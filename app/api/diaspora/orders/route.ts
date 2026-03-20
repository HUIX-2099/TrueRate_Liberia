import { NextResponse } from "next/server"
import { listOrdersByUser } from "@/lib/diaspora/order-store"

/**
 * GET /api/diaspora/orders
 * List current user orders (MVP: no auth, returns last 20 from in-memory store).
 */
export async function GET() {
  try {
    const userId = "guest-mvp"
    const orders = listOrdersByUser(userId)
    return NextResponse.json({
      data: orders,
      total: orders.length,
    })
  } catch (error) {
    console.error("Diaspora orders list API error:", error)
    return NextResponse.json(
      { error: "Unable to fetch orders" },
      { status: 500 }
    )
  }
}
