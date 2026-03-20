"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react"
import { useLiveRate } from "@/lib/live-rate-context"

interface TickerItem {
  label: string
  value: string
  change?: number
  direction?: "up" | "down" | "flat"
}

/** Flash animation when a rate value changes */
function FlashValue({ value, direction }: { value: string; direction?: "up" | "down" | "flat" }) {
  const [flash, setFlash] = useState(false)
  const prev = useRef(value)

  useEffect(() => {
    if (prev.current !== value) {
      setFlash(true)
      prev.current = value
      const t = setTimeout(() => setFlash(false), 1200)
      return () => clearTimeout(t)
    }
  }, [value])

  return (
    <span
      className={cn(
        "tabular-nums font-black transition-colors duration-500",
        flash && direction === "up" && "text-secondary",
        flash && direction === "down" && "text-destructive",
        !flash && "text-foreground"
      )}
    >
      {value}
    </span>
  )
}

function DirectionIcon({ direction }: { direction?: "up" | "down" | "flat" }) {
  if (direction === "up") return <TrendingUp className="h-3.5 w-3.5 shrink-0 text-green-600 dark:text-green-400" aria-label="Rate rising" />
  if (direction === "down") return <TrendingDown className="h-3.5 w-3.5 shrink-0 text-red-600 dark:text-red-400" aria-label="Rate falling" />
  return <Minus className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-label="Rate stable" />
}

export function RateTicker({ className }: { className?: string }) {
  const { rate, cblRate, timestamp, loading, refresh } = useLiveRate()
  const [position, setPosition] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>(0)
  const [change24h, setChange24h] = useState(0)
  const prevRate = useRef(rate)

  useEffect(() => {
    setChange24h(rate - prevRate.current)
    prevRate.current = rate
  }, [rate])

  const marketDirection: "up" | "down" | "flat" = change24h > 0.1 ? "up" : change24h < -0.1 ? "down" : "flat"

  const items: TickerItem[] = [
    { label: "USD/LRD Market", value: `${rate.toFixed(2)} LRD`, change: change24h, direction: marketDirection },
    { label: "CBL Official", value: cblRate ? `${cblRate.toFixed(2)} LRD` : "—" },
    { label: "Spread", value: cblRate ? `${Math.abs(rate - cblRate).toFixed(2)}` : "—", direction: marketDirection },
    { label: "Buy Rate", value: `${(rate * 0.998).toFixed(2)} LRD` },
    { label: "Sell Rate", value: `${(rate * 1.002).toFixed(2)} LRD` },
    { label: "1 LRD", value: `$${(1 / rate).toFixed(4)}` },
    { label: "100 USD", value: `${(rate * 100).toFixed(0)} LRD` },
    { label: "Updated", value: timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—" },
  ]

  // Smooth scroll animation
  useEffect(() => {
    let lastTime: number | null = null
    const speed = 40 // pixels per second

    function step(timestamp: number) {
      if (lastTime === null) lastTime = timestamp
      const delta = (timestamp - lastTime) / 1000
      lastTime = timestamp

      if (contentRef.current && containerRef.current) {
        const contentWidth = contentRef.current.scrollWidth / 2
        setPosition((prev) => {
          const next = prev + speed * delta
          return next >= contentWidth ? 0 : next
        })
      }
      animRef.current = requestAnimationFrame(step)
    }

    animRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  const repeatedItems = [...items, ...items]

  return (
    <div
      className={cn(
        "flex items-center gap-0 border-b border-border/40 bg-muted/20 h-9",
        className
      )}
      role="marquee"
      aria-live="off"
      aria-label="Live USD/LRD rate ticker"
    >
      {/* Refresh button */}
      <button
        onClick={refresh}
        disabled={loading}
        aria-label="Refresh live rate"
        className="flex h-full items-center justify-center px-3 border-r border-border/40 bg-background/50 hover:bg-muted/30 transition-colors shrink-0"
      >
        <RefreshCw className={cn("h-3.5 w-3.5 text-muted-foreground", loading && "animate-spin")} />
      </button>

      {/* Live badge */}
      <div className="flex items-center gap-1.5 px-3 border-r border-border/40 shrink-0">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
        </span>
        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-secondary">Live</span>
      </div>

      {/* Scrolling ticker */}
      <div ref={containerRef} className="flex-1 overflow-hidden min-w-0">
        <div
          ref={contentRef}
          className="flex items-center gap-0"
          style={{ transform: `translateX(-${position}px)`, willChange: "transform" }}
          aria-hidden
        >
          {repeatedItems.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 border-r border-border/20 shrink-0 h-9">
              <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">{item.label}</span>
              <DirectionIcon direction={item.direction} />
              <FlashValue value={item.value} direction={item.direction} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
