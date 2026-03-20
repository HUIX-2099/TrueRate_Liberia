/**
 * Tiered API key middleware helper.
 * Call `checkApiKey(req)` at the top of API route handlers that should be
 * protected by an API key.  Returns a result object — never throws.
 */

import type { NextRequest } from "next/server"
import { validateApiKey, TIER_LIMITS, type ApiTier } from "./store"

export interface ApiKeyCheckResult {
  valid: boolean
  tier?: ApiTier
  userId?: string
  rateLimit?: number
  error?: string
  statusCode?: number
}

export function checkApiKey(
  req: NextRequest | Request,
  requiredTier?: ApiTier
): ApiKeyCheckResult {
  const authHeader =
    (req as NextRequest).headers?.get?.("authorization") ??
    (req as Request).headers?.get?.("authorization") ??
    ""

  const rawKey = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader.trim()

  if (!rawKey) {
    return {
      valid: false,
      error: "Missing API key. Pass it as `Authorization: Bearer <key>`.",
      statusCode: 401,
    }
  }

  const record = validateApiKey(rawKey)
  if (!record) {
    return { valid: false, error: "Invalid or revoked API key.", statusCode: 401 }
  }

  if (requiredTier) {
    const tierOrder: ApiTier[] = ["free", "standard", "premium", "enterprise"]
    if (tierOrder.indexOf(record.tier) < tierOrder.indexOf(requiredTier)) {
      return {
        valid: false,
        error: `This endpoint requires a ${TIER_LIMITS[requiredTier].label} plan or above.`,
        statusCode: 403,
      }
    }
  }

  return {
    valid: true,
    tier: record.tier,
    userId: record.userId,
    rateLimit: record.rateLimit,
  }
}
