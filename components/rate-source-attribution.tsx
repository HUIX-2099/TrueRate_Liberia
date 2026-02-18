"use client"

import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

export interface RateSourceAttributionProps {
  /** Source names (e.g. ["Central Bank of Liberia"] or ["ExchangeRate API", "Open Exchange Rates"]) */
  sources: string[]
  /** ISO timestamp of last update */
  timestamp?: string
  /** CBL official rate when available — show alongside composite for comparison */
  cblRate?: number | null
  /** CBL rate date from source (ISO); shown as "CBL rate updated [date]" */
  cblLastUpdated?: string | null
  /** Composite/display rate (to show "TrueRate" vs "CBL") */
  compositeRate?: number
  /** Compact layout for small spaces */
  compact?: boolean
  /** Hide the "Sources: …" line (e.g. on hero) */
  hideSources?: boolean
  className?: string
}

function formatTime(iso: string): string {
  if (!iso) return ""
  try {
    const d = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60_000)
    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
  } catch {
    return ""
  }
}

export function RateSourceAttribution({
  sources,
  timestamp = "",
  cblRate = null,
  cblLastUpdated,
  compositeRate,
  compact = false,
  hideSources = false,
  className = "",
}: RateSourceAttributionProps) {
  const sourceLabel = sources.length === 0
    ? "Multiple sources"
    : sources.length === 1
      ? sources[0]
      : `${sources.length} sources`

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={`inline-flex items-center gap-1.5 text-xs text-muted-foreground cursor-help ${className}`}>
              <Info className="h-3.5 w-3.5" />
              {sourceLabel}
              {timestamp ? ` · ${formatTime(timestamp)}` : ""}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p className="font-medium">Rate sources</p>
            <p className="text-xs mt-1">{sources.length ? sources.join(", ") : "Aggregated from multiple APIs"}</p>
            {timestamp && <p className="text-xs mt-1">Updated: {formatTime(timestamp)}</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  const hasCbl = cblRate != null && Number.isFinite(cblRate) && cblRate > 0
  const hasComposite = compositeRate != null && Number.isFinite(compositeRate) && compositeRate > 0
  const spread = hasCbl && hasComposite ? compositeRate - cblRate : null

  return (
    <div className={`space-y-1 ${className}`}>
      {!hideSources && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Sources:</span>
          {sources.length > 0 ? (
            sources.length <= 2 ? (
              sources.map((s) => (
                <Badge key={s} variant="secondary" className="text-xs font-normal">
                  {s}
                </Badge>
              ))
            ) : (
              <Badge variant="secondary" className="text-xs font-normal">
                {sources.length} sources
              </Badge>
            )
          ) : (
            <span className="text-xs text-muted-foreground">Aggregated</span>
          )}
        </div>
      )}
      {spread != null && (
        <p className="text-xs text-muted-foreground">
          Spread: {spread >= 0 ? "+" : ""}{spread.toFixed(2)} LRD. The gap between official and what changers actually trade. We show both so you see the full picture.
        </p>
      )}
      {timestamp && (
        <p className="text-xs text-muted-foreground">Last updated: {formatTime(timestamp)}</p>
      )}
    </div>
  )
}
