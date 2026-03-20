"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingDown, TrendingUp } from "lucide-react"

interface MarketSnapshotProps {
  rate: number
  updatedAt: string
}

function getStoredPreviousRate(): number | null {
  if (typeof window === "undefined") return null
  const stored = window.localStorage.getItem("liberia-market-rate")
  const storedValue = stored ? Number.parseFloat(stored) : null
  return !Number.isNaN(storedValue) && storedValue !== null ? storedValue : null
}

export function MarketSnapshot({ rate, updatedAt }: MarketSnapshotProps) {
  const [previousRate] = useState<number | null>(getStoredPreviousRate)

  useEffect(() => {
    window.localStorage.setItem("liberia-market-rate", rate.toString())
  }, [rate])

  const trend = previousRate === null ? 0 : rate - previousRate
  const TrendIcon = trend >= 0 ? TrendingUp : TrendingDown
  const trendLabel = previousRate === null ? "No prior data" : `${trend >= 0 ? "+" : ""}${trend.toFixed(2)}`

  return (
    <Card className="border-border/60 shadow-institutional transition-institutional hover:shadow-institutional-hover rounded-2xl min-w-0">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2 flex-wrap sm:flex-nowrap">
        <CardTitle className="text-base sm:text-lg font-semibold tracking-tight">Liberia Market Snapshot</CardTitle>
        <Badge variant="secondary" className="text-xs font-medium shrink-0">Live FX</Badge>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="text-xl sm:text-2xl md:text-3xl font-bold tabular-nums text-foreground tracking-tight">
          1 USD = {rate.toFixed(2)} LRD
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>Updated {updatedAt}</span>
          <span className="inline-flex items-center gap-1 tabular-nums">
            <TrendIcon className="h-4 w-4 shrink-0 text-primary" />
            {trendLabel} vs last visit
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
