import { NextRequest, NextResponse } from "next/server"
import { getMockVendors } from "@/lib/diaspora/mock-data"

/**
 * GET /api/diaspora/vendors
 * List verified vendors. Optional ?category=construction|food_groceries|household|fuel_voucher
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") ?? undefined

    const vendors = getMockVendors(category ?? null)
    return NextResponse.json({
      data: vendors,
      total: vendors.length,
    })
  } catch (error) {
    console.error("Diaspora vendors API error:", error)
    return NextResponse.json(
      { error: "Unable to fetch vendors" },
      { status: 500 }
    )
  }
}
