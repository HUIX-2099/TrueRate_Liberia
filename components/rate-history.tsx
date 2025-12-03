"use client"

import { useState, useEffect } from "react"
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

  useEffect(() => {
    async function fetchHistoricalData() {
      try {
        setLoading(true)
        const response = await fetch("/api/rates/historical")
        const result = await response.json()

        const days = getDaysFromRange(timeRange)
        const filteredData = (result.historical || []).slice(-days).map((item: any) => ({
          date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          rate: item.rate,
          buy: item.rate - 2,
          sell: item.rate + 2,
        }))

        setData(filteredData)
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
              <CardDescription>Track USD/LRD rate trends over time</CardDescription>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant={timeRange === "7d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("7d")}>
              7D
            </Button>
            <Button variant={timeRange === "30d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("30d")}>
              30D
            </Button>
            <Button variant={timeRange === "90d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("90d")}>
              90D
            </Button>
            <Button variant={timeRange === "1y" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("1y")}>
              1Y
            </Button>
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
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    domain={["dataMin - 2", "dataMax + 2"]}
                  />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Current</div>
                <div className="text-lg font-bold text-foreground">
                  {data.length > 0 ? data[data.length - 1]?.rate.toFixed(2) : "—"} LRD
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Highest</div>
                <div className="text-lg font-bold text-secondary">
                  {data.length > 0 ? Math.max(...data.map((d) => d.rate)).toFixed(2) : "—"} LRD
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Lowest</div>
                <div className="text-lg font-bold text-foreground">
                  {data.length > 0 ? Math.min(...data.map((d) => d.rate)).toFixed(2) : "—"} LRD
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
