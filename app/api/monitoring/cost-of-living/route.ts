import { NextResponse } from "next/server"
import { getCommodityPriceSeries, getMonitoredCommodities } from "@/lib/monitoring/commodity-data"
import { computeCostOfLivingIndex } from "@/lib/monitoring/commodity-engine/cost-of-living"

export const dynamic = "force-dynamic"
export const revalidate = 0

/** GET /api/monitoring/cost-of-living — Cost of living index (basket = 100 at base period). */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Math.min(365, Math.max(14, parseInt(searchParams.get("days") ?? "90", 10) || 90))
    const baseDate = searchParams.get("baseDate") ?? undefined

    const commodities = getMonitoredCommodities()
    const seriesList = await Promise.all(
      commodities.map((c) =>
        getCommodityPriceSeries({ commodityId: c.id, commodityName: c.name, days })
      )
    )

    const result = computeCostOfLivingIndex(seriesList, { baseDate })
    if (!result) {
      return NextResponse.json(
        { error: "Insufficient data for cost-of-living index" },
        { status: 422 }
      )
    }

    return NextResponse.json({
      ...result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Monitoring cost-of-living]", error)
    return NextResponse.json(
      {
        error: "Cost-of-living failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
