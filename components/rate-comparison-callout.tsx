"use client"

import { useState, useEffect } from "react"
import { History } from "lucide-react"

interface HistoricalPoint {
  date: string
  rate: number
}

interface RateComparisonCalloutProps {
  currentRate: number
  /** USD amount from converter - when set, shows "Your $X would have been L$Y" */
  usdAmount?: number
  /** Compact variant for inline display */
  compact?: boolean
  className?: string
}

function getClosestHistorical(
  historical: HistoricalPoint[],
  targetDaysAgo: number
): { date: string; rate: number } | null {
  if (!historical?.length) return null
  const target = new Date()
  target.setDate(target.getDate() - targetDaysAgo)
  const targetTime = target.getTime()

  let best: { date: string; rate: number } | null = null
  let bestDiff = Infinity

  for (const p of historical) {
    const d = new Date(p.date)
    const diff = Math.abs(d.getTime() - targetTime)
    if (diff < bestDiff && typeof p.rate === "number" && p.rate > 0) {
      bestDiff = diff
      best = { date: p.date, rate: p.rate }
    }
  }
  return best
}

function formatMonthsAgo(days: number): string {
  if (days <= 35) return "1 month ago"
  if (days <= 95) return "3 months ago"
  if (days <= 200) return "6 months ago"
  if (days <= 400) return "1 year ago"
  return `${Math.round(days / 30)} months ago`
}

export function RateComparisonCallout({
  currentRate,
  usdAmount,
  compact = false,
  className = "",
}: RateComparisonCalloutProps) {
  const [historical, setHistorical] = useState<HistoricalPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/rates/historical")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data?.historical)) {
          setHistorical(
            data.historical.filter(
              (p: { date?: string; rate?: number }) =>
                p?.date && typeof p.rate === "number"
            )
          )
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const pastPoint = historical.length
    ? getClosestHistorical(historical, 90) ??
      getClosestHistorical(historical, 30) ??
      getClosestHistorical(historical, 180)
    : null

  if (loading || !pastPoint || currentRate <= 0) return null

  const daysAgo = Math.round(
    (Date.now() - new Date(pastPoint.date).getTime()) / (1000 * 60 * 60 * 24)
  )
  const label = formatMonthsAgo(daysAgo)
  const pastLrd = usdAmount ? usdAmount * pastPoint.rate : null

  if (compact) {
    return (
      <div
        className={`flex items-center gap-2 text-xs text-muted-foreground ${className}`}
      >
        <History className="h-3.5 w-3.5 shrink-0" />
        <span>
          {label} the rate was {pastPoint.rate.toFixed(2)} LRD
          {pastLrd != null && usdAmount && usdAmount > 0 && (
            <>
              {" "}
              — your ${usdAmount.toLocaleString()} would have been L$
              {Math.round(pastLrd).toLocaleString()}
            </>
          )}
        </span>
      </div>
    )
  }

  return (
    <div
      className={`rounded-lg border border-border/60 bg-muted/40 p-3 text-sm ${className}`}
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <History className="h-4 w-4 shrink-0 text-primary/70" />
        <div>
          <span className="font-medium text-foreground">{label},</span> the rate
          was {pastPoint.rate.toFixed(2)} LRD
          {pastLrd != null && usdAmount && usdAmount > 0 && (
            <p className="mt-1 text-xs">
              Your ${usdAmount.toLocaleString()} would have been L$
              {Math.round(pastLrd).toLocaleString()} at that rate
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
