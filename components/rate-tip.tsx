"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { Lightbulb } from "lucide-react"
import { useMemo, useState, useEffect } from "react"

const TIP_KEYS = [
  "rateTip.strongerLrd",
  "rateTip.rateMeaning",
  "rateTip.marketVsOfficial",
] as const

export interface RateTipProps {
  /** Optional: fix which tip to show (0-based index). If not set, picks by day after mount to avoid hydration mismatch. */
  index?: number
  className?: string
}

export function RateTip({ index, className = "" }: RateTipProps) {
  const { t } = useLanguage()
  const [dayIndex, setDayIndex] = useState<number | null>(null)
  useEffect(() => {
    setDayIndex(new Date().getDate() % TIP_KEYS.length)
  }, [])
  const tipKey = useMemo(() => {
    if (typeof index === "number" && index >= 0 && index < TIP_KEYS.length) return TIP_KEYS[index]
    if (dayIndex !== null) return TIP_KEYS[dayIndex]
    return TIP_KEYS[0]
  }, [index, dayIndex])
  const text = t(tipKey)
  if (!text || text === tipKey) return null
  return (
    <p className={`text-xs text-muted-foreground flex items-center gap-1.5 ${className}`} role="note">
      <Lightbulb className="h-3.5 w-3.5 shrink-0 text-amber-500/80" aria-hidden />
      <span>{text}</span>
    </p>
  )
}
