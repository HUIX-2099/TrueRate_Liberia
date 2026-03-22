import { NextResponse } from "next/server"
import { getServerApiUrl } from "@/lib/api/server-base-url"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export const dynamic = "force-dynamic"
export const revalidate = 0

const SIGNALS_CACHE_KEY = "trfn_homepage_signals"
const CACHE_TTL_HOURS = 6

type NewsItem = { title?: string; headline?: string }

type ContextData = {
  rate: number | null
  cblRate: number | null
  cpi: unknown
  riskLevel: string | null
  news: unknown[]
}

export type HomepageSignal = {
  headline: string
  impact: "High" | "Medium" | "Low"
  timeframe: string
  category: "FX" | "Trade" | "Policy" | "Commodities" | "Transport" | "Remittance"
}

const IMPACTS = new Set<string>(["High", "Medium", "Low"])
const CATEGORIES = new Set<string>(["FX", "Trade", "Policy", "Commodities", "Transport", "Remittance"])

function isHomepageSignal(v: unknown): v is HomepageSignal {
  if (v === null || typeof v !== "object") return false
  const o = v as Record<string, unknown>
  if (typeof o.headline !== "string" || o.headline.length === 0 || o.headline.length > 200) return false
  if (typeof o.impact !== "string" || !IMPACTS.has(o.impact)) return false
  if (typeof o.timeframe !== "string" || o.timeframe.length === 0) return false
  if (typeof o.category !== "string" || !CATEGORIES.has(o.category)) return false
  return true
}

function parseSignalsFromClaudeText(text: string): HomepageSignal[] {
  const stripped = text.replace(/```json\s*|```/gi, "").trim()
  let parsed: unknown
  try {
    parsed = JSON.parse(stripped)
  } catch {
    const start = stripped.indexOf("[")
    const end = stripped.lastIndexOf("]")
    if (start < 0 || end <= start) throw new Error("Invalid signals JSON")
    parsed = JSON.parse(stripped.slice(start, end + 1))
  }
  if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("Invalid signals format")
  const out: HomepageSignal[] = []
  for (const item of parsed) {
    if (isHomepageSignal(item)) out.push(item)
    if (out.length >= 4) break
  }
  if (out.length === 0) throw new Error("No valid signals in response")
  return out.slice(0, 4)
}

async function generateSignalsFromClaude(contextData: ContextData): Promise<HomepageSignal[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error("Missing ANTHROPIC_API_KEY")

  const { rate, cblRate, cpi, riskLevel, news } = contextData
  const spread =
    rate != null && cblRate != null ? Math.abs(rate - cblRate).toFixed(2) : null

  const cpiObj = cpi && typeof cpi === "object" ? (cpi as Record<string, unknown>) : null
  const newsList = Array.isArray(news) ? news : []
  const headlines = newsList
    .slice(0, 3)
    .map((n) => {
      if (!n || typeof n !== "object") return ""
      const item = n as NewsItem
      return item.title ?? item.headline ?? ""
    })
    .filter(Boolean)

  const prompt = `You are TRFN Analyst for TrueRate Liberia. Generate exactly 4 concise economic signal cards for the TrueRate Liberia homepage based on this live data:

Current Data:
- USD/LRD Market Rate: ${rate != null ? `L$${rate.toFixed(2)}` : "unavailable"}
- CBL Official Rate: ${cblRate != null ? `L$${cblRate.toFixed(2)}` : "unavailable"}
- Market/CBL Spread: ${spread != null ? `L$${spread}` : "unavailable"}
- CPI: ${cpiObj?.cpi ?? "unavailable"} | Inflation YoY: ${cpiObj?.inflationYoY ?? "unavailable"}%
- Dollarization Risk Level: ${riskLevel ?? "unknown"}
- Recent News Headlines: ${headlines.join(" | ") || "unavailable"}
- Generated at: ${new Date().toISOString()}

Return a JSON array of exactly 4 signals. Each signal must have:
- "headline": string (max 90 chars, institutional language, specific to Liberia's current conditions)
- "impact": "High" | "Medium" | "Low"
- "timeframe": string (e.g. "24-72 hrs", "3-5 days", "1-2 weeks", "2-4 weeks")
- "category": "FX" | "Trade" | "Policy" | "Commodities" | "Transport" | "Remittance"

Rules:
- Use TRFN analytical voice — Bloomberg/Reuters style
- Reference specific data points (actual rate numbers, spread, inflation %)
- Cover different economic sectors across the 4 signals
- Be precise and actionable, not generic
- Do NOT include any text outside the JSON array

Example format:
[{"headline":"...","impact":"Medium","timeframe":"24-72 hrs","category":"FX"},...]`

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      messages: [{ role: "user", content: prompt }],
    }),
    cache: "no-store",
  })

  const data = (await response.json()) as { content?: { text?: string }[]; error?: { message?: string } }
  if (!response.ok) throw new Error(data.error?.message ?? "Claude API error")

  const text = data.content?.[0]?.text ?? ""
  return parseSignalsFromClaudeText(text)
}

