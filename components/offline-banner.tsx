"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { WifiOff } from "lucide-react"

export interface OfflineBannerProps {
  /** Human-readable "last updated" string when showing cached rate */
  lastUpdatedLabel?: string
  className?: string
}

export function OfflineBanner({ lastUpdatedLabel = "Cached rate", className = "" }: OfflineBannerProps) {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    if (typeof navigator === "undefined") return
    const onOffline = () => setIsOffline(true)
    const onOnline = () => setIsOffline(false)
    setIsOffline(!navigator.onLine)
    window.addEventListener("offline", onOffline)
    window.addEventListener("online", onOnline)
    return () => {
      window.removeEventListener("offline", onOffline)
      window.removeEventListener("online", onOnline)
    }
  }, [])

  if (!isOffline) return null

  return (
    <Alert
      variant="default"
      className={`border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20 rounded-lg ${className}`}
    >
      <WifiOff className="h-4 w-4 text-amber-600 dark:text-amber-500" />
      <AlertDescription>
        You're offline. We're using the last saved rate. {lastUpdatedLabel ? `(${lastUpdatedLabel})` : ""} Conversions still work.
      </AlertDescription>
    </Alert>
  )
}
