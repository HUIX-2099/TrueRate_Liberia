/**
 * Cron-based scheduler for data sync – types.
 */

/** Schedule: run every N minutes. */
export interface IntervalSchedule {
  type: "interval"
  minutes: number
}

/** Cron expression (e.g. every 15 min). Optional; interval used if not set. */
export interface CronSchedule {
  type: "cron"
  expression: string
}

export type Schedule = IntervalSchedule | CronSchedule

/** Result of a single job run. */
export interface JobRunResult {
  success: boolean
  recordsCount?: number
  message?: string
  error?: string
}

/** Definition of a sync job. */
export interface SyncJobDef {
  id: string
  name: string
  schedule: Schedule
  /** Async task that performs the sync. */
  run: () => Promise<JobRunResult>
}

/** Log entry for one execution. */
export interface SyncRunLogEntry {
  id: string
  jobId: string
  jobName: string
  startedAt: string
  finishedAt: string
  status: "success" | "partial" | "failed"
  recordsCount?: number
  message?: string
  error?: string
  attempt: number
  durationMs: number
}
