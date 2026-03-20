import { NextResponse } from "next/server"
import { computeEarlyWarnings } from "@/lib/crisis/early-warning"

export const dynamic = "force-dynamic"

/** GET /api/crisis/warnings — Early warning signals and predictions. */
export async function GET() {
  try {
    const result = computeEarlyWarnings({
      brentCrudePrice: 86.5,
      brentCrudeChange30d: 12.3,
      exchangeRate: 192,
      exchangeRateChange30d: 4.8,
      importVolumeChange: -8,
      regionalFuelPrices: [
        { country: "Sierra Leone", priceUSD: 1.45, change: 8 },
        { country: "Guinea", priceUSD: 1.52, change: 11 },
        { country: "Ivory Coast", priceUSD: 1.38, change: 5 },
      ],
      fuelPriceLocal: 900,
      fuelPriceChange7d: 22,
      ricePriceChange30d: 8,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("[Crisis warnings]", error)
    return NextResponse.json(
      { error: "Early warning computation failed", detail: error instanceof Error ? error.message : "Unknown" },
      { status: 500 },
    )
  }
}
