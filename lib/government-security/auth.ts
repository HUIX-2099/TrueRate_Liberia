/**
 * API authentication for government data integration.
 * Supports API key (Bearer or header) and optional JWT; validates against configured keys/issuer.
 */

import type { AuthResult, GovernmentIdentity, GovernmentRole } from "./types"

/** In-memory store: keyPrefix -> { name, roles }. Use env or DB in production. */
const keyRegistry = new Map<
  string,
  { name: string; roles: GovernmentRole[] }
>()

/** Register a government API key (prefix is used in audit logs only). */
export function registerGovernmentKey(
  key: string,
  options: { name?: string; roles?: GovernmentRole[] } = {}
): void {
  const prefix = key.slice(0, 6) + "***"
  keyRegistry.set(key, {
    name: options.name ?? "Government client",
    roles: options.roles ?? ["gov_viewer"],
  })
}

/** Load keys from env. GOV_API_KEYS = JSON array of { key, name?, roles? }. */
function loadKeysFromEnv(): void {
  const raw = process.env.GOV_API_KEYS
  if (!raw) return
  try {
    const arr = JSON.parse(raw) as Array<{ key: string; name?: string; roles?: GovernmentRole[] }>
    for (const item of arr) {
      if (item.key) registerGovernmentKey(item.key, { name: item.name, roles: item.roles })
    }
  } catch {
    // ignore invalid env
  }
}
loadKeysFromEnv()

/** Single key from env: GOV_API_KEY with optional GOV_API_KEY_NAME, GOV_API_KEY_ROLES (comma-separated). */
if (process.env.GOV_API_KEY) {
  const roles = process.env.GOV_API_KEY_ROLES
    ? (process.env.GOV_API_KEY_ROLES.split(",").map((r) => r.trim()) as GovernmentRole[])
    : undefined
  registerGovernmentKey(process.env.GOV_API_KEY, {
    name: process.env.GOV_API_KEY_NAME,
    roles: roles?.length ? roles : undefined,
  })
}

/** Get API key from request: Authorization Bearer, X-API-Key, or query api_key. */
export function getGovernmentApiKeyFromRequest(request: Request): string | null {
  const auth = request.headers.get("authorization")
  if (auth?.toLowerCase().startsWith("bearer ")) {
    const key = auth.slice(7).trim()
    if (key && keyRegistry.has(key)) return key
  }
  const xKey = request.headers.get("x-api-key")
  if (xKey && keyRegistry.has(xKey)) return xKey
  try {
    const url = new URL(request.url)
    const q = url.searchParams.get("api_key")
    if (q && keyRegistry.has(q)) return q
  } catch {
    // no url
  }
  return null
}

/** Authenticate request; returns AuthResult or null if invalid/missing. */
export function authenticateGovernmentRequest(request: Request): AuthResult | null {
  const key = getGovernmentApiKeyFromRequest(request)
  if (!key) return null
  const meta = keyRegistry.get(key)
  if (!meta) return null
  const keyPrefix = key.slice(0, 6) + "***"
  const identity: GovernmentIdentity = {
    id: keyPrefix,
    name: meta.name,
    roles: meta.roles,
  }
  return { identity, keyPrefix }
}
