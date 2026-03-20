import { NextResponse } from "next/server"
import { getCommodityPriceSeries, getMonitoredCommodities } from "@/lib/monitoring/commodity-data"
import { computeVolatilitySeries } from "@/lib/monitoring/commodity-engine/volatility"

export const dynamic = "force-dynamic"
export const revalidate = 0

/** GET /api/monitoring/volatility — Price volatility series for charts (rolling CV %). */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Math.min(365, Math.max(14, parseInt(searchParams.get("days") ?? "90", 10) || 90))
    const windowDays = Math.min(90, Math.max(3, parseInt(searchParams.get("window") ?? "7", 10) || 7))
    const commodityId = searchParams.get("commodityId") ?? undefined

    const commodities = commodityId
      ? getMonitoredCommodities().filter((c) => c.id === commodityId)
      : getMonitoredCommodities()
    if (commodities.length === 0) {
      return NextResponse.json({ series: [], message: "No commodities match" })
    }

    const results = await Promise.all(
      commodities.map((c) =>
        getCommodityPriceSeries({ commodityId: c.id, commodityName: c.name, days })
      )
    )

    const isIndicative = results.some((r) => r.isIndicative)
    const series = results.map(({ commodityId, commodityName, series: s }) =>
      computeVolatilitySeries(commodityId, commodityName, s, windowDays)
    )

    return NextResponse.json({
      series,
      windowDays,
      periodDays: days,
      timestamp: new Date().toISOString(),
      isIndicative,
    })
  } catch (error) {
    console.error("[Monitoring volatility]", error)
    return NextResponse.json(
      {
        error: "Volatility failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
