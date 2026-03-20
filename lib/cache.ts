/**
 * TTL cache for API responses.
 *
 * When UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set, all
 * operations are backed by Upstash Redis — safe for Vercel serverless where
 * module-level memory is not shared across invocations.
 *
 * Falls back to an in-memory Map (useful for local dev, but note that each
 * cold start gets a fresh store on serverless deployments).
 */

interface CacheEntry<T> {
  value: T
  expiresAt: number
}

const DEFAULT_TTL_MS = 60_000 // 1 minute

// ── In-memory fallback ────────────────────────────────────────────────────────

const store = new Map<string, CacheEntry<unknown>>()

function memGet<T>(key: string): T | null {
  const entry = store.get(key) as CacheEntry<T> | undefined
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    store.delete(key)
    return null
  }
  return entry.value
}

function memSet<T>(key: string, value: T, ttlMs: number): void {
  store.set(key, { value, expiresAt: Date.now() + ttlMs })
}

// ── Upstash Redis path ────────────────────────────────────────────────────────

function getRedisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  try {
    // Dynamic require so the module is optional — no hard crash when absent.
    const { Redis } = require("@upstash/redis") as typeof import("@upstash/redis")
    return new Redis({ url, token })
  } catch {
    return null
  }
}

async function redisGet<T>(key: string): Promise<T | null> {
  const redis = getRedisClient()
  if (!redis) return null
  try {
    return (await redis.get<T>(key)) ?? null
  } catch {
    return null
  }
}

async function redisSet<T>(key: string, value: T, ttlMs: number): Promise<boolean> {
  const redis = getRedisClient()
  if (!redis) return false
  try {
    await redis.set(key, value, { px: ttlMs })
    return true
  } catch {
    return false
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function getCached<T>(key: string): Promise<T | null> {
  const fromRedis = await redisGet<T>(key)
  if (fromRedis !== null) return fromRedis
  return memGet<T>(key)
}

export async function setCached<T>(key: string, value: T, ttlMs = DEFAULT_TTL_MS): Promise<void> {
  const storedInRedis = await redisSet(key, value, ttlMs)
  if (!storedInRedis) memSet(key, value, ttlMs)
}

export async function invalidateCache(keyPrefix: string): Promise<void> {
  // In-memory cleanup
  for (const key of store.keys()) {
    if (key.startsWith(keyPrefix)) store.delete(key)
  }
  // Redis cleanup (scan + delete)
  const redis = getRedisClient()
  if (redis) {
    try {
      const keys = await redis.keys(`${keyPrefix}*`)
      if (keys.length > 0) await redis.del(...keys)
    } catch {
      // non-fatal
    }
  }
}

/** Build cache key for a request (path + sorted query string). */
export function cacheKey(path: string, searchParams?: Record<string, string>): string {
  if (!searchParams || Object.keys(searchParams).length === 0) return path
  const q = new URLSearchParams(searchParams)
  return `${path}?${q.toString()}`
}

/** Whether Redis is configured (for health checks / logging). */
export function isRedisConfigured(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
}
