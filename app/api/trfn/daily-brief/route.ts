import { NextResponse, type NextRequest } from "next/server"
import { getServerApiUrl } from "@/lib/api/server-base-url"
import { getCanonicalFallbackRate } from "@/lib/canonical-rate"

export const dynamic = "force-dynamic"
export const revalidate = 0

type UserType = "consumer" | "business" | "diaspora" | "student"

const PERSONAS: Record<UserType, string> = {
  consumer:
    "a Liberian household consumer in Monrovia managing daily expenses, food shopping, transport, and family needs",
  business:
    "a Liberian business owner or importer/exporter making forex, inventory, and pricing decisions",
  diaspora:
    "a Liberian living abroad (US/UK/Canada) who sends remittances home and supports family in Liberia",
  student:
    "a Liberian student managing tuition, transport, and daily living costs on a tight budget",
}

const USER_TYPES = new Set<string>(["consumer", "business", "diaspora", "student"])

function parseUserType(raw: string | null): UserType {
  const t = (raw ?? "consumer").toLowerCase()
  return USER_TYPES.has(t) ? (t as UserType) : "consumer"
}

type NewsLike = { title?: string; headline?: string }

function topNewsLine(newsPayload: unknown, limit: number): string {
  if (!newsPayload || typeof newsPayload !== "object") return "No major headlines"
  const o = newsPayload as { articles?: unknown }
  const arr = Array.isArray(o.articles)
    ? o.articles
    : Array.isArray(newsPayload)
      ? (newsPayload as unknown[])
      : []
  const titles = arr
    .slice(0, limit)
    .map((n) => {
      if (!n || typeof n !== "object") return ""
      const item = n as NewsLike
      return item.title ?? item.headline ?? ""
    })
    .filter(Boolean)
  return titles.length ? titles.join(" | ") : "No major headlines"
}

type PriceLike = { item_name?: string; name?: string; price_lrd?: number; priceLRD?: number }

function keyPricesSnippet(pricesPayload: unknown, limit: number): string {
  if (!pricesPayload || typeof pricesPayload !== "object") return ""
  const o = pricesPayload as { items?: unknown[]; prices?: unknown[]; data?: unknown[] }
  const raw = Array.isArray(o.items)
    ? o.items
    : Array.isArray(o.prices)
      ? o.prices
      : Array.isArray(o.data)
        ? o.data
        : []
  const parts = raw.slice(0, limit).map((p) => {
    if (!p || typeof p !== "object") return ""
    const row = p as PriceLike
    const label = row.name ?? row.item_name ?? "Item"
    const lrd = row.priceLRD ?? row.price_lrd
    return typeof lrd === "number" && Number.isFinite(lrd) ? `${label}: L$${lrd.toFixed(0)}` : ""
  })
  return parts.filter(Boolean).join(", ")
}

