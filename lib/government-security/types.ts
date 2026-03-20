/**
 * Government data integration security – types for auth, roles, audit, rate limiting.
 */

/** Roles for government data access. */
export type GovernmentRole = "gov_viewer" | "gov_analyst" | "gov_admin" | "gov_auditor"

/** Identity extracted from API key or JWT. */
export interface GovernmentIdentity {
  /** Stable id (e.g. key id or subject). */
  id: string
  /** Display or client name. */
  name?: string
  /** Roles granted to this identity. */
  roles: GovernmentRole[]
  /** Optional scopes (e.g. dataset:rates). */
  scopes?: string[]
}

/** Result of authentication. */
export interface AuthResult {
  identity: GovernmentIdentity
  /** API key prefix for audit (e.g. gov_***). */
  keyPrefix: string
}

/** Audit event for compliance and forensics. */
export interface AuditEvent {
  id: string
  /** Action performed (e.g. api.access, api.denied, data.export). */
  action: string
  /** Actor (identity id or "anonymous"). */
  actor: string
  /** Resource (e.g. path, resource id). */
  resource: string
  /** success | denied | error */
  result: "success" | "denied" | "error"
  /** ISO timestamp. */
  timestamp: string
  /** Optional IP or forwarded-for. */
  ip?: string
  /** Optional user-agent. */
  userAgent?: string
  /** Optional metadata (no PII in production). */
  metadata?: Record<string, unknown>
}

/** Rate limit config. */
export interface RateLimitConfig {
  /** Max requests in the window. */
  maxRequests: number
  /** Window in seconds. */
  windowSeconds: number
}

/** Default: 100 requests per minute per key. */
export const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 100,
  windowSeconds: 60,
}
