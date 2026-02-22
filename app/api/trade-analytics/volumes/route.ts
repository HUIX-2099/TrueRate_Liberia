import { NextResponse } from "next/server"
import { getImportRecords } from "@/lib/trade-analytics/data"
import { analyzeImportVolumes } from "@/lib/trade-analytics/import-volumes"

export const dynamic = "force-dynamic"
export const revalidate = 0

/** GET /api/trade-analytics/volumes — Analyze import volumes by period/category/origin. */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const periods = Math.min(60, Math.max(6, parseInt(searchParams.get("periods") ?? "24", 10) || 24))
    const category = searchParams.get("category") ?? undefined
    const originCountry = searchParams.get("originCountry") ?? undefined

    const records = await getImportRecords({ periods, category, originCountry })
    const volumeAnalysis = analyzeImportVolumes(records)

    return NextResponse.json({
      volumeAnalysis,
      recordCount: records.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Trade analytics volumes]", error)
    return NextResponse.json(
      {
        error: "Import volume analysis failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
