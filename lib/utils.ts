import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Optimized fetch with caching
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

export async function cachedFetch(
  url: string,
  options?: RequestInit & { ttl?: number }
) {
  const { ttl = 5 * 60 * 1000, ...fetchOptions } = options || {} // 5 minutes default TTL
  const cacheKey = `${url}-${JSON.stringify(fetchOptions)}`

  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data
  }

  const response = await fetch(url, fetchOptions)
  const data = await response.json()

  cache.set(cacheKey, { data, timestamp: Date.now(), ttl })

  return data
}

/** Clear in-memory fetch cache so next cachedFetch calls get fresh data */
export function clearFetchCache(): void {
  cache.clear()
}

/** Clear TrueRate service worker caches (browser only). No-op if caches API unavailable. */
export async function clearServiceWorkerCaches(): Promise<void> {
  if (typeof window === "undefined" || !("caches" in window)) return
  try {
    const keys = await window.caches.keys()
    const truerateKeys = keys.filter((k: string) => k.startsWith("truerate-"))
    await Promise.all(truerateKeys.map((k: string) => window.caches.delete(k)))
  } catch {
    // ignore
  }
}
