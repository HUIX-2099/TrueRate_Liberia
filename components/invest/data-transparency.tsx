"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Clock } from "lucide-react"

export function DataTransparency() {
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch("/api/rates/live", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/liberia-cpi", { cache: "no-store" }).then((r) => r.json()),
    ])
      .then(([rateData, cpiData]) => {
        const ts = rateData?.timestamp ?? cpiData?.updatedAt ?? null
        if (ts) {
          try {
            const d = new Date(ts)
            setLastUpdated(
              isNaN(d.getTime())
                ? null
                : d.toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
            )
          } catch {
            setLastUpdated(null)
          }
        }
      })
      .catch(() => {})
  }, [])

  return (
    <Card className="rounded-2xl border-border/60 bg-card/80 shadow-[var(--shadow-institutional)] overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/40 border border-border/40 text-primary">
            <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="font-medium text-xs rounded-lg">
                Data Aggregated from Licensed Market Sources
              </Badge>
              {lastUpdated && (
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" aria-hidden />
                  Last updated: {lastUpdated}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground text-pretty leading-relaxed">
              Rates and indices on this dashboard are sourced from the Central Bank of Liberia, licensed
              foreign-exchange providers, LISGIS, Ministry of Commerce, and other authorized market data
              providers. This page is for informational purposes only and does not constitute investment,
              legal, or tax advice. Always verify data with official sources and seek professional guidance
              for investment decisions.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
