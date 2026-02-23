import { NextResponse } from "next/server"
import { getCommodityPriceSeries, getMonitoredCommodities, getExchangeRateSeries } from "@/lib/monitoring/commodity-data"
import { buildCostOfLivingDashboard } from "@/lib/cost-of-living"
import { PRICE_INDEX_BASKET_ID } from "@/lib/price-index/basket"

export const dynamic = "force-dynamic"
export const revalidate = 0

/** GET /api/cost-of-living/dashboard — Full COL dashboard: aggregated prices, index, affordability, FX comparison. */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Math.min(365, Math.max(14, parseInt(searchParams.get("days") ?? "90", 10) || 90))
    const baseDate = searchParams.get("baseDate") ?? undefined

    const commodities = getMonitoredCommodities()
    const [commoditySeriesList, fxSeries] = await Promise.all([
      Promise.all(
        commodities.map((c) =>
          getCommodityPriceSeries({ commodityId: c.id, commodityName: c.name, days })
        )
      ),
      getExchangeRateSeries(days),
    ])

    const dashboard = buildCostOfLivingDashboard(commoditySeriesList, fxSeries, {
      days,
      baseDate,
    })

    return NextResponse.json({
      ...dashboard,
      priceIndexBasketId: PRICE_INDEX_BASKET_ID,
    })
  } catch (error) {
    console.error("[Cost of living dashboard]", error)
    return NextResponse.json(
      {
        error: "Cost of living dashboard failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
