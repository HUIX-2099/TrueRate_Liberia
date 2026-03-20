import { NextResponse } from "next/server"
import { getApiKeyFromRequest } from "@/lib/api/business-auth"
import { fetchCblHistoricalRates } from "@/lib/cbl-rates"
import { generateHistoricalData } from "@/lib/api/multi-source-rates"

export async function GET(request: Request) {
  const apiKey = getApiKeyFromRequest(request)
  if (!apiKey) {
    return NextResponse.json({ error: "Missing or invalid API key. Use ?api_key= or Authorization: Bearer" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const days = Math.min(Math.max(parseInt(searchParams.get("days") ?? "90", 10) || 90, 1), 365)

  try {
    let historical: Array<{ date: string; rate: number; volume?: number }>
    let source = "TrueRate"
    try {
      const cbl = await fetchCblHistoricalRates(365)
      if (cbl.historical.length > 0) {
        historical = cbl.historical.map((p) => ({ date: p.date, rate: p.rate, volume: 0 }))
        source = cbl.source
      } else {
        historical = generateHistoricalData(days)
      }
    } catch {
      historical = generateHistoricalData(days)
    }
    const slice = historical.slice(-days)
    return NextResponse.json({
      historical: slice,
      source,
      timestamp: new Date().toISOString(),
    })
  } catch (e) {
    console.error("[API v1 historical]", e)
    return NextResponse.json({ error: "Failed to fetch historical rates" }, { status: 500 })
  }
}
