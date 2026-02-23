import { NextResponse } from "next/server"
import { getAggregatedRate } from "@/lib/api/multi-source-rates"
import { getVerificationMap } from "@/lib/verification"

// CORS headers for embeddable widget (cross-origin fetch from partner sites)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function GET() {
  try {
    const aggregatedData = await getAggregatedRate()

    // Simulate money changer rates with slight variations; verification from lib/verification (ministry/DB when available)
    const baseRate = aggregatedData.rate
    const now = new Date().toISOString()
    const changerRows = [
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
        openingHours: "Mon–Fri 8:00 AM – 4:00 PM",
        phone: "+231 77 123 4567",
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
        openingHours: "Mon–Sat 8:00 AM – 6:00 PM",
        phone: "+231 77 234 5678",
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
        openingHours: "Daily 7:00 AM – 8:00 PM",
        phone: "+231 77 345 6789",
      },
      {
        id: "4",
        name: "Waterside Exchange Bureau",
        location: "Waterside, Monrovia",
        buyRate: baseRate - 2.5,
        sellRate: baseRate + 1.8,
        rating: 4.5,
        verified: true,
        reviews: 312,
        trend: "stable",
        lastUpdate: now,
        openingHours: "Mon–Sat 7:30 AM – 5:30 PM",
        phone: "+231 77 456 7890",
      },
      {
        id: "5",
        name: "Congo Town Money Center",
        location: "Congo Town, Monrovia",
        buyRate: baseRate - 3,
        sellRate: baseRate + 2,
        rating: 4.4,
        verified: true,
        reviews: 287,
        trend: "up",
        lastUpdate: now,
        openingHours: "Mon–Fri 8:00 AM – 6:00 PM",
        phone: "+231 77 567 8901",
      },
      {
        id: "6",
        name: "SR Forex Exchange Bureau",
        location: "Mount Barclay, Monrovia",
        buyRate: baseRate - 2.8,
        sellRate: baseRate + 1.5,
        rating: 4.6,
        verified: true,
        reviews: 198,
        trend: "down",
        lastUpdate: now,
        openingHours: "Daily 8:00 AM – 7:00 PM",
        phone: "+231 77 678 9012",
      },
      {
        id: "7",
        name: "ELWA Junction Exchange",
        location: "ELWA Junction, Monrovia",
        buyRate: baseRate - 3.5,
        sellRate: baseRate + 2.2,
        rating: 4.3,
        verified: true,
        reviews: 156,
        trend: "stable",
        lastUpdate: now,
        openingHours: "Mon–Sat 7:00 AM – 6:00 PM",
        phone: "+231 77 789 0123",
      },
    ]
    const verifiedMap = getVerificationMap(changerRows.map((c) => c.id))
    const changers = changerRows.map((c) => ({
      ...c,
      verified: verifiedMap[c.id] ?? c.verified,
    }))

    const marketRate = aggregatedData.rate
    const officialRate = aggregatedData.cblRate ?? null
    return NextResponse.json(
      {
      rate: marketRate,
      marketRate,
      officialRate,
      cblRate: officialRate,
      cblLastUpdated: aggregatedData.cblLastUpdated ?? null,
      cblBuying: aggregatedData.cblBuying ?? null,
      cblSelling: aggregatedData.cblSelling ?? null,
      market: {
        rate: marketRate,
        confidence: aggregatedData.confidence,
        sources: aggregatedData.sources,
        timestamp: aggregatedData.timestamp,
      },
      official: {
        rate: officialRate,
        lastUpdated: aggregatedData.cblLastUpdated ?? null,
        buying: aggregatedData.cblBuying ?? null,
        selling: aggregatedData.cblSelling ?? null,
        sources: ["Central Bank of Liberia"],
      },
      sources: aggregatedData.sources,
      timestamp: aggregatedData.timestamp,
      changers,
    },
    { headers: corsHeaders },
    )
  } catch (error) {
    console.error("Best rate API error:", error)
    return NextResponse.json(
      { error: "Unable to fetch best rate" },
      { status: 500, headers: corsHeaders },
    )
  }
}

export const revalidate = 60 // Revalidate every minute
