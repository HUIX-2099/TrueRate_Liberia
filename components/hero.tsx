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

export function Hero() {
  const router = useRouter()
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
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background via-50% to-primary/[0.08]">
      {/* Background: on mobile gradient + orbs only; from md up add sketch charts */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        {/* Abstract doodle layer – hidden on mobile for cleaner look and less paint */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.18] dark:opacity-[0.25] hidden md:block" viewBox="0 0 1200 600" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden preserveAspectRatio="xMidYMid slice">
          {/* Bar chart – upward trend (varying bar heights) */}
          <rect x="80" y="380" width="36" height="120" rx="4" fill="var(--primary)" fillOpacity="0.5" />
          <rect x="140" y="320" width="36" height="180" rx="4" fill="var(--primary)" fillOpacity="0.45" />
          <rect x="200" y="260" width="36" height="240" rx="4" fill="var(--primary)" fillOpacity="0.5" />
          <rect x="260" y="200" width="36" height="300" rx="4" fill="var(--secondary)" fillOpacity="0.4" />
          <rect x="320" y="160" width="36" height="340" rx="4" fill="var(--secondary)" fillOpacity="0.45" />
          {/* Line chart – squiggly uptrend */}
          <path d="M480 340 Q520 320 560 300 T640 260 T720 220 T800 200 T880 180 T960 160" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 4" />
          {/* Second line – two peaks */}
          <path d="M500 420 L580 360 L660 400 L740 320 L820 380 L900 300" stroke="var(--secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 3" />
          {/* Growth arrows – upward */}
          <path d="M1040 280 L1040 200 M1020 220 L1040 200 L1060 220" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M1120 340 L1120 260 M1100 280 L1120 260 L1140 280" stroke="var(--secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Pie segment hint (circle with slice) */}
          <circle cx="180" cy="180" r="70" stroke="var(--primary)" strokeWidth="1.5" fill="none" strokeDasharray="3 4" />
          <path d="M180 180 L180 110 A70 70 0 0 1 235 155 Z" fill="var(--primary)" fillOpacity="0.25" stroke="var(--primary)" strokeWidth="1" />
        </svg>
        {/* Orbs: smaller and softer on mobile */}
        <div className="absolute -top-24 -right-24 h-48 w-48 sm:h-64 sm:w-64 md:-top-40 md:-right-40 md:h-80 md:w-80 rounded-full bg-primary/10 sm:bg-primary/12 blur-2xl md:blur-3xl" />
        <div className="absolute top-1/2 -left-12 h-40 w-40 sm:h-52 sm:w-52 md:-left-20 md:h-60 md:w-60 rounded-full bg-secondary/10 sm:bg-secondary/12 blur-2xl md:blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 rounded-full bg-accent/8 sm:bg-accent/10 blur-xl md:blur-2xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 min-[480px]:px-5 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 md:py-24 lg:py-32 max-w-[100vw] xl:max-w-none overflow-hidden">
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-20 lg:items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-5 sm:gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both min-w-0">
            {/* Update badge */}
            <div className="inline-flex items-center gap-2 sm:gap-3 rounded-full border border-primary/25 bg-card/95 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm w-fit shadow-md ring-1 ring-primary/10">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary" />
              </span>
              <span className="text-muted-foreground font-medium">Updated</span>
              <span className="text-muted-foreground/80">·</span>
              <span className="text-foreground font-semibold tabular-nums" aria-live="polite">{lastUpdate}</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-3 sm:space-y-4 md:space-y-5 min-w-0">
              <h1 className="text-2xl min-[380px]:text-3xl min-[480px]:text-4xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-balance leading-[1.15]">
                The Engine Behind{" "}
                <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                  Market Transparency in Liberia
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-pretty max-w-2xl leading-[1.6]">
                TrueRate is a fintech and market transparency platform serving Liberian citizens and businesses with{" "}
                <strong className="text-foreground font-semibold">reliable exchange rate information</strong>, market intelligence, and financial tools.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <Button
                size="lg"
                className="gap-2 h-11 sm:h-12 md:h-14 px-5 sm:px-6 md:px-8 text-base sm:text-lg rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ring-2 ring-primary/20 w-full sm:w-auto"
                asChild
              >
                <Link href="/converter">
                  Try Converter
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 h-11 sm:h-12 md:h-14 px-5 sm:px-6 md:px-8 text-base sm:text-lg rounded-xl bg-background/70 backdrop-blur-sm border-2 hover:bg-background hover:border-primary/40 hover:shadow-sm transition-all w-full sm:w-auto"
                asChild
              >
                <Link href="/predictions">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                  View Predictions
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 md:gap-10 pt-0 sm:pt-2">
              <div className="flex items-center gap-2.5 sm:gap-4 rounded-xl sm:rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm px-3 py-2.5 sm:px-5 sm:py-3.5 shadow-sm hover:border-primary/20 hover:bg-card/80 transition-colors min-w-0">
                <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-primary/15">
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-lg sm:text-xl font-bold text-foreground tabular-nums">100+</span>
                  <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Sources</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 sm:gap-4 rounded-xl sm:rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm px-3 py-2.5 sm:px-5 sm:py-3.5 shadow-sm hover:border-secondary/20 hover:bg-card/80 transition-colors min-w-0">
                <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-secondary/15">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-lg sm:text-xl font-bold text-foreground tabular-nums">99.2%</span>
                  <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Accuracy</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 sm:gap-4 rounded-xl sm:rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm px-3 py-2.5 sm:px-5 sm:py-3.5 shadow-sm hover:border-accent/20 hover:bg-card/80 transition-colors min-w-0">
                <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-accent/15">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-lg sm:text-xl font-bold text-foreground tabular-nums">60s</span>
                  <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">Updates</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Rate Card */}
          <div className="relative lg:ml-auto w-full max-w-md mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both delay-150 min-w-0 order-first lg:order-none">
            {/* Main Card */}
            <div className="relative rounded-2xl sm:rounded-3xl border border-primary/15 bg-card/95 backdrop-blur-xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-xl shadow-primary/10 hover:shadow-2xl hover:shadow-primary/15 transition-shadow duration-300 ring-1 ring-black/5 dark:ring-white/5">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Badge variant="secondary" className="px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm shrink-0">
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
              <div className="text-center mb-5 sm:mb-6 md:mb-8">
                <div className="flex flex-col items-center gap-2 sm:gap-3 mb-2">
                  <RateSourceSelector variant="pills" className="mb-1 w-full justify-center" />
                  <div className="text-3xl min-[380px]:text-4xl min-[480px]:text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight tabular-nums">
                    <RateChangeAnimation rate={effectiveRate ?? 0}>
                      {effectiveRate ? effectiveRate.toFixed(2) : "—"}
                    </RateChangeAnimation>
                  </div>
                </div>
                <div className="text-base sm:text-lg text-muted-foreground mt-1 sm:mt-2">LRD per 1 USD</div>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-x-6 sm:gap-y-2 text-xs sm:text-sm mt-2 sm:mt-3">
                  <div className="rounded-lg bg-muted/50 px-2.5 py-1 sm:px-3 sm:py-1.5 text-muted-foreground">
                    <span className="font-medium text-foreground">Market rate</span>
                    <span className="ml-1 sm:ml-1.5">{rate != null && rate > 0 ? rate.toFixed(2) : "—"} LRD/USD</span>
                  </div>
                  <div className="rounded-lg bg-muted/50 px-2.5 py-1 sm:px-3 sm:py-1.5 text-muted-foreground">
                    <span className="font-medium text-foreground">Official (CBL)</span>
                    <span className="ml-1 sm:ml-1.5">{cblRate != null && cblRate > 0 ? cblRate.toFixed(2) : "—"} LRD/USD</span>
                    {cblLastUpdated ? <span className="ml-1 text-xs">· {(() => { try { return new Date(cblLastUpdated).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) } catch { return "" } })()}</span> : null}
                  </div>
                </div>
              </div>

              {/* Buy/Sell Rates: when Official (CBL) selected, show CBL buying/selling; else effectiveRate ± 2 */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="rounded-xl sm:rounded-2xl bg-secondary/10 p-3 sm:p-4 text-center min-w-0">
                  <div className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5 sm:mb-1">Buy Rate</div>
                  <div className="text-xl sm:text-2xl font-bold text-secondary tabular-nums">
                    {cblBuying != null && cblRate != null && effectiveRate === cblRate
                      ? cblBuying.toFixed(2)
                      : effectiveRate
                        ? (effectiveRate - 2).toFixed(2)
                        : "—"}
                  </div>
                </div>
                <div className="rounded-xl sm:rounded-2xl bg-destructive/10 p-3 sm:p-4 text-center min-w-0">
                  <div className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5 sm:mb-1">Sell Rate</div>
                  <div className="text-xl sm:text-2xl font-bold text-destructive tabular-nums">
                    {(cblSelling != null && cblRate != null && effectiveRate === cblRate)
                      ? cblSelling.toFixed(2)
                      : effectiveRate
                        ? (effectiveRate + 2).toFixed(2)
                        : "—"}
                  </div>
                </div>
              </div>

              {/* Footer: source attribution + CBL when available */}
              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-border/50 flex flex-col gap-2 sm:gap-3">
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

            {/* Decorative glow behind card */}
            <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-gradient-to-br from-secondary/20 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute -top-8 -left-8 h-32 w-32 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
    </section>
  )
}
