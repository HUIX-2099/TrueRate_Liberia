"use client"

import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, LayoutGrid, HardHat, UtensilsCrossed, Home, Fuel, Shield, DollarSign, Truck, ShoppingBag, HeartHandshake } from "lucide-react"
import { MarketplaceHero } from "@/components/diaspora/Marketplace/MarketplaceHero"
import { HowItWorks } from "@/components/diaspora/Marketplace/HowItWorks"
import { CategoryStrip } from "@/components/diaspora/Marketplace/CategoryStrip"
import { ProductGrid } from "@/components/diaspora/Marketplace/ProductGrid"
import { CartDrawer } from "@/components/diaspora/Marketplace/CartDrawer"
import { CartTrigger } from "@/components/diaspora/Marketplace/CartTrigger"
import { VendorListSection } from "@/components/diaspora/Marketplace/VendorListSection"
import { useDiasporaCart } from "@/lib/diaspora/cart-context"
import { PRODUCT_CATEGORIES } from "@/lib/diaspora/constants"
import type { Product } from "@/lib/diaspora/types"

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  all: LayoutGrid,
  construction: HardHat,
  "food-groceries": UtensilsCrossed,
  household: Home,
  fuel: Fuel,
}

const CATEGORY_LABELS: Record<string, string> = {
  construction: "Construction",
  food_groceries: "Food & Groceries",
  household: "Household",
  fuel_voucher: "Fuel",
}

/** Map API product to ProductGrid/ProductCard display shape */
function toDisplayProduct(apiProduct: Product & { priceLrd?: number | null }, fxRate: number) {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    priceUsd: apiProduct.priceUsd,
    priceLrd: apiProduct.priceLrd ?? Math.round(Number(apiProduct.priceUsd) * fxRate),
    fxRate,
    deliveryEtaDays: apiProduct.deliveryEtaDays ?? undefined,
    stockLevel: apiProduct.stockLevel ?? "high",
    frequentlyPurchasedByDiaspora: apiProduct.frequentlyPurchasedByDiaspora,
    vendorId: apiProduct.vendorId,
    vendorName: apiProduct.vendorName,
    category: CATEGORY_LABELS[apiProduct.category] ?? apiProduct.category,
  }
}

