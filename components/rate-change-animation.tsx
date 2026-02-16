"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

interface RateChangeAnimationProps {
  /** Current rate value */
  rate: number
  /** Optional previous rate to detect direction and trigger animation */
  previousRate?: number | null
  /** Content to wrap (e.g. the rate number) */
  children: ReactNode
  /** Additional class names for the wrapper */
  className?: string
}

/**
 * Wraps the rate display and triggers a brief flash (green for down, red for up)
 * when the rate changes. Use with the same rate/previousRate as the displayed value.
 */
export function RateChangeAnimation({
  rate,
  previousRate = null,
  children,
  className = "",
}: RateChangeAnimationProps) {
  const [flash, setFlash] = useState<"up" | "down" | null>(null)
  const prevRateRef = useRef<number | null>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      prevRateRef.current = rate
      return
    }
    const prev = prevRateRef.current
    if (prev != null && rate !== prev && Number.isFinite(rate) && Number.isFinite(prev)) {
      setFlash(rate > prev ? "up" : "down")
      prevRateRef.current = rate
      const t = setTimeout(() => {
        setFlash(null)
      }, 600)
      return () => clearTimeout(t)
    }
    prevRateRef.current = rate
  }, [rate])

  return (
    <span
      className={`inline-block transition-[background-color,box-shadow] duration-300 ease-out rounded-md ${className} ${
        flash === "up"
          ? "animate-rate-flash-up"
          : flash === "down"
            ? "animate-rate-flash-down"
            : ""
      }`}
      data-flash={flash ?? undefined}
    >
      {children}
    </span>
  )
}
