/**
 * Audit logging for government data access and security events.
 */

import type { AuditEvent } from "./types"

const log: AuditEvent[] = []
const MAX_LOG_ENTRIES = 10_000

function nextId(): string {
  return `audit_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function getClientInfo(request: Request): { ip?: string; userAgent?: string } {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip") ?? undefined
  const userAgent = request.headers.get("user-agent") ?? undefined
  return { ip, userAgent }
}

/** Record an audit event (in-memory; persist to DB or SIEM in production). */
export function auditLog(
  action: string,
  actor: string,
  resource: string,
  result: AuditEvent["result"],
  options: {
    request?: Request
    metadata?: Record<string, unknown>
  } = {}
): AuditEvent {
  const { request, metadata } = options
  const { ip, userAgent } = request ? getClientInfo(request) : {}
  const event: AuditEvent = {
    id: nextId(),
    action,
    actor,
    resource,
    result,
    timestamp: new Date().toISOString(),
    ip,
    userAgent,
    metadata,
  }
  log.push(event)
  if (log.length > MAX_LOG_ENTRIES) log.shift()
  return event
}

/** Get recent audit events (for admin/auditor). */
export function getAuditLog(options: {
  since?: string
  actor?: string
  action?: string
  result?: AuditEvent["result"]
  limit?: number
} = {}): AuditEvent[] {
  let list = [...log]
  if (options.since) list = list.filter((e) => e.timestamp >= options.since!)
  if (options.actor) list = list.filter((e) => e.actor === options.actor)
  if (options.action) list = list.filter((e) => e.action === options.action)
  if (options.result) list = list.filter((e) => e.result === options.result)
  list.sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1))
  const limit = options.limit ?? 100
  return list.slice(0, limit)
}

/** Helper: audit API access (success/denied). */
export function auditApiAccess(
  request: Request,
  actor: string,
  resource: string,
  result: "success" | "denied",
  metadata?: Record<string, unknown>
): AuditEvent {
  return auditLog("api.access", actor, resource, result, { request, metadata })
}
