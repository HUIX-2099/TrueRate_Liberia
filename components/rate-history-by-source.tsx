"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, Building2, Store } from "lucide-react"

type TimeRange = "7d" | "30d" | "90d" | "1y"

function getDaysFromRange(range: TimeRange): number {
  switch (range) {
    case "7d":
      return 7
    case "30d":
      return 30
    case "90d":
      return 90
    case "1y":
      return 365
    default:
      return 90
  }
}

interface DataPoint {
  date: string
  dateShort: string
  cbl: number | null
  market: number | null
}

export function RateHistoryBySource() {
  const [timeRange, setTimeRange] = useState<TimeRange>("90d")
  const [rawSeries, setRawSeries] = useState<Array<{ date: string; cbl: number | null; market: number | null }>>([])
  const [loading, setLoading] = useState(true)
  const [cblSource, setCblSource] = useState<string | null>(null)
  const [marketSource, setMarketSource] = useState<string | null>(null)

  const days = getDaysFromRange(timeRange)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/rates/historical/by-source?days=${days}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        setRawSeries(data.series ?? [])
        setCblSource(data.cblSource ?? null)
        setMarketSource(data.marketSource ?? null)
      })
      .catch(() => {
        if (!cancelled) setRawSeries([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [days])

  const chartData: DataPoint[] = useMemo(() => {
    const slice = rawSeries.slice(-days)
    return slice.map((p) => ({
      date: p.date,
      dateShort: new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      cbl: p.cbl,
      market: p.market,
    }))
  }, [rawSeries, days])

  const hasCbl = chartData.some((d) => d.cbl != null)
  const hasMarket = chartData.some((d) => d.market != null)
  const domainMin = useMemo(() => {
    const values = chartData.flatMap((d) => [d.cbl, d.market].filter((v): v is number => v != null))
    if (values.length === 0) return 0
    return Math.floor(Math.min(...values) - 2)
  }, [chartData])
  const domainMax = useMemo(() => {
    const values = chartData.flatMap((d) => [d.cbl, d.market].filter((v): v is number => v != null))
    if (values.length === 0) return 200
    return Math.ceil(Math.max(...values) + 2)
  }, [chartData])

  const chartConfig = {
    cbl: {
      label: "CBL (official)",
      color: "var(--chart-2)",
    },
    market: {
      label: "Market",
      theme: {
        light: "var(--chart-1)",
        dark: "oklch(0.7 0.18 145)",
      },
    },
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/40 border border-border/40">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle>Rate history by source</CardTitle>
              <CardDescription>
                CBL (official) vs market rate over time. Compare official and indicative market trends.
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-2 rounded-full border border-border bg-muted/40 p-1">
              {(["7d", "30d", "90d", "1y"] as const).map((r) => (
                <Button
                  key={r}
                  variant={timeRange === r ? "default" : "ghost"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setTimeRange(r)}
                >
                  {r.toUpperCase()}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {cblSource && (
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                  CBL
                </span>
              )}
              {marketSource && (
                <span className="flex items-center gap-1">
                  <Store className="h-3.5 w-3.5 text-primary" />
                  Market
                </span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[320px] flex items-center justify-center">
            <div className="text-muted-foreground">Loading CBL & market history...</div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-[320px] flex items-center justify-center">
            <div className="text-muted-foreground">No data for this range</div>
          </div>
        ) : (
          <>
            <ChartContainer config={chartConfig} className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="dateShort"
                    stroke="var(--border)"
                    tick={{ fill: "var(--foreground)" }}
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="var(--border)"
                    tick={{ fill: "var(--foreground)" }}
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(v) => Number(v).toFixed(0)}
                    domain={[domainMin, domainMax]}
                  />
                  <Tooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(label) => (label != null ? String(label) : "")}
                        formatter={(value, name) => (
                          <div className="flex w-full items-center justify-between gap-4">
                            <span className="text-muted-foreground">
                              {name === "cbl" ? "CBL (official)" : "Market"}
                            </span>
                            <span className="font-mono font-medium">
                              {typeof value === "number" ? value.toFixed(2) : "—"} LRD
                            </span>
                          </div>
                        )}
                      />
                    }
                    isAnimationActive={false}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 12 }}
                    formatter={(value) => (value === "cbl" ? "CBL (official)" : "Market")}
                  />
                  {hasCbl && (
                    <Line
                      type="monotone"
                      dataKey="cbl"
                      name="cbl"
                      stroke="var(--chart-2)"
                      strokeWidth={2}
                      dot={false}
                      connectNulls
                      isAnimationActive={false}
                    />
                  )}
                  {hasMarket && (
                    <Line
                      type="monotone"
                      dataKey="market"
                      name="market"
                      stroke="var(--color-market)"
                      strokeWidth={2}
                      dot={false}
                      connectNulls
                      isAnimationActive={false}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
              {hasCbl && (
                <>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">CBL latest</div>
                    <div className="text-lg font-bold text-foreground">
                      {([...chartData].reverse().find((d) => d.cbl != null)?.cbl?.toFixed(2)) ?? "—"} LRD
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">CBL range</div>
                    <div className="text-sm font-medium text-foreground">
                      {(() => {
                        const vals = chartData.map((d) => d.cbl).filter((v): v is number => v != null)
                        if (vals.length === 0) return "—"
                        return `${Math.min(...vals).toFixed(0)} – ${Math.max(...vals).toFixed(0)}`
                      })()}{" "}
                      LRD
                    </div>
                  </div>
                </>
              )}
              {hasMarket && (
                <>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Market latest</div>
                    <div className="text-lg font-bold text-foreground">
                      {([...chartData].reverse().find((d) => d.market != null)?.market?.toFixed(2)) ?? "—"} LRD
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Market range</div>
                    <div className="text-sm font-medium text-foreground">
                      {(() => {
                        const vals = chartData.map((d) => d.market).filter((v): v is number => v != null)
                        if (vals.length === 0) return "—"
                        return `${Math.min(...vals).toFixed(0)} – ${Math.max(...vals).toFixed(0)}`
                      })()}{" "}
                      LRD
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
