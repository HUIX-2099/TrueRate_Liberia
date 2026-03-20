"use client"

import Link from "next/link"
import { PackageSearch } from "lucide-react"
import { ProductCard } from "./ProductCard"
import type { Product } from "./types"
import { Button } from "@/components/ui/button"

export interface ProductGridProps {
  products: Product[]
  onAddToCart?: (id: string) => void
  className?: string
}

export function ProductGrid({ products, onAddToCart, className }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div
        className={`rounded-2xl border border-dashed border-border/60 px-6 py-14 text-center ${className ?? ""}`}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/40 border border-border/40 text-primary mb-4">
          <PackageSearch className="h-7 w-7 text-primary" aria-hidden />
        </div>
        <p className="text-base font-semibold text-foreground">Nothing in this category yet</p>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">
          Try another category—or browse all vendors while we add more SKUs for diaspora sends.
        </p>
        <Button asChild variant="outline" className="mt-6 rounded-xl gap-2">
          <Link href="/diaspora/marketplace#vendors-heading">Browse verified vendors</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            id={p.id}
            name={p.name}
            priceUsd={p.priceUsd}
            priceLrd={p.priceLrd}
            fxRate={p.fxRate}
            deliveryEtaDays={p.deliveryEtaDays}
            stockLevel={p.stockLevel ?? "high"}
            frequentlyPurchasedByDiaspora={p.frequentlyPurchasedByDiaspora}
            vendorName={p.vendorName}
            category={p.category}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  )
}
