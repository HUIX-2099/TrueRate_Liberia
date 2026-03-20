"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Activity } from "lucide-react"
import { cn } from "@/lib/utils"

/** Compute 30d volatility from candles: annualized std dev of daily log returns (as %). */
function computeVolatilityFromCandles(candles: { close: number }[]): number | null {
  if (!candles?.length || candles.length < 2) return null
  const returns: number[] = []
  for (let i = 1; i < candles.length; i++) {
    const prev = candles[i - 1].close
    const curr = candles[i].close
    if (prev > 0) returns.push(Math.log(curr / prev))
  }
  if (returns.length < 2) return null
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length
  const variance = returns.reduce((s, r) => s + (r - mean) ** 2, 0) / (returns.length - 1)
  const std = Math.sqrt(variance)
  // Annualized: * sqrt(252) trading days, as percentage
  const annualized = std * Math.sqrt(252) * 100
  return Math.round(annualized * 10) / 10
}

export function VolatilityIndicator({
  className,
  variant = "default",
}: {
  className?: string
  /** Use "dark" on dark hero backgrounds so text is light */
  variant?: "default" | "dark"
}) {
  const [volatility, setVolatility] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch("/api/rates/candles?days=30")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        const vol = data?.candles ? computeVolatilityFromCandles(data.candles) : null
        setVolatility(vol)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const level = volatility == null ? null : volatility < 8 ? "low" : volatility < 15 ? "med" : "high"

  const textClass = variant === "dark" ? "text-white/80" : "text-muted-foreground"
  const badgeLow = variant === "dark" ? "bg-emerald-400/20 text-emerald-300" : "bg-muted/40 border border-border/40 text-emerald-700 dark:text-emerald-400"
  const badgeMed = variant === "dark" ? "bg-amber-400/20 text-amber-300" : "bg-muted/40 border border-border/40 text-amber-700 dark:text-amber-400"
  const badgeHigh = variant === "dark" ? "bg-red-400/20 text-red-300" : "bg-muted/40 border border-border/40 text-red-700 dark:text-red-400"

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Activity className={cn("h-3.5 w-3.5 shrink-0", textClass)} aria-hidden />
      <span className={cn("text-[11px] uppercase tracking-wider font-medium", textClass)}>
        FX Vol (30d)
      </span>
      {loading ? (
        <span className={cn("tabular-nums text-xs", textClass)}>—</span>
      ) : volatility != null ? (
        <Badge
          variant="outline"
          className={cn(
            "tabular-nums text-xs font-mono font-semibold border-0",
            level === "low" && badgeLow,
            level === "med" && badgeMed,
            level === "high" && badgeHigh
          )}
        >
          {volatility}%
        </Badge>
      ) : (
        <span className={cn("tabular-nums text-xs", textClass)}>—</span>
      )}
    </div>
  )
}
