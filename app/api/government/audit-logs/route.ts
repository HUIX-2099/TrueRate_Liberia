import { NextResponse } from "next/server"
import { withGovernmentSecurity, getAuditLog } from "@/lib/government-security"

/**
 * GET /api/government/audit-logs
 * Audit log access for gov_auditor and gov_admin. Query: since, actor, action, result, limit.
 */
const getHandler = withGovernmentSecurity(
  async (request) => {
    const url = new URL(request.url)
    const since = url.searchParams.get("since") ?? undefined
    const actor = url.searchParams.get("actor") ?? undefined
    const action = url.searchParams.get("action") ?? undefined
    const result = url.searchParams.get("result") as "success" | "denied" | "error" | undefined
    const limit = url.searchParams.get("limit") ? parseInt(url.searchParams.get("limit")!, 10) : undefined

    const events = getAuditLog({ since, actor, action, result, limit })
    return NextResponse.json({
      events,
      count: events.length,
      timestamp: new Date().toISOString(),
    })
  },
  { roles: ["gov_auditor", "gov_admin"] }
)

export const dynamic = "force-dynamic"
export const revalidate = 0
export const GET = getHandler