const FALLBACK_SIGNALS: HomepageSignal[] = [
  {
    headline:
      "Parallel-market FX spread stays narrow despite stronger afternoon dollar bids",
    impact: "Medium",
    timeframe: "24-72 hrs",
    category: "FX",
  },
  {
    headline: "Rice and imported staples point to mild retail pressure into next week",
    impact: "High",
    timeframe: "1-2 weeks",
    category: "Trade",
  },
  {
    headline:
      "Transport fares remain firm as route-level operating costs hold elevated",
    impact: "Medium",
    timeframe: "2-4 weeks",
    category: "Transport",
  },
  {
    headline: "Liquidity signals support near-term LRD stability in core urban markets",
    impact: "Low",
    timeframe: "3-5 days",
    category: "Policy",
  },
]

async function pruneSignalsCache(supabase: NonNullable<ReturnType<typeof createServiceRoleClient>>) {
  const { data: rows } = await supabase
    .from("trfn_signals_cache")
    .select("id")
    .eq("cache_key", SIGNALS_CACHE_KEY)
    .order("created_at", { ascending: false })
    .range(10, 9999)

  if (rows && rows.length > 0) {
    await supabase.from("trfn_signals_cache").delete().in(
      "id",
      rows.map((r: { id: string }) => r.id)
    )
  }
}

export async function GET() {
  const supabase = createServiceRoleClient()

  if (supabase) {
    try {
      const { data: cached } = await supabase
        .from("trfn_signals_cache")
        .select("*")
        .eq("cache_key", SIGNALS_CACHE_KEY)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (cached?.created_at) {
        const ageHours = (Date.now() - new Date(cached.created_at).getTime()) / 3_600_000
        if (ageHours < CACHE_TTL_HOURS) {
          return NextResponse.json({
            signals: cached.signals,
            cached: true,
            generatedAt: cached.created_at,
          })
        }
      }
    } catch {
      // Cache miss — generate fresh
    }
  }

  const [ratesRes, cpiRes, riskRes, newsRes] = await Promise.allSettled([
    fetch(getServerApiUrl("/api/rates/live"), { cache: "no-store" }).then((r) => r.json()),
    fetch(getServerApiUrl("/api/liberia-cpi"), { cache: "no-store" }).then((r) => r.json()),
    fetch(getServerApiUrl("/api/dollarization-risk"), { cache: "no-store" }).then((r) => r.json()),
    fetch(getServerApiUrl("/api/liberia-market-news"), { cache: "no-store" }).then((r) => r.json()),
  ])

  const ratesData = ratesRes.status === "fulfilled" ? ratesRes.value : null
  const cpiData = cpiRes.status === "fulfilled" ? cpiRes.value : null
  const riskData = riskRes.status === "fulfilled" ? riskRes.value : null
  const newsData = newsRes.status === "fulfilled" ? newsRes.value : null

  const contextData: ContextData = {
    rate: typeof ratesData?.rate === "number" ? ratesData.rate : null,
    cblRate: typeof ratesData?.cblRate === "number" ? ratesData.cblRate : null,
    cpi: cpiData,
    riskLevel: typeof riskData?.level === "string" ? riskData.level : null,
    news: Array.isArray(newsData?.articles)
      ? newsData.articles
      : Array.isArray(newsData)
        ? newsData
        : [],
  }

  try {
    const signals = await generateSignalsFromClaude(contextData)

    if (supabase) {
      try {
        await supabase.from("trfn_signals_cache").insert({
          cache_key: SIGNALS_CACHE_KEY,
          signals,
          context: contextData,
          created_at: new Date().toISOString(),
        })
        await pruneSignalsCache(supabase)
      } catch {
        // Cache write failed — still return signals
      }
    }

    return NextResponse.json({
      signals,
      cached: false,
      generatedAt: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({
      signals: FALLBACK_SIGNALS,
      cached: false,
      fallback: true,
      generatedAt: new Date().toISOString(),
    })
  }
}
