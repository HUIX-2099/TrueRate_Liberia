"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Store, ShieldCheck, MapPin, Phone, MessageCircle, FileCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Vendor } from "@/lib/diaspora/types"

const CATEGORY_LABELS: Record<string, string> = {
  construction: "Construction",
  food_groceries: "Food & Groceries",
  household: "Household",
  fuel_voucher: "Fuel",
}

export interface VendorListSectionProps {
  category?: string | null
  className?: string
}

export function VendorListSection({ category, className }: VendorListSectionProps) {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams()
    if (category && category !== "all") params.set("category", category)
    fetch(`/api/diaspora/vendors?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setVendors(data.data ?? [])
      })
      .catch(() => setVendors([]))
      .finally(() => setLoading(false))
  }, [category])

  if (loading) {
    return (
      <section className={cn("space-y-4", className)} aria-busy="true">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/40 border border-border/40">
            <ShieldCheck className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Verified vendors</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-border/40 animate-pulse rounded-2xl">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 bg-muted rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
                <div className="h-9 bg-muted rounded-xl w-full mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    )
  }

  if (vendors.length === 0) {
    return (
      <section className={cn("space-y-4", className)}>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/40 border border-border/40">
            <ShieldCheck className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Verified vendors</h2>
        </div>
        <p className="text-sm text-muted-foreground">No vendors found for this category.</p>
      </section>
    )
  }

  return (
    <section className={cn("space-y-5", className)} aria-labelledby="vendors-heading">
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/40 border border-border/40">
            <ShieldCheck className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
          </div>
          <h2 id="vendors-heading" className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Verified vendors
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1.5 ml-9">
          TrueRate-verified stores. Business registration and contact details listed.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {vendors.map((vendor) => (
          <Card
            key={vendor.id}
            className="rounded-2xl border border-border/40 bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/20 overflow-hidden"
          >
            <div
              className="absolute inset-x-0 top-0 h-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              aria-hidden
            />
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted/40 border border-border/40">
                  {vendor.logoUrl ? (
                    <img
                      src={vendor.logoUrl}
                      alt=""
                      className="h-7 w-7 rounded-lg object-contain"
                    />
                  ) : (
                    <Store className="h-5 w-5 text-primary" aria-hidden />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="font-semibold text-sm truncate">{vendor.storeName}</p>
                    {vendor.truerateVerified && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full bg-muted/40 border border-border/40 text-primary px-2 py-0.5 text-[10px] font-medium"
                        title="Verified by TrueRate"
                      >
                        <ShieldCheck className="h-3 w-3 text-green-600 dark:text-green-400" />
                        Verified
                      </span>
                    )}
                  </div>
                  {vendor.locationAddress && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0 text-blue-600 dark:text-blue-400" />
                      <span className="truncate">
                        {[vendor.locationAddress, vendor.locationCity].filter(Boolean).join(", ")}
                      </span>
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                    {vendor.averageRating != null && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted/40 border border-border/40 text-amber-600 dark:text-amber-400 font-medium px-2 py-0.5">
                        {vendor.averageRating.toFixed(1)} ★
                      </span>
                    )}
                    {vendor.reviewCount != null && (
                      <span>{vendor.reviewCount} reviews</span>
                    )}
                    {vendor.businessRegStatus === "verified" && (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <FileCheck className="h-3 w-3 text-primary" />
                        Registered
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                {vendor.phone && (
                  <a
                    href={`tel:${vendor.phone}`}
                    className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
                  >
                    <Phone className="h-3 w-3 text-primary" />
                    {vendor.phone}
                  </a>
                )}
                {vendor.whatsapp && (
                  <a
                    href={`https://wa.me/${vendor.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
                  >
                    <MessageCircle className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    WhatsApp
                  </a>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full gap-2 rounded-xl min-h-[40px] font-medium"
                asChild
              >
                <Link href={`/diaspora/marketplace?vendor=${vendor.id}&category=${vendor.categories[0] ?? "all"}`}>
                  View catalog
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
