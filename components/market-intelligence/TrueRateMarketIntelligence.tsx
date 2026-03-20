"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react"

interface InsightItem {
  title: string
  summary: string
  direction: "up" | "down" | "stable"
  category: string
}

const FALLBACK_INSIGHTS: InsightItem[] = [
  {
    title: "USD/LRD spread narrowing",
    summary: "The gap between street and official rates has tightened over the past week, signaling improved liquidity in the forex market.",
    direction: "down",
    category: "FX",
  },
  {
    title: "Rice prices stable",
    summary: "25kg bag prices have held steady across Monrovia markets for 3 consecutive weeks. No supply disruptions reported.",
    direction: "stable",
    category: "Commodities",
  },
  {
    title: "Fuel costs edge higher",
    summary: "Gasoline prices rose 2.1% this week following global crude increases and port congestion delays.",
    direction: "up",
    category: "Energy",
  },
  {
    title: "Construction materials steady",
    summary: "Cement and zinc sheet prices remain flat. Seasonal demand expected to rise in Q2.",
    direction: "stable",
    category: "Construction",
  },
]

function DirectionBadge({ direction }: { direction: InsightItem["direction"] }) {
  if (direction === "up")
    return (
      <Badge variant="outline" className="text-[10px] gap-1 border-red-500/30 text-red-600 bg-red-500/5">
        <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" /> Rising
      </Badge>
    )
  if (direction === "down")
    return (
      <Badge variant="outline" className="text-[10px] gap-1 border-green-500/30 text-green-600 bg-green-500/5">
        <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" /> Falling
      </Badge>
    )
  return (
    <Badge variant="outline" className="text-[10px] gap-1 border-muted-foreground/30 text-muted-foreground">
      <Minus className="h-3 w-3 text-muted-foreground" /> Stable
    </Badge>
  )
}

export function TrueRateMarketIntelligence() {
  const [insights, setInsights] = useState<InsightItem[]>(FALLBACK_INSIGHTS)
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const res = await fetch("/api/market-intelligence/input-data")
        if (res.ok) {
          const data = await res.json()
          if (!cancelled && Array.isArray(data?.insights) && data.insights.length > 0) {
            setInsights(data.insights)
          }
          setLastUpdated(data?.timestamp ?? new Date().toISOString())
        }
      } catch {
        // keep fallback
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return (
    <Card id="truerate-market-intelligence" className="border-border/40 rounded-2xl shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted/40 border border-border/40 shrink-0">
              <Lightbulb className="h-4.5 w-4.5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Weekly Market Insights</CardTitle>
              <CardDescription className="mt-0.5">
                Auto-generated intelligence from TrueRate data
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {loading && <RefreshCw className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
            {lastUpdated && (
              <span className="text-[10px] text-muted-foreground hidden sm:inline">
                {new Date(lastUpdated).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {insights.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-border/40 p-3 space-y-2 hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-semibold text-foreground leading-snug">{item.title}</span>
                <DirectionBadge direction={item.direction} />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.summary}</p>
              <Badge variant="secondary" className="text-[10px]">{item.category}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
