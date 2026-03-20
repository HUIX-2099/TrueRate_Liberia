/**
 * Run a sync job with retry and exponential backoff; log result.
 */

import type { SyncJobDef, SyncRunLogEntry, JobRunResult } from "./types"
import { appendRunLog } from "./store"

const MAX_ATTEMPTS = 3
const BASE_DELAY_MS = 2000

function nextId(): string {
  return `run_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function toStatus(result: JobRunResult): SyncRunLogEntry["status"] {
  if (result.success) return result.recordsCount === 0 && result.error ? "partial" : "success"
  return "failed"
}

/** Run one job with retries (exponential backoff). Logs each attempt and final result. */
export async function runJobWithRetry(job: SyncJobDef): Promise<SyncRunLogEntry> {
  const startedAt = new Date().toISOString()
  let lastResult: JobRunResult | null = null
  let attempt = 0

  for (attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      lastResult = await job.run()
      if (lastResult.success) break
      lastResult = {
        ...lastResult,
        success: false,
        error: lastResult.error ?? lastResult.message ?? "Unknown error",
      }
    } catch (err) {
      lastResult = {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      }
    }
    if (attempt < MAX_ATTEMPTS) {
      const delayMs = BASE_DELAY_MS * Math.pow(2, attempt - 1)
      await new Promise((r) => setTimeout(r, delayMs))
    }
  }

  const finishedAt = new Date().toISOString()
  const started = new Date(startedAt).getTime()
  const finished = new Date(finishedAt).getTime()
  const durationMs = finished - started
  const result = lastResult ?? { success: false, error: "No result" }
  const status = toStatus(result)

  const entry: SyncRunLogEntry = {
    id: nextId(),
    jobId: job.id,
    jobName: job.name,
    startedAt,
    finishedAt,
    status,
    recordsCount: result.recordsCount,
    message: result.message,
    error: result.error,
    attempt,
    durationMs,
  }
  appendRunLog(entry)
  return entry
}
