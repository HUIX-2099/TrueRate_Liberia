import { NextResponse } from "next/server"
import { getAggregatedRate } from "@/lib/api/multi-source-rates"

export async function GET() {
  try {
    const aggregatedData = await getAggregatedRate()

    // Simulate money changer rates with slight variations
    const baseRate = aggregatedData.rate
    const now = new Date().toISOString()
    const changers = [
      {
        id: "1",
        name: "Central Bank of Liberia",
        location: "Broad Street, Monrovia",
        buyRate: baseRate - 2,
        sellRate: baseRate + 2,
        rating: 4.8,
        verified: true,
        reviews: 1250,
        trend: "stable",
        lastUpdate: now,
      },
      {
        id: "2",
        name: "Quick Cash",
        location: "Sinkor, Monrovia",
        buyRate: baseRate - 1.5,
        sellRate: baseRate + 2.5,
        rating: 4.6,
        verified: true,
        reviews: 892,
        trend: "up",
        lastUpdate: now,
      },
      {
        id: "3",
        name: "Global Money Transfer",
        location: "Red Light, Monrovia",
        buyRate: baseRate - 3,
        sellRate: baseRate + 1,
        rating: 4.9,
        verified: true,
        reviews: 634,
        trend: "down",
        lastUpdate: now,
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
      timestamp: now,
    })
  } catch (error) {
    console.error("Best rate API error:", error)
    return NextResponse.json(
      { error: "Unable to fetch best rate" },
      { status: 500 }
    )
  }
}

export const revalidate = 60 // Revalidate every minute
