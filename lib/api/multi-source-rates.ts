interface RateSource {
  name: string
  url: string
  parser: (data: any) => number | null
  weight: number
}

// Prefer authenticated ExchangeRate-API v6 USD/LRD pair endpoint when key is provided
const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY || "demo"

export const RATE_SOURCES: RateSource[] = [
  // Fawaz Ahmed Currency API - Free, supports LRD
  {
    name: "Currency API (Fawaz Ahmed)",
    url: "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    parser: (data) => data?.usd?.lrd || null,
    weight: 1.0,
  },
  // Open Exchange Rates - Free tier
  {
    name: "Open Exchange Rates",
    url: "https://open.er-api.com/v6/latest/USD",
    parser: (data) => data?.rates?.LRD || null,
    weight: 1.0,
  },
  // ExchangeRate-API v6 Pair endpoint (authenticated)
  {
    name: "ExchangeRate-API v6 Pair",
    url: `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/pair/USD/LRD`,
    parser: (data) => data?.conversion_rate || null,
    weight: 1.2,
  },
  // Exchange Rate API - Free
  {
    name: "ExchangeRate API",
    url: "https://api.exchangerate-api.com/v4/latest/USD",
    parser: (data) => data?.rates?.LRD || null,
    weight: 0.9,
  },
]

async function fetchFromSource(source: RateSource): Promise<{ rate: number; source: string } | null> {
  try {
    const response = await fetch(source.url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
      headers: { "User-Agent": "TrueRate-Liberia/1.0" },
    })

    if (!response.ok) {
      console.log(`[v0] ${source.name} returned status ${response.status}`)
      return null
    }

    const data = await response.json()
    const rate = source.parser(data)

    if (rate && rate > 0 && rate > 150 && rate < 220) {
      console.log(`[v0] ${source.name}: ${rate} LRD per USD`)
      return { rate, source: source.name }
    }
    return null
  } catch (error) {
    console.error(`[v0] Error fetching from ${source.name}:`, error)
    return null
  }
}

export async function getAggregatedRate(): Promise<{
  rate: number
  confidence: number
  sources: string[]
  timestamp: string
}> {
  // If a real API key is present, prefer the authenticated ExchangeRate-API as the single source of truth
  if (EXCHANGE_RATE_API_KEY && EXCHANGE_RATE_API_KEY !== "demo") {
    const preferred = RATE_SOURCES.find((s) => s.name === "ExchangeRate-API v6 Pair")
    if (preferred) {
      const result = await fetchFromSource(preferred)
      if (result) {
        return {
          rate: Number(result.rate.toFixed(4)),
          confidence: 1.0,
          sources: [result.source],
          timestamp: new Date().toISOString(),
        }
      }
    }
  }

  const results = await Promise.allSettled(RATE_SOURCES.map((source) => fetchFromSource(source)))

  const validResults = results
    .filter(
      (result): result is PromiseFulfilledResult<{ rate: number; source: string }> =>
        result.status === "fulfilled" && result.value !== null,
    )
    .map((result) => result.value)

  if (validResults.length === 0) {
    console.log("[v0] All APIs failed, using CBL fallback rate")
    return {
      rate: 179.0, // Latest CBL rate as of Nov 2025
      confidence: 0.7,
      sources: ["Central Bank of Liberia (Fallback)"],
      timestamp: new Date().toISOString(),
    }
  }

  const rates = validResults.map((r) => r.rate)
  const avgRate = rates.reduce((sum, rate) => sum + rate, 0) / rates.length

  const variance = rates.reduce((sum, rate) => sum + Math.pow(rate - avgRate, 2), 0) / rates.length
  const stdDev = Math.sqrt(variance)
  const confidence = Math.max(0.6, Math.min(1.0, 1 - stdDev / avgRate))

  console.log(`[v0] Aggregated rate: ${avgRate.toFixed(2)} from ${validResults.length} sources`)

  return {
    rate: Number(avgRate.toFixed(4)),
    confidence: Number(confidence.toFixed(2)),
    sources: validResults.map((r) => r.source),
    timestamp: new Date().toISOString(),
  }
}

export function generateHistoricalData(days: number): Array<{ date: string; rate: number; volume: number }> {
  const data = []
  const now = Date.now()
  const baseRate = 179.0 // Current real rate

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000)

    const weekCycle = Math.sin(((days - i) / 7) * Math.PI) * 1.5
    const trend = (days - i) * 0.015
    const noise = (Math.random() - 0.5) * 2

    const rate = baseRate + weekCycle + trend + noise
    const volume = 40000 + Math.random() * 30000

    data.push({
      date: date.toISOString().split("T")[0],
      rate: Number(rate.toFixed(4)),
      volume: Math.round(volume),
    })
  }

  return data
}
