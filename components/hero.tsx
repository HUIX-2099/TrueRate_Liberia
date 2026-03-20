"use client"

import { Button } from "@/components/ui/button"

const HERO_ARIA_LABEL = "Hero: TrueRate — daily money support for Liberia"
const HERO_DESCRIPTION = "Know what is happening in Liberia's economy today, then plan tomorrow with clear market facts and practical tools for your home, your work, and your future."
import { ArrowRight, TrendingUp, TrendingDown, Zap, Shield, Globe } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
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
  const [lastUpdate, setLastUpdate] = useState("Just now")
  useEffect(() => {
    if (loading) { setLastUpdate("Loading…"); return }
    if (!timestamp) { setLastUpdate("Just now"); return }
    function tick() {
      try {
        const d = new Date(timestamp)
        const diff = (Date.now() - d.getTime()) / 60_000
        if (diff < 1) setLastUpdate("Just now")
        else if (diff < 60) setLastUpdate(`${Math.floor(diff)}m ago`)
        else setLastUpdate(d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }))
      } catch { setLastUpdate("Just now") }
    }
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [loading, timestamp])

  return (
    <section
      id="hero"
      aria-label={HERO_ARIA_LABEL}
      className="relative overflow-x-hidden min-h-[min(42vh,360px)] sm:min-h-[44vh] bg-background border-b border-border/30"
    >

      <div className="container relative z-10 mx-auto min-w-0 max-w-[100vw] xl:max-w-none overflow-x-hidden py-6 sm:py-10 md:py-14 lg:py-20 xl:py-24">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-16 xl:gap-20 lg:items-center">
          {/* Left: messaging */}
          <div className="flex flex-col gap-5 sm:gap-6 md:gap-7 min-w-0 text-left px-4 py-5 sm:px-6 sm:py-7 md:px-0 md:py-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-muted/20 border border-border/50 px-3 py-1.5 text-sm w-fit">
                <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-70" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-muted-foreground font-medium">Live</span>
                <span className="text-muted-foreground/60" aria-hidden>·</span>
                <span className="text-foreground font-semibold tabular-nums" aria-live="polite">{lastUpdate}</span>
              </div>
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground border border-border/50 rounded-full px-3 py-1">
                Built for smarter money decisions
              </span>
            </div>

            <div className="space-y-3 sm:space-y-4 min-w-0 animate-in fade-in slide-in-from-bottom-3 duration-600 fill-mode-both delay-75">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Trusted market facts
              </p>
              <h1 className="font-display text-2xl min-[360px]:text-3xl min-[380px]:text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-balance leading-[1.08]">
                <span className="inline-block pb-1.5 text-foreground">
                  Know today. Plan tomorrow.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground text-pretty max-w-xl leading-[1.65]">
                {HERO_DESCRIPTION}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <Button
                size="lg"
                className="group gap-2.5 min-h-[48px] h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 ring-2 ring-primary/15 w-full sm:w-auto font-semibold tracking-wide"
                asChild
              >
                <Link href="/converter" className="inline-flex items-center gap-2.5">
                  Convert Money
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 text-muted-foreground" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group gap-2.5 min-h-[48px] h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg rounded-2xl border-2 bg-background/80 backdrop-blur-sm hover:bg-primary/5 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 w-full sm:w-auto font-semibold tracking-wide"
                asChild
              >
                <Link href="/price-index" className="inline-flex items-center gap-2.5">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 text-green-600 dark:text-green-400" />
                  Check Fair Prices
                </Link>
              </Button>
            </div>

            {/* Trust stats — mini-cards bar on mobile */}
            <div className="md:hidden pt-1 min-w-0">
              <div className="flex items-stretch gap-2 rounded-2xl border border-border/45 bg-muted/10 p-3.5">
                <div className="flex flex-1 min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl bg-muted/30 py-2 px-2 border border-border/30">
                  <Globe className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                  <span className="text-sm font-bold text-foreground tabular-nums">100+</span>
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Sources</span>
                </div>
                <div className="flex flex-1 min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl bg-muted/30 py-2 px-2 border border-border/30">
                  <Shield className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                  <span className="text-sm font-bold text-foreground tabular-nums">99.2%</span>
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Accuracy</span>
                </div>
                <div className="flex flex-1 min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl bg-muted/30 py-2 px-2 border border-border/30">
                  <Zap className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                  <span className="text-sm font-bold text-foreground tabular-nums">60s</span>
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Updates</span>
                </div>
              </div>
            </div>
            <div className="hidden md:grid grid-cols-3 gap-3 lg:gap-4 pt-1 min-w-0">
              <div className="rounded-xl border border-border/60 bg-card px-3 py-3 lg:px-4 lg:py-4 text-center transition-colors hover:border-border/80 min-w-0">
                <div className="flex justify-center mb-1 lg:mb-1.5">
                  <span className="flex h-8 w-8 lg:h-10 lg:w-10 items-center justify-center rounded-lg lg:rounded-xl bg-muted/40 border border-border/40 text-foreground">
                    <Globe className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
                  </span>
                </div>
                <span className="block text-xl lg:text-2xl font-bold text-foreground tabular-nums leading-none">100+</span>
                <span className="block text-[10px] lg:text-xs font-medium text-muted-foreground uppercase tracking-wider mt-0.5 lg:mt-1">Sources</span>
              </div>
              <div className="rounded-xl border border-border/60 bg-card px-3 py-3 lg:px-4 lg:py-4 text-center transition-colors hover:border-border/80 min-w-0">
                <div className="flex justify-center mb-1 lg:mb-1.5">
                  <span className="flex h-8 w-8 lg:h-10 lg:w-10 items-center justify-center rounded-lg lg:rounded-xl bg-muted/40 border border-border/40 text-foreground">
                    <Shield className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
                  </span>
                </div>
                <span className="block text-xl lg:text-2xl font-bold text-foreground tabular-nums leading-none">99.2%</span>
                <span className="block text-[10px] lg:text-xs font-medium text-muted-foreground uppercase tracking-wider mt-0.5 lg:mt-1">Accuracy</span>
              </div>
              <div className="rounded-xl border border-border/60 bg-card px-3 py-3 lg:px-4 lg:py-4 text-center transition-colors hover:border-border/80 min-w-0">
                <div className="flex justify-center mb-1 lg:mb-1.5">
                  <span className="flex h-8 w-8 lg:h-10 lg:w-10 items-center justify-center rounded-lg lg:rounded-xl bg-muted/40 border border-border/40 text-foreground">
                    <Zap className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
                  </span>
                </div>
                <span className="block text-xl lg:text-2xl font-bold text-foreground tabular-nums leading-none">60s</span>
                <span className="block text-[10px] lg:text-xs font-medium text-muted-foreground uppercase tracking-wider mt-0.5 lg:mt-1">Updates</span>
              </div>
            </div>
          </div>

          {/* Right - Rate Card: mobile-first order-first so rate is first on small screens */}
          <div className="relative lg:ml-auto w-full max-w-md mx-auto lg:mx-0 min-w-0 order-first lg:order-none animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both delay-150">
            <div className="relative rounded-xl sm:rounded-2xl">
              <div className="relative rounded-2xl border border-border/50 bg-card p-4 sm:p-5 md:p-6 lg:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-3 sm:mb-5 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-70" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Live Rate
                  </span>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold tabular-nums ${ trend === 'up' ? 'text-red-600 dark:text-red-400' : trend === 'down' ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground' }`}
                >
                  {trend === 'up' ? <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" /> : <TrendingDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600 dark:text-red-400" />}
                  {trend === 'up' ? '+' : '-'}{changePercent.toFixed(2)}%
                </span>
              </div>

              <div className="text-center mb-4 sm:mb-6 md:mb-8">
                <div className="flex flex-col items-center gap-1.5 sm:gap-3 mb-1.5 sm:mb-2">
                  <RateSourceSelector variant="pills" className="mb-0.5 sm:mb-1 w-full justify-center" />
                  <div className="text-3xl min-[380px]:text-4xl min-[480px]:text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight tabular-nums" aria-live="polite">
                    <RateChangeAnimation rate={effectiveRate ?? rate ?? 0}>
                      {(effectiveRate ?? rate) ? (effectiveRate ?? rate)!.toFixed(2) : "—"}
                    </RateChangeAnimation>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2 font-medium">LRD per 1 USD</p>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-x-3 sm:gap-y-2 text-xs sm:text-sm mt-3">
                  <div className="rounded-lg bg-muted/30 px-3 py-2 text-muted-foreground border border-border/40">
                    <span className="font-medium text-foreground">Market</span>
                    <span className="ml-1.5 tabular-nums">
                      {(() => {
                        const market = (rate != null && rate > 0) ? rate : (cblBuying != null && cblSelling != null ? (cblBuying + cblSelling) / 2 : (cblRate ?? 0))
                        return market > 0 ? `${market.toFixed(2)} LRD` : "—"
                      })()}
                    </span>
                  </div>
                  <div className="rounded-lg bg-muted/30 px-3 py-2 text-muted-foreground border border-border/40">
                    <span className="font-medium text-foreground">CBL</span>
                    <span className="ml-1.5 tabular-nums">{cblRate != null && cblRate > 0 ? cblRate.toFixed(2) : "—"} LRD</span>
                    {cblLastUpdated ? <span className="ml-1 text-[10px] sm:text-xs opacity-80">· {(() => { try { return new Date(cblLastUpdated).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) } catch { return "" } })()}</span> : null}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="rounded-xl sm:rounded-2xl bg-muted/20 border border-border/40 p-3 sm:p-4 text-center min-w-0">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5 sm:mb-1">Buy Rate</div>
                  <div className="text-xl sm:text-2xl font-bold text-secondary tabular-nums">
                    {cblBuying != null && cblRate != null && effectiveRate === cblRate
                      ? cblBuying.toFixed(2)
                      : effectiveRate
                        ? (effectiveRate - 2).toFixed(2)
                        : "—"}
                  </div>
                </div>
                <div className="rounded-xl sm:rounded-2xl bg-muted/20 border border-border/40 p-3 sm:p-4 text-center min-w-0">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5 sm:mb-1">Sell Rate</div>
                  <div className="text-xl sm:text-2xl font-bold text-destructive tabular-nums">
                    {(cblSelling != null && cblRate != null && effectiveRate === cblRate)
                      ? cblSelling.toFixed(2)
                      : effectiveRate
                        ? (effectiveRate + 2).toFixed(2)
                        : "—"}
                  </div>
                </div>
              </div>

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
                  className="group h-8 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm w-full sm:w-auto shrink-0 border-0"
                  aria-label="View today's market"
                  onClick={() => router.push("/market")}
                >
                  View Market <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-200 group-hover:translate-x-0.5 text-muted-foreground" />
                </Button>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
