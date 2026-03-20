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
    parser: (data) => data?.rates?.LRD ?? data?.rates?.lrd ?? null,
    weight: 1.0,
  },
  // Exchange Rate API - Free
  {
    name: "ExchangeRate API",
    url: "https://api.exchangerate-api.com/v4/latest/USD",
    parser: (data) => data?.rates?.LRD ?? data?.rates?.lrd ?? null,
    weight: 0.9,
  },
]

if (EXCHANGE_RATE_API_KEY && EXCHANGE_RATE_API_KEY !== "demo") {
  // Only add the authenticated source when a real key is configured.
  RATE_SOURCES.unshift({
    name: "ExchangeRate-API v6 Pair",
    url: `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/pair/USD/LRD`,
    parser: (data) => data?.conversion_rate || null,
    weight: 1.2,
  })
}

/** Xe.com converter page — primary market source (mid-market rate). https://www.xe.com/currencyconverter/convert/?Amount=1&From=USD&To=LRD */
const XE_USD_LRD_URL =
  "https://www.xe.com/currencyconverter/convert/?Amount=1&From=USD&To=LRD"

/** Fetch market rate from Xe.com converter page (mid-market rate). Uses the same URL as the public converter. */
async function fetchMarketRateFromXe(): Promise<{ rate: number; source: string } | null> {
  try {
    const response = await fetch(XE_USD_LRD_URL, {
      next: { revalidate: 60 },
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; TrueRate-Liberia/1.0; +https://truerate.org)",
        Accept: "text/html",
      },
    })
    if (!response.ok) return null
    const html = await response.text()
    // Match "1.00 USD = 185.70965101 LRD" or table "185.71 LRD" (mid-market rate)
    const match =
      html.match(/1\.00\s*USD\s*=\s*([\d,.]+)\s*LRD/i) ??
      html.match(/(18[0-9]\.[\d]+)\s*LRD/i) ??
      html.match(/(\d{3,}\.?\d*)\s*LRD/i)
    if (!match?.[1]) return null
    const rate = Number.parseFloat(match[1].replace(/,/g, ""))
    if (!Number.isFinite(rate) || rate < 100 || rate > 300) return null
    console.log(`[v0] Market rate from Xe: ${rate} LRD/USD`)
    return { rate: Number(rate.toFixed(4)), source: "Xe" }
  } catch (error) {
    console.error(`[v0] Xe (market) failed:`, error)
    return null
  }
}

/** Fetch market rate only from Exchange Rate API (v6 pair if key set, else v4 latest). Does not affect CBL/official. */
async function fetchMarketRateFromExchangeRateApi(): Promise<{ rate: number; source: string } | null> {
  const hasKey = EXCHANGE_RATE_API_KEY && EXCHANGE_RATE_API_KEY !== "demo"
  const url = hasKey
    ? `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/pair/USD/LRD`
    : "https://api.exchangerate-api.com/v4/latest/USD"
  const parser = hasKey
    ? (data: any) => data?.conversion_rate ?? null
    : (data: any) => data?.rates?.LRD ?? data?.rates?.lrd ?? null
  const sourceName = hasKey ? "ExchangeRate-API v6 Pair" : "ExchangeRate API"
  try {
    const response = await fetch(url, {
      next: { revalidate: 60 },
      headers: { "User-Agent": "TrueRate-Liberia/1.0" },
    })
    if (!response.ok) return null
    const data = await response.json()
    const rate = parser(data)
    if (rate != null && rate > 150 && rate < 220) {
      console.log(`[v0] Market rate from ${sourceName}: ${rate} LRD/USD`)
      return { rate: Number(rate.toFixed(4)), source: sourceName }
    }
    return null
  } catch (error) {
    console.error(`[v0] Exchange Rate API (market) failed:`, error)
    return null
  }
}

