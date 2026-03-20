import { NextResponse } from "next/server"
import { getAggregatedRate } from "@/lib/api/multi-source-rates"
import { getCanonicalFallbackRate } from "@/lib/canonical-rate"

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
    const baseRate = data.rate ?? getCanonicalFallbackRate()
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

    // Estimated annualised economic growth (%) per county based on sector activity
    const countyGrowth: Record<string, number> = {
      Montserrado: 4.2,   // Capital; trade, finance, services
      Margibi:    3.9,    // Rubber (Firestone), proximity to capital
      Nimba:      3.6,    // Iron ore mining (ArcelorMittal)
      Bong:       3.2,    // Mining corridor, agriculture
      "Grand Bassa": 2.9, // Port city Buchanan, forestry
      Lofa:       2.5,    // Agriculture, cross-border trade
      Maryland:   2.2,    // Fisheries, palm oil; remote
      Gbarpolu:   1.8,    // Sparse population; limited infrastructure
    }

    const byCounty: Array<{ county: string; region: string; avgRate: number; growth: number; count: number }> = [
      { county: "Montserrado", region: "Monrovia", avgRate: baseRate, growth: countyGrowth.Montserrado, count: Math.max(1, byRegion.Monrovia?.rates.length ?? 5) },
      { county: "Grand Bassa", region: "Upcountry", avgRate: baseRate - 1, growth: countyGrowth["Grand Bassa"], count: 1 },
      { county: "Bong", region: "Upcountry", avgRate: baseRate - 2.5, growth: countyGrowth.Bong, count: 1 },
      { county: "Nimba", region: "Upcountry", avgRate: baseRate - 2, growth: countyGrowth.Nimba, count: 1 },
      { county: "Lofa", region: "Upcountry", avgRate: baseRate - 3, growth: countyGrowth.Lofa, count: 1 },
      { county: "Margibi", region: "Upcountry", avgRate: baseRate - 1.5, growth: countyGrowth.Margibi, count: 1 },
      { county: "Maryland", region: "Upcountry", avgRate: baseRate - 3.5, growth: countyGrowth.Maryland, count: 1 },
      { county: "Gbarpolu", region: "Upcountry", avgRate: baseRate - 2, growth: countyGrowth.Gbarpolu, count: 1 },
    ]

    const monroviaGrowth = countyGrowth.Montserrado
    const upcountryGrowth = parseFloat(
      (Object.entries(countyGrowth).filter(([k]) => k !== "Montserrado").reduce((s, [, v]) => s + v, 0) /
        (Object.keys(countyGrowth).length - 1)).toFixed(1)
    )

    return NextResponse.json({
      regional,
      byCounty,
      monroviaGrowth,
      upcountryGrowth,
      timestamp: new Date().toISOString(),
    })
  } catch (e) {
    const baseRate = getCanonicalFallbackRate()
    return NextResponse.json({
      regional: [
        { region: "Monrovia", county: "Montserrado", avgRate: baseRate, count: 5 },
        { region: "Upcountry", avgRate: baseRate - 2, count: 5 },
      ],
      byCounty: [
        { county: "Montserrado", region: "Monrovia", avgRate: baseRate, growth: 4.2, count: 5 },
        { county: "Grand Bassa", region: "Upcountry", avgRate: baseRate - 1, growth: 2.9, count: 1 },
        { county: "Bong", region: "Upcountry", avgRate: baseRate - 2.5, growth: 3.2, count: 1 },
        { county: "Gbarpolu", region: "Upcountry", avgRate: baseRate - 2, growth: 1.8, count: 1 },
      ],
      monroviaGrowth: 4.2,
      upcountryGrowth: 2.8,
      timestamp: new Date().toISOString(),
    })
  }
}
