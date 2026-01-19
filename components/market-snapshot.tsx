"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingDown, TrendingUp } from "lucide-react"

interface MarketSnapshotProps {
  rate: number
  updatedAt: string
}

export function MarketSnapshot({ rate, updatedAt }: MarketSnapshotProps) {
  const [previousRate, setPreviousRate] = useState<number | null>(null)

  useEffect(() => {
    const stored = window.localStorage.getItem("liberia-market-rate")
    const storedValue = stored ? Number.parseFloat(stored) : null
    if (!Number.isNaN(storedValue) && storedValue !== null) {
      setPreviousRate(storedValue)
    }
    window.localStorage.setItem("liberia-market-rate", rate.toString())
  }, [rate])

  const trend = previousRate === null ? 0 : rate - previousRate
  const TrendIcon = trend >= 0 ? TrendingUp : TrendingDown
  const trendLabel = previousRate === null ? "No prior data" : `${trend >= 0 ? "+" : ""}${trend.toFixed(2)}`

  return (
    <Card className="border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle className="text-lg">Liberia Market Snapshot</CardTitle>
        <Badge variant="secondary">Live FX</Badge>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="text-3xl font-bold text-primary">1 USD = {rate.toFixed(2)} LRD</div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>Updated {updatedAt}</span>
          <span className="inline-flex items-center gap-1">
            <TrendIcon className="h-4 w-4" />
            {trendLabel} vs last visit
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
