import { NextResponse } from "next/server"
import { getImportRecords } from "@/lib/trade-analytics/data"
import { detectDemandPatterns } from "@/lib/trade-analytics/demand-patterns"

export const dynamic = "force-dynamic"
export const revalidate = 0

/** GET /api/trade-analytics/demand-patterns — Detect demand patterns (trend, seasonality) per category. */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const periods = Math.min(60, Math.max(6, parseInt(searchParams.get("periods") ?? "24", 10) || 24))
    const category = searchParams.get("category") ?? undefined

    const records = await getImportRecords({ periods, category })
    const demandPatterns = detectDemandPatterns(records)

    return NextResponse.json({
      demandPatterns,
      recordCount: records.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Trade analytics demand-patterns]", error)
    return NextResponse.json(
      {
        error: "Demand pattern detection failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
