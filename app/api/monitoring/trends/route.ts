import { NextResponse } from "next/server"
import { getCommodityPriceSeries, getMonitoredCommodities } from "@/lib/monitoring/commodity-data"
import { computeTrend } from "@/lib/monitoring/commodity-engine/trends"

export const dynamic = "force-dynamic"
export const revalidate = 0

/** GET /api/monitoring/trends — Price trends for monitored commodities. */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Math.min(365, Math.max(7, parseInt(searchParams.get("days") ?? "30", 10) || 30))
    const commodityId = searchParams.get("commodityId") ?? undefined
    const window = searchParams.get("window")
      ? parseInt(searchParams.get("window")!, 10)
      : undefined

    const commodities = commodityId
      ? getMonitoredCommodities().filter((c) => c.id === commodityId)
      : getMonitoredCommodities()
    if (commodities.length === 0) {
      return NextResponse.json({ trends: [], message: "No commodities match" })
    }

    const results = await Promise.all(
      commodities.map((c) =>
        getCommodityPriceSeries({ commodityId: c.id, commodityName: c.name, days })
      )
    )

    const trends = results
      .map(({ commodityId, commodityName, series }) =>
        computeTrend(commodityId, commodityName, series, { window })
      )
      .filter((t): t is NonNullable<typeof t> => t !== null)

    return NextResponse.json({
      trends,
      periodDays: days,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Monitoring trends]", error)
    return NextResponse.json(
      { error: "Trends failed", detail: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
