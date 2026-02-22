import { NextResponse } from "next/server"
import {
  getCommodityPriceSeries,
  getExchangeRateSeries,
  getMonitoredCommodities,
} from "@/lib/monitoring/commodity-data"
import { computeCorrelation } from "@/lib/monitoring/commodity-engine/correlation"

export const dynamic = "force-dynamic"
export const revalidate = 0

/** GET /api/monitoring/correlation — Correlation of commodity prices with USD/LRD exchange rate. */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Math.min(365, Math.max(7, parseInt(searchParams.get("days") ?? "30", 10) || 30))
    const commodityId = searchParams.get("commodityId") ?? undefined

    const [fxSeries, ...commodityData] = await Promise.all([
      getExchangeRateSeries(days),
      ...getMonitoredCommodities()
        .filter((c) => !commodityId || c.id === commodityId)
        .map((c) => getCommodityPriceSeries({ commodityId: c.id, commodityName: c.name, days })),
    ])

    const correlations = commodityData.map(({ commodityId: cid, commodityName, series }) =>
      computeCorrelation(cid, commodityName, series, fxSeries, days)
    )

    return NextResponse.json({
      correlations,
      periodDays: days,
      fxDescription: "USD/LRD (CBL or market)",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Monitoring correlation]", error)
    return NextResponse.json(
      {
        error: "Correlation failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
