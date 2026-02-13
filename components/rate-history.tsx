"use client"

import { useMemo, useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp } from "lucide-react"

type TimeRange = "7d" | "30d" | "90d" | "1y"

export function RateHistory() {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d")
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [liveRate, setLiveRate] = useState<number | null>(null)
  const [source, setSource] = useState<string | null>(null)
  const [sourceUrl, setSourceUrl] = useState<string | null>(null)
  const latestPoint = useMemo(() => (data.length ? data[data.length - 1] : null), [data])
  const latestRate = typeof liveRate === "number"
    ? liveRate
    : typeof latestPoint?.rate === "number"
      ? latestPoint.rate
      : null
  const latestDate = latestPoint?.date ?? "—"
  const formatRate = (value?: number) => (typeof value === "number" ? value.toFixed(4) : "—")
  const highestRate = useMemo(() => {
    if (!data.length && typeof liveRate !== "number") return null
    const historyMax = data.length ? Math.max(...data.map((d) => d.rate)) : null
    if (typeof liveRate === "number" && typeof historyMax === "number") {
      return Math.max(liveRate, historyMax)
    }
    return typeof liveRate === "number" ? liveRate : historyMax
  }, [data, liveRate])

  useEffect(() => {
    async function fetchHistoricalData() {
      try {
        setLoading(true)
        const [historyResponse, liveResponse] = await Promise.all([
          fetch("/api/rates/historical"),
          fetch("/api/rates/live"),
        ])
        const result = await historyResponse.json()
        const liveResult = await liveResponse.json()
        const liveValue = typeof liveResult?.rate === "number" ? liveResult.rate : null
        setLiveRate(liveValue)
        setSource(result.source ?? null)
        setSourceUrl(result.sourceUrl ?? null)

        const days = getDaysFromRange(timeRange)
        const filteredData = (result.historical || []).slice(-days).map((item: any) => ({
          date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          rate: item.rate,
          buy: item.rate - 2,
          sell: item.rate + 2,
        }))

        if (liveValue && filteredData.length) {
          const next = [...filteredData]
          next[next.length - 1] = {
            ...next[next.length - 1],
            date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            rate: liveValue,
          }
          setData(next)
        } else {
          setData(filteredData)
        }
      } catch (error) {
        console.error("[v0] Error fetching historical data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistoricalData()
  }, [timeRange])

  const getDaysFromRange = (range: TimeRange): number => {
    switch (range) {
      case "7d":
        return 7
      case "30d":
        return 30
      case "90d":
        return 90
      case "1y":
        return 365
    }
  }

  const chartConfig = {
    rate: {
      label: "Exchange Rate",
      color: "hsl(var(--primary))",
    },
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Exchange Rate History</CardTitle>
              <CardDescription>
                {source ? (
                  <>
                    Track USD/LRD rate trends from{" "}
                    {sourceUrl ? (
                      <a
                        href={sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-primary"
                      >
                        {source}
                      </a>
                    ) : (
                      source
                    )}
                  </>
                ) : (
                  "Track USD/LRD rate trends over time"
                )}
              </CardDescription>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-border bg-muted/40 p-1">
              <Button
                variant={timeRange === "7d" ? "default" : "ghost"}
                size="sm"
                className="rounded-full"
                onClick={() => setTimeRange("7d")}
              >
                7D
              </Button>
              <Button
                variant={timeRange === "30d" ? "default" : "ghost"}
                size="sm"
                className="rounded-full"
                onClick={() => setTimeRange("30d")}
              >
                30D
              </Button>
              <Button
                variant={timeRange === "90d" ? "default" : "ghost"}
                size="sm"
                className="rounded-full"
                onClick={() => setTimeRange("90d")}
              >
                90D
              </Button>
              <Button
                variant={timeRange === "1y" ? "default" : "ghost"}
                size="sm"
                className="rounded-full"
                onClick={() => setTimeRange("1y")}
              >
                1Y
              </Button>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background px-3 py-2 shadow-sm">
              <div className="text-xs text-muted-foreground">{latestDate}</div>
              <div className="h-6 w-px bg-border/60" />
              <div>
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Exchange Rate</div>
                <div className="text-base font-semibold text-foreground">{formatRate(latestRate)}</div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">Loading historical data...</div>
          </div>
        ) : (
          <>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--foreground))"
                    tick={{ fill: "hsl(var(--foreground))" }}
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--foreground))"
                    tick={{ fill: "hsl(var(--foreground))" }}
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(value) => Number(value).toFixed(4)}
                    domain={["dataMin - 2", "dataMax + 2"]}
                  />
                  <Tooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(label) => `${label}`}
                        formatter={(value) => (
                          <div className="flex w-full items-center justify-between">
                            <span className="text-muted-foreground">Exchange Rate</span>
                            <span className="font-mono font-medium">
                              {Number(value).toFixed(4)}
                            </span>
                          </div>
                        )}
                      />
                    }
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Current</div>
                <div className="text-lg font-bold text-foreground">
                  {formatRate(latestRate)} LRD
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Highest</div>
                <div className="text-lg font-bold text-secondary">
                  {formatRate(highestRate)} LRD
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Lowest</div>
                <div className="text-lg font-bold text-foreground">
                  {data.length > 0 ? Math.min(...data.map((d) => d.rate)).toFixed(4) : "—"} LRD
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
