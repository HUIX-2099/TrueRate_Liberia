"use client"

import { useState, useCallback, useMemo } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SectionContainer } from "@/components/ui/section-container"
import { MarketplaceHero } from "./MarketplaceHero"
import { HowItWorks } from "./HowItWorks"
import { CategoryStrip } from "./CategoryStrip"
import { FilterBar } from "./FilterBar"
import { ProductGrid } from "./ProductGrid"
import { CartDrawer } from "./CartDrawer"
import { CartTrigger } from "./CartTrigger"
import { Button } from "@/components/ui/button"
import type { CartItem, Product } from "./types"

const MOCK_PRODUCTS: Product[] = [
  { id: "p1", name: "Portland Cement 50kg", priceUsd: 12.5, priceLrd: 2275, fxRate: 182, deliveryEtaDays: [2, 5], stockLevel: "high", frequentlyPurchasedByDiaspora: true, vendorId: "v1", vendorName: "Liberia Build Supply Co.", category: "Construction" },
  { id: "p2", name: "Premium Rice 25kg", priceUsd: 28, priceLrd: 5096, fxRate: 182, deliveryEtaDays: [1, 3], stockLevel: "medium", frequentlyPurchasedByDiaspora: true, vendorId: "v2", vendorName: "Monrovia Fresh Goods", category: "Food & Groceries" },
]

export function MarketplacePanel() {
  const [category, setCategory] = useState("all")
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [location, setLocation] = useState("all")
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const handleAddToCart = useCallback((id: string) => {
    const product = MOCK_PRODUCTS.find((p) => p.id === id)
    if (!product) return
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === id)
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [
        ...prev,
        {
          id: product.id,
          productId: product.id,
          name: product.name,
          quantity: 1,
          priceUsd: product.priceUsd,
          vendorId: product.vendorId,
          vendorName: product.vendorName,
        },
      ]
    })
  }, [])

  const cartTotal = useMemo(
    () => cartItems.reduce((s, i) => s + i.priceUsd * i.quantity, 0),
    [cartItems]
  )
  const cartCount = useMemo(
    () => cartItems.reduce((s, i) => s + i.quantity, 0),
    [cartItems]
  )

  return (
    <SectionContainer
      id="marketplace"
      title="Send to family"
      description="Shop in USD — your family receives in Liberia"
      action={
        <div className="flex items-center gap-2 flex-wrap">
          <CartDrawer
            items={cartItems}
            trigger={
              <CartTrigger
                itemCount={cartCount}
                totalUsd={cartTotal}
              />
            }
          />
          <Button size="sm" asChild className="gap-2 min-h-[44px] rounded-xl font-medium">
            <Link href="/diaspora/marketplace">
              Open marketplace
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </Button>
        </div>
      }
    >
      <MarketplaceHero variant="compact" />

      <HowItWorks variant="compact" className="mb-6" />

      <CategoryStrip
        activeId={category}
        onSelect={setCategory}
        className="mb-4"
      />

      <FilterBar
        location={location}
        onLocationChange={setLocation}
        verifiedOnly={verifiedOnly}
        onVerifiedOnlyChange={setVerifiedOnly}
      />

      <h3 className="text-base font-semibold text-foreground mb-4 mt-6">
        What to send
      </h3>
      <ProductGrid
        products={MOCK_PRODUCTS}
        onAddToCart={handleAddToCart}
      />
    </SectionContainer>
  )
}
