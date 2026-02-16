/**
 * Simple API key validation for Business API.
 * Keys are stored in memory; replace with DB lookup in production.
 */

const validKeys = new Set<string>([
  // Demo key for development; remove or rotate in production
  ...(process.env.TRUERATE_DEMO_API_KEY ? [process.env.TRUERATE_DEMO_API_KEY] : []),
])

export function getApiKeyFromRequest(request: Request): string | null {
  const auth = request.headers.get("authorization")
  if (auth?.startsWith("Bearer ")) {
    const key = auth.slice(7).trim()
    if (key && validKeys.has(key)) return key
  }
  const url = new URL(request.url)
  const q = url.searchParams.get("api_key")
  if (q && validKeys.has(q)) return q
  return null
}

export function registerApiKey(key: string): void {
  validKeys.add(key)
}
