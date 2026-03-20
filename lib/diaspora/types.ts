/**
 * Diaspora Marketplace — shared types for API and UI.
 * Aligns with Prisma schema and API contracts.
 */

export type UserRole = "user" | "vendor" | "admin"

export type BusinessRegStatus = "pending" | "verified" | "rejected"

export type ProductCategorySlug =
  | "construction"
  | "food_groceries"
  | "household"
  | "fuel_voucher"

export type OrderStatus =
  | "draft"
  | "pending_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "disputed"
  | "refunded"

export interface Vendor {
  id: string
  storeName: string
  slug: string
  description?: string | null
  locationAddress: string
  locationCity?: string | null
  locationRegion?: string | null
  phone: string
  whatsapp?: string | null
  businessRegNo?: string | null
  businessRegStatus?: BusinessRegStatus | null
  truerateVerified: boolean
  verifiedAt?: string | null
  categories: string[]
  logoUrl?: string | null
  bannerUrl?: string | null
  isActive: boolean
  /** Computed: average rating 1–5 */
  averageRating?: number | null
  /** Computed: total review count */
  reviewCount?: number
}

export interface Product {
  id: string
  vendorId: string
  vendorName?: string
  name: string
  slug: string
  description?: string | null
  category: ProductCategorySlug
  unit: string
  priceUsd: number
  priceLrd?: number | null
  imageUrl?: string | null
  isActive: boolean
  /** ETA min–max days for delivery */
  deliveryEtaDays?: [number, number] | null
  stockLevel?: "high" | "medium" | "low"
  frequentlyPurchasedByDiaspora?: boolean
}

export interface CartItem {
  id: string
  productId: string
  name: string
  quantity: number
  priceUsd: number
  priceLrd?: number | null
  vendorId?: string
  vendorName?: string
  category?: string
}

export interface FeeBreakdown {
  platformFeeUsd: number
  deliveryFeeUsd: number
  taxUsd?: number
  subtotalUsd: number
  totalUsd: number
  fxRate: number
  totalLrd?: number
}

export interface RecipientDetails {
  recipientName: string
  recipientPhone: string
  deliveryAddress: string
  deliveryCity?: string
  deliveryNotes?: string
}

export interface OrderSummary {
  id: string
  status: OrderStatus
  totalUsd: number
  totalLrd?: number | null
  fxRateSnapshot?: number | null
  recipientName: string
  deliveryAddress: string
  createdAt: string
  itemCount: number
}

export interface OrderDetail extends OrderSummary {
  items: Array<{
    id: string
    productId: string
    productName: string
    quantity: number
    unitPriceUsd: number
    lineTotalUsd: number
    vendorName: string
  }>
  feeBreakdown?: FeeBreakdown | null
  proofPhotoUrl?: string | null
  updatedAt: string
}

export interface VendorRatingSummary {
  averageRating: number
  totalRatings: number
  distribution?: Record<number, number>
}

export interface CheckoutSessionRequest {
  items: Array<{ productId: string; quantity: number }>
  recipient: RecipientDetails
  useEscrow?: boolean
  fxRate?: number
}

export interface CheckoutSessionResponse {
  url: string
  sessionId: string
  orderId: string
}
