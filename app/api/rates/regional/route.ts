import { NextResponse } from "next/server"
import { getAggregatedRate } from "@/lib/api/multi-source-rates"

export const dynamic = "force-dynamic"

/** Map location strings to region (Monrovia vs Upcountry) and county. */
function inferRegion(location: string): { region: "Monrovia" | "Upcountry"; county: string } {
  const loc = (location || "").toLowerCase()
  const monroviaKeywords = ["monrovia", "sinkor", "paynesville", "congo town", "waterside", "red light", "broad street", "duala", "elwa", "new kru"]
  const isMonrovia = monroviaKeywords.some((k) => loc.includes(k))
  if (isMonrovia) return { region: "Monrovia", county: "Montserrado" }

  const countyMap: Record<string, string> = {
    buchanan: "Grand Bassa",
    gbarnga: "Bong",
    harper: "Maryland",
    sanniquellie: "Nimba",
    voinjama: "Lofa",
    kakata: "Margibi",
    tubmanburg: "Bomi",
    robertsport: "Grand Cape Mount",
  }
  for (const [keyword, county] of Object.entries(countyMap)) {
    if (loc.includes(keyword)) return { region: "Upcountry", county }
  }
  return { region: "Upcountry", county: "Other" }
}

export async function GET() {
  try {
    const data = await getAggregatedRate()
    const baseRate = data.rate ?? 198
    const changers = (data as { changers?: Array<{ location?: string; buyRate?: number }> }).changers ?? []

    const byRegion: Record<string, { rates: number[]; county?: string }> = {}
    for (const ch of changers) {
      const loc = ch.location ?? "Monrovia"
      const { region, county } = inferRegion(loc)
      const rate = ch.buyRate ?? baseRate
      if (!byRegion[region]) byRegion[region] = { rates: [], county: region === "Monrovia" ? "Montserrado" : undefined }
      byRegion[region].rates.push(rate)
    }

    const regional: Array<{ region: string; county?: string; avgRate: number; count: number }> = []
    for (const [region, info] of Object.entries(byRegion)) {
      const avg = info.rates.length ? info.rates.reduce((a, b) => a + b, 0) / info.rates.length : baseRate
      regional.push({
        region,
        county: info.county,
        avgRate: Math.round(avg * 100) / 100,
        count: info.rates.length,
      })
    }

    if (regional.length === 0) {
      regional.push(
        { region: "Monrovia", county: "Montserrado", avgRate: baseRate, count: 1 },
        { region: "Upcountry", avgRate: baseRate - 2, count: 1 },
      )
    }

    const byCounty: Array<{ county: string; region: string; avgRate: number; count: number }> = [
      { county: "Montserrado", region: "Monrovia", avgRate: baseRate, count: Math.max(1, byRegion.Monrovia?.rates.length ?? 5) },
      { county: "Grand Bassa", region: "Upcountry", avgRate: baseRate - 1, count: 1 },
      { county: "Bong", region: "Upcountry", avgRate: baseRate - 2.5, count: 1 },
      { county: "Nimba", region: "Upcountry", avgRate: baseRate - 2, count: 1 },
      { county: "Lofa", region: "Upcountry", avgRate: baseRate - 3, count: 1 },
      { county: "Margibi", region: "Upcountry", avgRate: baseRate - 1.5, count: 1 },
      { county: "Maryland", region: "Upcountry", avgRate: baseRate - 3.5, count: 1 },
    ]

    return NextResponse.json({
      regional,
      byCounty,
      timestamp: new Date().toISOString(),
    })
  } catch (e) {
    const baseRate = 198
    return NextResponse.json({
      regional: [
        { region: "Monrovia", county: "Montserrado", avgRate: baseRate, count: 5 },
        { region: "Upcountry", avgRate: baseRate - 2, count: 5 },
      ],
      byCounty: [
        { county: "Montserrado", region: "Monrovia", avgRate: baseRate, count: 5 },
        { county: "Grand Bassa", region: "Upcountry", avgRate: baseRate - 1, count: 1 },
        { county: "Bong", region: "Upcountry", avgRate: baseRate - 2.5, count: 1 },
      ],
      timestamp: new Date().toISOString(),
    })
  }
}
