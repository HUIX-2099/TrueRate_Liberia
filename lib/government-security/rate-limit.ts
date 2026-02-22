/**
 * Rate limiting for government API (in-memory sliding window per key).
 */

import type { RateLimitConfig } from "./types"
import { DEFAULT_RATE_LIMIT } from "./types"

/** Per-key: list of request timestamps (ms). */
const buckets = new Map<string, number[]>()
const BUCKET_CLEANUP_INTERVAL = 60_000
let lastCleanup = Date.now()

function cleanup(): void {
  const now = Date.now()
  if (now - lastCleanup < BUCKET_CLEANUP_INTERVAL) return
  lastCleanup = now
  const windowMs = (DEFAULT_RATE_LIMIT.windowSeconds ?? 60) * 1000
  for (const [key, timestamps] of buckets.entries()) {
    const cutoff = now - windowMs
    const kept = timestamps.filter((t) => t > cutoff)
    if (kept.length === 0) buckets.delete(key)
    else buckets.set(key, kept)
  }
}

/**
 * Check rate limit for identifier (e.g. API key or IP).
 * Returns true if allowed, false if rate limited.
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = DEFAULT_RATE_LIMIT
): { allowed: boolean; remaining: number; resetAt: number } {
  cleanup()
  const now = Date.now()
  const windowMs = config.windowSeconds * 1000
  const cutoff = now - windowMs
  const timestamps = buckets.get(identifier) ?? []
  const recent = timestamps.filter((t) => t > cutoff)
  const allowed = recent.length < config.maxRequests
  if (allowed) recent.push(now)
  buckets.set(identifier, recent)
  const resetAt = recent.length > 0 ? Math.min(...recent) + windowMs : now + windowMs
  const remaining = Math.max(0, config.maxRequests - recent.length)
  return { allowed, remaining, resetAt }
}

/** Get client identifier for rate limiting (key prefix or IP). */
export function getRateLimitId(request: Request, keyPrefixOrNull: string | null): string {
  if (keyPrefixOrNull) return `key:${keyPrefixOrNull}`
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip") ?? "anonymous"
  return `ip:${ip}`
}
