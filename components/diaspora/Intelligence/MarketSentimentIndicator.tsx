"use client"

import { Activity } from "lucide-react"
import { StatusBadge } from "@/components/ui/status-badge"
import { cn } from "@/lib/utils"

export type SentimentVariant = "stable" | "watch" | "volatile"

export interface MarketSentimentIndicatorProps {
  sentiment: SentimentVariant
  size?: "sm" | "md"
  className?: string
  /** Official vs street spread % when both are known */
  spreadPct?: number | null
}

const LABELS: Record<SentimentVariant, string> = {
  stable: "Stable",
  watch: "Watch",
  volatile: "Volatile",
}

const BLURBS: Record<SentimentVariant, string> = {
  stable:
    "Street and official rates are close—fewer nasty surprises when you budget or send money.",
  watch:
    "The gap is widening—worth double-checking quotes before large transfers or tuition payments.",
  volatile:
    "Spreads are wide—vendors and changers may quote very different numbers from hour to hour.",
}

export function MarketSentimentIndicator({
  sentiment,
  size = "md",
  className,
  spreadPct,
}: MarketSentimentIndicatorProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-card p-4 shadow-[var(--shadow-institutional)] relative overflow-hidden",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/[0.06] blur-2xl"
        aria-hidden
      />
      <div className="relative flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/40 border border-border/40">
          <Activity className="h-4 w-4 text-primary" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Market sentiment
          </p>
          <StatusBadge label={LABELS[sentiment]} variant={sentiment} size={size} />
          {spreadPct != null && Number.isFinite(spreadPct) ? (
            <p className="text-xs font-medium tabular-nums text-foreground/90">
              Street vs official:{" "}
              <span className={spreadPct > 0 ? "text-amber-600 dark:text-amber-400" : ""}>
                {spreadPct > 0 ? "+" : ""}
                {spreadPct.toFixed(1)}%
              </span>
            </p>
          ) : null}
          <p className="text-xs text-muted-foreground leading-relaxed">{BLURBS[sentiment]}</p>
        </div>
      </div>
    </div>
  )
}