export default function DiasporaMarketplacePage() {
  const [category, setCategory] = useState("all")
  const [products, setProducts] = useState<ReturnType<typeof toDisplayProduct>[]>([])
  const [fxRate, setFxRate] = useState(182)
  const [loading, setLoading] = useState(true)
  const { items, addItem, totalUsd, itemCount } = useDiasporaCart()

  const apiCategory = PRODUCT_CATEGORIES.find((c) => c.id === category)?.apiCategory ?? null

  useEffect(() => {
    let cancelled = false
    const params = new URLSearchParams()
    if (apiCategory) params.set("category", apiCategory)
    fetch(`/api/diaspora/products?${params}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        const list = data.data ?? []
        setProducts(list.map((p: Product) => toDisplayProduct(p, fxRate)))
      })
      .catch(() => { if (!cancelled) setProducts([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [apiCategory])

  useEffect(() => {
    fetch("/api/rates/live")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data?.rate === "number") setFxRate(data.rate)
      })
      .catch(() => {})
  }, [])

  /** Keep LRD hints in sync when live FX loads or updates (no extra network round-trip). */
  useEffect(() => {
    setProducts((prev) =>
      prev.map((p) => ({
        ...p,
        fxRate,
        priceLrd: Math.round(Number(p.priceUsd) * fxRate),
      }))
    )
  }, [fxRate])

  const handleAddToCart = useCallback(
    (id: string) => {
      const p = products.find((x) => x.id === id)
      if (!p) return
      addItem({
        productId: p.id,
        name: p.name,
        quantity: 1,
        priceUsd: p.priceUsd,
        vendorId: p.vendorId ?? "",
        vendorName: p.vendorName ?? "",
        category: p.category,
      })
    },
    [products, addItem]
  )

  const categoryItems = PRODUCT_CATEGORIES.map((c) => ({
    id: c.id,
    label: c.label,
    icon: CATEGORY_ICONS[c.id] ?? LayoutGrid,
  }))

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-x-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(520px,55vh)]"
        aria-hidden
      />
      <Header />
      <main className="flex-1 pb-24 md:pb-12 overflow-x-hidden relative">
        <header className="sticky top-0 z-30 border-b border-primary/10 bg-background/85 supports-[backdrop-filter]:bg-background/75 shadow-sm">
          <PageContainer maxWidth="6xl">
            <div className="flex items-center justify-between h-14 sm:h-16 gap-3 sm:gap-4">
              <Button asChild variant="ghost" size="sm" className="gap-2 -ml-2 min-h-[44px] text-muted-foreground hover:text-foreground">
                <Link href="/diaspora">
                  <ArrowLeft className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="hidden sm:inline">Back to Diaspora</span>
                </Link>
              </Button>
              <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 pointer-events-none max-w-[42%] sm:max-w-none">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-primary" />
                  <h1 className="text-base font-semibold text-foreground truncate tracking-tight">
                    Marketplace
                  </h1>
                </div>
                <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground tabular-nums sm:text-[11px]">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70 opacity-50" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  ~{fxRate} LRD/USD
                </span>
              </div>
              <div className="ml-auto shrink-0">
                <CartDrawer
                  items={items}
                  trigger={
                    <CartTrigger itemCount={itemCount} totalUsd={totalUsd} />
                  }
                />
              </div>
            </div>
          </PageContainer>
        </header>

        <PageContainer maxWidth="6xl" className="py-6 sm:py-10">
          <MarketplaceHero variant="default" />
          <section className="mb-8 rounded-2xl border border-border/40 bg-card/50 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Real people, real support</p>
                <p className="text-sm text-foreground mt-1">
                  Every order helps someone at home feel remembered, supported, and cared for.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border border-border/50 bg-background px-2.5 py-1 text-foreground">Families first</span>
                <span className="rounded-full border border-border/50 bg-background px-2.5 py-1 text-foreground">Transparent delivery</span>
                <span className="rounded-full border border-border/50 bg-background px-2.5 py-1 text-foreground">Trusted vendors</span>
              </div>
            </div>
          </section>
          <HowItWorks variant="default" className="mb-10" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 py-6 mb-10 border-y border-border/30">
            {[
              { icon: Shield, label: "Secure checkout", color: "text-primary", bg: "from-primary/12 to-transparent" },
              { icon: DollarSign, label: "Pay in USD", color: "text-emerald-600 dark:text-emerald-400", bg: "from-emerald-500/12 to-transparent" },
              { icon: Truck, label: "Delivery to Liberia", color: "text-amber-600 dark:text-amber-400", bg: "from-amber-500/12 to-transparent" },
              { icon: HeartHandshake, label: "Verified vendors", color: "text-violet-600 dark:text-violet-400", bg: "from-violet-500/12 to-transparent" },
            ].map(({ icon: Icon, label, color, bg }) => (
              <div
                key={label}
                className="group flex items-center gap-3 rounded-2xl border border-border/40 bg-card/60 px-3 py-3 sm:px-4 sm:py-3.5 shadow-sm transition-all duration-300 hover:border-primary/20 hover:bg-card hover:shadow-md"
              >
                <div
                  className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl ${bg} ${color} ring-1 ring-border/30 transition-transform duration-300`}
                >
                  <Icon className="h-3.5 w-3.5 text-primary" aria-hidden />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-foreground leading-tight">{label}</span>
              </div>
            ))}
          </div>

          <VendorListSection category={apiCategory} className="mb-12" />

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/40 border border-border/40">
                <LayoutGrid className="h-3.5 w-3.5 text-primary" />
              </div>
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Categories</h2>
            </div>
            <CategoryStrip categories={categoryItems} activeId={category} onSelect={setCategory} />
          </div>

          <section id="products" className="scroll-mt-28">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">What to send</h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                  Add items to your cart. At checkout enter your family&apos;s address in Liberia for delivery.
                </p>
              </div>
              {!loading && products.length > 0 && (
                <Badge variant="outline" className="text-xs self-start sm:self-auto shrink-0">
                  {products.length} item{products.length !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="rounded-2xl border border-border/40 bg-muted/20">
                    <div className="aspect-[4/3] bg-muted/40 animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                      <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                      <div className="h-10 w-full bg-muted rounded-xl animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ProductGrid
                products={products}
                onAddToCart={handleAddToCart}
              />
            )}
          </section>

          <footer className="mt-16 pt-8 border-t border-border/40">
            <div className="rounded-2xl bg-muted/30 border border-border/40 p-6 sm:p-8 text-center max-w-xl mx-auto">
              <HeartHandshake className="h-8 w-8 mx-auto mb-3 text-primary" />
              <p className="font-semibold text-foreground mb-1">Need help?</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                All prices in USD. Delivery to Monrovia, Paynesville, and surrounding areas.
                More vendors and products coming soon.{" "}
                <Link href="/diaspora#trust" className="text-primary hover:underline font-medium">
                  Trust & support
                </Link>
              </p>
            </div>
          </footer>
        </PageContainer>
      </main>
      <Footer />
    </div>
  )
}
