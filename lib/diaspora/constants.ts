/**
 * Diaspora Marketplace — categories, fee defaults, and display labels.
 */

export const PRODUCT_CATEGORIES = [
  { id: "all", slug: "all", label: "All", apiCategory: null },
  { id: "construction", slug: "construction", label: "Construction", apiCategory: "construction" as const },
  { id: "food-groceries", slug: "food_groceries", label: "Food & Groceries", apiCategory: "food_groceries" as const },
  { id: "household", slug: "household", label: "Household", apiCategory: "household" as const },
  { id: "fuel", slug: "fuel_voucher", label: "Fuel", apiCategory: "fuel_voucher" as const },
] as const

export type ProductCategoryId = (typeof PRODUCT_CATEGORIES)[number]["id"]

/** Platform fee: percentage of cart subtotal (e.g. 2.5%) */
export const PLATFORM_FEE_PERCENT = 2.5

/** Minimum platform fee in USD */
export const PLATFORM_FEE_MIN_USD = 0.5

/** Delivery fee tiers by subtotal (simplified; can be replaced with zone-based logic) */
export const DELIVERY_FEE_USD = 5

/** Default delivery ETA range (days) when not specified per product */
export const DEFAULT_DELIVERY_ETA_DAYS: [number, number] = [2, 5]

/** Order status display labels */
export const ORDER_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  pending_payment: "Pending payment",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  disputed: "Disputed",
  refunded: "Refunded",
}
