import { NextRequest, NextResponse } from "next/server"
import { getMockProducts } from "@/lib/diaspora/mock-data"

/**
 * GET /api/diaspora/products
 * List products. Optional ?category= & ?vendorId=
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") ?? undefined
    const vendorId = searchParams.get("vendorId") ?? undefined

    const products = getMockProducts({
      category: category ?? null,
      vendorId: vendorId ?? null,
    })

    return NextResponse.json({
      data: products,
      total: products.length,
    })
  } catch (error) {
    console.error("Diaspora products API error:", error)
    return NextResponse.json(
      { error: "Unable to fetch products" },
      { status: 500 }
    )
  }
}
