import { NextRequest, NextResponse } from "next/server"
import { getOrderById } from "@/lib/diaspora/order-store"

/**
 * GET /api/diaspora/orders/[id]
 * Order detail + items + status.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const order = getOrderById(id)
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }
    return NextResponse.json(order)
  } catch (error) {
    console.error("Diaspora order detail API error:", error)
    return NextResponse.json(
      { error: "Unable to fetch order" },
      { status: 500 }
    )
  }
}
