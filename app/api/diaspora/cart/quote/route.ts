import { NextRequest, NextResponse } from "next/server"
import { getMockProductById, getMockFxRate } from "@/lib/diaspora/mock-data"
import { computeFeeBreakdown } from "@/lib/diaspora/fees"
import { getAggregatedRate } from "@/lib/api/multi-source-rates"

/**
 * POST /api/diaspora/cart/quote
 * Get fee breakdown and LRD total for cart. Body: { items: [{ productId, quantity }], fxRate?: number }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const items = Array.isArray(body?.items) ? body.items : []
    const fxOverride = typeof body?.fxRate === "number" ? body.fxRate : undefined

    if (items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty", details: "items array required" },
        { status: 400 }
      )
    }

    const lines: { priceUsd: number; quantity: number }[] = []
    const invalid: string[] = []

    for (const row of items) {
      const productId = row?.productId
      const quantity = Math.max(1, Math.floor(Number(row?.quantity) || 1))
      if (!productId) continue
      const product = getMockProductById(String(productId))
      if (!product) {
        invalid.push(productId)
        continue
      }
      lines.push({ priceUsd: Number(product.priceUsd), quantity })
    }

    if (invalid.length > 0) {
      return NextResponse.json(
        { error: "Invalid product IDs", details: invalid },
        { status: 400 }
      )
    }

    let fxRate = fxOverride
    if (fxRate == null) {
      try {
        const aggregated = await getAggregatedRate()
        fxRate = aggregated.rate
      } catch {
        fxRate = getMockFxRate()
      }
    }

    const breakdown = computeFeeBreakdown(lines, fxRate)
    return NextResponse.json({
      ...breakdown,
      itemCount: lines.reduce((s, l) => s + l.quantity, 0),
    })
  } catch (error) {
    console.error("Diaspora cart quote API error:", error)
    return NextResponse.json(
      { error: "Unable to compute quote" },
      { status: 500 }
    )
  }
}
