/**
 * Cron / schedule logic: determine which jobs are due.
 */

import type { SyncJobDef, Schedule } from "./types"
import { getLastRun } from "./store"

/** Return true if the job is due to run (interval elapsed or cron matches). */
export function isJobDue(job: SyncJobDef, now: Date = new Date()): boolean {
  const last = getLastRun(job.id)
  const schedule = job.schedule

  if (schedule.type === "interval") {
    const windowMs = schedule.minutes * 60 * 1000
    if (!last) return true
    const lastTime = new Date(last).getTime()
    return now.getTime() - lastTime >= windowMs
  }

  if (schedule.type === "cron") {
    return isCronDue(schedule.expression, last, now)
  }

  return false
}

// Simple cron parser: every N minutes (minute field star-slash N), hourly (0 *), daily (0 0).
function isCronDue(expression: string, lastRun: string | null, now: Date): boolean {
  const parts = expression.trim().split(/\s+/)
  if (parts.length < 5) return true

  const [min, hour] = parts

  if (min.startsWith("*/")) {
    const n = parseInt(min.slice(2), 10)
    if (!Number.isFinite(n) || n < 1) return true
    if (!lastRun) return true
    const last = new Date(lastRun).getTime()
    const windowMs = n * 60 * 1000
    return now.getTime() - last >= windowMs
  }

  if (min === "0" && hour === "*") {
    if (!lastRun) return true
    const last = new Date(lastRun)
    return now.getUTCHours() !== last.getUTCHours() || now.getTime() - last.getTime() > 3600_000
  }

  if (min === "0" && hour === "0") {
    if (!lastRun) return true
    const last = new Date(lastRun)
    const lastDay = last.toISOString().slice(0, 10)
    const today = now.toISOString().slice(0, 10)
    return lastDay !== today
  }

  return true
}
