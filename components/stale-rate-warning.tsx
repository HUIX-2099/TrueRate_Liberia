"use client"

import { useMemo, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Trash2 } from "lucide-react"
import { useLiveRate } from "@/lib/live-rate-context"

const STALE_MS = 2 * 60 * 60 * 1000 // 2 hours

export interface StaleRateWarningProps {
  /** ISO timestamp of last successful rate fetch */
  timestamp: string
  /** Callback to refresh the rate */
  onRefresh: () => Promise<void>
  /** Optional: show compact inline message instead of full alert */
  compact?: boolean
  /** Optional: show "Clear cache & refresh" button to clear all rate caches and fetch fresh data */
  showClearCache?: boolean
  className?: string
}

function getAgeMs(iso: string): number | null {
  if (!iso) return null
  try {
    return Date.now() - new Date(iso).getTime()
  } catch {
    return null
  }
}

export function useIsStale(timestamp: string): boolean {
  return useMemo(() => {
    const age = getAgeMs(timestamp)
    return age != null && age > STALE_MS
  }, [timestamp])
}

export function StaleRateWarning({ timestamp, onRefresh, compact = false, showClearCache = true, className = "" }: StaleRateWarningProps) {
  const isStale = useIsStale(timestamp)
  const [refreshing, setRefreshing] = useState(false)
  const { clearRateCache } = useLiveRate()

  if (!isStale) return null

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setRefreshing(false)
    }
  }

  const handleClearCacheAndRefresh = async () => {
    setRefreshing(true)
    try {
      await clearRateCache()
    } finally {
      setRefreshing(false)
    }
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-2 text-amber-600 dark:text-amber-500 text-xs ${className}`}>
        <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
        <span>Rate may be outdated. </span>
        <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? "Refreshing…" : "Refresh"}
        </Button>
        {showClearCache && (
          <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={handleClearCacheAndRefresh} disabled={refreshing}>
            Clear cache & refresh
          </Button>
        )}
      </div>
    )
  }

  return (
    <Alert variant="default" className={`border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertTitle className="text-amber-800 dark:text-amber-400">Rate may be outdated</AlertTitle>
      <AlertDescription className="flex flex-wrap items-center gap-2">
        <span>Last update was over 2 hours ago. Connect to the internet and refresh for the latest rate.</span>
        <div className="flex flex-wrap gap-2 mt-1">
          <Button size="sm" variant="outline" className="gap-1.5" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing…" : "Refresh rate"}
          </Button>
          {showClearCache && (
            <Button size="sm" variant="secondary" className="gap-1.5" onClick={handleClearCacheAndRefresh} disabled={refreshing}>
              <Trash2 className="h-3.5 w-3.5 text-primary" />
              Clear cache & refresh
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  )
}