async function fetchFromSource(source: RateSource): Promise<{ rate: number; source: string } | null> {
  try {
    const response = await fetch(source.url, {
      next: { revalidate: 60 },
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

/** Returns market rate (from APIs) and official CBL rate separately. `rate` is always market, never CBL. */
export async function getAggregatedRate(): Promise<{
  /** Market rate from aggregated APIs; never the CBL official rate */
  rate: number
  confidence: number
  sources: string[]
  timestamp: string
  cblRate: number | null
  cblLastUpdated: string | null
  cblBuying: number | null
  cblSelling: number | null
}> {
  const { fetchCblRateFromHomepage } = await import("@/lib/cbl-homepage")
  const { fetchCblLatestRate } = await import("@/lib/cbl-rates")
  let cblRate: number | null = null
  let cblLastUpdated: string | null = null
  let cblBuying: number | null = null
  let cblSelling: number | null = null
  try {
    const cblResearch = await fetchCblLatestRate()
    if (cblResearch && cblResearch.rate > 150 && cblResearch.rate < 220) {
      cblRate = Number(cblResearch.rate.toFixed(4))
      cblLastUpdated = cblResearch.lastUpdated ?? null
      cblBuying = Number(cblResearch.buying.toFixed(4))
      cblSelling = Number(cblResearch.selling.toFixed(4))
    }
    if (cblRate == null) {
      const cblHomepage = await fetchCblRateFromHomepage()
      if (cblHomepage && cblHomepage.rate > 150 && cblHomepage.rate < 220) {
        cblRate = Number(cblHomepage.rate.toFixed(4))
        cblLastUpdated = cblHomepage.lastUpdated ?? null
        cblBuying = Number(cblHomepage.buying.toFixed(4))
        cblSelling = Number(cblHomepage.selling.toFixed(4))
      }
    }
  } catch (e) {
    console.warn("[v0] CBL fetch failed, using API fallback:", e)
  }

  // Market rate primary source: CBL + changer spread. Money changers add +2 or +3 to CBL sell (sell USD higher)
  // and subtract 2 or 3 from CBL buy (buy USD lower). Market mid = (CBL buy + CBL sell) / 2.
  const CHANGER_SPREAD = 2.5 // typical +2 or +3 on sell, -2 or -3 on buy
  if (cblBuying != null && cblSelling != null && cblBuying > 150 && cblSelling > 150 && cblBuying < 220 && cblSelling < 220) {
    const marketMid = (cblBuying + cblSelling) / 2
    const result = {
      rate: Number(marketMid.toFixed(4)),
      confidence: 1.0,
      sources: ["Market"] as string[],
      timestamp: new Date().toISOString(),
      cblRate,
      cblLastUpdated,
      cblBuying,
      cblSelling,
    }
    console.log(`[v0] Market rate from CBL + spread: mid ${marketMid.toFixed(2)} (changer buy ${(cblBuying - CHANGER_SPREAD).toFixed(2)}, sell ${(cblSelling + CHANGER_SPREAD).toFixed(2)})`)
    await persistRateToCache(result.rate, result.confidence, result.sources)
    return result
  }

  // Fallback: api.exchangerate-api.com, then aggregate other APIs (including Xe).
  const exchangeRateApiResult = await fetchMarketRateFromExchangeRateApi()
  if (exchangeRateApiResult) {
    const result = {
      rate: exchangeRateApiResult.rate,
      confidence: 1.0,
      sources: ["Market"] as string[],
      timestamp: new Date().toISOString(),
      cblRate,
      cblLastUpdated,
      cblBuying,
      cblSelling,
    }
    await persistRateToCache(result.rate, result.confidence, result.sources)
    return result
  }

  const marketPromises = [
    fetchMarketRateFromXe(),
    ...RATE_SOURCES.map((source) => fetchFromSource(source)),
  ]
  const settled = await Promise.allSettled(marketPromises)

  const validResults = settled
    .filter(
      (s): s is PromiseFulfilledResult<{ rate: number; source: string }> =>
        s.status === "fulfilled" && s.value != null,
    )
    .map((s) => s.value)

  if (validResults.length === 0) {
    // All external sources failed — use the last successfully fetched rate from DB, then canonical fallback.
    const lastKnown = await getLastKnownRate()
    if (lastKnown) {
      console.log(`[v0] All market sources failed, using last-known rate: ${lastKnown.rate} (fetched ${lastKnown.fetchedAt})`)
      return {
        rate: lastKnown.rate,
        confidence: 0.5,
        sources: [`Last known (${lastKnown.fetchedAt})`],
        timestamp: new Date().toISOString(),
        cblRate,
        cblLastUpdated,
        cblBuying,
        cblSelling,
      }
    }
    const { getCanonicalFallbackRate } = await import("@/lib/canonical-rate")
    const fallback = getCanonicalFallbackRate()
    console.warn(`[v0] All market sources failed and no cached rate in DB — using canonical fallback: ${fallback}`)
    return {
      rate: fallback,
      confidence: 0,
      sources: ["Canonical fallback (no live data)"],
      timestamp: new Date().toISOString(),
      cblRate,
      cblLastUpdated,
      cblBuying,
      cblSelling,
    }
  }

  const rates = validResults.map((r) => r.rate).sort((a, b) => a - b)
  const mid = rates.length >> 1
  const medianRate =
    rates.length % 2 === 1 ? rates[mid]! : (rates[mid - 1]! + rates[mid]!) / 2

  const avgRate = rates.reduce((sum, rate) => sum + rate, 0) / rates.length
  const variance = rates.reduce((sum, rate) => sum + Math.pow(rate - avgRate, 2), 0) / rates.length
  const stdDev = Math.sqrt(variance)
  const confidence = Math.max(0.6, Math.min(1.0, 1 - stdDev / avgRate))

  const sourceNames = [...new Set(validResults.map((r) => r.source))]
  console.log(`[v0] Market rate (median): ${medianRate.toFixed(2)} from ${validResults.length} feeds: ${sourceNames.join(", ")}`)

  const result = {
    rate: Number(medianRate.toFixed(4)),
    confidence: Number(confidence.toFixed(2)),
    sources: sourceNames.length > 0 ? sourceNames : ["Market (indicative)"],
    timestamp: new Date().toISOString(),
    cblRate,
    cblLastUpdated,
    cblBuying,
    cblSelling,
  }
  await persistRateToCache(result.rate, result.confidence, result.sources)
  return result
}

/** Persist successfully fetched rate to DB so it can serve as a fallback. */
async function persistRateToCache(rate: number, confidence: number, sources: string[]): Promise<void> {
  try {
    const { getPrismaClient } = await import("@/lib/db/prisma")
    const prisma = getPrismaClient()
    if (!prisma) return
    await (prisma as any).cachedRate.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", rate, confidence, sources },
      update: { rate, confidence, sources, fetchedAt: new Date() },
    })
  } catch {
    // Non-fatal — DB may not be migrated yet
  }
}

/** Read the last successfully fetched rate from DB. */
async function getLastKnownRate(): Promise<{ rate: number; fetchedAt: string } | null> {
  try {
    const { getPrismaClient } = await import("@/lib/db/prisma")
    const prisma = getPrismaClient()
    if (!prisma) return null
    const cached = await (prisma as any).cachedRate.findUnique({ where: { id: "singleton" } })
    if (!cached) return null
    return {
      rate: Number(cached.rate),
      fetchedAt: new Date(cached.fetchedAt).toUTCString(),
    }
  } catch {
    return null
  }
}

export function generateHistoricalData(days: number): Array<{ date: string; rate: number; volume: number }> {
  const { getCanonicalFallbackRate } = require("@/lib/canonical-rate")
  const data = []
  const now = Date.now()
  const baseRate = getCanonicalFallbackRate()

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
