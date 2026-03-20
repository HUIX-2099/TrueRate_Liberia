"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { MapPin, ChevronRight, Building2, Mountain, BarChart3, TrendingUp, ChevronDown } from "lucide-react"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Cell } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { getRegionalChartColor } from "@/lib/regional-chart-colors"

interface RegionalItem {
  region: string
  county?: string
  avgRate: number
  count: number
}

interface CountyItem {
  county: string
  region: string
  avgRate: number
  growth: number
  count: number
}

export function RegionalBreakdownWidget() {
  const [regional, setRegional] = useState<RegionalItem[]>([])
  const [byCounty, setByCounty] = useState<CountyItem[]>([])
  const [monroviaGrowth, setMonroviaGrowth] = useState<number>(0)
  const [upcountryGrowth, setUpcountryGrowth] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [showCountyBreakdown, setShowCountyBreakdown] = useState(false)

  useEffect(() => {
    fetch("/api/rates/regional")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.regional)) setRegional(data.regional)
        if (Array.isArray(data.byCounty)) setByCounty(data.byCounty)
        if (typeof data.monroviaGrowth === "number") setMonroviaGrowth(data.monroviaGrowth)
        if (typeof data.upcountryGrowth === "number") setUpcountryGrowth(data.upcountryGrowth)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Card className="rounded-xl border-border/60 shadow-sm overflow-hidden bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg text-primary" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40 text-primary" />
              <Skeleton className="h-4 w-64 text-primary" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </div>
          <Separator />
          <Skeleton className="h-[320px] w-full rounded-xl" />
        </CardContent>
      </Card>
    )
  }

  const monrovia = regional.find((r) => r.region === "Monrovia")
  const upcountry = regional.find((r) => r.region === "Upcountry")
  const monroviaRate = (monrovia ?? regional[0])?.avgRate ?? 0
  const upcountryRate = (upcountry ?? regional[1])?.avgRate ?? 0
  const spread = monroviaRate && upcountryRate ? Math.abs(monroviaRate - upcountryRate) : 0
  const spreadPercent = monroviaRate && upcountryRate
    ? ((spread / Math.min(monroviaRate, upcountryRate)) * 100).toFixed(1)
    : "0"

  const countySlice = byCounty.slice(0, 10)
  const chartData = countySlice.map((c) => ({
    county: c.county,
    growth: c.growth,
    fill: getRegionalChartColor(c.county),
  }))
  const growthValues = chartData.map((d) => d.growth)
  const minGrowth = growthValues.length ? Math.min(...growthValues) : 0
  const maxGrowth = growthValues.length ? Math.max(...growthValues) : 5
  const growthPadding = Math.max(0.2, (maxGrowth - minGrowth) * 0.15) || 0.5
  const xDomain = [Math.max(0, minGrowth - growthPadding), maxGrowth + growthPadding] as [number, number]
  const regionalChartConfig = {
    growth: { label: "Growth %", color: "var(--primary)" },
  }

  const sortedCountiesByGrowthDesc = [...byCounty].sort((a, b) => b.growth - a.growth)
  const topCounties = sortedCountiesByGrowthDesc.slice(0, 3)
  const bottomCounties = sortedCountiesByGrowthDesc
    .slice(-3)
    .sort((a, b) => a.growth - b.growth)

  return (
    <TooltipProvider delayDuration={200}>
      <Card className="rounded-2xl border-border/60 shadow-sm overflow-hidden bg-card min-w-0">
        <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-5">
          <CardTitle className="flex items-center gap-3 text-base sm:text-lg font-semibold">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-muted/40 border border-border/40 text-primary shrink-0">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="min-w-0">Regional breakdown</span>
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm leading-relaxed pl-0 sm:pl-[3.25rem] mt-1">
            Monrovia vs upcountry: annual growth plus LRD/USD context.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 pt-0 space-y-5 min-w-0">

          {/* Monrovia vs Upcountry — compact inline cards */}
          <div className="space-y-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground flex items-center gap-1.5">
              <BarChart3 className="h-3 w-3 text-primary" />
              Monrovia vs Upcountry
            </p>
            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-3 min-w-0">
              {/* Monrovia */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 dark:bg-primary/[0.08] px-4 py-3.5 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary shrink-0">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">Monrovia</span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-foreground leading-none">
                  {Number.isFinite(monroviaGrowth) ? `${monroviaGrowth.toFixed(1)}%` : "—"}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">annual growth</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-block mt-2 text-[10px] font-medium text-muted-foreground bg-muted/70 px-2 py-0.5 rounded-full cursor-default">
                      {monroviaRate ? `${monroviaRate.toFixed(2)} LRD/USD` : "—"}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Current exchange rate in this region</TooltipContent>
                </Tooltip>
              </div>

              {/* Upcountry */}
              <div className="rounded-xl border border-secondary/25 bg-secondary/5 dark:bg-secondary/[0.08] px-4 py-3.5 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/15 text-primary shrink-0">
                    <Mountain className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">Upcountry</span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-foreground leading-none">
                  {Number.isFinite(upcountryGrowth) ? `${upcountryGrowth.toFixed(1)}%` : "—"}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">annual growth</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-block mt-2 text-[10px] font-medium text-muted-foreground bg-muted/70 px-2 py-0.5 rounded-full cursor-default">
                      {upcountryRate ? `${upcountryRate.toFixed(2)} LRD/USD` : "—"}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Current exchange rate in this region</TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Growth gap pill */}
            {Number.isFinite(monroviaGrowth) && Number.isFinite(upcountryGrowth) && upcountryGrowth !== 0 && (
              <div className="flex items-center gap-2 pt-0.5">
                <div className="h-px flex-1 bg-border/50" />
                <span className="text-[11px] text-muted-foreground px-1 whitespace-nowrap flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                  Gap: <span className="font-mono font-semibold text-foreground ml-1">{Math.abs(monroviaGrowth - upcountryGrowth).toFixed(1)}pp</span>
                  <span className="mx-1 opacity-40">·</span>
                  Monrovia leads by {((Math.abs(monroviaGrowth - upcountryGrowth) / upcountryGrowth) * 100).toFixed(0)}%
                </span>
                <div className="h-px flex-1 bg-border/50" />
              </div>
            )}
          </div>

          <Separator />

          {/* County details (collapsed by default) */}
          <div className="space-y-3 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground flex items-center gap-1.5">
                  <BarChart3 className="h-3 w-3 text-primary" />
                  Economic growth by county
                </p>
                {growthValues.length > 0 ? (
                  <p className="text-[11px] text-muted-foreground">
                    Range: <span className="font-mono text-foreground">{minGrowth.toFixed(1)}%</span> to{" "}
                    <span className="font-mono text-foreground">{maxGrowth.toFixed(1)}%</span> (annualized)
                  </p>
                ) : (
                  <p className="text-[11px] text-muted-foreground">County-level data will appear when community reports are available.</p>
                )}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 rounded-lg min-h-[40px] px-3 font-medium border-primary/20 hover:bg-muted/40 border border-border/40 hover:border-primary/35"
                onClick={() => setShowCountyBreakdown((v) => !v)}
                aria-expanded={showCountyBreakdown}
              >
                {showCountyBreakdown ? "Hide chart" : "See county breakdown"}
                <ChevronDown className={`h-4 w-4 transition-transform ${showCountyBreakdown ? "rotate-180" : "rotate-0"}`} aria-hidden />
              </Button>
            </div>

            {chartData.length === 0 ? (
              <div className="h-[220px] flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-muted-foreground/25 bg-muted/20 dark:bg-muted/30 text-muted-foreground text-sm">
                <MapPin className="h-8 w-8 opacity-40 text-blue-600 dark:text-blue-400" />
                <p className="font-medium text-xs">No county data yet</p>
                <p className="text-[11px] max-w-xs text-center opacity-80">Economic growth by county will appear when community reports are available.</p>
              </div>
            ) : showCountyBreakdown ? (
              <div id="county-growth-chart" className="space-y-3 min-w-0">
                <ChartContainer config={regionalChartConfig} className="h-[260px] md:h-[300px] w-full min-w-0">
                  <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 56, left: 4, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} horizontal={false} />
                    <XAxis
                      type="number"
                      dataKey="growth"
                      domain={xDomain}
                      allowDecimals
                      tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                      stroke="var(--border)"
                      tickFormatter={(v) => `${Number(v).toFixed(1)}%`}
                    />
                    <YAxis
                      type="category"
                      dataKey="county"
                      width={96}
                      tick={{ fontSize: 11, fill: "var(--foreground)" }}
                      stroke="transparent"
                    />
                    <RechartsTooltip
                      content={
                        <ChartTooltipContent
                          labelFormatter={(_, payload): React.ReactNode => {
                            const p = payload?.[0]?.payload as Record<string, string> | undefined
                            return p ? p.county : ""
                          }}
                          formatter={(value): React.ReactNode => (typeof value === "number" ? `${value.toFixed(1)}% annual growth` : String(value))}
                        />
                      }
                      cursor={{ fill: "var(--muted)", fillOpacity: 0.25 }}
                    />
                    <Bar
                      dataKey="growth"
                      radius={[0, 5, 5, 0]}
                      name="Growth %"
                      maxBarSize={22}
                      label={{
                        position: "right",
                        fontSize: 10,
                        fill: "var(--muted-foreground)",
                        formatter: (v: unknown) => `${Number(v).toFixed(1)}%`,
                      }}
                    >
                      {chartData.map((entry) => (
                        <Cell key={entry.county} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-primary/20 bg-primary/5 dark:bg-primary/[0.08] px-4 py-3.5 min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Fastest counties
                  </p>
                  <div className="mt-2 space-y-2">
                    {topCounties.length ? (
                      topCounties.map((c) => (
                        <div key={c.county} className="flex items-center justify-between gap-3">
                          <span className="text-sm font-medium">{c.county}</span>
                          <span className="text-sm font-mono tabular-nums text-foreground">{c.growth.toFixed(1)}%</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] text-muted-foreground">—</p>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-secondary/25 bg-secondary/5 dark:bg-secondary/[0.08] px-4 py-3.5 min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Slowest counties
                  </p>
                  <div className="mt-2 space-y-2">
                    {bottomCounties.length ? (
                      bottomCounties.map((c) => (
                        <div key={c.county} className="flex items-center justify-between gap-3">
                          <span className="text-sm font-medium">{c.county}</span>
                          <span className="text-sm font-mono tabular-nums text-foreground">{c.growth.toFixed(1)}%</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] text-muted-foreground">—</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator className="my-0.5" />

          <div className="flex justify-center pt-0.5">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-lg min-h-[44px] sm:h-9 px-4 font-medium text-primary border-primary/25 hover:bg-muted/40 border border-border/40 hover:border-primary/40 w-full sm:w-auto"
              asChild
            >
              <Link href="/market" className="inline-flex items-center">
                Today&apos;s Market
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            </Button>
          </div>

        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
