import { NextResponse } from "next/server"
import { withGovernmentSecurity, isEncryptionConfigured } from "@/lib/government-security"

/**
 * GET /api/government/health
 * Lightweight health check for government integration (auth + rate limit applied).
 * Returns security capabilities (encryption configured, etc.).
 */
const getHandler = withGovernmentSecurity(async () => {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    security: {
      encryptionConfigured: isEncryptionConfigured(),
      auditEnabled: true,
      rateLimitEnabled: true,
    },
  })
})

export const dynamic = "force-dynamic"
export const revalidate = 0
export const GET = getHandler
