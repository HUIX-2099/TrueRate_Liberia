"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Store, ShieldCheck, Truck } from "lucide-react"
import { cn } from "@/lib/utils"

export interface VendorCardProps {
  id: string
  name: string
  logoUrl?: string | null
  trustScore: number
  yearsActive: number
  deliverySpeed: string
  verified: boolean
  onViewSupply?: (id: string) => void
  className?: string
}

export function VendorCard({
  id,
  name,
  logoUrl,
  trustScore,
  yearsActive,
  deliverySpeed,
  verified,
  onViewSupply,
  className,
}: VendorCardProps) {
  return (
    <Card
      className={cn(
        "min-w-[240px] max-w-[280px] sm:min-w-[260px] shrink-0 border-border/40 bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/20",
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted/40 border border-border/40">
            {logoUrl ? (
              <img src={logoUrl} alt="" className="h-7 w-7 rounded-lg object-contain" />
            ) : (
              <Store className="h-5 w-5 text-primary" aria-hidden />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-sm truncate">{name}</p>
              {verified && (
                <ShieldCheck className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" aria-label="Verified" />
              )}
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-full bg-muted/40 border border-border/40 text-primary font-medium px-2 py-0.5">
                {trustScore}% trust
              </span>
              <span>{yearsActive} yrs</span>
              <span className="flex items-center gap-1">
                <Truck className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                {deliverySpeed}
              </span>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-3.5 w-full gap-2 rounded-xl min-h-[40px] font-medium"
          onClick={() => onViewSupply?.(id)}
          aria-label={`View supply from ${name}`}
        >
          View Supply
        </Button>
      </CardContent>
    </Card>
  )
}
