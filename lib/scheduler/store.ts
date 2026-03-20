/**
 * In-memory store for scheduler run history and last-run times.
 */

import type { SyncRunLogEntry } from "./types"

const runHistory: SyncRunLogEntry[] = []
const lastRunByJob = new Map<string, string>() // jobId -> ISO timestamp
const MAX_HISTORY = 500

export function appendRunLog(entry: SyncRunLogEntry): void {
  runHistory.push(entry)
  if (runHistory.length > MAX_HISTORY) runHistory.shift()
  lastRunByJob.set(entry.jobId, entry.finishedAt)
}

export function getLastRun(jobId: string): string | null {
  return lastRunByJob.get(jobId) ?? null
}

export function getRunHistory(options: {
  jobId?: string
  since?: string
  limit?: number
} = {}): SyncRunLogEntry[] {
  let list = [...runHistory]
  if (options.jobId) list = list.filter((e) => e.jobId === options.jobId)
  if (options.since) list = list.filter((e) => e.finishedAt >= options.since!)
  list.sort((a, b) => (b.finishedAt > a.finishedAt ? 1 : -1))
  const limit = options.limit ?? 100
  return list.slice(0, limit)
}

/** Build dashboard-friendly sync log entries (one per job: latest run + status). */
export function getSyncLogSummary(): Array<{
  source: string
  lastSync: string
  status: "success" | "partial" | "failed"
  recordsCount?: number
  message?: string
}> {
  const byJob = new Map<string, SyncRunLogEntry>()
  const sorted = [...runHistory].sort((a, b) => (b.finishedAt > a.finishedAt ? 1 : -1))
  for (const e of sorted) {
    if (!byJob.has(e.jobId)) byJob.set(e.jobId, e)
  }
  return [...byJob.entries()]
    .map(([jobId, e]) => ({
      source: e.jobName,
      lastSync: e.finishedAt,
      status: e.status,
      recordsCount: e.recordsCount,
      message: e.message ?? e.error,
    }))
    .sort((a, b) => (b.lastSync > a.lastSync ? 1 : -1))
}
