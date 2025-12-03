import { NextResponse } from "next/server"
import { getAggregatedRate } from "@/lib/api/multi-source-rates"

export async function GET() {
  try {
    const aggregatedData = await getAggregatedRate()

    // Simulate money changer rates with slight variations
    const baseRate = aggregatedData.rate
    const changers = [
      {
        id: "1",
        name: "City Exchange",
        location: "Broad Street, Monrovia",
        buyRate: baseRate - 2,
        sellRate: baseRate + 2,
        rating: 4.8,
        verified: true,
      },
      {
        id: "2",
        name: "Quick Cash",
        location: "Sinkor, Monrovia",
        buyRate: baseRate - 1.5,
        sellRate: baseRate + 2.5,
        rating: 4.6,
        verified: true,
      },
      {
        id: "3",
        name: "Global Money Transfer",
        location: "Red Light, Monrovia",
        buyRate: baseRate - 3,
        sellRate: baseRate + 1,
        rating: 4.9,
        verified: true,
      },
    ]

    return NextResponse.json({
      // Backward compatibility for clients expecting `data.rate`
      rate: aggregatedData.rate,
      official: {
        rate: aggregatedData.rate,
        confidence: aggregatedData.confidence,
        sources: aggregatedData.sources,
        timestamp: aggregatedData.timestamp,
      },
      changers,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Error in live rates API:", error)
    return NextResponse.json({ error: "Failed to fetch rates" }, { status: 500 })
  }
}

export const revalidate = 60 // Revalidate every minute
