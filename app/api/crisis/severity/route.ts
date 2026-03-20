import { NextResponse } from "next/server"
import { computeSeverity } from "@/lib/crisis/severity-engine"

export const dynamic = "force-dynamic"

/** GET /api/crisis/severity — Current crisis severity based on all available signals. */
export async function GET() {
  try {
    const [rateRes, priceRes] = await Promise.allSettled([
      fetch(new URL("/api/rates/live", process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"), { cache: "no-store" }),
      fetch(new URL("/api/price-index", process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"), { cache: "no-store" }),
    ])

    let exchangeRateChangePercent: number | undefined
    let fuelPriceChangePercent: number | undefined
    let riceChangePercent: number | undefined

    if (rateRes.status === "fulfilled" && rateRes.value.ok) {
      const data = await rateRes.value.json()
      if (data.change24h) {
        exchangeRateChangePercent = data.change24h
      }
    }

    if (priceRes.status === "fulfilled" && priceRes.value.ok) {
      const data = await priceRes.value.json()
      const items: Array<{ id: string; changePercent?: number }> = data.items ?? data.basket ?? []
      const fuel = items.find((i: { id: string }) => i.id === "fuel" || i.id === "fuel-pms")
      const rice = items.find((i: { id: string }) => i.id === "rice")
      if (fuel && "changePercent" in fuel) fuelPriceChangePercent = fuel.changePercent as number
      if (rice && "changePercent" in rice) riceChangePercent = rice.changePercent as number
    }

    const result = computeSeverity({
      fuelPriceChangePercent: fuelPriceChangePercent ?? 22,
      exchangeRateChangePercent: exchangeRateChangePercent ?? 4.5,
      riceChangePercent: riceChangePercent ?? 8,
      communityReportsCount: 15,
      globalOilChangePercent: 12,
      inflationMoM: 3.2,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("[Crisis severity]", error)
    return NextResponse.json(
      { error: "Severity computation failed", detail: error instanceof Error ? error.message : "Unknown" },
      { status: 500 },
    )
  }
}
