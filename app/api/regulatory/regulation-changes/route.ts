import { NextResponse } from "next/server"
import { getRecentRegulationChanges } from "@/lib/regulatory"
import type { RegulationChangeKind } from "@/lib/regulatory"

export const dynamic = "force-dynamic"
export const revalidate = 0

/** GET /api/regulatory/regulation-changes — Recent market regulation change events (for notification polling). Query: since, kind, limit. */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const since = searchParams.get("since") ?? undefined
    const kind = searchParams.get("kind") as RegulationChangeKind | undefined
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined

    const events = getRecentRegulationChanges({ since, kind, limit })
    return NextResponse.json({ regulationChanges: events, count: events.length })
  } catch (error) {
    console.error("[Regulatory regulation-changes GET]", error)
    return NextResponse.json(
      {
        error: "Failed to list regulation changes",
        detail: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 }
    )
  }
}
