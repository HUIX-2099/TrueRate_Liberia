import { NextResponse } from "next/server"
import { fetchCblRateFromHomepage } from "@/lib/cbl-homepage"
import { fetchCblLatestRate } from "@/lib/cbl-rates"

/**
 * GET /api/rates/cbl
 * Official USD/LRD rate from CBL. Primary: research buying-selling-rates table (date = lastUpdated).
 * Fallback: CBL homepage Market Buying and Selling Rates.
 */
export async function GET() {
  try {
    const research = await fetchCblLatestRate()
    if (research && research.rate >= 150 && research.rate <= 220) {
      return NextResponse.json({
        rate: research.rate,
        cblRate: research.rate,
        buying: research.buying,
        selling: research.selling,
        date: research.date,
        lastUpdated: research.lastUpdated,
        source: "Central Bank of Liberia (Daily Exchange Rates)",
      })
    }
    const data = await fetchCblRateFromHomepage()
    if (!data) {
      return NextResponse.json(
        { error: "CBL rate unavailable", rate: null, cblRate: null },
        { status: 503 }
      )
    }
    return NextResponse.json({
      rate: data.rate,
      cblRate: data.rate,
      buying: data.buying,
      selling: data.selling,
      date: data.date,
      lastUpdated: data.lastUpdated,
      source: data.source,
    })
  } catch (error) {
    console.error("[API rates/cbl]", error)
    return NextResponse.json(
      { error: "Failed to fetch CBL rate", rate: null, cblRate: null },
      { status: 500 }
    )
  }
}

export const revalidate = 3600
