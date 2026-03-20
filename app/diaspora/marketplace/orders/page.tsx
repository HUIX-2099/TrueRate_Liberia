"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Package } from "lucide-react"
import type { OrderSummary } from "@/lib/diaspora/types"
import { ORDER_STATUS_LABELS } from "@/lib/diaspora/constants"

export default function DiasporaOrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/diaspora/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data.data ?? []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pb-24 md:pb-12">
        <div className="sticky top-0 z-30 border-b border-border/40 bg-background/95">
          <PageContainer maxWidth="6xl">
            <div className="flex items-center h-14 sm:h-16">
              <Button asChild variant="ghost" size="sm" className="gap-2 -ml-2">
                <Link href="/diaspora/marketplace">
                  <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                  <span className="hidden sm:inline">Back to marketplace</span>
                </Link>
              </Button>
            </div>
          </PageContainer>
        </div>
        <PageContainer maxWidth="2xl" className="py-8">
          <h1 className="text-xl font-semibold text-foreground mb-2">Your orders</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Track diaspora marketplace orders and delivery status.
          </p>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="rounded-2xl border-border/40 animate-pulse">
                  <CardContent className="p-4 h-24" />
                </Card>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <Card className="rounded-2xl border-border/40">
              <CardContent className="py-12 text-center">
                <Package className="h-12 w-12 /50 mx-auto mb-3 text-primary" />
                <p className="text-muted-foreground mb-4">No orders yet.</p>
                <Button asChild className="rounded-xl min-h-[44px]">
                  <Link href="/diaspora/marketplace">Shop marketplace</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <ul className="space-y-3">
              {orders.map((order) => (
                <li key={order.id}>
                  <Link href={`/diaspora/marketplace/order-confirmation?orderId=${order.id}`}>
                    <Card className="rounded-2xl border-border/40 transition-colors hover:border-primary/30 hover:bg-muted/30">
                      <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-mono text-xs text-muted-foreground">{order.id}</p>
                          <p className="font-medium text-foreground">
                            {order.recipientName} · {order.itemCount} item{order.itemCount !== 1 ? "s" : ""}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                            {ORDER_STATUS_LABELS[order.status] ?? order.status}
                          </p>
                        </div>
                        <div className="text-right tabular-nums font-medium">
                          ${Number(order.totalUsd).toFixed(2)} USD
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </PageContainer>
      </main>
      <Footer />
    </div>
  )
}
