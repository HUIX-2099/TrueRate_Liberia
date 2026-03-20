/**
 * Cron-based scheduler for data sync. Run due jobs, log results, expose history.
 */

import type { SyncRunLogEntry } from "./types"
import { SYNC_JOBS } from "./jobs"
import { isJobDue } from "./cron"
import { runJobWithRetry } from "./runner"
import { getRunHistory, getSyncLogSummary } from "./store"

export { SYNC_JOBS } from "./jobs"
export { getLastRun, getRunHistory, getSyncLogSummary } from "./store"
export type { SyncJobDef, SyncRunLogEntry, JobRunResult, Schedule } from "./types"

/** Run all jobs that are due. Returns run results and summary. */
export async function runDueJobs(now: Date = new Date()): Promise<{
  ran: SyncRunLogEntry[]
  skipped: string[]
  summary: { success: number; failed: number; partial: number }
}> {
  const due = SYNC_JOBS.filter((job) => isJobDue(job, now))
  const skipped = SYNC_JOBS.filter((job) => !isJobDue(job, now)).map((j) => j.id)

  const ran: SyncRunLogEntry[] = []
  for (const job of due) {
    const entry = await runJobWithRetry(job)
    ran.push(entry)
  }

  const summary = {
    success: ran.filter((e) => e.status === "success").length,
    failed: ran.filter((e) => e.status === "failed").length,
    partial: ran.filter((e) => e.status === "partial").length,
  }

  return { ran, skipped, summary }
}

/** Run a single job by id (for manual trigger). */
export async function runJobById(jobId: string): Promise<SyncRunLogEntry | null> {
  const job = SYNC_JOBS.find((j) => j.id === jobId)
  if (!job) return null
  return runJobWithRetry(job)
}
