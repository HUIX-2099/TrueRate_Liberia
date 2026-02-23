/**
 * Business verification for changers and licensed entities.
 * Currently uses a static allowlist; can be replaced by DB (business_licenses) when MoCI data is available.
 */

import type { BusinessVerificationStatus, VerificationMap } from "./types"

/** Verified business/changer IDs (e.g. from ministry license data). Replace with DB lookup when available. */
const VERIFIED_IDS = new Set<string>([
  "1", "2", "3", "4", "5", "6", "7", // Match mock changers in app/api/rates/live/route.ts
])

/**
 * Returns whether the given business/changer ID is verified (e.g. licensed).
 */
export function isVerified(businessId: string): boolean {
  return VERIFIED_IDS.has(String(businessId))
}

/**
 * Returns verification status for a single business.
 */
export function getVerificationStatus(businessId: string): BusinessVerificationStatus {
  const verified = isVerified(businessId)
  return {
    id: String(businessId),
    verified,
    source: verified ? "operational" : "none",
    licenseStatus: verified ? "active" : undefined,
  }
}

/**
 * Returns a map of business ID → verified (true/false) for the given IDs.
 */
export function getVerificationMap(ids: string[]): VerificationMap {
  const map: VerificationMap = {}
  for (const id of ids) {
    map[String(id)] = isVerified(id)
  }
  return map
}

/**
 * Returns the set of all verified business IDs (for list endpoints).
 */
export function getVerifiedBusinessIds(): string[] {
  return Array.from(VERIFIED_IDS)
}
