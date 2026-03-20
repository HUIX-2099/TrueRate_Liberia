/**
 * Mock data for Diaspora Marketplace (MVP / no DB).
 * Replace with Prisma queries when DATABASE_URL is set.
 */

import type { Vendor, Product } from "./types"

const FX_RATE = 182

export const MOCK_VENDORS: Vendor[] = [
  {
    id: "v1",
    storeName: "Liberia Build Supply Co.",
    slug: "liberia-build-supply",
    description: "Construction materials, cement, zinc, rebar, tiles, and paint. Serving Monrovia and Paynesville.",
    locationAddress: "Red Light, Monrovia",
    locationCity: "Monrovia",
    locationRegion: "Montserrado",
    phone: "+231 77 123 4567",
    whatsapp: "+231 77 123 4567",
    businessRegNo: "LR-2020-BS-001",
    businessRegStatus: "verified",
    truerateVerified: true,
    verifiedAt: "2024-01-15T00:00:00Z",
    categories: ["construction"],
    isActive: true,
    averageRating: 4.7,
    reviewCount: 124,
  },
  {
    id: "v2",
    storeName: "Monrovia Fresh Goods",
    slug: "monrovia-fresh-goods",
    description: "Rice, oil, canned goods, and household groceries. Delivery across Greater Monrovia.",
    locationAddress: "Waterside, Monrovia",
    locationCity: "Monrovia",
    locationRegion: "Montserrado",
    phone: "+231 77 234 5678",
    whatsapp: "+231 77 234 5678",
    businessRegNo: "LR-2019-FG-002",
    businessRegStatus: "verified",
    truerateVerified: true,
    verifiedAt: "2024-02-01T00:00:00Z",
    categories: ["food_groceries"],
    isActive: true,
    averageRating: 4.5,
    reviewCount: 89,
  },
  {
    id: "v3",
    storeName: "ELWA Fuel & Supply",
    slug: "elwa-fuel-supply",
    description: "Fuel vouchers (gasoline & diesel), lubricants. Pickup or delivery.",
    locationAddress: "ELWA Junction, Paynesville",
    locationCity: "Paynesville",
    locationRegion: "Montserrado",
    phone: "+231 77 345 6789",
    whatsapp: "+231 77 345 6789",
    businessRegNo: "LR-2021-FS-003",
    businessRegStatus: "verified",
    truerateVerified: true,
    verifiedAt: "2024-03-10T00:00:00Z",
    categories: ["fuel_voucher"],
    isActive: true,
    averageRating: 4.3,
    reviewCount: 56,
  },
  {
    id: "v4",
    storeName: "Home Comfort Liberia",
    slug: "home-comfort-liberia",
    description: "Furniture, appliances, mattresses. Verified supplier for diaspora orders.",
    locationAddress: "Sinkor, Monrovia",
    locationCity: "Monrovia",
    locationRegion: "Montserrado",
    phone: "+231 77 456 7890",
    whatsapp: "+231 77 456 7890",
    businessRegStatus: "verified",
    truerateVerified: true,
    verifiedAt: "2024-04-01T00:00:00Z",
    categories: ["household"],
    isActive: true,
    averageRating: 4.6,
    reviewCount: 42,
  },
]

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    vendorId: "v1",
    vendorName: "Liberia Build Supply Co.",
    name: "Portland Cement 50kg",
    slug: "portland-cement-50kg",
    category: "construction",
    unit: "bag",
    priceUsd: 12.5,
    priceLrd: 2275,
    isActive: true,
    deliveryEtaDays: [2, 5],
    stockLevel: "high",
    frequentlyPurchasedByDiaspora: true,
  },
  {
    id: "p2",
    vendorId: "v1",
    vendorName: "Liberia Build Supply Co.",
    name: "Corrugated Zinc Sheet (3m)",
    slug: "zinc-sheet-3m",
    category: "construction",
    unit: "sheet",
    priceUsd: 28,
    priceLrd: 5096,
    isActive: true,
    deliveryEtaDays: [2, 5],
    stockLevel: "high",
    frequentlyPurchasedByDiaspora: true,
  },
  {
    id: "p3",
    vendorId: "v1",
    vendorName: "Liberia Build Supply Co.",
    name: "Rebar 12mm (6m)",
    slug: "rebar-12mm-6m",
    category: "construction",
    unit: "piece",
    priceUsd: 8.5,
    priceLrd: 1547,
    isActive: true,
    deliveryEtaDays: [2, 5],
    stockLevel: "medium",
  },
  {
    id: "p4",
    vendorId: "v2",
    vendorName: "Monrovia Fresh Goods",
    name: "Premium Rice 25kg",
    slug: "premium-rice-25kg",
    category: "food_groceries",
    unit: "bag",
    priceUsd: 28,
    priceLrd: 5096,
    isActive: true,
    deliveryEtaDays: [1, 3],
    stockLevel: "medium",
    frequentlyPurchasedByDiaspora: true,
  },
  {
    id: "p5",
    vendorId: "v2",
    vendorName: "Monrovia Fresh Goods",
    name: "Vegetable Oil 5L",
    slug: "vegetable-oil-5l",
    category: "food_groceries",
    unit: "bottle",
    priceUsd: 12,
    priceLrd: 2184,
    isActive: true,
    deliveryEtaDays: [1, 3],
    stockLevel: "high",
  },
  {
    id: "p6",
    vendorId: "v2",
    vendorName: "Monrovia Fresh Goods",
    name: "Canned Sardines 12-pack",
    slug: "canned-sardines-12",
    category: "food_groceries",
    unit: "pack",
    priceUsd: 15,
    priceLrd: 2730,
    isActive: true,
    deliveryEtaDays: [1, 3],
    stockLevel: "high",
  },
  {
    id: "p7",
    vendorId: "v3",
    vendorName: "ELWA Fuel & Supply",
    name: "Gasoline Voucher 20L",
    slug: "gasoline-voucher-20l",
    category: "fuel_voucher",
    unit: "voucher",
    priceUsd: 22,
    priceLrd: 4004,
    isActive: true,
    deliveryEtaDays: [0, 1],
    stockLevel: "high",
    frequentlyPurchasedByDiaspora: true,
  },
  {
    id: "p8",
    vendorId: "v3",
    vendorName: "ELWA Fuel & Supply",
    name: "Diesel Supply Order 50L",
    slug: "diesel-order-50l",
    category: "fuel_voucher",
    unit: "order",
    priceUsd: 55,
    priceLrd: 10010,
    isActive: true,
    deliveryEtaDays: [1, 2],
    stockLevel: "high",
  },
  {
    id: "p9",
    vendorId: "v4",
    vendorName: "Home Comfort Liberia",
    name: "Double Mattress",
    slug: "double-mattress",
    category: "household",
    unit: "piece",
    priceUsd: 85,
    priceLrd: 15470,
    isActive: true,
    deliveryEtaDays: [3, 7],
    stockLevel: "medium",
  },
  {
    id: "p10",
    vendorId: "v4",
    vendorName: "Home Comfort Liberia",
    name: "Standing Fan",
    slug: "standing-fan",
    category: "household",
    unit: "piece",
    priceUsd: 45,
    priceLrd: 8190,
    isActive: true,
    deliveryEtaDays: [2, 5],
    stockLevel: "high",
  },
]

export function getMockVendors(category?: string | null): Vendor[] {
  if (!category || category === "all") return MOCK_VENDORS.filter((v) => v.isActive)
  return MOCK_VENDORS.filter(
    (v) => v.isActive && v.categories.includes(category)
  )
}

export function getMockVendorById(id: string): Vendor | null {
  return MOCK_VENDORS.find((v) => v.id === id) ?? null
}

export function getMockProducts(filters?: {
  category?: string | null
  vendorId?: string | null
}): Product[] {
  let list = [...MOCK_PRODUCTS].filter((p) => p.isActive)
  if (filters?.category && filters.category !== "all") {
    list = list.filter((p) => p.category === filters.category)
  }
  if (filters?.vendorId) {
    list = list.filter((p) => p.vendorId === filters.vendorId)
  }
  return list
}

export function getMockProductById(id: string): Product | null {
  return MOCK_PRODUCTS.find((p) => p.id === id) ?? null
}

/** Default FX rate for mock (use /api/rates/live in production). */
export function getMockFxRate(): number {
  return FX_RATE
}
