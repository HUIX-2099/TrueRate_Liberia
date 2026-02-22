import { NextResponse } from "next/server"
import { getHistoricalTrends, getHistoricalTrendById } from "@/lib/trade-analytics/historical-trends"

export const dynamic = "force-dynamic"
export const revalidate = 0

/** GET /api/trade-analytics/historical-trends — List stored historical trend snapshots. */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") ?? undefined
    const since = searchParams.get("since") ?? undefined
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined
    const id = searchParams.get("id") ?? undefined

    if (id) {
      const snapshot = getHistoricalTrendById(id)
      if (!snapshot) {
        return NextResponse.json({ error: "Snapshot not found", id }, { status: 404 })
      }
      return NextResponse.json({ snapshot })
    }

    const trends = getHistoricalTrends({ period, since, limit })
    return NextResponse.json({
      trends,
      count: trends.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Trade analytics historical-trends]", error)
    return NextResponse.json(
      {
        error: "Historical trends failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
