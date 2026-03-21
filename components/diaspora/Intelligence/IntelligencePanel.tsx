"use client"

import { useState, useEffect, useMemo } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { ArrowRight, LineChart, Radio } from "lucide-react"
import { SectionContainer } from "@/components/ui/section-container"
import { MarketSentimentIndicator } from "./MarketSentimentIndicator"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import type { RateChartPeriod } from "./RateChart"

const RateChart = dynamic(() => import("./RateChart"), {
  ssr: false,
  loading: () => (
    <div className="h-[260px] w-full rounded-xl border border-border/60 bg-muted/20 flex items-center justify-center text-sm text-muted-foreground animate-pulse">
      Loading chart…
    </div>
  ),
})

const CommodityTracker = dynamic(() => import("./CommodityTracker"), {
  ssr: false,
  loading: () => (
    <div className="h-32 w-full rounded-xl border border-border/60 bg-muted/20 flex items-center justify-center text-sm text-muted-foreground animate-pulse">
      Loading commodities…
    </div>
  ),
})

function formatRateAge(iso: string | undefined): string {
  if (!iso) return ""
  try {
    const d = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffM = Math.floor(diffMs / 60000)
    if (diffM < 1) return "Updated just now"
    if (diffM < 60) return `Updated ${diffM}m ago`
    const diffH = Math.floor(diffM / 60)
    if (diffH < 24) return `Updated ${diffH}h ago`
    return `Updated ${d.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
  } catch {
    return ""
  }
}

export function IntelligencePanel() {
  const [liveRate, setLiveRate] = useState<number | null>(null)
  const [officialRate, setOfficialRate] = useState<number | null>(null)
  const [rateUpdated, setRateUpdated] = useState<string | undefined>(undefined)
  const [period, setPeriod] = useState<RateChartPeriod>("7d")
  const [showInflationOverlay, setShowInflationOverlay] = useState(false)

  useEffect(() => {
    fetch("/api/rates/live")
      .then((res) => res.json())
      .then((data) => {
        if (data.rate != null && typeof data.rate === "number") setLiveRate(data.rate)
        if (typeof data.timestamp === "string") setRateUpdated(data.timestamp)
        const official = data.officialRate ?? data.cblRate
        if (typeof official === "number" && official > 0) setOfficialRate(official)
        else setOfficialRate(null)
      })
      .catch(() => {})
  }, [])

  const spreadPct = useMemo(() => {
    if (officialRate != null && officialRate > 0 && liveRate != null) {
      return Number((((liveRate - officialRate) / officialRate) * 100).toFixed(2))
    }
    return null
  }, [officialRate, liveRate])

  const sentiment = useMemo((): "stable" | "watch" | "volatile" => {
    if (spreadPct == null) return "stable"
    if (spreadPct >= 5) return "volatile"
    if (spreadPct >= 2) return "watch"
    return "stable"
  }, [spreadPct])

  const updatedLabel = formatRateAge(rateUpdated)

  return (
    <SectionContainer
      id="intelligence"
      title="Economic intelligence"
      description="Big-picture trends and everyday prices together—so you see how the dollar, mood of the market, and staples move at the same time."
      action={
        <Button
          size="sm"
          variant="outline"
          asChild
          className="gap-2 min-h-[44px] rounded-xl border-border/50 hover:border-primary/30 shadow-sm"
        >
          <Link href="/market-intelligence">
            Open dashboard
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </Button>
      }
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden
            />
            <div className="relative flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/40 border border-border/40">
                <Radio className="h-5 w-5 text-primary" aria-hidden />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">USD/LRD now</p>
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                    Live
                  </span>
                </div>
                <p className="text-2xl sm:text-[1.65rem] font-bold tabular-nums text-foreground tracking-tight">
                  {liveRate != null ? `${liveRate.toFixed(0)} LRD` : "—"}
                  <span className="text-sm font-semibold text-muted-foreground"> / $1</span>
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Typical street mid-rate from aggregated sources—use it as a quick pulse before you send, shop, or price a trip.
                </p>
                {updatedLabel !== "" ? (
                  <p className="text-[11px] font-medium text-muted-foreground/90 pt-1">{updatedLabel}</p>
                ) : null}
              </div>
            </div>
          </div>

          <MarketSentimentIndicator sentiment={sentiment} size="md" spreadPct={spreadPct} />
        </div>

        <div className="rounded-xl border border-border/40 bg-muted/10 p-4 sm:p-5 space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background border border-border/50">
                <LineChart className="h-5 w-5 text-primary" aria-hidden />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Rate path &amp; price pressure</h3>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed max-w-xl">
                  Follow how USD/LRD drifts across the window you care about. Toggle the overlay to compare an{" "}
                  <span className="text-foreground/80 font-medium">indexed inflation pulse</span> (illustrative) on the
                  same timeline—handy for seeing when FX and price pressure move together.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Chart time range">
              {(["7d", "30d", "90d"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={cn(
                    "rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all min-h-[44px]",
                    period === p
                      ? "border-primary bg-primary/12 text-primary shadow-sm ring-1 ring-primary/20"
                      : "border-border/50 bg-background/80 text-muted-foreground hover:bg-muted/50 hover:border-border/70 hover:text-foreground"
                  )}
                  aria-pressed={period === p}
                >
                  {p === "7d" ? "7 days" : p === "30d" ? "30 days" : "90 days"}
                </button>
              ))}
            </div>

            <div className="flex flex-1 flex-col gap-2 rounded-xl border border-border/40 bg-background/60 p-3 sm:p-3.5 sm:max-w-md lg:ml-auto">
              <div className="flex items-start gap-3">
                <Switch
                  id="inflation-overlay"
                  checked={showInflationOverlay}
                  onCheckedChange={setShowInflationOverlay}
                  className="mt-0.5"
                />
                <div className="min-w-0 space-y-1">
                  <Label htmlFor="inflation-overlay" className="text-sm font-semibold text-foreground cursor-pointer">
                    Inflation overlay
                  </Label>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Layers a demo index that reacts like broad price pressure—use it to read timing, not exact CPI.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <RateChart period={period} showInflationOverlay={showInflationOverlay} />
        </div>

        <div>
          <div className="mb-4 space-y-1">
            <h3 className="text-sm font-semibold text-foreground">Commodity tracker</h3>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
              Three goods Liberian households and builders watch constantly. Percent moves are week-over-week examples—pair
              with the chart above to feel how FX and shelves interact.
            </p>
          </div>
          <CommodityTracker />
        </div>
      </div>
    </SectionContainer>
  )
}
