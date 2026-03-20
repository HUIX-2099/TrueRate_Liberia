import { NextResponse } from "next/server"

import { fetchCblHistoricalRates } from "@/lib/cbl-rates"
import { generateHistoricalData } from "@/lib/api/multi-source-rates"

export async function GET() {
  try {
    const cbl = await fetchCblHistoricalRates(365)
    if (cbl.historical.length > 0) {
      return NextResponse.json({
        historical: cbl.historical.map((p) => ({ date: p.date, rate: p.rate, volume: 0 })),
        source: cbl.source,
        sourceUrl: "https://www.cbl.org.lr/research/buying-selling-rates",
        timestamp: new Date().toISOString(),
      })
    }
    const historical = generateHistoricalData(90)
    return NextResponse.json({
      historical: historical.map((p) => ({ date: p.date, rate: p.rate, volume: p.volume })),
      source: "Fallback",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Historical] Error fetching CBL rates:", error)
    try {
      const historical = generateHistoricalData(90)
      return NextResponse.json({
        historical: historical.map((p) => ({ date: p.date, rate: p.rate, volume: p.volume })),
        source: "Fallback",
        timestamp: new Date().toISOString(),
      })
    } catch {
      return NextResponse.json({ error: "Failed to fetch historical rates" }, { status: 500 })
    }
  }
}

export const revalidate = 3600 // Revalidate every hour
