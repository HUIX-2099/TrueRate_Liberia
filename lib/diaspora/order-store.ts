/**
 * In-memory order store for MVP (no DB). Replace with Prisma when DATABASE_URL is set.
 */

import type { OrderDetail, OrderStatus, RecipientDetails, FeeBreakdown } from "./types"

const orders = new Map<string, OrderDetail & { items: OrderDetail["items"] }>()

let orderCounter = 1

function nextId(): string {
  return `ord-mock-${Date.now()}-${orderCounter++}`
}

export interface CreateOrderInput {
  userId: string
  items: Array<{
    productId: string
    productName: string
    vendorId: string
    vendorName: string
    quantity: number
    unitPriceUsd: number
    lineTotalUsd: number
  }>
  recipient: RecipientDetails
  feeBreakdown: FeeBreakdown
  status?: OrderStatus
}

export function createOrder(input: CreateOrderInput): OrderDetail {
  const id = nextId()
  const now = new Date().toISOString()
  const totalUsd = input.feeBreakdown.totalUsd
  const totalLrd = input.feeBreakdown.totalLrd ?? null
    const orderItemsWithId = input.items.map((item, idx) => ({
      id: `${id}-item-${idx}`,
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPriceUsd: item.unitPriceUsd,
      lineTotalUsd: item.lineTotalUsd,
      vendorName: item.vendorName,
    }))
    const order: OrderDetail & { items: OrderDetail["items"] } = {
      id,
      status: input.status ?? "pending_payment",
      totalUsd,
      totalLrd,
      fxRateSnapshot: input.feeBreakdown.fxRate,
      recipientName: input.recipient.recipientName,
      deliveryAddress: input.recipient.deliveryAddress,
      createdAt: now,
      itemCount: input.items.reduce((s, i) => s + i.quantity, 0),
      items: orderItemsWithId,
    feeBreakdown: input.feeBreakdown,
    updatedAt: now,
  }
  orders.set(id, order)
  return order
}

export function getOrderById(id: string): (OrderDetail & { items: OrderDetail["items"] }) | null {
  return orders.get(id) ?? null
}

export function updateOrderStatus(
  id: string,
  status: OrderStatus,
  extra?: { proofPhotoUrl?: string }
): (OrderDetail & { items: OrderDetail["items"] }) | null {
  const order = orders.get(id)
  if (!order) return null
  order.status = status
  order.updatedAt = new Date().toISOString()
  if (extra?.proofPhotoUrl) order.proofPhotoUrl = extra.proofPhotoUrl
  return order
}

export function listOrdersByUser(userId: string): OrderDetail[] {
  // MVP: no auth, return last 20 orders
  return Array.from(orders.values())
    .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
    .slice(0, 20)
    .map((o) => ({
      id: o.id,
      status: o.status,
      totalUsd: o.totalUsd,
      totalLrd: o.totalLrd,
      fxRateSnapshot: o.fxRateSnapshot,
      recipientName: o.recipientName,
      deliveryAddress: o.deliveryAddress,
      createdAt: o.createdAt,
      itemCount: o.itemCount,
      items: o.items,
      updatedAt: o.updatedAt,
    }))
}
