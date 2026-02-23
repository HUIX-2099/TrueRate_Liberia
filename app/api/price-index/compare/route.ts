import { NextResponse } from "next/server"
import { getCommodityPriceSeries, getMonitoredCommodities } from "@/lib/monitoring/commodity-data"
import { buildCostOfLivingDashboard } from "@/lib/cost-of-living"
import { PRICE_INDEX_BASKET_ID } from "@/lib/price-index/basket"

export const dynamic = "force-dynamic"
export const revalidate = 0

/** Average basket (LRD) over a list of days; returns null if no data. */
function averageBasket(
  aggregatedPrices: Array<{ date: string; basketAvg: number }>,
  dates: string[]
): number | null {
  const set = new Set(dates)
  const values = aggregatedPrices.filter((p) => set.has(p.date)).map((p) => p.basketAvg)
  if (values.length === 0) return null
  return values.reduce((a, b) => a + b, 0) / values.length
}

/**
 * GET /api/price-index/compare
 * Returns this week vs last week and this month vs last month for the Price Index basket (same as COL).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Math.min(365, Math.max(14, parseInt(searchParams.get("days") ?? "60", 10) || 60))

    const commodities = getMonitoredCommodities()
    const commoditySeriesList = await Promise.all(
      commodities.map((c) =>
        getCommodityPriceSeries({ commodityId: c.id, commodityName: c.name, days })
      )
    )
    const fxSeries: Array<{ date: string; value: number }> = []
    const dashboard = buildCostOfLivingDashboard(commoditySeriesList, fxSeries, { days })

    const aggregated = dashboard.aggregatedPrices
      .map((p) => ({ date: p.date, basketAvg: p.basketAvg }))
      .sort((a, b) => a.date.localeCompare(b.date))

    if (aggregated.length < 2) {
      return NextResponse.json({
        priceIndexBasketId: PRICE_INDEX_BASKET_ID,
        periodComparison: null,
        message: "Insufficient data for period comparison",
      })
    }

    const allDates = aggregated.map((p) => p.date)
    const latest = allDates[allDates.length - 1]!
    const latestDate = new Date(latest)

    const thisWeekDates: string[] = []
    const lastWeekDates: string[] = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(latestDate)
      d.setDate(d.getDate() - i)
      thisWeekDates.push(d.toISOString().slice(0, 10))
    }
    for (let i = 7; i < 14; i++) {
      const d = new Date(latestDate)
      d.setDate(d.getDate() - i)
      lastWeekDates.push(d.toISOString().slice(0, 10))
    }

    const thisMonthDates: string[] = []
    const lastMonthDates: string[] = []
    for (let i = 0; i < 30; i++) {
      const d = new Date(latestDate)
      d.setDate(d.getDate() - i)
      thisMonthDates.push(d.toISOString().slice(0, 10))
    }
    for (let i = 30; i < 60; i++) {
      const d = new Date(latestDate)
      d.setDate(d.getDate() - i)
      lastMonthDates.push(d.toISOString().slice(0, 10))
    }

    const thisWeekAvg = averageBasket(aggregated, thisWeekDates)
    const lastWeekAvg = averageBasket(aggregated, lastWeekDates)
    const thisMonthAvg = averageBasket(aggregated, thisMonthDates)
    const lastMonthAvg = averageBasket(aggregated, lastMonthDates)

    const weekOverWeekPercent =
      thisWeekAvg != null && lastWeekAvg != null && lastWeekAvg !== 0
        ? Number((((thisWeekAvg - lastWeekAvg) / lastWeekAvg) * 100).toFixed(2))
        : null
    const monthOverMonthPercent =
      thisMonthAvg != null && lastMonthAvg != null && lastMonthAvg !== 0
        ? Number((((thisMonthAvg - lastMonthAvg) / lastMonthAvg) * 100).toFixed(2))
        : null

    const periodComparison = {
      thisWeekAvg: thisWeekAvg ?? undefined,
      lastWeekAvg: lastWeekAvg ?? undefined,
      weekOverWeekPercent,
      thisMonthAvg: thisMonthAvg ?? undefined,
      lastMonthAvg: lastMonthAvg ?? undefined,
      monthOverMonthPercent,
      latestDate,
      basketLabel: "Price Index basket (essential goods)",
    }

    return NextResponse.json({
      priceIndexBasketId: PRICE_INDEX_BASKET_ID,
      periodComparison,
    })
  } catch (error) {
    console.error("[Price index compare]", error)
    return NextResponse.json(
      {
        error: "Period comparison failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
