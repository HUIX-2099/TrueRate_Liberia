"use client"

import { useLiveRate, type RateSourcePreference } from "@/lib/live-rate-context"
import { cn } from "@/lib/utils"
import { Building2, TrendingUp } from "lucide-react"

export interface RateSourceSelectorProps {
  /** Inline (compact) or pill style */
  variant?: "inline" | "pills"
  className?: string
}

export function RateSourceSelector({ variant = "pills", className = "" }: RateSourceSelectorProps) {
  const { rateSource, setRateSource, cblRate } = useLiveRate()
  const hasOfficial = cblRate != null && cblRate > 0

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-2 text-xs text-muted-foreground", className)}>
        <span className="font-medium text-foreground">Use rate:</span>
        <button
          type="button"
          onClick={() => setRateSource("market")}
          className={cn(
            "underline-offset-2 hover:underline",
            rateSource === "market" && "font-semibold text-foreground"
          )}
        >
          Market
        </button>
        <span aria-hidden>·</span>
        <button
          type="button"
          onClick={() => setRateSource("official")}
          disabled={!hasOfficial}
          className={cn(
            "underline-offset-2 hover:underline disabled:opacity-50 disabled:cursor-not-allowed",
            rateSource === "official" && "font-semibold text-foreground"
          )}
          title={!hasOfficial ? "Official (CBL) rate not available" : "Use CBL official rate"}
        >
          Official (CBL)
        </button>
        {rateSource === "official" && !hasOfficial && (
          <span className="italic">(unavailable; showing market)</span>
        )}
      </div>
    )
  }

  return (
    <div className={cn("inline-flex rounded-lg border border-border/60 bg-muted/30 p-0.5", className)} role="group" aria-label="Select rate source">
      <button
        type="button"
        onClick={() => setRateSource("market")}
        className={cn(
          "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
          rateSource === "market"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <TrendingUp className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
        Market
      </button>
      <button
        type="button"
        onClick={() => setRateSource("official")}
        disabled={!hasOfficial}
        title={!hasOfficial ? "Official (CBL) rate not available" : "Use CBL official rate"}
        className={cn(
          "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          rateSource === "official"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Building2 className="h-3.5 w-3.5 text-primary" />
        Official (CBL)
      </button>
    </div>
  )
}
