"use client"

import { useState } from "react"
import { useLiveRate } from "@/lib/live-rate-context"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export function ClearCacheButton() {
  const { clearRateCache } = useLiveRate()
  const [refreshing, setRefreshing] = useState(false)

  const handleClick = async () => {
    setRefreshing(true)
    try {
      await clearRateCache()
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-muted-foreground hover:text-foreground h-auto py-1 px-2 text-sm font-normal"
      onClick={handleClick}
      disabled={refreshing}
      aria-label="Clear cache and refresh rates"
    >
      <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
      {refreshing ? "Refreshing…" : "Clear cache & refresh"}
    </Button>
  )
}
