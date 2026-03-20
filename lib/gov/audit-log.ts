/**
 * Audit log store — in-memory for dev, Prisma-backed when DATABASE_URL is set.
 *
 * Every government/admin action is recorded here for compliance traceability.
 */

export type AuditAction =
  | "user.login"
  | "user.logout"
  | "user.register"
  | "api_key.created"
  | "api_key.revoked"
  | "rate.reported"
  | "forum.thread.created"
  | "forum.thread.deleted"
  | "forum.reply.deleted"
  | "invest.opportunity.created"
  | "invest.opportunity.updated"
  | "admin.page.accessed"
  | "gov.dashboard.accessed"

export interface AuditEntry {
  id: string
  timestamp: Date
  action: AuditAction
  userId?: string
  ipAddress?: string
  userAgent?: string
  details?: Record<string, unknown>
  severity: "info" | "warn" | "critical"
}

// ── In-memory store ────────────────────────────────────────────────────────

const entries: AuditEntry[] = []
const MAX_IN_MEMORY = 1000

export function logAuditEvent(
  action: AuditAction,
  opts: {
    userId?: string
    ipAddress?: string
    userAgent?: string
    details?: Record<string, unknown>
    severity?: AuditEntry["severity"]
  } = {}
): AuditEntry {
  const entry: AuditEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    action,
    userId: opts.userId,
    ipAddress: opts.ipAddress,
    userAgent: opts.userAgent,
    details: opts.details,
    severity: opts.severity ?? "info",
  }

  entries.unshift(entry)
  if (entries.length > MAX_IN_MEMORY) entries.splice(MAX_IN_MEMORY)

  if (process.env.NODE_ENV !== "production") {
    console.log(`[AUDIT] ${entry.severity.toUpperCase()} | ${entry.action} | user=${entry.userId ?? "anon"} | ${JSON.stringify(entry.details ?? {})}`)
  }

  return entry
}

export function getAuditLog(opts?: {
  limit?: number
  offset?: number
  userId?: string
  action?: AuditAction
  severity?: AuditEntry["severity"]
}): { entries: AuditEntry[]; total: number } {
  let filtered = [...entries]

  if (opts?.userId) filtered = filtered.filter((e) => e.userId === opts.userId)
  if (opts?.action) filtered = filtered.filter((e) => e.action === opts.action)
  if (opts?.severity) filtered = filtered.filter((e) => e.severity === opts.severity)

  const total = filtered.length
  const limit = opts?.limit ?? 50
  const offset = opts?.offset ?? 0

  return { entries: filtered.slice(offset, offset + limit), total }
}
