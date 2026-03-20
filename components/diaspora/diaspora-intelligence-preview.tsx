"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  LineChart,
  ArrowRight,
  TrendingUp,
  Fuel,
  UtensilsCrossed,
  Building2,
  AlertTriangle,
} from "lucide-react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Area, AreaChart, XAxis, YAxis } from "recharts"

const SAMPLE_TREND = [
  { day: "Mon", rate: 182 },
  { day: "Tue", rate: 183 },
  { day: "Wed", rate: 184 },
  { day: "Thu", rate: 185 },
  { day: "Fri", rate: 186 },
  { day: "Sat", rate: 185 },
  { day: "Sun", rate: 186 },
]

export function DiasporaIntelligencePreview() {
  const [liveRate, setLiveRate] = useState<number | null>(null)

  useEffect(() => {
    fetch("/api/rates/live")
      .then((res) => res.json())
      .then((data) => {
        if (data.rate != null && typeof data.rate === "number") setLiveRate(data.rate)
      })
      .catch(() => {})
  }, [])

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-card shadow-[var(--shadow-institutional)] overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center">
            <LineChart className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-primary">Economic Intelligence Dashboard</CardTitle>
            <CardDescription>
              Big-picture trends and everyday prices—FX, mood, and staples in one glance.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground mb-0.5">USD/LRD now</p>
            <p className="text-xl font-bold tabular-nums">
              {liveRate != null ? `${liveRate.toFixed(0)}` : "—"} LRD
            </p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground mb-0.5">7-day trend</p>
            <p className="text-sm font-medium text-primary">Official vs market</p>
          </div>
        </div>
        <div className="h-[120px] w-full min-w-0">
          <ChartContainer
            config={{
              rate: { label: "LRD" },
              day: { label: "Day" },
            }}
            className="h-full w-full"
          >
            <AreaChart data={SAMPLE_TREND} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
              <defs>
                <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis domain={["dataMin - 2", "dataMax + 2"]} tick={{ fontSize: 10 }} width={32} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="rate"
                stroke="var(--chart-1)"
                fill="url(#rateGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </div>
        <ul className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <li className="flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
            7 / 30 / 90-day charts
          </li>
          <li className="flex items-center gap-1">
            <Fuel className="h-3.5 w-3.5 text-primary" />
            Fuel tracker
          </li>
          <li className="flex items-center gap-1">
            <UtensilsCrossed className="h-3.5 w-3.5 text-primary" />
            Rice tracker
          </li>
          <li className="flex items-center gap-1">
            <Building2 className="h-3.5 w-3.5 text-primary" />
            CBL policy updates
          </li>
          <li className="flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            Volatility alerts
          </li>
        </ul>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/market-intelligence">
            Open Dashboard
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
