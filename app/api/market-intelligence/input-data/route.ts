import { NextResponse } from "next/server"
import { buildMarketInputData } from "@/lib/market-input-data"

export const dynamic = "force-dynamic"
export const revalidate = 0

/**
 * GET /api/market-intelligence/input-data
 * Returns market input data: import volume by category, major importers,
 * wholesale benchmarks, trade flow trends, commodity availability.
 */
export async function GET() {
  try {
    const data = await buildMarketInputData()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[Market intelligence input-data]", error)
    return NextResponse.json(
      {
        error: "Failed to build market input data",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
