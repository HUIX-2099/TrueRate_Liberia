/**
 * Diaspora Marketplace catalog.
 * When DATABASE_URL is set, proxies to Prisma.
 * Otherwise falls back to the in-memory seeded catalog.
 * Expanded from mock-data.ts with more products, search, and pagination.
 */

import { MOCK_VENDORS, MOCK_PRODUCTS } from "./mock-data"
import type { Vendor, Product } from "./types"

export interface CatalogFilters {
  category?: string | null
  vendorId?: string | null
  search?: string | null
  minPriceUsd?: number | null
  maxPriceUsd?: number | null
  stockLevel?: string | null
  truerateVerified?: boolean | null
  limit?: number
  offset?: number
}

export interface CatalogResult<T> {
  items: T[]
  total: number
  limit: number
  offset: number
}

function matchesSearch<T extends { name: string; description?: string | null; storeName?: string | null }>(
  item: T,
  query: string
): boolean {
  const q = query.toLowerCase()
  return (
    item.name?.toLowerCase().includes(q) ||
    (item.description?.toLowerCase().includes(q) ?? false) ||
    (item.storeName?.toLowerCase().includes(q) ?? false)
  )
}

export async function getVendors(filters?: CatalogFilters): Promise<CatalogResult<Vendor>> {
  if (process.env.DATABASE_URL) {
    try {
      const { getPrismaClient } = await import("@/lib/db/prisma")
      const prisma = getPrismaClient()
      if (prisma) {
        const where: Record<string, unknown> = { isActive: true }
        if (filters?.category && filters.category !== "all") {
          where.categories = { has: filters.category }
        }
        if (filters?.truerateVerified === true) {
          where.truerateVerified = true
        }
        const [vendors, total] = await Promise.all([
          prisma.vendor.findMany({
            where,
            skip: filters?.offset ?? 0,
            take: Math.min(filters?.limit ?? 20, 100),
            orderBy: [{ truerateVerified: "desc" }, { storeName: "asc" }],
          }),
          prisma.vendor.count({ where }),
        ])
        return { items: vendors as unknown as Vendor[], total, limit: filters?.limit ?? 20, offset: filters?.offset ?? 0 }
      }
    } catch {
      // fall through to mock
    }
  }

  let list = MOCK_VENDORS.filter((v) => v.isActive)
  if (filters?.category && filters.category !== "all") {
    list = list.filter((v) => v.categories.includes(filters.category!))
  }
  if (filters?.search) {
    list = list.filter((v) => matchesSearch({ name: v.storeName, description: v.description, storeName: v.storeName }, filters.search!))
  }
  if (filters?.truerateVerified === true) {
    list = list.filter((v) => v.truerateVerified)
  }
  const total = list.length
  const offset = filters?.offset ?? 0
  const limit = filters?.limit ?? 20
  return { items: list.slice(offset, offset + limit), total, limit, offset }
}

export async function getVendorById(id: string): Promise<Vendor | null> {
  if (process.env.DATABASE_URL) {
    try {
      const { getPrismaClient } = await import("@/lib/db/prisma")
      const prisma = getPrismaClient()
      if (prisma) {
        const vendor = await prisma.vendor.findUnique({ where: { id } })
        return vendor as unknown as Vendor | null
      }
    } catch { /* fall through */ }
  }
  return MOCK_VENDORS.find((v) => v.id === id) ?? null
}

export async function getProducts(filters?: CatalogFilters): Promise<CatalogResult<Product>> {
  if (process.env.DATABASE_URL) {
    try {
      const { getPrismaClient } = await import("@/lib/db/prisma")
      const prisma = getPrismaClient()
      if (prisma) {
        const where: Record<string, unknown> = { isActive: true }
        if (filters?.category && filters.category !== "all") where.category = filters.category
        if (filters?.vendorId) where.vendorId = filters.vendorId
        if (filters?.minPriceUsd != null) where.priceUsd = { gte: filters.minPriceUsd }
        if (filters?.maxPriceUsd != null) where.priceUsd = { ...(where.priceUsd as object ?? {}), lte: filters.maxPriceUsd }

        const [products, total] = await Promise.all([
          prisma.product.findMany({
            where,
            include: { vendor: { select: { storeName: true, truerateVerified: true } } },
            skip: filters?.offset ?? 0,
            take: Math.min(filters?.limit ?? 20, 100),
            orderBy: { name: "asc" },
          }),
          prisma.product.count({ where }),
        ])
        return { items: products as unknown as Product[], total, limit: filters?.limit ?? 20, offset: filters?.offset ?? 0 }
      }
    } catch { /* fall through */ }
  }

  let list = MOCK_PRODUCTS.filter((p) => p.isActive)
  if (filters?.category && filters.category !== "all") list = list.filter((p) => p.category === filters.category)
  if (filters?.vendorId) list = list.filter((p) => p.vendorId === filters.vendorId)
  if (filters?.search) list = list.filter((p) => matchesSearch({ name: p.name, description: p.description }, filters.search!))
  if (filters?.minPriceUsd != null) list = list.filter((p) => p.priceUsd >= filters.minPriceUsd!)
  if (filters?.maxPriceUsd != null) list = list.filter((p) => p.priceUsd <= filters.maxPriceUsd!)
  if (filters?.stockLevel) list = list.filter((p) => p.stockLevel === filters.stockLevel)

  const total = list.length
  const offset = filters?.offset ?? 0
  const limit = filters?.limit ?? 20
  return { items: list.slice(offset, offset + limit), total, limit, offset }
}

export async function getProductById(id: string): Promise<Product | null> {
  if (process.env.DATABASE_URL) {
    try {
      const { getPrismaClient } = await import("@/lib/db/prisma")
      const prisma = getPrismaClient()
      if (prisma) {
        const p = await prisma.product.findUnique({ where: { id }, include: { vendor: { select: { storeName: true, truerateVerified: true } } } })
        return p as unknown as Product | null
      }
    } catch { /* fall through */ }
  }
  return MOCK_PRODUCTS.find((p) => p.id === id) ?? null
}
