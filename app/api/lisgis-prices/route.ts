import { NextResponse } from "next/server"

import { fetchLisgisPrices } from "@/lib/lisgis-prices"

export async function GET() {
  try {
    const result = await fetchLisgisPrices()
    if (!result) {
      return NextResponse.json(
        { items: [], error: "LISGIS unavailable", source: "LISGIS" },
        { status: 200 },
      )
    }
    return NextResponse.json({
      ...result,
      source: "LISGIS",
    })
  } catch (error) {
    console.error("[LISGIS Prices] fetch failed", error)
    return NextResponse.json(
      { items: [], error: "LISGIS unavailable", source: "LISGIS" },
      { status: 200 },
    )
  }
}
