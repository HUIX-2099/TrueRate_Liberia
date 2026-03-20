"use client"

import { Button } from "@/components/ui/button"
import { Package, Truck, ShoppingCart } from "lucide-react"
import { StatusBadge } from "@/components/ui/status-badge"
import { cn } from "@/lib/utils"

export interface ProductCardProps {
  id: string
  name: string
  priceUsd: number
  priceLrd?: number
  fxRate?: number
  deliveryEtaDays?: [number, number]
  stockLevel?: "high" | "medium" | "low"
  frequentlyPurchasedByDiaspora?: boolean
  vendorName?: string
  category?: string
  onAddToCart?: (id: string) => void
  className?: string
}

const STOCK_VARIANT = {
  high: "stable" as const,
  medium: "watch" as const,
  low: "negative" as const,
}

export function ProductCard({
  id,
  name,
  priceUsd,
  priceLrd,
  fxRate,
  deliveryEtaDays,
  stockLevel = "high",
  frequentlyPurchasedByDiaspora,
  vendorName,
  category = "Supply",
  onAddToCart,
  className,
}: ProductCardProps) {
  const eta =
    deliveryEtaDays && `${deliveryEtaDays[0]}–${deliveryEtaDays[1]} days`
  const stockLabel = stockLevel === "high" ? "In stock" : stockLevel === "medium" ? "Limited" : "Low stock"

  return (
    <article
      className={cn(
        "group rounded-2xl border border-border/40 bg-card overflow-hidden shadow-sm transition-colors duration-300 hover:border-border/80 flex flex-col",
        className
      )}
    >
      <div className="relative aspect-[4/3] flex items-center justify-center overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.92_0.05_150/0.35),transparent_55%)] dark:bg-[radial-gradient(circle_at_30%_20%,oklch(0.35_0.08_260/0.25),transparent_55%)]"
          aria-hidden
        />
        <Package
          className="h-14 w-14 /20 transition-transform duration-300 group-hover:scale-110 text-primary"
          aria-hidden
        />
        {fxRate != null && (
          <span className="absolute top-3 right-3 rounded-lg bg-background/90 text-foreground text-[10px] font-semibold px-2.5 py-1 shadow-sm border border-border/40 tabular-nums">
            1 USD ≈ {fxRate} LRD
          </span>
        )}
        {frequentlyPurchasedByDiaspora && (
          <span className="absolute top-3 left-3 rounded-lg bg-emerald-600 text-white text-[10px] font-semibold px-2.5 py-1 shadow-md ring-2 ring-white/20">
            Popular
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider truncate">{category}</p>
          {vendorName != null && vendorName !== "" && (
            <p className="text-[10px] font-medium text-primary/80 truncate max-w-[45%]" title={vendorName}>
              {vendorName}
            </p>
          )}
        </div>
        <p className="font-semibold text-foreground text-sm leading-snug line-clamp-2 min-h-[2.5rem]">{name}</p>
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mt-auto pt-1">
          <span className="text-xl font-bold tabular-nums text-foreground">
            ${priceUsd.toLocaleString()}
          </span>
          {priceLrd != null && (
            <span className="text-[11px] text-muted-foreground">≈ {priceLrd.toLocaleString()} LRD</span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge label={stockLabel} variant={STOCK_VARIANT[stockLevel]} size="sm" />
          {eta && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Truck className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              {eta}
            </span>
          )}
        </div>
        <Button
          size="sm"
          className="w-full gap-2 rounded-xl min-h-[44px] font-semibold shadow-sm mt-1"
          onClick={() => onAddToCart?.(id)}
          aria-label={`Add ${name} to cart`}
        >
          <ShoppingCart className="h-4 w-4 text-primary" />
          Add to cart
        </Button>
      </div>
    </article>
  )
}
