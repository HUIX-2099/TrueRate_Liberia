"use client"

import { cn } from "@/lib/utils"

export interface DataCardProps {
  /** Short label above value (e.g. "Latest CPI", "Inflation YoY") */
  label: string
  /** Main value (number, string, or node) — use tabular-nums for numbers */
  value: React.ReactNode
  /** Optional caption below value (e.g. period, "LRD per 1 USD") */
  subtext?: string
  /** Optional trend: "up" | "down" | "neutral" for color only */
  trend?: "up" | "down" | "neutral"
  /** Optional icon (left of label or above) */
  icon?: React.ReactNode
  /** Optional source badge (e.g. GovernmentSourceBadge) */
  sourceBadge?: React.ReactNode
  /** Elevation: default uses institutional shadow */
  elevation?: "flat" | "default" | "raised"
  className?: string
  children?: React.ReactNode
}

const elevationClasses = {
  flat: "",
  default: "shadow-institutional transition-institutional hover:shadow-institutional-hover",
  raised: "shadow-institutional-raised",
}

export function DataCard({
  label,
  value,
  subtext,
  trend,
  icon,
  sourceBadge,
  elevation = "default",
  className,
  children,
}: DataCardProps) {
  const trendColor =
    trend === "up"
      ? "text-destructive"
      : trend === "down"
        ? "text-secondary"
        : ""

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card overflow-hidden min-w-0",
        elevationClasses[elevation],
        className
      )}
    >
      <div className="p-4 sm:p-5 md:p-6">
        <div className="flex flex-col gap-2 sm:gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {icon && (
                <span
                  className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-muted/40 border border-border/40 text-primary"
                  aria-hidden
                >
                  {icon}
                </span>
              )}
              <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                {label}
              </span>
            </div>
            {sourceBadge}
          </div>
          <div className={cn("tabular-nums", trendColor)}>
            {typeof value === "string" || typeof value === "number" ? (
              <span className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
                {value}
              </span>
            ) : (
              value
            )}
          </div>
          {subtext && (
            <p className="text-xs text-muted-foreground">{subtext}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}
