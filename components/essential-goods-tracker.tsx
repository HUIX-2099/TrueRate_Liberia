"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Sparkline } from "@/components/invest/sparkline"
import { Wheat, Fuel, Car, ShoppingCart, RefreshCw } from "lucide-react"

interface TrackerItem {
  key: string
  name: string
  priceLRD: number
  series: Array<{ weekEnding: string; value: number }>
}

interface TrackerCategory {
  label: string
  items: TrackerItem[]
}

interface TrackerData {
  rate: number
  categories: {
    rice: TrackerCategory
    fuel: TrackerCategory
    transport: TrackerCategory
    basicGoods: TrackerCategory
  }
  updatedAt: string
}

const categoryMeta: Record<string, { icon: React.ReactNode; accent: string }> = {
  rice: { icon: <Wheat className="h-5 w-5 text-primary" />, accent: "bg-muted/40 border border-border/40 border-amber-500/20" },
  fuel: { icon: <Fuel className="h-5 w-5 text-primary" />, accent: "bg-muted/40 border border-border/40 border-orange-500/20" },
  transport: { icon: <Car className="h-5 w-5 text-primary" />, accent: "bg-muted/40 border border-border/40 border-blue-500/20" },
  basicGoods: { icon: <ShoppingCart className="h-5 w-5 text-primary" />, accent: "bg-muted/40 border border-border/40 border-emerald-500/20" },
}

function formatLRD(n: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n) + " LRD"
}

export function EssentialGoodsTracker() {
  const [data, setData] = useState<TrackerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/price-index/tracker")
      if (!res.ok) throw new Error("Failed to load tracker")
      const json = await res.json()
      setData(json)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load tracker")
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <Card className="relative border-border/50 rounded-2xl shadow-sm bg-card/80 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/30" aria-hidden />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Essential goods tracker</CardTitle>
          <CardDescription>Rice, fuel, transport &amp; basic goods — weekly view</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card className="relative border-border/50 rounded-2xl shadow-sm bg-card/80 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/30" aria-hidden />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Essential goods tracker</CardTitle>
          <CardDescription>Rice, fuel, transport &amp; basic goods</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error ?? "No data"}</p>
          <button
            type="button"
            onClick={fetchData}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
            Retry
          </button>
        </CardContent>
      </Card>
    )
  }

  const categories = [
    { id: "rice", ...data.categories.rice },
    { id: "fuel", ...data.categories.fuel },
    { id: "transport", ...data.categories.transport },
    { id: "basicGoods", ...data.categories.basicGoods },
  ]

  return (
    <Card className="relative border-border/50 rounded-2xl shadow-sm bg-card/80 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/30" aria-hidden />
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              Essential goods tracker
            </CardTitle>
            <CardDescription className="text-sm mt-0.5">
              Rice, fuel, transport &amp; basic goods — compare to market and see weekly trend
            </CardDescription>
          </div>
          <button
            type="button"
            onClick={fetchData}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
            Refresh
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {categories.map((cat) => {
          const meta = categoryMeta[cat.id] ?? categoryMeta.basicGoods
          return (
            <div key={cat.id}>
              <h3 className="mb-3 flex items-center gap-2.5 text-sm font-semibold text-foreground">
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg border ${meta.accent}`}>
                  {meta.icon}
                </span>
                {cat.label}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cat.items.map((item) => (
                  <div
                    key={item.key}
                    className="flex flex-col rounded-xl border border-border/50 bg-muted/20 dark:bg-muted/10 p-4 transition-colors hover:border-primary/20 hover:bg-muted/30"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-medium leading-tight text-foreground">{item.name}</span>
                      <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                        {formatLRD(item.priceLRD)}
                      </span>
                    </div>
                    <div className="mt-3 h-10">
                      <Sparkline
                        data={item.series.map((p) => ({ value: p.value }))}
                        color="var(--primary)"
                        height={40}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
