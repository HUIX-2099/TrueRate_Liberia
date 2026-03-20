/**
 * Wrapper for government API route handlers: auth, optional role check, rate limit, audit.
 */

import { NextResponse } from "next/server"
import type { GovernmentRole } from "./types"
import { authenticateGovernmentRequest } from "./auth"
import { requireRole } from "./roles"
import { auditApiAccess } from "./audit"
import { checkRateLimit, getRateLimitId } from "./rate-limit"
import { DEFAULT_RATE_LIMIT } from "./types"

export interface GovernmentSecurityOptions {
  /** Required roles (any one of). Omit to allow any authenticated identity. */
  roles?: GovernmentRole[]
  /** Rate limit override. */
  rateLimit?: { maxRequests: number; windowSeconds: number }
}

export type GovernmentRouteHandler = (
  request: Request,
  context: { identity: { id: string; name?: string; roles: GovernmentRole[] }; keyPrefix: string }
) => Promise<NextResponse> | NextResponse

/**
 * Wrap a route handler with government security: API auth, optional role check, rate limit, audit.
 */
export function withGovernmentSecurity(
  handler: GovernmentRouteHandler,
  options: GovernmentSecurityOptions = {}
): (request: Request) => Promise<NextResponse> {
  const { roles, rateLimit = DEFAULT_RATE_LIMIT } = options

  return async function securedRoute(request: Request): Promise<NextResponse> {
    const path = new URL(request.url).pathname

    const auth = authenticateGovernmentRequest(request)
    const rateId = getRateLimitId(request, auth?.keyPrefix ?? null)

    if (!auth) {
      auditApiAccess(request, "anonymous", path, "denied", { reason: "missing_or_invalid_key" })
      return NextResponse.json(
        { error: "Unauthorized", message: "Valid API key required (Authorization: Bearer, X-API-Key, or api_key)" },
        { status: 401 }
      )
    }

    const { allowed, remaining, resetAt } = checkRateLimit(rateId, rateLimit)
    if (!allowed) {
      auditApiAccess(request, auth.identity.id, path, "denied", { reason: "rate_limited" })
      return NextResponse.json(
        { error: "Too Many Requests", message: "Rate limit exceeded" },
        { status: 429, headers: { "X-RateLimit-Remaining": "0", "X-RateLimit-Reset": String(resetAt) } }
      )
    }

    if (roles?.length) {
      try {
        requireRole(auth.identity, roles)
      } catch (err: unknown) {
        const code = (err as { code?: string })?.code
        auditApiAccess(request, auth.identity.id, path, "denied", { reason: "insufficient_role" })
        return NextResponse.json(
          { error: "Forbidden", message: code === "FORBIDDEN" ? "Insufficient role" : "Access denied" },
          { status: 403 }
        )
      }
    }

    try {
      const response = await handler(request, {
        identity: auth.identity,
        keyPrefix: auth.keyPrefix,
      })
      auditApiAccess(request, auth.identity.id, path, "success")
      if (response instanceof NextResponse) {
        response.headers.set("X-RateLimit-Remaining", String(Math.max(0, remaining - 1)))
        response.headers.set("X-RateLimit-Reset", String(resetAt))
      }
      return response
    } catch (err) {
      auditApiAccess(request, auth.identity.id, path, "error")
      throw err
    }
  }
}
