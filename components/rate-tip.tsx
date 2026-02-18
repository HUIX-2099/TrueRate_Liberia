"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { Lightbulb } from "lucide-react"
import { useMemo, useState, useEffect } from "react"

const TIP_KEYS = [
  "rateTip.strongerLrd",
  "rateTip.marketVsOfficial",
] as const

export interface RateTipProps {
  /** Optional: fix which tip to show (0-based index). If not set, picks by day after mount to avoid hydration mismatch. */
  index?: number
  /** Keys to exclude from the rotation (e.g. ["rateTip.strongerLrd"] on hero) */
  excludeKeys?: string[]
  className?: string
}

export function RateTip({ index, className = "", excludeKeys = [] }: RateTipProps) {
  const { t } = useLanguage()
  const keys = useMemo(
    () => (excludeKeys.length > 0 ? TIP_KEYS.filter((k) => !excludeKeys.includes(k)) : [...TIP_KEYS]),
    [excludeKeys]
  )
  const [dayIndex, setDayIndex] = useState<number | null>(null)
  useEffect(() => {
    setDayIndex(keys.length > 0 ? new Date().getDate() % keys.length : null)
  }, [keys.length])
  const tipKey = useMemo(() => {
    if (keys.length === 0) return null
    if (typeof index === "number" && index >= 0 && index < keys.length) return keys[index]
    if (dayIndex !== null) return keys[dayIndex]
    return keys[0]
  }, [index, dayIndex, keys])
  const text = tipKey ? t(tipKey) : ""
  if (!tipKey || !text || text === tipKey) return null
  return (
    <p className={`text-xs text-muted-foreground flex items-center gap-1.5 ${className}`} role="note">
      <Lightbulb className="h-3.5 w-3.5 shrink-0 text-amber-500/80" aria-hidden />
      <span>{text}</span>
    </p>
  )
}
