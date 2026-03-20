"use client"

import { cn } from "@/lib/utils"

export interface LiveRateBlockProps {
  /** Current rate (LRD per 1 USD) */
  rate: number | null
  loading?: boolean
  /** ISO timestamp for "Updated X ago" */
  timestamp?: string | null
  /** Compact: single line; default: larger display with label */
  variant?: "default" | "compact"
  /** Optional unit label */
  unitLabel?: string
  className?: string
}

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

export function LiveRateBlock({
  rate,
  loading = false,
  timestamp,
  variant = "default",
  unitLabel = "LRD per 1 USD",
  className,
}: LiveRateBlockProps) {
  const displayRate =
    loading || rate == null ? "—" : rate.toFixed(2)
  const timeAgo = timestamp ? formatTimeAgo(timestamp) : null

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 flex-wrap",
          className
        )}
        role="region"
        aria-label="Live exchange rate"
      >
        <span
          className="live-dot-ping relative flex h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500"
          aria-hidden
        >
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70 motion-reduce:animate-none motion-reduce:opacity-0" />
        </span>
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Live
        </span>
        <span
          className="text-base sm:text-lg font-bold tabular-nums text-foreground"
          aria-live="polite"
          aria-busy={loading}
        >
          {loading ? "—" : `1 USD = ${displayRate} LRD`}
        </span>
        {timeAgo && (
          <span className="text-xs text-muted-foreground">
            · {timeAgo}
          </span>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "rounded-xl sm:rounded-2xl border border-border/50 bg-card p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow",
        className
      )}
      role="region"
      aria-label="Live exchange rate"
    >
      <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
        <span
          className="live-dot-ping relative flex h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500"
          aria-hidden
        >
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70 motion-reduce:animate-none motion-reduce:opacity-0" />
        </span>
        <span className="text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Live Rate
        </span>
      </div>
      <div
        className="text-2xl sm:text-3xl font-bold tabular-nums text-foreground tracking-tight"
        aria-live="polite"
        aria-busy={loading}
      >
        {displayRate}
      </div>
      <p className="text-xs sm:text-sm text-muted-foreground mt-1">{unitLabel}</p>
      {timeAgo && (
        <p className="text-[11px] sm:text-xs text-muted-foreground mt-2">
          Updated {timeAgo}
        </p>
      )}
    </div>
  )
}
