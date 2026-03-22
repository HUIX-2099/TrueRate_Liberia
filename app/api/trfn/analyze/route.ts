import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export const dynamic = "force-dynamic"
export const revalidate = 0

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages"
const ANTHROPIC_MODEL = "claude-sonnet-4-20250514"

type RateRow = { rate: number; recorded_at: string }
type PriceRow = {
  item_name: string
  category?: string | null
  price_lrd: number
  price_usd?: number | null
  market_location?: string | null
}

type CryptoAsset = { usd?: number; usd_24h_change?: number }

function isCryptoContext(v: unknown): v is { bitcoin?: CryptoAsset; ethereum?: CryptoAsset } {
  return v !== null && typeof v === "object"
}

function formatTrend(rates: RateRow[]): { trend: string; values: number[] } {
  const values = rates.map((r) => r.rate)
  if (values.length < 2) return { trend: "stable", values }
  const newest = values[0]
  const oldest = values[values.length - 1]
  if (newest > oldest) return { trend: "rising", values }
  if (newest < oldest) return { trend: "falling", values }
  return { trend: "stable", values }
}

export async function POST(req: Request) {
  const supabase = createServiceRoleClient()
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase service role not configured (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)" },
      { status: 503 }
    )
  }

  const anthropicApiKey = process.env.ANTHROPIC_API_KEY
  if (!anthropicApiKey) {
    return NextResponse.json({ error: "Missing ANTHROPIC_API_KEY" }, { status: 503 })
  }

  let body: { question?: unknown; context?: unknown } = {}
  try {
    body = (await req.json()) as { question?: unknown; context?: unknown }
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const question =
    typeof body.question === "string" ? body.question.slice(0, 8000) : ""

  const ctx =
    body.context !== null && typeof body.context === "object"
      ? (body.context as Record<string, unknown>)
      : null
  const rawCrypto = ctx?.crypto
  const cryptoContext = isCryptoContext(rawCrypto) ? rawCrypto : null

  const cryptoBlock = cryptoContext
    ? `
Crypto Markets:
- Bitcoin: $${cryptoContext.bitcoin?.usd != null ? cryptoContext.bitcoin.usd.toLocaleString() : "N/A"} (${cryptoContext.bitcoin?.usd_24h_change != null ? `${cryptoContext.bitcoin.usd_24h_change.toFixed(2)}%` : "N/A"} 24h)
- Ethereum: $${cryptoContext.ethereum?.usd != null ? cryptoContext.ethereum.usd.toLocaleString() : "N/A"} (${cryptoContext.ethereum?.usd_24h_change != null ? `${cryptoContext.ethereum.usd_24h_change.toFixed(2)}%` : "N/A"} 24h)
`
    : ""

  try {
    const { data: latestRate, error: latestErr } = await supabase
      .from("exchange_rates")
      .select("*")
      .eq("base_currency", "USD")
      .eq("target_currency", "LRD")
      .order("recorded_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (latestErr) {
      return NextResponse.json({ error: latestErr.message }, { status: 500 })
    }

    const { data: recentRatesRaw, error: recentErr } = await supabase
      .from("exchange_rates")
      .select("rate, recorded_at")
      .eq("base_currency", "USD")
      .eq("target_currency", "LRD")
      .order("recorded_at", { ascending: false })
      .limit(7)

    if (recentErr) {
      return NextResponse.json({ error: recentErr.message }, { status: 500 })
    }

    const recentRates = (recentRatesRaw ?? []) as RateRow[]
    const { trend: rateTrend, values: rateValues } = formatTrend(recentRates)

    const { data: pricesRaw, error: pricesErr } = await supabase
      .from("price_index")
      .select("*")
      .order("recorded_at", { ascending: false })
      .limit(10)

    if (pricesErr) {
      return NextResponse.json({ error: pricesErr.message }, { status: 500 })
    }

    const prices = (pricesRaw ?? []) as PriceRow[]

    const pricesBlock =
      prices.length > 0
        ? `
Community Price Index (latest ${prices.length} submissions):
${prices
  .map(
    (p) =>
      `- ${p.item_name} (${p.category ?? "uncategorized"}): L$${p.price_lrd} / ${p.price_usd != null ? `$${p.price_usd}` : "—"} in ${p.market_location ?? "—"}`
  )
  .join("\n")}
`
        : "No price index data available yet."

    const systemPrompt = `You are TRFN Analyst — TrueRate Finance Network's institutional-grade AI market analyst for Liberia.

You provide sharp, concise, data-driven analysis in the style of Bloomberg or Reuters — authoritative, professional, and actionable. You understand Liberia's economic context: USD/LRD exchange dynamics, CBL policy, remittance flows, informal markets, and everyday cost-of-living pressures.

Always:
- Lead with the most important insight
- Use specific numbers from the data provided
- Keep analysis under 200 words unless asked for more
- End with one concrete implication for businesses or consumers
- Use TRFN signal language: "TRFN flags...", "TRFN signals...", "Analysis suggests..."

Never use generic filler. Be direct and data-grounded.`

    const userMessage = `
Current Market Data (as of ${new Date().toISOString()}):

USD/LRD Rate: ${latestRate?.rate ?? "N/A"} LRD per USD
Rate Trend (7-day): ${rateTrend} (${rateValues.join(", ")})
Last Updated: ${latestRate?.recorded_at ?? "N/A"}

${cryptoBlock ? `${cryptoBlock}\n` : ""}
${pricesBlock}

User Question: ${question || "Provide a brief macro market analysis for Liberia based on current data."}
`

    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
      cache: "no-store",
    })

    const data = (await response.json()) as {
      content?: Array<{ type?: string; text?: string }>
      error?: { message?: string }
    }

    if (!response.ok) {
      const msg = data.error?.message ?? `Anthropic API error (${response.status})`
      return NextResponse.json({ error: msg, details: data }, { status: response.status })
    }

    const analysis = data.content?.[0]?.text ?? "Analysis unavailable."

    return NextResponse.json({ analysis, timestamp: new Date().toISOString() })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("AI analysis error:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
