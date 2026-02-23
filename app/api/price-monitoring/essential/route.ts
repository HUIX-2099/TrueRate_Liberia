import { NextResponse } from "next/server"
import { buildPriceMonitoringDashboard } from "@/lib/price-monitoring"
import { PRICE_INDEX_BASKET_ID } from "@/lib/price-index/basket"

export const dynamic = "force-dynamic"
export const revalidate = 0

/**
 * GET /api/price-monitoring/essential
 * Ministry-monitored essential commodities (Liberia Price Index basket): Rice, Cooking oil, Cement, Fuel, Sugar.
 * Aligned with cost of living, market risk, and affordability metrics.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Math.min(365, Math.max(14, parseInt(searchParams.get("days") ?? "90", 10) || 90))
    const dashboard = await buildPriceMonitoringDashboard(days)
    return NextResponse.json({ ...dashboard, priceIndexBasketId: PRICE_INDEX_BASKET_ID })
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
