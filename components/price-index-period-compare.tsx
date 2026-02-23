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
      <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-medium">
        <TrendingUp className="h-4 w-4" />
        +{percent}%
      </span>
    )
  }
  if (percent < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
        <TrendingDown className="h-4 w-4" />
        {percent}%
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-muted-foreground font-medium">
      <Minus className="h-4 w-4" />
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
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Period comparison
          </CardTitle>
          <CardDescription>Same basket as Price Index (essential goods)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-[72px] rounded-lg" />
            <Skeleton className="h-[72px] rounded-lg" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !data?.periodComparison) {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Period comparison
          </CardTitle>
          <CardDescription>Same basket as Price Index (essential goods)</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {data?.message ?? error ?? "No comparison data available. Try again later."}
          </p>
          <button
            type="button"
            onClick={fetchCompare}
            className="mt-2 text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
          >
            <RefreshCw className="h-3.5 w-3.5" />
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
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          Period comparison
        </CardTitle>
        <CardDescription>
          {comp.basketLabel}. Based on basket average (LRD) over the period.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {weekLabel && comp.weekOverWeekPercent != null && (
            <div className="rounded-lg border border-border/60 bg-muted/20 dark:bg-muted/30 p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                This week vs last week
              </p>
              <p className="text-2xl font-bold tabular-nums">
                <ChangeBadge percent={comp.weekOverWeekPercent} />
              </p>
              {comp.thisWeekAvg != null && comp.lastWeekAvg != null && (
                <p className="text-xs text-muted-foreground mt-1">
                  Avg LRD {comp.thisWeekAvg.toLocaleString(undefined, { maximumFractionDigits: 0 })} vs{" "}
                  {comp.lastWeekAvg.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              )}
            </div>
          )}
          {monthLabel && comp.monthOverMonthPercent != null && (
            <div className="rounded-lg border border-border/60 bg-muted/20 dark:bg-muted/30 p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                This month vs last month
              </p>
              <p className="text-2xl font-bold tabular-nums">
                <ChangeBadge percent={comp.monthOverMonthPercent} />
              </p>
              {comp.thisMonthAvg != null && comp.lastMonthAvg != null && (
                <p className="text-xs text-muted-foreground mt-1">
                  Avg LRD {comp.thisMonthAvg.toLocaleString(undefined, { maximumFractionDigits: 0 })} vs{" "}
                  {comp.lastMonthAvg.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
