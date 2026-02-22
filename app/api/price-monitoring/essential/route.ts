import { NextResponse } from "next/server"
import { buildPriceMonitoringDashboard } from "@/lib/price-monitoring"

export const dynamic = "force-dynamic"
export const revalidate = 0

/**
 * GET /api/price-monitoring/essential
 * Ministry-monitored essential commodities: Rice (25kg, 50kg), Cooking oil, Cement, Fuel, other staples.
 * Use cases: correlate LRD/USD with commodity prices, Cost of Living Index, how exchange rates affect daily life in Monrovia.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Math.min(365, Math.max(14, parseInt(searchParams.get("days") ?? "90", 10) || 90))
    const dashboard = await buildPriceMonitoringDashboard(days)
    return NextResponse.json(dashboard)
  } catch (error) {
    console.error("[Price monitoring essential]", error)
    return NextResponse.json(
      {
        error: "Price monitoring failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
