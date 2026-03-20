"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, TrendingDown, Minus, Calendar, RefreshCw, BarChart3 } from "lucide-react"

interface PeriodComparison {
  thisMonthAvg?: number
  lastMonthAvg?: number
  monthOverMonthPercent: number | null
  latestDate: string
  basketLabel: string
}

interface CompareData {
  periodComparison: PeriodComparison | null
  message?: string
}

interface CpiData {
  momChange?: number | null
  referenceMonth?: string | null
}

export function InflationMoMComparison({
  cpiMomChange,
  cpiReferenceMonth,
}: {
  cpiMomChange?: number | null
  cpiReferenceMonth?: string | null
}) {
  const [compare, setCompare] = useState<CompareData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch("/api/price-index/compare?days=60")
      .then((res) => res.json())
      .then((json: CompareData) => {
        if (!cancelled) setCompare(json)
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const pc = compare?.periodComparison
  const momPercent = pc?.monthOverMonthPercent ?? null
  const cpiMom = cpiMomChange != null ? Number(cpiMomChange) : null

  if (loading && momPercent === undefined && cpiMom === undefined) {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Inflation comparison (month-to-month)
          </CardTitle>
          <CardDescription>This month vs last month</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Inflation comparison (month-to-month)
        </CardTitle>
        <CardDescription>
          Basket and official CPI — is the cost of living going up or down?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {momPercent !== null && (
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                Essential basket (MoM)
              </div>
              <div className="mt-2 flex items-center gap-2">
                {momPercent > 0 && <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />}
                {momPercent < 0 && <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />}
                {momPercent === 0 && <Minus className="h-5 w-5 text-muted-foreground" />}
                <span
                  className={
                    momPercent > 0
                      ? "text-lg font-semibold text-red-600 dark:text-red-400"
                      : momPercent < 0
                        ? "text-lg font-semibold text-green-600 dark:text-green-400"
                        : "text-lg font-semibold text-muted-foreground"
                  }
                >
                  {momPercent > 0 ? "+" : ""}
                  {momPercent}%
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{pc?.basketLabel}</p>
            </div>
          )}
          {cpiMom !== null && (
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <BarChart3 className="h-4 w-4 text-primary" />
                Official CPI (MoM)
              </div>
              <div className="mt-2 flex items-center gap-2">
                {cpiMom > 0 && <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />}
                {cpiMom < 0 && <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />}
                {cpiMom === 0 && <Minus className="h-5 w-5 text-muted-foreground" />}
                <span
                  className={
                    cpiMom > 0
                      ? "text-lg font-semibold text-red-600 dark:text-red-400"
                      : cpiMom < 0
                        ? "text-lg font-semibold text-green-600 dark:text-green-400"
                        : "text-lg font-semibold text-muted-foreground"
                  }
                >
                  {cpiMom > 0 ? "+" : ""}
                  {cpiMom}%
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{cpiReferenceMonth ?? "Latest period"}</p>
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-muted-foreground">{error}</p>
        )}
      </CardContent>
    </Card>
  )
}
