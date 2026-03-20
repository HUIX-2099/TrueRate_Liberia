import { NextResponse } from "next/server"
import { getCommodityPriceSeries, getMonitoredCommodities } from "@/lib/monitoring/commodity-data"
import { computeInflationIndicators } from "@/lib/monitoring/commodity-engine/inflation"

export const dynamic = "force-dynamic"
export const revalidate = 0

/** GET /api/monitoring/inflation — Market inflation indicators (MoM, YoY basket % change). */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Math.min(365 * 2, Math.max(60, parseInt(searchParams.get("days") ?? "365", 10) || 365))

    const commodities = getMonitoredCommodities()
    const seriesList = await Promise.all(
      commodities.map((c) =>
        getCommodityPriceSeries({ commodityId: c.id, commodityName: c.name, days })
      )
    )

    const indicators = computeInflationIndicators(seriesList, { days })

    return NextResponse.json({
      indicators,
      periodDays: days,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Monitoring inflation]", error)
    return NextResponse.json(
      {
        error: "Inflation indicators failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
