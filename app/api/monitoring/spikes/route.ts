import { NextResponse } from "next/server"
import { getCommodityPriceSeries, getMonitoredCommodities } from "@/lib/monitoring/commodity-data"
import { detectSpikes } from "@/lib/monitoring/commodity-engine/spikes"

export const dynamic = "force-dynamic"
export const revalidate = 0

/** GET /api/monitoring/spikes — Detected price spikes. */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Math.min(365, Math.max(7, parseInt(searchParams.get("days") ?? "30", 10) || 30))
    const commodityId = searchParams.get("commodityId") ?? undefined
    const percentThreshold = searchParams.get("percentThreshold")
      ? parseInt(searchParams.get("percentThreshold")!, 10)
      : 15
    const zScoreThreshold = searchParams.get("zScoreThreshold")
      ? parseFloat(searchParams.get("zScoreThreshold")!)
      : 2.5

    const commodities = commodityId
      ? getMonitoredCommodities().filter((c) => c.id === commodityId)
      : getMonitoredCommodities()
    if (commodities.length === 0) {
      return NextResponse.json({ spikes: [], message: "No commodities match" })
    }

    const results = await Promise.all(
      commodities.map((c) =>
        getCommodityPriceSeries({ commodityId: c.id, commodityName: c.name, days })
      )
    )

    const allSpikes: ReturnType<typeof detectSpikes> = []
    for (const { commodityId: cid, commodityName, series } of results) {
      allSpikes.push(
        ...detectSpikes(cid, commodityName, series, {
          percentThreshold,
          zScoreThreshold,
          useZScore: true,
        })
      )
    }
    allSpikes.sort((a, b) => b.date.localeCompare(a.date))

    return NextResponse.json({
      spikes: allSpikes,
      periodDays: days,
      options: { percentThreshold, zScoreThreshold },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Monitoring spikes]", error)
    return NextResponse.json(
      { error: "Spikes failed", detail: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
