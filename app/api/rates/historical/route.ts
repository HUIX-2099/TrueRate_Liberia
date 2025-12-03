import { NextResponse } from "next/server"
import { generateHistoricalData } from "@/lib/api/multi-source-rates"

export async function GET() {
  try {
    const historical = generateHistoricalData(90) // Last 90 days

    return NextResponse.json({
      historical,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Error in historical rates API:", error)
    return NextResponse.json({ error: "Failed to fetch historical rates" }, { status: 500 })
  }
}

export const revalidate = 3600 // Revalidate every hour
