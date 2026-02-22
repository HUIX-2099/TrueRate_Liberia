import { NextResponse } from "next/server"
import { getImportRecords } from "@/lib/trade-analytics/data"
import { generateMarketDemandScore } from "@/lib/trade-analytics/market-demand-score"

export const dynamic = "force-dynamic"
export const revalidate = 0

/** GET /api/trade-analytics/market-demand-score — Market demand score (0-100) for basket or category. */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const periods = Math.min(60, Math.max(6, parseInt(searchParams.get("periods") ?? "24", 10) || 24))
    const period = searchParams.get("period") ?? undefined
    const category = searchParams.get("category") ?? undefined

    const records = await getImportRecords({ periods, category })
    const scores = generateMarketDemandScore(records, { period, category })

    return NextResponse.json({
      scores,
      period: period ?? "latest",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Trade analytics market-demand-score]", error)
    return NextResponse.json(
      {
        error: "Market demand score failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
