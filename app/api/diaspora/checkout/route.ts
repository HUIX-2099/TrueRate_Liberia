import { NextRequest, NextResponse } from "next/server"
import { getMockProductById, getMockFxRate } from "@/lib/diaspora/mock-data"
import { computeFeeBreakdown } from "@/lib/diaspora/fees"
import { createOrder } from "@/lib/diaspora/order-store"
import { getAggregatedRate } from "@/lib/api/multi-source-rates"
import { isPaymentsEnabled } from "@/lib/payments/stripe"
import type { RecipientDetails } from "@/lib/diaspora/types"

/**
 * POST /api/diaspora/checkout
 * Create order from cart; return confirmation URL (Stripe Checkout URL in production).
 * Body: { items: [{ productId, quantity }], recipient: RecipientDetails, useEscrow?: boolean, fxRate?: number }
 */
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production" && !isPaymentsEnabled()) {
    return NextResponse.json(
      { error: "Marketplace checkout is coming soon. Payments are not yet configured." },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()
    const items = Array.isArray(body?.items) ? body.items : []
    const recipient = body?.recipient as RecipientDetails | undefined
    const useEscrow = Boolean(body?.useEscrow)
    const fxOverride = typeof body?.fxRate === "number" ? body.fxRate : undefined

    if (items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty", details: "items array required" },
        { status: 400 }
      )
    }

    if (
      !recipient ||
      !recipient.recipientName?.trim() ||
      !recipient.recipientPhone?.trim() ||
      !recipient.deliveryAddress?.trim()
    ) {
      return NextResponse.json(
        { error: "Invalid recipient", details: "recipientName, recipientPhone, deliveryAddress required" },
        { status: 400 }
      )
    }

    const orderItems: Array<{
      productId: string
      productName: string
      vendorId: string
      vendorName: string
      quantity: number
      unitPriceUsd: number
      lineTotalUsd: number
    }> = []
    const invalid: string[] = []

    for (const row of items) {
      const productId = String(row?.productId ?? "")
      const quantity = Math.max(1, Math.floor(Number(row?.quantity) || 1))
      const product = getMockProductById(productId)
      if (!product) {
        invalid.push(productId)
        continue
      }
      const unitPriceUsd = Number(product.priceUsd)
      orderItems.push({
        productId: product.id,
        productName: product.name,
        vendorId: product.vendorId,
        vendorName: product.vendorName ?? "Vendor",
        quantity,
        unitPriceUsd,
        lineTotalUsd: unitPriceUsd * quantity,
      })
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

    const lines = orderItems.map((i) => ({ priceUsd: i.unitPriceUsd, quantity: i.quantity }))
    const feeBreakdown = computeFeeBreakdown(lines, fxRate)

    const userId = "guest-mvp"
    const order = createOrder({
      userId,
      items: orderItems,
      recipient: {
        recipientName: recipient.recipientName.trim(),
        recipientPhone: recipient.recipientPhone.trim(),
        deliveryAddress: recipient.deliveryAddress.trim(),
        deliveryCity: recipient.deliveryCity?.trim(),
        deliveryNotes: recipient.deliveryNotes?.trim(),
      },
      feeBreakdown,
      status: "pending_payment",
    })

    const baseUrl = process.env.BASE_URL
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
    const confirmationUrl = `${baseUrl}/diaspora/marketplace/order-confirmation?orderId=${order.id}`

    return NextResponse.json({
      url: confirmationUrl,
      sessionId: `mock_session_${order.id}`,
      orderId: order.id,
    })
  } catch (error) {
    console.error("Diaspora checkout API error:", error)
    return NextResponse.json(
      { error: "Unable to create order" },
      { status: 500 }
    )
  }
}
