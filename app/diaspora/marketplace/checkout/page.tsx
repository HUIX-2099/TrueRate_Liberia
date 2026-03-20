"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react"
import { useDiasporaCart } from "@/lib/diaspora/cart-context"
import type { FeeBreakdown, RecipientDetails } from "@/lib/diaspora/types"

export default function CheckoutPage() {
  const { items, totalUsd, itemCount, clearCart } = useDiasporaCart()
  const [quote, setQuote] = useState<FeeBreakdown | null>(null)
  const [loadingQuote, setLoadingQuote] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recipient, setRecipient] = useState<RecipientDetails>({
    recipientName: "",
    recipientPhone: "",
    deliveryAddress: "",
    deliveryCity: "",
    deliveryNotes: "",
  })

  useEffect(() => {
    if (items.length === 0) {
      setLoadingQuote(false)
      setQuote(null)
      return
    }
    setLoadingQuote(true)
    fetch("/api/diaspora/cart/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setQuote(data)
      })
      .catch(() => setQuote(null))
      .finally(() => setLoadingQuote(false))
  }, [items])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0 || !quote) return
    if (!recipient.recipientName?.trim() || !recipient.recipientPhone?.trim() || !recipient.deliveryAddress?.trim()) {
      setError("Please fill in recipient name, phone, and delivery address.")
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch("/api/diaspora/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          recipient: {
            recipientName: recipient.recipientName.trim(),
            recipientPhone: recipient.recipientPhone.trim(),
            deliveryAddress: recipient.deliveryAddress.trim(),
            deliveryCity: recipient.deliveryCity?.trim() || undefined,
            deliveryNotes: recipient.deliveryNotes?.trim() || undefined,
          },
          useEscrow: false,
          fxRate: quote.fxRate,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Checkout failed")
      clearCart()
      window.location.href = `/diaspora/marketplace/order-confirmation?orderId=${data.orderId}`
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed")
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0 && !loadingQuote) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <p className="text-muted-foreground mb-4">Your cart is empty.</p>
            <Button asChild className="rounded-xl min-h-[44px]">
              <Link href="/diaspora/marketplace">Continue shopping</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

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
          <h1 className="text-xl font-semibold text-foreground mb-2">Checkout</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Enter your family’s details in Liberia for delivery. Pay in USD; we’ll show the LRD equivalent at the TrueRate rate.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-2xl border border-border/40 bg-muted/20 p-4 sm:p-6 space-y-4">
              <h2 className="text-sm font-semibold text-foreground">Recipient in Liberia</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="recipientName">Full name *</Label>
                  <Input
                    id="recipientName"
                    value={recipient.recipientName}
                    onChange={(e) => setRecipient((r) => ({ ...r, recipientName: e.target.value }))}
                    placeholder="Name of recipient"
                    required
                    className="min-h-[44px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipientPhone">Phone *</Label>
                  <Input
                    id="recipientPhone"
                    type="tel"
                    value={recipient.recipientPhone}
                    onChange={(e) => setRecipient((r) => ({ ...r, recipientPhone: e.target.value }))}
                    placeholder="+231 77 123 4567"
                    required
                    className="min-h-[44px]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryAddress">Delivery address *</Label>
                <Input
                  id="deliveryAddress"
                  value={recipient.deliveryAddress}
                  onChange={(e) => setRecipient((r) => ({ ...r, deliveryAddress: e.target.value }))}
                  placeholder="Street, area, city"
                  required
                  className="min-h-[44px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryCity">City (optional)</Label>
                <Input
                  id="deliveryCity"
                  value={recipient.deliveryCity ?? ""}
                  onChange={(e) => setRecipient((r) => ({ ...r, deliveryCity: e.target.value }))}
                  placeholder="e.g. Monrovia, Paynesville"
                  className="min-h-[44px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryNotes">Delivery notes (optional)</Label>
                <Textarea
                  id="deliveryNotes"
                  value={recipient.deliveryNotes ?? ""}
                  onChange={(e) => setRecipient((r) => ({ ...r, deliveryNotes: e.target.value }))}
                  placeholder="Landmark, gate code, etc."
                  rows={2}
                  className="resize-none"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-border/40 bg-card p-4 sm:p-6 space-y-3">
              <h2 className="text-sm font-semibold text-foreground">Order summary</h2>
              <ul className="space-y-2 text-sm">
                {items.map((i) => (
                  <li key={i.productId} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {i.name} × {i.quantity}
                    </span>
                    <span className="tabular-nums">${(i.priceUsd * i.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              {loadingQuote ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  Calculating fees and exchange rate…
                </div>
              ) : quote ? (
                <>
                  <div className="border-t border-border/40 pt-3 mt-3 space-y-1 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="tabular-nums">${quote.subtotalUsd.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Platform fee</span>
                      <span className="tabular-nums">${quote.platformFeeUsd.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery</span>
                      <span className="tabular-nums">${quote.deliveryFeeUsd.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-foreground pt-2">
                      <span>Total (USD)</span>
                      <span className="tabular-nums">${quote.totalUsd.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground text-xs">
                      <span>Rate: 1 USD = {quote.fxRate} LRD</span>
                      {quote.totalLrd != null && (
                        <span className="tabular-nums">≈ {quote.totalLrd.toLocaleString()} LRD</span>
                      )}
                    </div>
                  </div>
                </>
              ) : null}
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
              <span>Payment is secure. You’ll see confirmation and order details after placing the order.</span>
            </div>

            <Button
              type="submit"
              className="w-full rounded-xl min-h-[44px]"
              disabled={loadingQuote || submitting || !quote || items.length === 0}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2 text-primary" />
                  Processing…
                </>
              ) : (
                `Place order · $${quote?.totalUsd.toFixed(2) ?? "0.00"} USD`
              )}
            </Button>
          </form>
        </PageContainer>
      </main>
      <Footer />
    </div>
  )
}
