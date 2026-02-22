import { NextResponse } from "next/server"
import { runMonitoring } from "@/lib/monitoring/commodity-engine/engine"

export const dynamic = "force-dynamic"
export const revalidate = 0

/** GET /api/monitoring/overview — Full monitoring result (trends, spikes, correlation, alerts). */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Math.min(365, Math.max(7, parseInt(searchParams.get("days") ?? "30", 10) || 30))
    const spikePercent = searchParams.get("spikePercent")
    const spikeZ = searchParams.get("spikeZ")
    const noAlerts = searchParams.get("alerts") === "false"

    const result = await runMonitoring({
      days,
      spikePercentThreshold: spikePercent ? parseInt(spikePercent, 10) : undefined,
      spikeZScoreThreshold: spikeZ ? parseFloat(spikeZ) : undefined,
      evaluateAlertRules: !noAlerts,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("[Monitoring overview]", error)
    return NextResponse.json(
      { error: "Monitoring failed", detail: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
