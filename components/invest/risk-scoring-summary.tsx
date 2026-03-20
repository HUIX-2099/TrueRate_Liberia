"use client"

import { useMemo } from "react"
import { INVESTMENT_OPPORTUNITIES } from "./investment-opportunities"
import { cn } from "@/lib/utils"

export function RiskScoringSummary() {
  const { avg, low, high } = useMemo(() => {
    const scores = INVESTMENT_OPPORTUNITIES.map((o) => o.riskScore)
    const sum = scores.reduce((a, b) => a + b, 0)
    return {
      avg: scores.length ? Math.round((sum / scores.length) * 10) / 10 : 0,
      low: Math.min(...scores),
      high: Math.max(...scores),
    }
  }, [])

  const band = avg <= 3 ? "low" : avg <= 6 ? "med" : "high"

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs">
      <span className="text-muted-foreground uppercase tracking-wider font-medium">
        Sector risk index
      </span>
      <span className="tabular-nums font-mono font-bold text-foreground">{avg}/10</span>
      <span className="text-muted-foreground">avg</span>
      <span className="text-muted-foreground">·</span>
      <span className="tabular-nums font-mono text-muted-foreground">
        {low}–{high} range
      </span>
      <span
        className={cn(
          "rounded px-1.5 py-0.5 font-medium",
          band === "low" && "bg-muted/40 border border-border/40 text-emerald-700 dark:text-emerald-400",
          band === "med" && "bg-muted/40 border border-border/40 text-amber-700 dark:text-amber-400",
          band === "high" && "bg-muted/40 border border-border/40 text-red-700 dark:text-red-400"
        )}
      >
        {band === "low" ? "Low" : band === "med" ? "Moderate" : "Elevated"}
      </span>
    </div>
  )
}
