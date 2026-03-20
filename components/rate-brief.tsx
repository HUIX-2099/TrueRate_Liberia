"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useLanguage } from "@/lib/i18n/language-context"
import { HelpCircle } from "lucide-react"

export interface RateBriefProps {
  /** Optional: week-over-week % change (e.g. 1.5 or -0.8) to show a short "this week" fact */
  weekChangePercent?: number | null
  /** Inline/card layout: trigger looks like a link; card shows as a small section */
  variant?: "inline" | "card"
  className?: string
}

export function RateBrief({ weekChangePercent = null, variant = "inline", className = "" }: RateBriefProps) {
  const { t } = useLanguage()

  const triggerLabel = t("rateBrief.trigger")
  const title = t("rateBrief.title")
  const cbl = t("rateBrief.cbl")
  const demand = t("rateBrief.demand")
  const seasonality = t("rateBrief.seasonality")
  const footer = t("rateBrief.footer")
  const thisWeekUp = t("rateBrief.thisWeekUp")
  const thisWeekDown = t("rateBrief.thisWeekDown")

  const hasWeekChange = weekChangePercent != null && !Number.isNaN(weekChangePercent)
  const weekUp = hasWeekChange && weekChangePercent! > 0
  const weekDown = hasWeekChange && weekChangePercent! < 0

  const content = (
    <PopoverContent align={variant === "card" ? "start" : "center"} className="w-80 sm:w-96">
      <p className="font-medium text-sm mb-2">{title}</p>
      <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
        <li>{cbl}</li>
        <li>{demand}</li>
        <li>{seasonality}</li>
      </ul>
      {hasWeekChange && (
        <p className="text-xs mt-3 pt-2 border-t border-border">
          {weekUp && thisWeekUp.replace("{pct}", Math.abs(weekChangePercent!).toFixed(1))}
          {weekDown && thisWeekDown.replace("{pct}", Math.abs(weekChangePercent!).toFixed(1))}
        </p>
      )}
      <p className="text-xs text-muted-foreground mt-2">{footer}</p>
    </PopoverContent>
  )

  if (variant === "card") {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={`flex items-center gap-2 text-left w-full rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors ${className}`}
          >
            <HelpCircle className="h-4 w-4 shrink-0 /70 text-primary" />
            <span>{triggerLabel}</span>
          </button>
        </PopoverTrigger>
        {content}
      </Popover>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-help underline-offset-2 hover:underline ${className}`}
        >
          <HelpCircle className="h-3.5 w-3.5 text-primary" />
          {triggerLabel}
        </button>
      </PopoverTrigger>
      {content}
    </Popover>
  )
}
