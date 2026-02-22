import { NextResponse } from "next/server"
import { withGovernmentSecurity } from "@/lib/government-security"
import { getAggregatedRate } from "@/lib/api/multi-source-rates"

/**
 * GET /api/government/data
 * Government data integration endpoint. Protected: API key + rate limit + audit.
 * Returns aggregated rate and timestamp (example payload; extend with COL, regulatory, etc.).
 */
const getHandler = withGovernmentSecurity(async (request, { identity }) => {
  const url = new URL(request.url)
  const includeRates = url.searchParams.get("rates") !== "false"

  const payload: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    client: identity.id,
    scope: "government_integration",
  }

  if (includeRates) {
    try {
      const data = await getAggregatedRate()
      payload.rates = {
        usdLrd: data.rate,
        cblRate: data.cblRate ?? null,
        sourceCount: data.sources?.length ?? 0,
      }
    } catch (e) {
      payload.rates = { error: "Unavailable" }
    }
  }

  return NextResponse.json(payload)
})

export const dynamic = "force-dynamic"
export const revalidate = 0
export const GET = getHandler
