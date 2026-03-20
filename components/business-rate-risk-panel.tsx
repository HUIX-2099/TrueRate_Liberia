"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Area,
  AreaChart,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Activity,
  Shield,
  RefreshCw,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface BusinessRiskData {
  currentRate: number
  candles: Array<{ date: string; close: number }>
  trend30d: "up" | "down" | "neutral"
  trendPercent30d: number
  volatilityPercent: number
  dayChange: number
  dayChangePercent: number
  weekChange: number
  weekChangePercent: number
  isHighRiskPeriod: boolean
  recommendation: "hold_usd" | "convert_now" | "neutral"
  reason: string
  analytics: { slopePerDay: number; high30d: number; low30d: number }
  period: string
}

function formatDate(d: string): string {
  try {
    return new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })
  } catch {
    return d
  }
}

export function BusinessRateRiskPanel() {
  const [data, setData] = useState<BusinessRiskData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/rates/business-risk")
      if (!res.ok) throw new Error("Failed to load")
      const json = await res.json()
      setData(json)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load rate risk data")
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading && !data) {
    return (
      <Card className="rounded-2xl border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Rate trend &amp; recommendation
          </CardTitle>
          <CardDescription>30-day trend, volatility, and a clear action</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </CardContent>
      </Card>
    )
  }

  if (error && !data) {
    return (
      <Card className="rounded-2xl border-border/60">
        <CardContent className="py-8">
          <p className="text-sm text-muted-foreground">{error}</p>
          <button
            type="button"
            onClick={fetchData}
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
            Retry
          </button>
        </CardContent>
      </Card>
    )
  }

  if (!data) return null

  const chartData = data.candles.map((c) => ({ date: formatDate(c.date), value: c.close, full: c.date }))
  const volLevel = data.volatilityPercent < 8 ? "low" : data.volatilityPercent < 15 ? "med" : "high"

  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardHeader className="pb-3 border-b border-border/40 bg-muted/20">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Rate trend &amp; recommendation
            </CardTitle>
            <CardDescription className="mt-0.5">
              30-day trend, volatility, and clear guidance for LRD/USD exposure
            </CardDescription>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            {data.currentRate.toFixed(2)} LRD
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* High risk period alert */}
        {data.isHighRiskPeriod && (
          <div
            className={cn(
              "flex items-start gap-3 rounded-xl border px-4 py-3",
              "bg-muted/40 border border-border/40 border-amber-500/30 text-amber-800 dark:text-amber-200 dark:bg-muted/40 border border-border/40 dark:border-amber-500/20"
            )}
          >
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-semibold text-sm">High risk period</p>
              <p className="text-xs mt-0.5 opacity-90">
                Elevated volatility or sustained LRD weakness. Consider reducing LRD exposure and deferring large USD→LRD conversions.
              </p>
            </div>
          </div>
        )}

        {/* 30-day trend chart */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">30-day rate trend</p>
          <div className="h-36 w-full rounded-xl bg-muted/30 border border-border/40 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
                <defs>
                  <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10 }} width={36} tickFormatter={(v) => v.toFixed(0)} />
                <Tooltip
                  formatter={(value) => [typeof value === "number" ? value.toFixed(2) : String(value ?? ""), "LRD"]}
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.full ?? ""}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
                <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={1.5} fill="url(#rateGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Volatility + rate movement analytics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Volatility (30d)</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Activity className={cn("h-3.5 w-3.5", volLevel === "high" && "text-amber-600", volLevel === "med" && "text-amber-500", volLevel === "low" && "text-green-600")} />
              <span className="font-mono font-semibold text-sm">{data.volatilityPercent}%</span>
            </div>
          </div>
          <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">1d change</p>
            <div className={cn("flex items-center gap-1 mt-1 font-mono text-sm font-semibold", data.dayChange >= 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400")}>
              {data.dayChange >= 0 ? <TrendingUp className="h-3.5 w-3.5 text-green-600 dark:text-green-400" /> : <TrendingDown className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />}
              {data.dayChange >= 0 ? "+" : ""}{data.dayChangePercent.toFixed(2)}%
            </div>
          </div>
          <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">7d change</p>
            <div className={cn("flex items-center gap-1 mt-1 font-mono text-sm font-semibold", data.weekChange >= 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400")}>
              {data.weekChange >= 0 ? <TrendingUp className="h-3.5 w-3.5 text-green-600 dark:text-green-400" /> : <TrendingDown className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />}
              {data.weekChange >= 0 ? "+" : ""}{data.weekChangePercent.toFixed(2)}%
            </div>
          </div>
          <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">30d trend</p>
            <div className={cn("flex items-center gap-1 mt-1 font-mono text-sm font-semibold", data.trend30d === "up" && "text-red-600 dark:text-red-400", data.trend30d === "down" && "text-green-600 dark:text-green-400", data.trend30d === "neutral" && "text-muted-foreground")}>
              {data.trend30d === "up" && <TrendingUp className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />}
              {data.trend30d === "down" && <TrendingDown className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />}
              {data.trend30d === "neutral" && <Minus className="h-3.5 w-3.5 text-muted-foreground" />}
              {data.trendPercent30d >= 0 ? "+" : ""}{data.trendPercent30d}%
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Recommendation</p>
          <div
            className={cn(
              "rounded-xl border-2 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
              data.recommendation === "hold_usd" && "bg-muted/40 border border-border/40 border-amber-500/30",
              data.recommendation === "convert_now" && "bg-muted/40 border border-border/40 border-green-500/30",
              data.recommendation === "neutral" && "bg-muted/30 border-border/60"
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                  data.recommendation === "hold_usd" && "bg-amber-500/20",
                  data.recommendation === "convert_now" && "bg-green-500/20",
                  data.recommendation === "neutral" && "bg-muted"
                )}
              >
                <Shield className={cn("h-6 w-6", data.recommendation === "hold_usd" && "text-amber-600 dark:text-amber-400", data.recommendation === "convert_now" && "text-green-600 dark:text-green-400", data.recommendation === "neutral" && "text-muted-foreground")} />
              </div>
              <div>
                <p className="font-bold text-lg capitalize">
                  {data.recommendation === "hold_usd" && "Hold USD"}
                  {data.recommendation === "convert_now" && "Convert now"}
                  {data.recommendation === "neutral" && "Neutral"}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">{data.reason}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
