export interface CartItem {
  id: string
  productId: string
  name: string
  quantity: number
  priceUsd: number
  vendorId?: string
  vendorName?: string
}

export interface Vendor {
  id: string
  name: string
  trustScore: number
  yearsActive: number
  deliverySpeed: string
  verified: boolean
  logoUrl?: string | null
}

export interface Product {
  id: string
  name: string
  priceUsd: number
  priceLrd?: number
  fxRate?: number
  deliveryEtaDays?: [number, number]
  stockLevel?: "high" | "medium" | "low"
  frequentlyPurchasedByDiaspora?: boolean
  vendorId?: string
  vendorName?: string
  /** Display category (e.g. Construction, Food & Groceries) */
  category?: string
}
