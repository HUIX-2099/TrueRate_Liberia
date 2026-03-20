import { NextResponse } from "next/server"
import { runTradeAnalytics } from "@/lib/trade-analytics/engine"

export const dynamic = "force-dynamic"
export const revalidate = 0

/** GET /api/trade-analytics/overview — Full trade analytics run. */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const periods = Math.min(60, Math.max(6, parseInt(searchParams.get("periods") ?? "24", 10) || 24))
    const category = searchParams.get("category") ?? undefined
    const storeHistory = searchParams.get("storeHistory") !== "false"

    const result = await runTradeAnalytics({
      periods,
      category,
      storeHistory,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("[Trade analytics overview]", error)
    return NextResponse.json(
      {
        error: "Trade analytics failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
