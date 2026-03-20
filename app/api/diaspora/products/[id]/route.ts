import { NextRequest, NextResponse } from "next/server"
import { getMockProductById } from "@/lib/diaspora/mock-data"

/**
 * GET /api/diaspora/products/[id]
 * Product detail.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = getMockProductById(id)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error) {
    console.error("Diaspora product detail API error:", error)
    return NextResponse.json(
      { error: "Unable to fetch product" },
      { status: 500 }
    )
  }
}
