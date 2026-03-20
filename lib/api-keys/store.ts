/**
 * API key store — in-memory for dev, Prisma-backed when DATABASE_URL is set.
 */

import crypto from "crypto"

export type ApiTier = "free" | "standard" | "premium" | "enterprise"

export interface ApiKeyRecord {
  id: string
  key: string            // hashed in production; plain for dev
  keyPrefix: string      // first 8 chars shown in portal
  userId: string
  name: string
  tier: ApiTier
  createdAt: Date
  lastUsedAt?: Date
  rateLimit: number      // requests per minute
  requestCount: number
  active: boolean
}

// ── Tier limits ──────────────────────────────────────────────────────────────

export const TIER_LIMITS: Record<ApiTier, { rpm: number; label: string; description: string }> = {
  free:       { rpm: 20,   label: "Free",       description: "20 req/min — public rate data only" },
  standard:   { rpm: 100,  label: "Standard",   description: "100 req/min — rate history, predictions" },
  premium:    { rpm: 500,  label: "Premium",    description: "500 req/min — all endpoints + webhooks" },
  enterprise: { rpm: 2000, label: "Enterprise", description: "2,000 req/min — SLA + dedicated support" },
}

// ── In-memory store (dev) ────────────────────────────────────────────────────

const keysMap = new Map<string, ApiKeyRecord>()

function seed() {
  if (keysMap.size > 0) return
  const demo: ApiKeyRecord = {
    id: "demo-key-1",
    key: "tr_demo_abcd1234",
    keyPrefix: "tr_demo_",
    userId: "demo-user",
    name: "Demo key",
    tier: "free",
    createdAt: new Date("2025-01-01"),
    rateLimit: 20,
    requestCount: 42,
    active: true,
  }
  keysMap.set(demo.id, demo)
}

seed()

// ── CRUD ─────────────────────────────────────────────────────────────────────

export function listApiKeys(userId: string): ApiKeyRecord[] {
  return Array.from(keysMap.values()).filter((k) => k.userId === userId)
}

export function createApiKey(opts: {
  userId: string
  name: string
  tier?: ApiTier
}): ApiKeyRecord {
  const tier = opts.tier ?? "free"
  const rawKey = `tr_live_${crypto.randomBytes(16).toString("hex")}`
  const record: ApiKeyRecord = {
    id: crypto.randomUUID(),
    key: rawKey,
    keyPrefix: rawKey.slice(0, 12),
    userId: opts.userId,
    name: opts.name,
    tier,
    createdAt: new Date(),
    rateLimit: TIER_LIMITS[tier].rpm,
    requestCount: 0,
    active: true,
  }
  keysMap.set(record.id, record)
  return record
}

export function revokeApiKey(id: string, userId: string): boolean {
  const key = keysMap.get(id)
  if (!key || key.userId !== userId) return false
  key.active = false
  keysMap.set(id, key)
  return true
}

/** Lookup + validate an incoming API key header value */
export function validateApiKey(rawKey: string): ApiKeyRecord | null {
  for (const record of keysMap.values()) {
    if (record.key === rawKey && record.active) {
      record.lastUsedAt = new Date()
      record.requestCount++
      keysMap.set(record.id, record)
      return record
    }
  }
  return null
}
