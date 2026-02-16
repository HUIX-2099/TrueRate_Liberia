import { NextResponse } from "next/server"
import { getApiKeyFromRequest } from "@/lib/api/business-auth"
import { getAggregatedRate } from "@/lib/api/multi-source-rates"

export async function GET(request: Request) {
  const apiKey = getApiKeyFromRequest(request)
  if (!apiKey) {
    return NextResponse.json({ error: "Missing or invalid API key. Use ?api_key= or Authorization: Bearer" }, { status: 401 })
  }

  try {
    const data = await getAggregatedRate()
    return NextResponse.json({
      rate: data.rate,
      cblRate: data.cblRate ?? null,
      sources: data.sources,
      timestamp: data.timestamp,
    })
  } catch (e) {
    console.error("[API v1 rate]", e)
    return NextResponse.json({ error: "Failed to fetch rate" }, { status: 500 })
  }
}
