export { authenticateGovernmentRequest, getGovernmentApiKeyFromRequest, registerGovernmentKey } from "./auth"
export { hasRole, requireRole, requireGovAdmin, requireGovAnalyst } from "./roles"
export { auditLog, auditApiAccess, getAuditLog } from "./audit"
export { checkRateLimit, getRateLimitId } from "./rate-limit"
export { encryptField, decryptField, encryptSensitiveFields, decryptSensitiveFields, isEncryptionConfigured } from "./encryption"
export { withGovernmentSecurity } from "./with-government-security"
export type { GovernmentRouteHandler, GovernmentSecurityOptions } from "./with-government-security"
export type {
  GovernmentRole,
  GovernmentIdentity,
  AuthResult,
  AuditEvent,
  RateLimitConfig,
} from "./types"
export { DEFAULT_RATE_LIMIT } from "./types"
