"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle2, Package, ArrowRight } from "lucide-react"
import type { OrderDetail } from "@/lib/diaspora/types"
import { ORDER_STATUS_LABELS } from "@/lib/diaspora/constants"

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(!!orderId)
  const [error, setError] = useState<string | null>(() => orderId ? null : "No order ID")

  useEffect(() => {
    if (!orderId) return
    let cancelled = false
    fetch(`/api/diaspora/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        if (data.error) throw new Error(data.error)
        setOrder(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Order not found")
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <p className="text-muted-foreground">Loading order…</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <p className="text-muted-foreground mb-4">{error ?? "Order not found."}</p>
            <Button asChild className="rounded-xl min-h-[44px]">
              <Link href="/diaspora/marketplace">Back to marketplace</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const statusLabel = ORDER_STATUS_LABELS[order.status] ?? order.status

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pb-24 md:pb-12">
        <PageContainer maxWidth="2xl" className="py-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-14 w-14 rounded-full bg-muted/40 border border-border/40 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" aria-hidden />
            </div>
            <h1 className="text-xl font-semibold text-foreground">Order confirmed</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Order <span className="font-mono text-foreground">{order.id}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Status: <span className="font-medium text-foreground">{statusLabel}</span>
            </p>
          </div>

          <Card className="rounded-2xl border-border/40 mb-6">
            <CardHeader className="pb-2">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Delivery details
              </h2>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-medium">{order.recipientName}</p>
              <p className="text-muted-foreground">{order.deliveryAddress}</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/40 mb-6">
            <CardHeader className="pb-2">
              <h2 className="text-sm font-semibold text-foreground">Items</h2>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {order.items?.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-start text-sm border-b border-border/40 pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">{item.vendorName} · ×{item.quantity}</p>
                    </div>
                    <span className="tabular-nums">${item.lineTotalUsd.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              {order.feeBreakdown && (
                <div className="mt-4 pt-4 border-t border-border/40 space-y-1 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="tabular-nums">${order.feeBreakdown.subtotalUsd.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform fee</span>
                    <span className="tabular-nums">${order.feeBreakdown.platformFeeUsd.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="tabular-nums">${order.feeBreakdown.deliveryFeeUsd.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-foreground pt-2">
                    <span>Total paid</span>
                    <span className="tabular-nums">${order.totalUsd.toFixed(2)} USD</span>
                  </div>
                  {order.feeBreakdown.totalLrd != null && (
                    <div className="text-xs">
                      ≈ {order.feeBreakdown.totalLrd.toLocaleString()} LRD (rate: {order.feeBreakdown.fxRate})
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline" className="rounded-xl min-h-[44px]">
              <Link href="/diaspora/marketplace/orders">View all orders</Link>
            </Button>
            <Button asChild className="rounded-xl min-h-[44px]">
              <Link href="/diaspora/marketplace" className="gap-2">
                Continue shopping
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </Button>
          </div>
        </PageContainer>
      </main>
      <Footer />
    </div>
  )
}
