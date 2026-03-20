import { NextResponse } from "next/server"
import {
  getTradePolicyUpdates,
  getPriceControlPolicies,
  getRecentRegulationChanges,
} from "@/lib/regulatory"

export const dynamic = "force-dynamic"
export const revalidate = 0

/** GET /api/regulatory/overview — Snapshot: counts and recent trade policies, price controls, and regulation changes. */
export async function GET() {
  try {
    const tradePolicies = getTradePolicyUpdates({ limit: 10 })
    const priceControls = getPriceControlPolicies({ limit: 10 })
    const recentChanges = getRecentRegulationChanges({ limit: 20 })

    return NextResponse.json({
      tradePolicyCount: getTradePolicyUpdates({ limit: 1000 }).length,
      priceControlCount: getPriceControlPolicies({ limit: 1000 }).length,
      recentChangesCount: recentChanges.length,
      recentTradePolicies: tradePolicies,
      recentPriceControls: priceControls,
      recentRegulationChanges: recentChanges,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Regulatory overview GET]", error)
    return NextResponse.json(
      {
        error: "Failed to get regulatory overview",
        detail: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 }
    )
  }
}
