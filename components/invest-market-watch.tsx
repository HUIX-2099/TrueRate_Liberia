"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useLiveRate } from "@/lib/live-rate-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChartContainer } from "@/components/ui/chart"
import { Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  RefreshCw,
  Activity,
} from "lucide-react"

const CHART_POINTS_MAX = 48
const SESSION_TICK_MS = 4000
const WIGGLE_PERCENT = 0.002

function useSessionRateHistory(liveRate: number): { displayRate: number; history: { t: string; rate: number }[] } {
  const [history, setHistory] = useState<{ t: string; rate: number }[]>([])
  const [displayRate, setDisplayRate] = useState(liveRate)
  const liveRef = useRef(liveRate)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => { liveRef.current = liveRate }, [liveRate])

  // When live rate updates, snap display to it and push to history
  useEffect(() => {
    setDisplayRate(liveRate)
    setHistory((prev) => {
      const next = [...prev, { t: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }), rate: liveRate }]
      return next.slice(-CHART_POINTS_MAX)
    })
  }, [liveRate])

  // Between live updates: gentle wiggle so the "market" visibly moves
  useEffect(() => {
    tickRef.current = setInterval(() => {
      const base = liveRef.current
      const wiggle = base * (Math.random() * 2 - 1) * WIGGLE_PERCENT
      const next = base + wiggle
      setDisplayRate(next)
      setHistory((prev) => {
        const nextArr = [...prev, { t: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }), rate: next }]
        return nextArr.slice(-CHART_POINTS_MAX)
      })
    }, SESSION_TICK_MS)
    return () => {
      if (tickRef.current) clearInterval(tickRef.current)
    }
  }, [])

  return { displayRate, history }
}

const chartConfig = {
  rate: { label: "USD/LRD", color: "var(--primary)" },
}

export function InvestMarketWatch() {
  const { effectiveRate, loading, refresh, timestamp } = useLiveRate()
  const { displayRate, history } = useSessionRateHistory(effectiveRate)
  const [investUsd, setInvestUsd] = useState("1000")
  const prevRateRef = useRef(effectiveRate)
  const [trend, setTrend] = useState<"up" | "down" | "flat">("flat")

  useEffect(() => {
    if (prevRateRef.current !== effectiveRate) {
      setTrend(effectiveRate > prevRateRef.current ? "up" : effectiveRate < prevRateRef.current ? "down" : "flat")
      prevRateRef.current = effectiveRate
    }
  }, [effectiveRate])

  const investUsdNum = useMemo(() => {
    const n = parseFloat(investUsd.replace(/,/g, ""))
    return Number.isFinite(n) && n >= 0 ? n : 0
  }, [investUsd])

  const lrdValue = useMemo(() => investUsdNum * effectiveRate, [investUsdNum, effectiveRate])
  const lrdDisplayValue = useMemo(() => investUsdNum * displayRate, [investUsdNum, displayRate])

  const [lastUpdate, setLastUpdate] = useState("—")
  useEffect(() => {
    if (!timestamp) { setLastUpdate("—"); return }
    function tick() {
      try {
        const d = new Date(timestamp)
        const diff = (Date.now() - d.getTime()) / 60_000
        if (diff < 1) setLastUpdate("Just now")
        else if (diff < 60) setLastUpdate(`${Math.floor(diff)}m ago`)
        else setLastUpdate(d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }))
      } catch { setLastUpdate("—") }
    }
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [timestamp])

  const chartData = useMemo(() => {
    if (history.length === 0) return [{ t: "—", rate: effectiveRate }]
    return history
  }, [history, effectiveRate])

  return (
    <section
      className="py-8 sm:py-10 md:py-12 bg-background border-b border-border/60"
      aria-labelledby="market-watch-heading"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 id="market-watch-heading" className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" aria-hidden />
            Market Watch — USD/LRD
          </h2>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs font-medium tabular-nums">
              Updated {lastUpdate}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5"
              onClick={() => refresh()}
              disabled={loading}
              aria-label="Refresh rate"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} aria-hidden />
              Refresh
            </Button>
          </div>
        </div>

        {/* Ticker strip — big rate, up/down */}
        <Card className="mb-6 border-2 border-primary/20 bg-card rounded-2xl overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider mb-1">
                  Live rate (used for conversions)
                </p>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold tabular-nums text-foreground">
                    1 USD = {effectiveRate.toFixed(2)} LRD
                  </span>
                  {trend !== "flat" && (
                    <span
                      className={`inline-flex items-center gap-1 text-sm font-medium ${ trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400" }`}
                      aria-live="polite"
                    >
                      {trend === "up" ? <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" aria-hidden /> : <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" aria-hidden />}
                      {trend === "up" ? "Up" : "Down"} vs last refresh
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-0.5">Session movement (illustrative)</p>
                <p className="text-xl sm:text-2xl font-semibold tabular-nums text-muted-foreground">
                  {displayRate.toFixed(2)} LRD
                </p>
                <p className="text-[10px] text-muted-foreground/80">Small wiggles simulate market fluctuation.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Chart — watch the market go up and down */}
          <Card className="lg:col-span-3 border-border/60 rounded-2xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" aria-hidden />
                Session movement
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Rate moves over time. This session includes small simulated fluctuations so you can see the market move.
              </p>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[220px] w-full">
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <XAxis
                    dataKey="t"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    domain={["dataMin - 1", "dataMax + 1"]}
                    tickFormatter={(v) => v.toFixed(1)}
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />
                  <Tooltip
                    content={({ active, payload }) =>
                      active && payload?.[0] ? (
                        <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-md">
                          <span className="text-muted-foreground">{payload[0].payload.t}</span>
                          <span className="ml-2 font-mono font-semibold">{Number(payload[0].value).toFixed(2)} LRD</span>
                        </div>
                      ) : null
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Put money now — invest simulator */}
          <Card className="lg:col-span-2 border-border/60 rounded-2xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
                Put money now
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                See how much LRD you get at the current rate. Value updates as the market moves.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invest-usd">Amount (USD)</Label>
                <Input
                  id="invest-usd"
                  type="text"
                  inputMode="decimal"
                  placeholder="e.g. 1000"
                  value={investUsd}
                  onChange={(e) => setInvestUsd(e.target.value.replace(/[^0-9.]/g, ""))}
                  className="text-lg font-mono tabular-nums"
                />
              </div>
              <div className="rounded-xl bg-muted/50 border border-border/60 p-4">
                <p className="text-xs text-muted-foreground mb-1">You receive (at live rate)</p>
                <p className="text-2xl font-bold tabular-nums text-foreground" aria-live="polite">
                  {lrdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} LRD
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  If session rate were {displayRate.toFixed(2)}: {lrdDisplayValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} LRD
                </p>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Conversions use the live rate above. This is for illustration only — not a real investment.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Caution — how the market works */}
        <Card className="mt-6 border-amber-500/30 bg-amber-500/5 rounded-2xl overflow-hidden">
          <CardContent className="p-4 sm:p-5 flex gap-3 sm:gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/40 border border-border/40 text-primary" aria-hidden>
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm sm:text-base mb-1.5">Be cautious — the market moves</h3>
              <p className="text-sm text-muted-foreground text-pretty leading-relaxed">
                The USD/LRD rate goes up and down. When you convert or invest, you lock in the rate at that moment. If the rate moves later, the same amount of USD can buy more or less LRD. Watch the chart and live rate, use TrueRate for reference only, and seek professional advice for real investment decisions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
