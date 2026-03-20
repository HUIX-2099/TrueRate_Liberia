import { NextResponse, type NextRequest } from "next/server"
import { fetchCblHistoricalRates } from "@/lib/cbl-rates"
import { fetchXeChartsMarketHistory } from "@/lib/xe-charts"
import { generateHistoricalData } from "@/lib/api/multi-source-rates"

export const revalidate = 3600

/**
 * GET /api/rates/historical/by-source?days=90
 * Returns rate history by source: CBL (official) and market.
 * Market history from https://www.xe.com/currencycharts/?from=USD&to=LRD (close + 1Y low/high).
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const requestedDays = parseInt(searchParams.get("days") ?? "90", 10)
  const days = Number.isFinite(requestedDays) ? Math.min(Math.max(requestedDays, 7), 365) : 90

  try {
    const [cblResult, xeMarket] = await Promise.all([
      fetchCblHistoricalRates(days),
      fetchXeChartsMarketHistory(days),
    ])

    const cblByDate = new Map<string, number>()
    for (const p of cblResult.historical) {
      cblByDate.set(p.date, p.rate)
    }

    const marketByDate = new Map<string, number>()
    const marketSource = xeMarket?.source ?? null
    if (xeMarket?.historical?.length) {
      for (const p of xeMarket.historical) {
        marketByDate.set(p.date, p.rate)
      }
    } else {
      const fallback = generateHistoricalData(days)
      for (const p of fallback) {
        marketByDate.set(p.date, p.rate)
      }
    }

    const allDates = new Set([...cblByDate.keys(), ...marketByDate.keys()])
    const sortedDates = Array.from(allDates).sort()

    const series = sortedDates.map((date) => ({
      date,
      cbl: cblByDate.get(date) ?? null,
      market: marketByDate.get(date) ?? null,
    }))

    return NextResponse.json({
      series,
      cblSource: cblResult.source,
      marketSource: marketSource ?? "Market (indicative)",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[historical/by-source]", error)
    const fallback = generateHistoricalData(days)
    const series = fallback.map((p) => ({
      date: p.date,
      cbl: null,
      market: p.rate,
    }))
    return NextResponse.json({
      series,
      cblSource: null,
      marketSource: "Fallback",
      timestamp: new Date().toISOString(),
    })
  }
}
