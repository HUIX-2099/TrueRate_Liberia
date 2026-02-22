"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { MapPin, ChevronRight, Building2, Mountain, BarChart3 } from "lucide-react"
import Link from "next/link"
import { CountyFlag } from "@/lib/county-flags"

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
  count: number
}

export function RegionalBreakdownWidget() {
  const [regional, setRegional] = useState<RegionalItem[]>([])
  const [byCounty, setByCounty] = useState<CountyItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/rates/regional")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.regional)) setRegional(data.regional)
        if (Array.isArray(data.byCounty)) setByCounty(data.byCounty)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Card className="rounded-xl border-border/60 shadow-sm overflow-hidden bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </div>
          <Separator />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
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
  const minRate = countySlice.length ? Math.min(...countySlice.map((c) => c.avgRate)) : 0
  const maxRate = countySlice.length ? Math.max(...countySlice.map((c) => c.avgRate)) : 1
  const rateRange = maxRate - minRate || 1

  return (
    <TooltipProvider delayDuration={200}>
      <Card className="rounded-xl border-border/60 shadow-md overflow-hidden bg-gradient-to-b from-card to-card/95">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <span>Regional breakdown</span>
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed pl-[3.25rem]">
            Average USD/LRD rate by region. Monrovia (Montserrado) vs upcountry counties.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Monrovia vs Upcountry */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <BarChart3 className="h-3.5 w-3.5" />
              Monrovia vs Upcountry
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="group rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-4 text-center transition-shadow hover:shadow-md">
                <div className="flex justify-center mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <p className="text-sm font-semibold text-foreground">Monrovia</p>
                <p className="text-2xl font-bold font-mono tabular-nums text-foreground mt-1">
                  {monroviaRate ? monroviaRate.toFixed(2) : "—"}
                </p>
                <p className="text-xs text-muted-foreground">LRD per USD</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-block mt-2 text-xs font-medium text-muted-foreground bg-muted/80 px-2 py-0.5 rounded-full">
                      {(monrovia ?? regional[0])?.count ?? 0} reports
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Number of rate reports in this region</TooltipContent>
                </Tooltip>
              </div>
              <div className="group rounded-xl border border-secondary/25 bg-gradient-to-br from-secondary/5 to-secondary/10 p-4 text-center transition-shadow hover:shadow-md">
                <div className="flex justify-center mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/15">
                    <Mountain className="h-5 w-5 text-secondary" />
                  </div>
                </div>
                <p className="text-sm font-semibold text-foreground">Upcountry</p>
                <p className="text-2xl font-bold font-mono tabular-nums text-foreground mt-1">
                  {upcountryRate ? upcountryRate.toFixed(2) : "—"}
                </p>
                <p className="text-xs text-muted-foreground">LRD per USD</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-block mt-2 text-xs font-medium text-muted-foreground bg-muted/80 px-2 py-0.5 rounded-full">
                      {(upcountry ?? regional[1])?.count ?? 0} reports
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Number of rate reports in this region</TooltipContent>
                </Tooltip>
              </div>
            </div>
            {spread > 0 && (
              <p className="text-xs text-center text-muted-foreground">
                Spread: <span className="font-mono font-medium text-foreground">{spread.toFixed(2)}</span> LRD
                ({spreadPercent}% difference)
              </p>
            )}
          </div>

          <Separator className="my-1" />

          {/* By county */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">By county</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {countySlice.map((c) => {
                const pct = rateRange ? ((c.avgRate - minRate) / rateRange) * 100 : 0
                return (
                  <Tooltip key={c.county}>
                    <TooltipTrigger asChild>
                      <div className="group rounded-xl border border-border/60 bg-muted/20 p-3 text-center transition-all hover:border-primary/30 hover:bg-muted/40 hover:shadow-sm cursor-default">
                        <div className="flex justify-center mb-2">
                          <CountyFlag county={c.county} className="h-8 w-10 rounded-md shadow-sm object-cover" />
                        </div>
                        <p className="text-lg font-bold font-mono tabular-nums text-foreground">{c.avgRate.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">LRD</p>
                        <Progress value={Math.min(100, pct + 5)} className="h-1.5 mt-2 bg-muted" />
                        <p className="text-sm font-medium text-foreground mt-1.5 truncate" title={c.county}>
                          {c.county}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{c.count} reports</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">{c.county}</p>
                      <p className="text-xs text-muted-foreground">{c.avgRate.toFixed(2)} LRD/USD · {c.count} reports</p>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          </div>

          <Separator className="my-1" />

          <div className="flex justify-center pt-1">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-primary border-primary/30 hover:bg-primary/10 hover:border-primary/50"
              asChild
            >
              <Link href="/analytics">
                View full analytics
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
