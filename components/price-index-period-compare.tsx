"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, TrendingDown, Minus, Calendar, RefreshCw } from "lucide-react"

interface PeriodComparison {
  thisWeekAvg?: number
  lastWeekAvg?: number
  weekOverWeekPercent: number | null
  thisMonthAvg?: number
  lastMonthAvg?: number
  monthOverMonthPercent: number | null
  latestDate: string
  basketLabel: string
}

interface CompareResponse {
  priceIndexBasketId?: string
  periodComparison: PeriodComparison | null
  message?: string
}

function ChangeBadge({ percent }: { percent: number }) {
  if (percent > 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted/40 border border-border/40 px-2.5 py-1 text-red-600 dark:text-red-400 font-semibold tabular-nums">
        <TrendingUp className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
        +{percent.toFixed(2)}%
      </span>
    )
  }
  if (percent < 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted/40 border border-border/40 px-2.5 py-1 text-green-600 dark:text-green-400 font-semibold tabular-nums">
        <TrendingDown className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
        {percent.toFixed(2)}%
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 text-muted-foreground font-semibold tabular-nums">
      <Minus className="h-4 w-4 shrink-0 text-muted-foreground" />
      0%
    </span>
  )
}

export function PriceIndexPeriodCompare() {
  const [data, setData] = useState<CompareResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCompare = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/price-index/compare?days=60")
      if (!res.ok) throw new Error("Failed to fetch")
      const json: CompareResponse = await res.json()
      setData(json)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load comparison")
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompare()
  }, [])

  if (loading) {
    return (
      <Card className="relative border-border/50 rounded-2xl shadow-sm bg-card/80 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/30" aria-hidden />
        <CardHeader className="pb-2 pt-5">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Period comparison
          </CardTitle>
          <CardDescription>Basket average (LRD) over the period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !data?.periodComparison) {
    return (
      <Card className="relative border-border/50 rounded-2xl shadow-sm bg-card/80 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/30" aria-hidden />
        <CardHeader className="pb-2 pt-5">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Period comparison
          </CardTitle>
          <CardDescription>Basket average (LRD) over the period</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {data?.message ?? error ?? "No comparison data available. Try again later."}
          </p>
          <button
            type="button"
            onClick={fetchCompare}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
            Retry
          </button>
        </CardContent>
      </Card>
    )
  }

  const comp = data.periodComparison
  const weekLabel = comp.weekOverWeekPercent != null ? "This week vs last week" : null
  const monthLabel = comp.monthOverMonthPercent != null ? "This month vs last month" : null

  return (
    <Card className="relative border-border/50 rounded-2xl shadow-sm bg-card/80 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/30" aria-hidden />
      <CardHeader className="pb-2 pt-5">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          Period comparison
        </CardTitle>
        <CardDescription className="text-xs">
          {comp.basketLabel}. Based on basket average (LRD) over the period.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {weekLabel && comp.weekOverWeekPercent != null && (
            <div className="rounded-xl border border-border/50 bg-muted/20 dark:bg-muted/10 p-4">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                This week vs last week
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <ChangeBadge percent={comp.weekOverWeekPercent} />
                {comp.thisWeekAvg != null && comp.lastWeekAvg != null && (
                  <span className="text-xs text-muted-foreground tabular-nums">
                    Avg {comp.thisWeekAvg.toLocaleString(undefined, { maximumFractionDigits: 0 })} vs{" "}
                    {comp.lastWeekAvg.toLocaleString(undefined, { maximumFractionDigits: 0 })} LRD
                  </span>
                )}
              </div>
            </div>
          )}
          {monthLabel && comp.monthOverMonthPercent != null && (
            <div className="rounded-xl border border-border/50 bg-muted/20 dark:bg-muted/10 p-4">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                This month vs last month
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <ChangeBadge percent={comp.monthOverMonthPercent} />
                {comp.thisMonthAvg != null && comp.lastMonthAvg != null && (
                  <span className="text-xs text-muted-foreground tabular-nums">
                    Avg {comp.thisMonthAvg.toLocaleString(undefined, { maximumFractionDigits: 0 })} vs{" "}
                    {comp.lastMonthAvg.toLocaleString(undefined, { maximumFractionDigits: 0 })} LRD
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
