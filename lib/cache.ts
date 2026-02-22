/**
 * In-memory TTL cache for API responses. Use for expensive GET endpoints.
 * For production at scale, replace with Redis (REDIS_URL); same interface.
 */

interface CacheEntry<T> {
  value: T
  expiresAt: number
}

const store = new Map<string, CacheEntry<unknown>>()
const DEFAULT_TTL_MS = 60_000 // 1 minute

export function getCached<T>(key: string): T | null {
  const entry = store.get(key) as CacheEntry<T> | undefined
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    store.delete(key)
    return null
  }
  return entry.value
}

export function setCached<T>(key: string, value: T, ttlMs = DEFAULT_TTL_MS): void {
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  })
}

export function invalidateCache(keyPrefix: string): void {
  for (const key of store.keys()) {
    if (key.startsWith(keyPrefix)) store.delete(key)
  }
}

/** Build cache key for a request (path + sorted query string). */
export function cacheKey(path: string, searchParams?: Record<string, string>): string {
  if (!searchParams || Object.keys(searchParams).length === 0) return path
  const q = new URLSearchParams(searchParams)
  return `${path}?${q.toString()}`
}
