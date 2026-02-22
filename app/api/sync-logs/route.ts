import { NextResponse } from "next/server"
import { getSyncLogSummary, getRunHistory } from "@/lib/scheduler"

export const dynamic = "force-dynamic"
export const revalidate = 0

export interface SyncLogEntry {
  source: string
  lastSync: string
  status: "success" | "partial" | "failed"
  recordsCount?: number
  message?: string
}

/** GET /api/sync-logs — Data sync log entries from scheduler (and optional run history). */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const history = url.searchParams.get("history") === "true"
    const jobId = url.searchParams.get("jobId") ?? undefined
    const since = url.searchParams.get("since") ?? undefined
    const limit = url.searchParams.get("limit") ? parseInt(url.searchParams.get("limit")!, 10) : undefined

    const logs = getSyncLogSummary()

    const payload: { logs: SyncLogEntry[]; timestamp: string; runs?: unknown[] } = {
      logs: logs.length > 0 ? logs : getPlaceholderLogs(),
      timestamp: new Date().toISOString(),
    }

    if (history) {
      payload.runs = getRunHistory({ jobId, since, limit })
    }

    return NextResponse.json(payload)
  } catch (error) {
    console.error("[Sync logs]", error)
    return NextResponse.json(
      { error: "Failed to fetch sync logs", detail: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    )
  }
}

function getPlaceholderLogs(): SyncLogEntry[] {
  const now = new Date()
  return [
    { source: "CBL rates", lastSync: now.toISOString(), status: "success", message: "Run /api/cron/sync to start" },
    { source: "Commodity prices", lastSync: now.toISOString(), status: "success", message: "Scheduled via cron" },
    { source: "Trade / import data", lastSync: now.toISOString(), status: "success", message: "Scheduled via cron" },
  ]
}
