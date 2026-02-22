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
