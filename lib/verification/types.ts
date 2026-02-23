/**
 * Business verification types for TrueRate.
 * Verification can come from Ministry of Commerce (license status) or community/operational rules.
 */

export type VerificationSource = "ministry" | "community" | "operational" | "none"

export interface BusinessVerificationStatus {
  id: string
  verified: boolean
  source: VerificationSource
  /** When license/ministry data is available: active | suspended | expired | unknown */
  licenseStatus?: "active" | "suspended" | "expired" | "unknown"
  /** Optional: valid until date from ministry data */
  validUntil?: string
}

export interface VerificationMap {
  [businessId: string]: boolean
}
