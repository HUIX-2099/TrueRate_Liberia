"use client"

import { useMemo } from "react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { cn } from "@/lib/utils"
import { useLiveRate } from "@/lib/live-rate-context"

export type RateChartPeriod = "7d" | "30d" | "90d"

const DAYS_7 = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const
const OFFS_7 = [-4, -3, -2, -1, 0, -1, 0] as const

function buildSample7d(anchor: number) {
  return DAYS_7.map((day, i) => ({ day, rate: anchor + OFFS_7[i] }))
}

function buildSample30d(anchor: number) {
  return buildSample7d(anchor).flatMap((_, i) =>
    Array.from({ length: 4 }, (__, j) => ({
      day: `W${i + 1}.${j + 1}`,
      rate: anchor - 4 + Math.floor((i * 4 + j) / 3),
    }))
  ).slice(0, 30)
}

function buildSample90d(anchor: number) {
  return Array.from({ length: 90 }, (_, i) => ({
    day: `D${i + 1}`,
    rate: anchor - 6 + Math.min(10, Math.floor(i / 9)),
  }))
}

export interface RateChartProps {
  period: RateChartPeriod
  showInflationOverlay?: boolean
  className?: string
}

/** Illustrative index that moves with the rate but not 1:1—helps compare timing of pressure vs. street FX. */
function withInflationPulse(
  data: Array<{ day: string; rate: number }>,
  period: RateChartPeriod
): Array<{ day: string; rate: number; inflationPulse: number }> {
  const phase = period === "7d" ? 0 : period === "30d" ? 1.2 : 2.4
  return data.map((d, i) => ({
    ...d,
    inflationPulse: Number(
      (d.rate * 0.93 + Math.sin(i * 0.38 + phase) * 1.8 + (i % 5) * 0.15).toFixed(2)
    ),
  }))
}

export function RateChart({ period, showInflationOverlay, className }: RateChartProps) {
  const { rate } = useLiveRate()

  const chartData = useMemo(() => {
    const raw =
      period === "7d"
        ? buildSample7d(rate)
        : period === "30d"
          ? buildSample30d(rate)
          : buildSample90d(rate)
    return withInflationPulse(raw, period)
  }, [period, rate])

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] sm:text-xs text-muted-foreground">
        <span className="flex items-center gap-2 font-medium text-foreground/80">
          <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--chart-1)] shadow-[0_0_8px_color-mix(in_oklab,var(--chart-1)_60%,transparent)]" />
          USD/LRD (street mid)
        </span>
        {showInflationOverlay ? (
          <span className="flex items-center gap-2">
            <span className="mt-0.5 h-0 w-7 shrink-0 border-t-2 border-dashed border-[var(--chart-3)]" aria-hidden />
            <span>
              Inflation pulse <span className="text-muted-foreground font-normal">(indexed demo—lags FX slightly)</span>
            </span>
          </span>
        ) : (
          <span className="text-muted-foreground/90 italic">Turn on overlay to compare price pressure with the rate.</span>
        )}
      </div>

      <ChartContainer
        config={{
          rate: { label: "USD/LRD", color: "var(--chart-1)" },
          inflationPulse: { label: "Inflation pulse", color: "var(--chart-3)" },
        }}
        className="h-[220px] w-full min-w-0"
      >
        <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 4, left: 0 }}>
          <defs>
            <linearGradient id="rateGradientIntelligence" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="inflationGradientIntelligence" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.22} />
              <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 8" vertical={false} className="stroke-border/40" />
          <XAxis dataKey="day" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis
            domain={["dataMin - 2", "dataMax + 2"]}
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={36}
            tickFormatter={(v) => `${v}`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, _name, item) => (
                  <div className="flex w-full flex-1 items-center justify-between gap-4">
                    <span className="text-muted-foreground">
                      {item.dataKey === "inflationPulse" ? "Inflation pulse" : "USD/LRD"}
                    </span>
                    <span className="font-medium tabular-nums text-foreground">
                      {item.dataKey === "inflationPulse"
                        ? `${value} (index)`
                        : `${value} LRD`}
                    </span>
                  </div>
                )}
              />
            }
          />
          <Area
            type="monotone"
            dataKey="rate"
            stroke="var(--chart-1)"
            fill="url(#rateGradientIntelligence)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
            animationDuration={900}
          />
          {showInflationOverlay ? (
            <Area
              type="monotone"
              dataKey="inflationPulse"
              stroke="var(--chart-3)"
              strokeWidth={2}
              strokeDasharray="6 4"
              fill="url(#inflationGradientIntelligence)"
              dot={false}
              activeDot={{ r: 3, strokeWidth: 0 }}
              animationDuration={1100}
            />
          ) : null}
        </AreaChart>
      </ChartContainer>
    </div>
  )
}

export default RateChart
