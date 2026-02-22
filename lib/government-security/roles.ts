/**
 * Role-based access for government data integration.
 */

import type { GovernmentRole, GovernmentIdentity } from "./types"

/** Hierarchy: admin has all; analyst has viewer + analyst; viewer is base. */
const ROLE_ORDER: GovernmentRole[] = ["gov_viewer", "gov_analyst", "gov_admin", "gov_auditor"]

function roleLevel(role: GovernmentRole): number {
  const i = ROLE_ORDER.indexOf(role)
  return i >= 0 ? i : -1
}

/** Returns true if identity has at least the required role (by hierarchy). */
export function hasRole(identity: GovernmentIdentity, required: GovernmentRole): boolean {
  if (identity.roles.includes("gov_admin")) return true
  if (identity.roles.includes(required)) return true
  const requiredLevel = roleLevel(required)
  return identity.roles.some((r) => roleLevel(r) >= requiredLevel)
}

/** Require one of the given roles; throws if not allowed. */
export function requireRole(identity: GovernmentIdentity, allowed: GovernmentRole[]): void {
  const ok = allowed.some((r) => hasRole(identity, r))
  if (!ok) {
    const err = new Error("Insufficient role")
    ;(err as Error & { code?: string }).code = "FORBIDDEN"
    throw err
  }
}

/** Require gov_admin for write/delete operations. */
export function requireGovAdmin(identity: GovernmentIdentity): void {
  requireRole(identity, ["gov_admin"])
}

/** Require at least gov_analyst for sensitive read. */
export function requireGovAnalyst(identity: GovernmentIdentity): void {
  requireRole(identity, ["gov_analyst", "gov_admin"])
}