export async function GET(req: NextRequest) {
  const userType = parseUserType(req.nextUrl.searchParams.get("type"))
  const persona = PERSONAS[userType]

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "Missing ANTHROPIC_API_KEY" }, { status: 503 })
  }

  const [ratesRes, cpiRes, riskRes, newsRes, pricesRes] = await Promise.allSettled([
    fetch(getServerApiUrl("/api/rates/live"), { cache: "no-store" }).then((r) => r.json()),
    fetch(getServerApiUrl("/api/liberia-cpi"), { cache: "no-store" }).then((r) => r.json()),
    fetch(getServerApiUrl("/api/dollarization-risk"), { cache: "no-store" }).then((r) => r.json()),
    fetch(getServerApiUrl("/api/liberia-market-news"), { cache: "no-store" }).then((r) => r.json()),
    fetch(getServerApiUrl("/api/price-index"), { cache: "no-store" }).then((r) => r.json()),
  ])

  const rates = ratesRes.status === "fulfilled" && ratesRes.value && typeof ratesRes.value === "object"
    ? (ratesRes.value as Record<string, unknown>)
    : {}
  const cpi = cpiRes.status === "fulfilled" && cpiRes.value && typeof cpiRes.value === "object"
    ? (cpiRes.value as Record<string, unknown>)
    : {}
  const risk = riskRes.status === "fulfilled" && riskRes.value && typeof riskRes.value === "object"
    ? (riskRes.value as Record<string, unknown>)
    : {}
  const news = newsRes.status === "fulfilled" ? newsRes.value : {}
  const prices = pricesRes.status === "fulfilled" ? pricesRes.value : {}

  const rateNum = typeof rates.rate === "number" ? rates.rate : null
  const cblNum = typeof rates.cblRate === "number" ? rates.cblRate : null
  const changePct =
    typeof rates.change === "number" && Number.isFinite(rates.change) ? rates.change : null

  const cpiNum = typeof cpi.cpi === "number" ? cpi.cpi : null
  const inflationYoY = cpi.inflationYoY
  const riskLevel = typeof risk.level === "string" ? risk.level : "low"

  const fallbackRate = getCanonicalFallbackRate()
  const spreadStr =
    rateNum != null && cblNum != null ? Math.abs(rateNum - cblNum).toFixed(0) : "4"

  const today = new Date().toLocaleDateString("en-LR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const prompt = `You are writing a personalized daily financial brief for TrueRate Liberia. Today is ${today}.

The reader is ${persona}.

Live Market Data Right Now:
- USD/LRD Market Rate: ${rateNum != null ? `L$${rateNum.toFixed(2)}` : `~L$${fallbackRate.toFixed(0)}`}
- CBL Official Rate: ${cblNum != null ? `L$${cblNum.toFixed(2)}` : "unavailable"}
- Market/CBL Spread: ${rateNum != null && cblNum != null ? `L$${Math.abs(rateNum - cblNum).toFixed(2)}` : "unavailable"}
- Rate trend: ${changePct != null ? `${changePct > 0 ? "+" : ""}${changePct.toFixed(2)}%` : "stable"}
- Dollarization Risk: ${riskLevel}
- CPI: ${cpiNum != null ? cpiNum.toFixed(1) : "791"} | Inflation YoY: ${typeof inflationYoY === "number" ? inflationYoY : "7.2"}%
- Top news: ${topNewsLine(news, 2)}
- Key prices today: ${keyPricesSnippet(prices, 4) || "See TrueRate price index"}

Write a personalized daily brief in this EXACT format — plain English, warm but authoritative, Liberian context:

**Good [morning/afternoon], here's your Liberia market brief for ${today}.**

[2-3 sentence paragraph about what the rate means specifically for this person today. Be concrete — mention actual LRD amounts, not vague language.]

**What to watch today:**
- [Specific action or awareness point #1 relevant to this persona]
- [Specific action or awareness point #2 relevant to this persona]  
- [Specific action or awareness point #3 relevant to this persona]

**One thing to do:**
[One clear, specific recommended action for today — e.g. "If you're exchanging more than $200 today, compare at least 3 changers before committing. The spread is L$${spreadStr} today."]

**Market mood:** [One sentence on overall market conditions]

Keep it under 200 words. No jargon. Write like you're texting a smart friend who lives in Liberia.`

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 600,
        messages: [{ role: "user", content: prompt }],
      }),
      cache: "no-store",
    })

    const data = (await response.json()) as {
      content?: { text?: string }[]
      error?: { message?: string }
    }
    if (!response.ok) throw new Error(data.error?.message ?? "Claude error")

    const brief = data.content?.[0]?.text ?? ""

    return NextResponse.json({
      brief,
      userType,
      generatedAt: new Date().toISOString(),
      context: {
        rate: rateNum,
        cblRate: cblNum,
        riskLevel,
        inflationYoY: typeof inflationYoY === "number" ? inflationYoY : null,
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
