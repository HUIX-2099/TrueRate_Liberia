import { NextResponse } from "next/server"
import { getImportRecords } from "@/lib/trade-analytics/data"
import { forecastForexPressure } from "@/lib/trade-analytics/forex-pressure"

export const dynamic = "force-dynamic"
export const revalidate = 0

/** GET /api/trade-analytics/forex-pressure — Forecast forex pressure (import bill, pressure index). */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const periods = Math.min(60, Math.max(6, parseInt(searchParams.get("periods") ?? "24", 10) || 24))
    const period = searchParams.get("period") ?? undefined
    const fxRateOverride = searchParams.get("fxRate")
      ? parseFloat(searchParams.get("fxRate")!)
      : undefined

    const records = await getImportRecords({ periods })
    const forecast = await forecastForexPressure(records, { period, fxRateOverride })

    if (!forecast) {
      return NextResponse.json(
        { error: "Insufficient data for forex pressure forecast" },
        { status: 422 }
      )
    }

    return NextResponse.json({
      forecast,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Trade analytics forex-pressure]", error)
    return NextResponse.json(
      {
        error: "Forex pressure forecast failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
