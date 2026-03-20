"use client"

import { AlertTriangle, ArrowRight, X } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

const BANNER_DISMISS_KEY = "truerate-crisis-banner-dismissed"

export function CrisisAlertBanner() {
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem(BANNER_DISMISS_KEY)
    if (!stored) queueMicrotask(() => setDismissed(false))
  }, [])

  const dismiss = () => {
    setDismissed(true)
    sessionStorage.setItem(BANNER_DISMISS_KEY, "1")
  }

  if (dismissed) return null

  return (
    <div className="bg-destructive text-white px-4 py-2.5 relative min-w-0 overflow-hidden">
      <div className="container mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-sm min-w-0">
        <AlertTriangle className="h-4 w-4 shrink-0 animate-pulse text-amber-600 dark:text-amber-400" />
        <span className="font-medium text-center sm:text-left">
          Fuel price hike detected — prices rising across Liberia
        </span>
        <Link
          href="/crisis"
          className="inline-flex items-center gap-1 font-bold underline underline-offset-2 hover:no-underline shrink-0 min-h-[44px] py-2"
        >
          Crisis Dashboard <ArrowRight className="h-3 w-3 text-muted-foreground" />
        </Link>
        <button
          onClick={dismiss}
          className="absolute right-1 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-white/10 rounded transition-colors touch-manipulation"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}
