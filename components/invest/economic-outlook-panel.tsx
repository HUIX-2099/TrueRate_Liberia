"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { PieChart } from "lucide-react"
import { cn } from "@/lib/utils"

interface OutlookMetric {
  label: string
  value: string
  sub: string
  trend?: "up" | "down" | "flat"
}

export function EconomicOutlookPanel() {
  const [inflationYoY, setInflationYoY] = useState<number | null>(null)
  const [rate, setRate] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch("/api/liberia-cpi").then((r) => r.json()),
      fetch("/api/rates/live", { cache: "no-store" }).then((r) => r.json()),
    ])
      .then(([cpiData, rateData]) => {
        if (cancelled) return
        if (typeof cpiData?.inflationYoY === "number") setInflationYoY(cpiData.inflationYoY)
        if (typeof rateData?.rate === "number") setRate(rateData.rate)
      })
      .catch(() => {})

    return () => { cancelled = true }
  }, [])

  const metrics: OutlookMetric[] = [
    {
      label: "GDP growth (est.)",
      value: "2.5–3.5%",
      sub: "FY 2024–25",
      trend: "up",
    },
    {
      label: "Inflation (YoY)",
      value: inflationYoY != null ? `${inflationYoY.toFixed(1)}%` : "—",
      sub: "LISGIS / CBL",
      trend: inflationYoY != null && inflationYoY > 6 ? "up" : "flat",
    },
    {
      label: "USD/LRD",
      value: rate != null ? rate.toFixed(2) : "—",
      sub: "Spot",
      trend: "flat",
    },
  ]

  return (
    <Card className="rounded-xl border-border/60 bg-card shadow-[var(--shadow-institutional)]">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-3">
          <PieChart className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Economic outlook summary
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-lg border border-border/50 bg-muted/30 dark:bg-muted/20 p-2.5 sm:p-3 min-w-0"
            >
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider truncate">
                {m.label}
              </p>
              <p className="tabular-nums font-mono font-bold text-sm sm:text-base mt-0.5 text-foreground">
                {m.value}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{m.sub}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed border-t border-border/50 pt-3">
          Liberia’s economy remains dependent on commodity exports and remittances. FX stability is a policy priority; 
          inflation has moderated from peaks. Structural reforms and investment in energy and infrastructure support 
          medium-term growth. Data: CBL, LISGIS, IMF, World Bank.
        </p>
      </CardContent>
    </Card>
  )
}
