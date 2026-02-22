import { NextResponse } from "next/server"
import { getRunHistory } from "@/lib/scheduler"

export const dynamic = "force-dynamic"
export const revalidate = 0

/** GET /api/scheduler/runs — Full run history for scheduler (jobId, since, limit). */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const jobId = url.searchParams.get("jobId") ?? undefined
    const since = url.searchParams.get("since") ?? undefined
    const limit = url.searchParams.get("limit") ? parseInt(url.searchParams.get("limit")!, 10) : undefined

    const runs = getRunHistory({ jobId, since, limit })
    return NextResponse.json({
      runs,
      count: runs.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Scheduler runs]", error)
    return NextResponse.json(
      { error: "Failed to fetch run history", detail: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    )
  }
}
