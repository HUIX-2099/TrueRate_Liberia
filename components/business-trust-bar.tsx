"use client"

import { useEffect, useState } from "react"
import { RefreshCw, Users } from "lucide-react"
import { LiveRateBlock } from "@/components/live-rate-block"
import { GovernmentSourceBadge } from "@/components/government-source-badge"

/** Format "Xm ago" / "Just now" for last update */
function formatTimeAgo(iso: string): string {
  if (!iso) return "Just now"
  try {
    const d = new Date(iso)
    const diffMs = Date.now() - d.getTime()
    const diffMins = Math.floor(diffMs / 60_000)
    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
  } catch {
    return "Just now"
  }
}

export function BusinessTrustBar() {
  const [rate, setRate] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>("")

  useEffect(() => {
    let mounted = true
    function fetchRate() {
      fetch("/api/rates/live")
        .then((res) => res.json())
        .then((data) => {
          if (!mounted) return
          if (data?.rate != null && typeof data.rate === "number") {
            setRate(data.rate)
            setLastUpdated(data.timestamp ?? data.market?.timestamp ?? data.updated ?? new Date().toISOString())
          }
          setLoading(false)
        })
        .catch(() => mounted && (setLoading(false), setRate(null)))
    }
    fetchRate()
    const interval = setInterval(fetchRate, 60_000)
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  return (
    <div
      role="region"
      aria-label="Live rate and trust information"
      className="border-y border-border/60 bg-muted/30 dark:bg-muted/20"
    >
      <div className="container mx-auto min-w-0 px-4 sm:px-6 max-w-6xl">
        {/* Mobile-first: stacked so rate is first, then source/updated/trust in one readable block */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-x-6 sm:gap-y-4 py-3 sm:py-5 text-center sm:text-left">
          {/* Live rate: primary on mobile */}
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
            <LiveRateBlock
              rate={rate}
              loading={loading}
              timestamp={lastUpdated || undefined}
              variant="compact"
            />
          </div>

          {/* Data source: institutional trust */}
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="text-xs text-muted-foreground uppercase tracking-wider mr-1">
              Data:
            </span>
            <GovernmentSourceBadge source="cbl" />
            <span className="text-muted-foreground/60" aria-hidden>&</span>
            <GovernmentSourceBadge source="market" />
          </div>

          {lastUpdated && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <RefreshCw className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
              <span>Updated {formatTimeAgo(lastUpdated)}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <Users className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span className="tabular-nums">25,000+ business users</span>
          </div>
        </div>
      </div>
    </div>
  )
}
