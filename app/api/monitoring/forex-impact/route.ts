import { NextResponse } from "next/server"
import {
  getCommodityPriceSeries,
  getExchangeRateSeries,
  getMonitoredCommodities,
} from "@/lib/monitoring/commodity-data"
import { computeForexImpact } from "@/lib/monitoring/commodity-engine/forex-impact"

export const dynamic = "force-dynamic"
export const revalidate = 0

/** GET /api/monitoring/forex-impact — Forex impact insights (correlation + beta, narrative). */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Math.min(365, Math.max(14, parseInt(searchParams.get("days") ?? "90", 10) || 90))
    const commodityId = searchParams.get("commodityId") ?? undefined

    const [fxSeries, ...commodityData] = await Promise.all([
      getExchangeRateSeries(days),
      ...getMonitoredCommodities()
        .filter((c) => !commodityId || c.id === commodityId)
        .map((c) => getCommodityPriceSeries({ commodityId: c.id, commodityName: c.name, days })),
    ])

    const insights = commodityData.map(({ commodityId: cid, commodityName, series }) =>
      computeForexImpact(cid, commodityName, series, fxSeries, days)
    )

    return NextResponse.json({
      insights,
      periodDays: days,
      fxDescription: "USD/LRD (CBL or market)",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Monitoring forex-impact]", error)
    return NextResponse.json(
      {
        error: "Forex impact failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
