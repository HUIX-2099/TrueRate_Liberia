"use client"

import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"

export function LiveUpdateIndicator() {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    setLastUpdate(new Date())
    const interval = setInterval(
      () => {
        setIsUpdating(true)
        setTimeout(() => {
          setLastUpdate(new Date())
          setIsUpdating(false)
        }, 1000)
      },
      5 * 60 * 1000,
    ) // 5 minutes

    return () => clearInterval(interval)
  }, [])

  const [timeSinceUpdate, setTimeSinceUpdate] = useState<number | null>(null)
  useEffect(() => {
    if (!lastUpdate) return
    function tick() { setTimeSinceUpdate(Math.floor((Date.now() - lastUpdate!.getTime()) / 1000 / 60)) }
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [lastUpdate])

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <RefreshCw className={`h-3 w-3 ${isUpdating ? "animate-spin text-primary" : ""}`} />
      <span className="hidden sm:inline">
        Live • Updated{" "}
        {timeSinceUpdate === null
          ? "just now"
          : timeSinceUpdate === 0
            ? "just now"
            : `${timeSinceUpdate}m ago`}
      </span>
      <span className="inline sm:hidden">Live</span>
    </div>
  )
}
