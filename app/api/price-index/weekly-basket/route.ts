import { NextResponse } from "next/server"
import { getCommodityPriceSeries, getMonitoredCommodities } from "@/lib/monitoring/commodity-data"
import { buildCostOfLivingDashboard } from "@/lib/cost-of-living"
import { PRICE_INDEX_BASKET_ID } from "@/lib/price-index/basket"

export const dynamic = "force-dynamic"
export const revalidate = 60

/** Week ending (Sunday) from date string YYYY-MM-DD. */
function getWeekEnding(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00Z")
  const day = d.getUTCDay()
  const toSunday = day === 0 ? 0 : 7 - day
  d.setUTCDate(d.getUTCDate() + toSunday)
  return d.toISOString().slice(0, 10)
}

/**
 * GET /api/price-index/weekly-basket
 * Returns weekly grocery basket index (last 8 weeks) for the Price Index basket.
 */
export async function GET() {
  try {
    const days = 56 // 8 weeks
    const commodities = getMonitoredCommodities()
    const commoditySeriesList = await Promise.all(
      commodities.map((c) =>
        getCommodityPriceSeries({ commodityId: c.id, commodityName: c.name, days })
      )
    )
    const dashboard = buildCostOfLivingDashboard(commoditySeriesList, [], { days })
    const aggregated = dashboard.aggregatedPrices
      .map((p) => ({ date: p.date, basketAvg: p.basketAvg }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Group by week (week ending Sunday), take last day's basket avg per week
    const byWeek = new Map<string, number>()
    for (const p of aggregated) {
      const weekEnding = getWeekEnding(p.date)
      byWeek.set(weekEnding, p.basketAvg)
    }
    const weeks = Array.from(byWeek.entries())
      .map(([weekEnding, basketTotalLRD]) => ({ weekEnding, basketTotalLRD }))
      .sort((a, b) => a.weekEnding.localeCompare(b.weekEnding))
      .slice(-8)

    const withChange = weeks.map((w, i) => {
      const prev = weeks[i - 1]
      const weekOverWeekPercent =
        prev && prev.basketTotalLRD > 0
          ? Number((((w.basketTotalLRD - prev.basketTotalLRD) / prev.basketTotalLRD) * 100).toFixed(2))
          : null
      return { ...w, weekOverWeekPercent }
    })

    return NextResponse.json({
      priceIndexBasketId: PRICE_INDEX_BASKET_ID,
      weeks: withChange,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Weekly basket]", error)
    return NextResponse.json(
      { error: "Weekly basket failed", detail: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    )
  }
}
