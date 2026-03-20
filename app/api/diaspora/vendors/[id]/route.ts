import { NextRequest, NextResponse } from "next/server"
import { getMockVendorById } from "@/lib/diaspora/mock-data"
import { getMockProducts } from "@/lib/diaspora/mock-data"

/**
 * GET /api/diaspora/vendors/[id]
 * Vendor profile + products. Optional ?category= for products filter.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const vendor = getMockVendorById(id)
    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") ?? undefined
    const products = getMockProducts({ vendorId: id, category: category ?? null })

    return NextResponse.json({
      ...vendor,
      products,
    })
  } catch (error) {
    console.error("Diaspora vendor detail API error:", error)
    return NextResponse.json(
      { error: "Unable to fetch vendor" },
      { status: 500 }
    )
  }
}
