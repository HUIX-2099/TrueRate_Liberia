import { NextResponse } from "next/server"
import { getAlerts, acknowledgeAlert } from "@/lib/monitoring/commodity-engine/alerts"

export const dynamic = "force-dynamic"
export const revalidate = 0

/** GET /api/monitoring/alerts — List alerts (optional: ?acknowledged=false&severity=warning&limit=20). */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const acknowledgedParam = searchParams.get("acknowledged")
    const acknowledged =
      acknowledgedParam === "true"
        ? true
        : acknowledgedParam === "false"
          ? false
          : undefined
    const severity = searchParams.get("severity") ?? undefined
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined

    const alerts = getAlerts({ acknowledged, severity, limit })
    return NextResponse.json({ alerts, count: alerts.length })
  } catch (error) {
    console.error("[Monitoring alerts GET]", error)
    return NextResponse.json(
      { error: "Failed to list alerts", detail: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    )
  }
}

/** POST /api/monitoring/alerts — Acknowledge an alert. Body: { "id": "alt_..." }. */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const id = typeof body.id === "string" ? body.id : null
    if (!id) {
      return NextResponse.json({ error: "Missing alert id in body" }, { status: 400 })
    }
    const updated = acknowledgeAlert(id)
    if (!updated) {
      return NextResponse.json({ error: "Alert not found", id }, { status: 404 })
    }
    return NextResponse.json({ alert: updated })
  } catch (error) {
    console.error("[Monitoring alerts POST]", error)
    return NextResponse.json(
      { error: "Failed to acknowledge alert", detail: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    )
  }
}
