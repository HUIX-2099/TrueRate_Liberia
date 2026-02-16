"use client"

import { useMemo, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

const STALE_MS = 2 * 60 * 60 * 1000 // 2 hours

export interface StaleRateWarningProps {
  /** ISO timestamp of last successful rate fetch */
  timestamp: string
  /** Callback to refresh the rate */
  onRefresh: () => Promise<void>
  /** Optional: show compact inline message instead of full alert */
  compact?: boolean
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

export function StaleRateWarning({ timestamp, onRefresh, compact = false, className = "" }: StaleRateWarningProps) {
  const isStale = useIsStale(timestamp)
  const [refreshing, setRefreshing] = useState(false)
  if (!isStale) return null

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setRefreshing(false)
    }
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-2 text-amber-600 dark:text-amber-500 text-xs ${className}`}>
        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
        <span>Rate may be outdated. </span>
        <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? "Refreshing…" : "Refresh"}
        </Button>
      </div>
    )
  }

  return (
    <Alert variant="default" className={`border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
      <AlertTitle className="text-amber-800 dark:text-amber-400">Rate may be outdated</AlertTitle>
      <AlertDescription className="flex flex-wrap items-center gap-2">
        <span>Last update was over 2 hours ago. Connect to the internet and refresh for the latest rate.</span>
        <Button size="sm" variant="outline" className="gap-1.5 mt-1" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing…" : "Refresh rate"}
        </Button>
      </AlertDescription>
    </Alert>
  )
}
