"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, TrendingUp, TrendingDown, Zap, Shield, Globe } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useLiveRate } from "@/lib/live-rate-context"
import { RateSourceAttribution } from "@/components/rate-source-attribution"
import { RateFeedbackButtons } from "@/components/rate-feedback-buttons"
import { StaleRateWarning } from "@/components/stale-rate-warning"
import { RateChangeAnimation } from "@/components/rate-change-animation"
import { RateSourceSelector } from "@/components/rate-source-selector"
import { useLanguage } from "@/lib/i18n/language-context"

export function Hero() {
  const router = useRouter()
  const { t } = useLanguage()
  const { rate, loading, sources, timestamp, cblRate, cblBuying, cblSelling, cblLastUpdated, refresh, effectiveRate } = useLiveRate()
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('up')
  const [changePercent, setChangePercent] = useState(0.8)
  const lastUpdate = loading ? "Loading…" : timestamp ? (() => {
    try {
      const d = new Date(timestamp)
      const diff = (Date.now() - d.getTime()) / 60_000
      if (diff < 1) return "Just now"
      if (diff < 60) return `${Math.floor(diff)}m ago`
      return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
    } catch { return "Just now" }
  })() : "Just now"

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/2 -left-20 h-60 w-60 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-40 w-40 rounded-full bg-accent/10 blur-2xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-10 sm:py-14 md:py-20 lg:py-28 max-w-[100vw] xl:max-w-none overflow-hidden">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-8">
            {/* Live Badge */}
            <div className="inline-flex items-center gap-3 rounded-full border border-border/50 bg-card/80 backdrop-blur-sm px-5 py-2.5 text-sm w-fit shadow-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
              </span>
              <span className="text-muted-foreground font-medium">Live Updates</span>
              <span className="text-foreground font-semibold">• {lastUpdate}</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-2xl min-[480px]:text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-balance leading-[1.15]">
                The most accurate{" "}
                <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                  exchange rates
                </span>{" "}
                in Liberia
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground text-pretty max-w-2xl leading-relaxed">
                TrueRate aggregates data from <strong className="text-foreground">100+ trusted sources</strong> including
                the Central Bank, licensed changers, and international APIs to deliver real-time USD/LRD rates with{" "}
                <strong className="text-foreground">AI-powered predictions</strong>.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <Button size="lg" className="gap-2 h-14 px-8 text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all" asChild>
                <Link href="/converter">
                  Try Converter
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 h-14 px-8 text-lg bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all" asChild>
                <Link href="/predictions">
                  <TrendingUp className="h-5 w-5" />
                  View Predictions
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-8 pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-foreground">100+</span>
                  <span className="text-sm text-muted-foreground">Data Sources</span>
                </div>
              </div>
              <div className="h-12 w-px bg-border hidden sm:block" />
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-foreground">99.2%</span>
                  <span className="text-sm text-muted-foreground">Accuracy</span>
                </div>
              </div>
              <div className="h-12 w-px bg-border hidden sm:block" />
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-foreground">60s</span>
                  <span className="text-sm text-muted-foreground">Updates</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Rate Card */}
          <div className="relative lg:ml-auto w-full max-w-md mx-auto lg:mx-0">
            {/* Main Card */}
            <div className="relative rounded-2xl sm:rounded-3xl border border-border/50 bg-card/80 backdrop-blur-xl p-4 sm:p-6 md:p-8 shadow-xl shadow-primary/5 ring-1 ring-black/5 dark:ring-white/5">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="px-3 py-1">
                    <span className="relative flex h-2 w-2 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                    </span>
                    Live Rate
                  </Badge>
                </div>
                <span className={`inline-flex items-center gap-1 text-sm font-semibold ${
                  trend === 'up' ? 'text-destructive' : trend === 'down' ? 'text-secondary' : 'text-muted-foreground'
                }`}>
                  {trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {trend === 'up' ? '+' : '-'}{changePercent.toFixed(2)}%
                </span>
              </div>

              {/* Main Rate Display */}
              <div className="text-center mb-8">
                <div className="flex flex-col items-center gap-2 mb-2">
                  <RateSourceSelector variant="pills" className="mb-1" />
                  <div className="text-4xl min-[480px]:text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight">
                    <RateChangeAnimation rate={effectiveRate ?? 0}>
                      {effectiveRate ? effectiveRate.toFixed(2) : "—"}
                    </RateChangeAnimation>
                  </div>
                </div>
                <div className="text-lg text-muted-foreground mt-2">LRD per 1 USD</div>
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm mt-3">
                  <div className="rounded-lg bg-muted/50 px-3 py-1.5 text-muted-foreground">
                    <span className="font-medium text-foreground">Market rate</span>
                    <span className="ml-1.5">{rate != null && rate > 0 ? rate.toFixed(2) : "—"} LRD/USD</span>
                  </div>
                  <div className="rounded-lg bg-muted/50 px-3 py-1.5 text-muted-foreground">
                    <span className="font-medium text-foreground">Official (CBL)</span>
                    <span className="ml-1.5">{cblRate != null && cblRate > 0 ? cblRate.toFixed(2) : "—"} LRD/USD</span>
                    {cblLastUpdated ? <span className="ml-1 text-xs">· {(() => { try { return new Date(cblLastUpdated).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) } catch { return "" } })()}</span> : null}
                  </div>
                </div>
              </div>

              {/* Buy/Sell Rates: when Official (CBL) selected, show CBL buying/selling; else effectiveRate ± 2 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-secondary/10 p-4 text-center">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Buy Rate</div>
                  <div className="text-2xl font-bold text-secondary">
                    {cblBuying != null && cblRate != null && effectiveRate === cblRate
                      ? cblBuying.toFixed(2)
                      : effectiveRate
                        ? (effectiveRate - 2).toFixed(2)
                        : "—"}
                  </div>
                </div>
                <div className="rounded-2xl bg-destructive/10 p-4 text-center">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Sell Rate</div>
                  <div className="text-2xl font-bold text-destructive">
                    {(cblSelling != null && cblRate != null && effectiveRate === cblRate)
                      ? cblSelling.toFixed(2)
                      : effectiveRate
                        ? (effectiveRate + 2).toFixed(2)
                        : "—"}
                  </div>
                </div>
              </div>

              {/* Footer: source attribution + CBL when available */}
              <div className="mt-6 pt-4 border-t border-border/50 flex flex-col gap-3">
                <RateSourceAttribution
                  sources={sources}
                  timestamp={timestamp}
                  cblRate={cblRate}
                  cblLastUpdated={cblLastUpdated}
                  compositeRate={rate ?? undefined}
                  compact={false}
                  hideSources
                />
                <StaleRateWarning timestamp={timestamp} onRefresh={refresh} compact />
                <RateFeedbackButtons rate={rate ?? undefined} compact />
                <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm w-full sm:w-auto shrink-0"
                  aria-label="View rate history"
                  onClick={() => router.push("/analytics")}
                >
                  View History <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-gradient-to-br from-secondary/30 to-secondary/5 blur-2xl" />
            <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-gradient-to-br from-primary/30 to-primary/5 blur-2xl" />
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  )
}
