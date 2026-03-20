"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts"
import { TrendingUp, TrendingDown, Minus, ShoppingCart, RefreshCw } from "lucide-react"

interface WeekPoint {
  weekEnding: string
  basketTotalLRD: number
  weekOverWeekPercent: number | null
}

interface WeeklyBasketData {
  weeks: WeekPoint[]
  priceIndexBasketId: string
  updatedAt: string
}

function formatLRD(n: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n) + " LRD"
}

function formatWeekLabel(weekEnding: string): string {
  const d = new Date(weekEnding + "T12:00:00Z")
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function WeeklyBasketIndex() {
  const [data, setData] = useState<WeeklyBasketData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/price-index/weekly-basket")
      if (!res.ok) throw new Error("Failed to load weekly basket")
      const json = await res.json()
      setData(json)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load weekly basket")
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <Card className="relative border-border/50 rounded-2xl shadow-sm bg-card/80 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/30" aria-hidden />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Weekly grocery basket index
          </CardTitle>
          <CardDescription>Same basket as Price Index — last 8 weeks</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-52 w-full rounded-xl" />
        </CardContent>
      </Card>
    )
  }

  if (error || !data?.weeks?.length) {
    return (
      <Card className="relative border-border/50 rounded-2xl shadow-sm bg-card/80 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/30" aria-hidden />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Weekly grocery basket index
          </CardTitle>
          <CardDescription>Same basket as Price Index</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error ?? "No data"}</p>
          <button
            type="button"
            onClick={fetchData}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
            Retry
          </button>
        </CardContent>
      </Card>
    )
  }

  const latest = data.weeks[data.weeks.length - 1]
  const wow = latest?.weekOverWeekPercent ?? null
  const chartData = data.weeks.map((w) => ({
    name: formatWeekLabel(w.weekEnding),
    total: w.basketTotalLRD,
    full: w.weekEnding,
  }))

  return (
    <Card className="relative border-border/50 rounded-2xl shadow-sm bg-card/80 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/30" aria-hidden />
      <CardHeader className="pb-2 pt-5">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <ShoppingCart className="h-5 w-5 text-primary" />
          Weekly grocery basket index
        </CardTitle>
        <CardDescription className="text-xs">
          Total cost of the essential basket by week — rice, fuel, palm oil, cement, sugar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-baseline gap-4 rounded-xl border border-border/50 bg-muted/20 dark:bg-muted/10 p-4">
          <div>
            <p className="text-2xl font-bold tabular-nums text-foreground">
              {latest ? formatLRD(latest.basketTotalLRD) : "—"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              This week {latest ? formatWeekLabel(latest.weekEnding) : ""}
            </p>
          </div>
          {wow !== null && (
            <div
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium text-sm tabular-nums ${ wow > 0 ? "bg-muted/40 border border-border/40 text-red-600 dark:text-red-400" : wow < 0 ? "bg-muted/40 border border-border/40 text-green-600 dark:text-green-400" : "bg-muted text-muted-foreground" }`}
            >
              {wow > 0 && <TrendingUp className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />}
              {wow < 0 && <TrendingDown className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />}
              {wow === 0 && <Minus className="h-4 w-4 shrink-0 text-muted-foreground" />}
              {wow > 0 ? "+" : ""}
              {wow.toFixed(2)}% vs last week
            </div>
          )}
        </div>
        <div className="h-52 w-full rounded-xl border border-border/40 bg-muted/10 p-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "1px solid var(--border)" }}
                formatter={(value) => [formatLRD(typeof value === "number" ? value : Number(value ?? 0)), "Basket total"]}
                labelFormatter={(_, payload) => (payload?.[0]?.payload?.full ?? "") as string}
              />
              <Bar dataKey="total" radius={[4, 4, 0, 0]} fill="var(--primary)" fillOpacity={0.85}>
                {chartData.map((_, i) => (
                  <Cell
                    key={i}
                    fill="var(--primary)"
                    fillOpacity={i === chartData.length - 1 ? 1 : 0.6}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
