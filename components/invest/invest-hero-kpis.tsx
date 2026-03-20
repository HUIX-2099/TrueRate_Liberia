"use client"

import { useEffect, useState, useMemo } from "react"
import { useLiveRate } from "@/lib/live-rate-context"
import { DollarSign, TrendingUp, ShoppingBasket } from "lucide-react"
import { cn } from "@/lib/utils"
import { Sparkline } from "./sparkline"
import { CANONICAL_FALLBACK_RATE } from "@/lib/canonical-rate"

function KpiCard({
  label,
  value,
  subtext,
  icon,
  trendData,
  delayMs = 0,
  className,
}: {
  label: string
  value: React.ReactNode
  subtext?: string
  icon: React.ReactNode
  trendData?: { value: number }[]
  delayMs?: number
  className?: string
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50 + delayMs)
    return () => clearTimeout(t)
  }, [delayMs])

  return (
    <div
      className={cn(
        "rounded-xl border border-border/40 bg-card shadow-sm transition-all duration-500 min-w-0 overflow-hidden",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        className
      )}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="flex items-center gap-2 min-w-0">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted/40 border border-border/40 text-primary">
              {icon}
            </span>
            <span className="text-[11px] sm:text-xs font-medium text-muted-foreground truncate uppercase tracking-wider">
              {label}
            </span>
          </span>
        </div>
        <div className="tabular-nums text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground font-mono">
          {value}
        </div>
        {subtext && <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{subtext}</p>}
        {trendData && trendData.length >= 2 && (
          <div className="mt-2 h-8">
            <Sparkline data={trendData} height={32} color="var(--primary)" />
          </div>
        )}
      </div>
    </div>
  )
}

export function InvestHeroKPIs() {
  const { effectiveRate, loading: rateLoading } = useLiveRate()
  const [inflation, setInflation] = useState<number | null>(null)
  const [cpi, setCpi] = useState<number | null>(null)
  const [basketSubtext, setBasketSubtext] = useState<string>("Essential goods basket")
  const [inflationSeries, setInflationSeries] = useState<{ year: string; cpi: number; inflation: number }[]>([])
  const [candleCloses, setCandleCloses] = useState<number[]>([])

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch("/api/inflation").then((r) => r.json()),
      fetch("/api/liberia-cpi").then((r) => r.json()),
      fetch("/api/rates/candles?days=21").then((r) => r.json()),
    ]).then(([infData, cpiData, candlesData]) => {
      if (cancelled) return
      const series = Array.isArray(infData?.series) ? infData.series : []
      setInflationSeries(series)
      const last = series[series.length - 1]
      if (last && typeof last.inflation === "number") setInflation(last.inflation)
      if (typeof cpiData?.cpi === "number") setCpi(cpiData.cpi)
      if (cpiData?.lastMonth) setBasketSubtext(cpiData.lastMonth)
      const candles = candlesData?.candles ?? []
      if (Array.isArray(candles) && candles.length) {
        setCandleCloses(candles.map((c: { close: number }) => c.close))
      }
    }).catch(() => {})

    return () => { cancelled = true }
  }, [])

  const rate = rateLoading ? CANONICAL_FALLBACK_RATE : effectiveRate
  const inflationDisplay = inflation !== null ? `${inflation.toFixed(1)}%` : "—"
  const basketDisplay = cpi !== null ? cpi.toFixed(1) : "—"

  const rateTrendData = useMemo(
    () => candleCloses.map((value) => ({ value })),
    [candleCloses]
  )
  const inflationTrendData = useMemo(
    () => inflationSeries.map((p) => ({ value: p.inflation })),
    [inflationSeries]
  )
  const cpiTrendData = useMemo(
    () => inflationSeries.map((p) => ({ value: p.cpi })),
    [inflationSeries]
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      <KpiCard
        label="USD/LRD"
        value={`${rate.toFixed(2)} LRD`}
        subtext="Live mid"
        icon={<DollarSign className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden />}
        trendData={rateTrendData.length >= 2 ? rateTrendData : undefined}
        delayMs={0}
      />
      <KpiCard
        label="Inflation (YoY)"
        value={inflationDisplay}
        subtext="LISGIS / CBL"
        icon={<TrendingUp className="h-3.5 w-3.5 text-green-600 dark:text-green-400" aria-hidden />}
        trendData={inflationTrendData.length >= 2 ? inflationTrendData : undefined}
        delayMs={80}
      />
      <KpiCard
        label="CPI"
        value={basketDisplay}
        subtext={basketSubtext}
        icon={<ShoppingBasket className="h-3.5 w-3.5 text-primary" aria-hidden />}
        trendData={cpiTrendData.length >= 2 ? cpiTrendData : undefined}
        delayMs={160}
      />
    </div>
  )
}
