"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useLiveRate } from "@/lib/live-rate-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, TrendingDown, TrendingUp, ArrowRight } from "lucide-react"
import { RateSourceAttribution } from "@/components/rate-source-attribution"
import { RateHistoryExport } from "@/components/rate-history-export"
import { StaleRateWarning } from "@/components/stale-rate-warning"
import { RateSourceSelector } from "@/components/rate-source-selector"
import { RateChangeAnimation } from "@/components/rate-change-animation"
import { RateFeedbackButtons } from "@/components/rate-feedback-buttons"
import { useLanguage } from "@/lib/i18n/language-context"
import { RateBrief } from "@/components/rate-brief"

interface Changer {
  id: string
  name: string
  location: string
  buyRate: number
  sellRate: number
  rating: number
  verified: boolean
}

export default function RatesPage() {
  const { t } = useLanguage()
  const {
    rate: liveRate,
    loading: rateLoading,
    sources: rateSources,
    timestamp: rateTimestamp,
    cblRate,
    cblBuying,
    cblSelling,
    cblLastUpdated,
    refresh: refreshLiveRate,
    effectiveRate,
  } = useLiveRate()
  const [sourceCount, setSourceCount] = useState(0)
  const [changers, setChangers] = useState<Changer[]>([])
  const [recentRates, setRecentRates] = useState<number[]>([])
  const [previousDayRate, setPreviousDayRate] = useState<number | null>(null)

  const lastUpdate = rateLoading
    ? "Loading…"
    : rateTimestamp
      ? (() => {
          try {
            const d = new Date(rateTimestamp)
            const diff = (Date.now() - d.getTime()) / 60_000
            if (diff < 1) return "Just now"
            if (diff < 60) return `${Math.floor(diff)}m ago`
            return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
          } catch {
            return "Just now"
          }
        })()
      : "Just now"

  useEffect(() => {
    const fetchChangers = async () => {
      try {
        const res = await fetch("/api/rates/live")
        const data = await res.json()
        if (Array.isArray(data?.changers)) {
          setSourceCount(data.changers.length)
          setChangers(data.changers)
        }
      } catch (error) {
        console.error("[Rates] Failed to fetch changers", error)
      }
    }
    fetchChangers()
    const interval = setInterval(fetchChangers, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const today = new Date().toDateString()
    const storedDate = window.localStorage.getItem("truerate-last-date")
    const storedRate = window.localStorage.getItem("truerate-last-rate")
    const storedPrev = window.localStorage.getItem("truerate-prev-day-rate")

    if (storedDate && storedDate !== today && storedRate) {
      window.localStorage.setItem("truerate-prev-day-rate", storedRate)
      setPreviousDayRate(Number.parseFloat(storedRate))
    } else if (storedPrev) {
      setPreviousDayRate(Number.parseFloat(storedPrev))
    }

    window.localStorage.setItem("truerate-last-date", today)
    window.localStorage.setItem("truerate-last-rate", liveRate.toString())
  }, [liveRate])

  useEffect(() => {
    if (!Number.isFinite(liveRate)) return
    setRecentRates((prev) => {
      const seeded = prev.length === 0 ? [liveRate, liveRate] : [...prev, liveRate]
      const next = seeded.slice(-12)
      window.localStorage.setItem("truerate-recent-rates", JSON.stringify(next))
      return next
    })
  }, [liveRate])

  useEffect(() => {
    const stored = window.localStorage.getItem("truerate-recent-rates")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length) {
          setRecentRates(parsed.filter((value) => typeof value === "number"))
        }
      } catch (error) {
        console.error("[Rates] Invalid cached recent rates JSON", error)
        window.localStorage.removeItem("truerate-recent-rates")
      }
    }
  }, [])

  const change = useMemo(() => {
    if (previousDayRate === null) return null
    return liveRate - previousDayRate
  }, [liveRate, previousDayRate])

  const recommendation = useMemo(() => {
    if (change === null) {
      return "Track the rate today and set an alert near your typical buy/sell target."
    }
    if (change >= 1.5) {
      return "Rate is rising fast; consider buying USD sooner or set a sell alert."
    }
    if (change <= -1.5) {
      return "Rate is easing; consider waiting or setting a lower buy target."
    }
    return "Rate is stable; compare changers and set a tight alert band."
  }, [change])

  const sparklinePath = useMemo(() => {
    if (recentRates.length < 2) return ""
    const min = Math.min(...recentRates)
    const max = Math.max(...recentRates)
    const range = max - min || 1
    const points = recentRates.map((value, index) => {
      const x = (index / (recentRates.length - 1)) * 100
      const y = 40 - ((value - min) / range) * 40
      return `${x},${y}`
    })
    return `M ${points.join(" L ")}`
  }, [recentRates])

  const topChangers = useMemo(() => {
    return [...changers].sort((a, b) => b.rating - a.rating).slice(0, 3)
  }, [changers])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
        <section className="py-10 sm:py-14 md:py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-[100vw] xl:max-w-none">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                <Badge variant="outline">Live Rates</Badge>
                <Badge variant="secondary">Updated {lastUpdate}</Badge>
                <Badge variant="outline">
                  {sourceCount ? `${sourceCount} changers` : "Loading sources"}
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-balance"><span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">USD to LRD Live Rate</span></h1>
              <p className="text-base sm:text-lg text-muted-foreground text-pretty">
                Real-time updates from verified changers across Liberia.
              </p>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
              {/* Main rate card – same layout as hero */}
              <div className="relative rounded-2xl sm:rounded-3xl border border-border/50 bg-card/80 backdrop-blur-xl p-4 sm:p-6 md:p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="px-3 py-1">
                      <span className="relative flex h-2 w-2 mr-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                      </span>
                      Live Rate
                    </Badge>
                    {sourceCount > 0 && (
                      <span className="text-sm text-muted-foreground">· {sourceCount} changers</span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">{lastUpdate}</span>
                </div>

                <div className="text-center mb-8">
                  <div className="flex flex-col items-center gap-2 mb-2">
                    <RateSourceSelector variant="pills" className="mb-1" />
                    <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight">
                      <RateChangeAnimation rate={effectiveRate ?? 0}>
                        {effectiveRate ? effectiveRate.toFixed(2) : "—"}
                      </RateChangeAnimation>
                    </div>
                  </div>
                  <div className="text-lg text-muted-foreground mt-2">LRD per 1 USD</div>
                  <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm mt-3">
                    <div className="rounded-lg bg-muted/50 px-3 py-1.5 text-muted-foreground">
                      <span className="font-medium text-foreground">Market rate</span>
                      <span className="ml-1.5">{liveRate != null && liveRate > 0 ? liveRate.toFixed(2) : "—"} LRD/USD</span>
                    </div>
                    <div className="rounded-lg bg-muted/50 px-3 py-1.5 text-muted-foreground">
                      <span className="font-medium text-foreground">Official (CBL)</span>
                      <span className="ml-1.5">{cblRate != null && cblRate > 0 ? cblRate.toFixed(2) : "—"} LRD/USD</span>
                      {cblLastUpdated ? <span className="ml-1 text-xs">· {(() => { try { return new Date(cblLastUpdated).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) } catch { return "" } })()}</span> : null}
                    </div>
                  </div>
                  <div className="flex justify-center mt-2"><RateBrief variant="inline" /></div>
                </div>

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

                <div className="mt-6 pt-4 border-t border-border/50 flex flex-col gap-3">
                  <RateSourceAttribution
                    sources={rateSources}
                    timestamp={rateTimestamp}
                    cblRate={cblRate}
                    cblLastUpdated={cblLastUpdated}
                    compositeRate={liveRate ?? undefined}
                    compact={false}
                    hideSources
                  />
                  <StaleRateWarning timestamp={rateTimestamp} onRefresh={refreshLiveRate} compact />
                  <RateFeedbackButtons rate={liveRate ?? undefined} compact />
                  <Link href="/analytics" className="block">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm w-full sm:w-auto shrink-0"
                      aria-label="View rate history"
                    >
                      View History <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">Explore the Market</CardTitle>
                  <CardDescription>Compare locations and trends</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    See where rates are best and compare verified changers by county.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Link href="/map">
                      <Button variant="outline" className="gap-2">
                        <MapPin className="h-4 w-4" />
                        Open Rate Map
                      </Button>
                    </Link>
                    <Link href="/analytics">
                      <Button className="gap-2">
                        <TrendingUp className="h-4 w-4" />
                        View Analytics
                      </Button>
                    </Link>
                    <RateHistoryExport />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid gap-6 lg:grid-cols-3">
              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Daily Change</CardTitle>
                  <CardDescription>Compared to previous day</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {change === null ? (
                    <div className="text-sm text-muted-foreground">Not enough history yet.</div>
                  ) : (
                    <div className="flex items-center gap-2 text-2xl font-bold">
                      {change >= 0 ? (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      )}
                      <span className={change >= 0 ? "text-green-600" : "text-red-600"}>
                        {change >= 0 ? "+" : ""}
                        {change.toFixed(2)} LRD
                      </span>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Stored locally and updates on your next daily visit.
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Rate Trend</CardTitle>
                  <CardDescription>Last 12 updates • {recentRates.length} data points</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-24 w-full rounded-lg bg-gradient-to-b from-muted/20 to-muted/5 border border-border/40 flex items-center justify-center relative overflow-hidden">
                    {sparklinePath ? (
                      <svg viewBox="0 0 100 40" className="h-full w-full absolute inset-0">
                        <defs>
                          <linearGradient id="sparkline-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
                          </linearGradient>
                        </defs>
                        <path
                          d={`${sparklinePath} L 100,40 L 0,40 Z`}
                          fill="url(#sparkline-gradient)"
                          stroke="none"
                        />
                        <path
                          d={sparklinePath}
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <span className="text-xs text-muted-foreground">Collecting data...</span>
                    )}
                  </div>
                  {recentRates.length >= 2 && (
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                      <span>Range: {(Math.min(...recentRates)).toFixed(2)} - {(Math.max(...recentRates)).toFixed(2)}</span>
                      <span className="text-primary font-medium">
                        {recentRates[recentRates.length - 1] > recentRates[recentRates.length - 2] ? '↗' : recentRates[recentRates.length - 1] < recentRates[recentRates.length - 2] ? '↘' : '→'}
                        {(recentRates[recentRates.length - 1] - recentRates[recentRates.length - 2]).toFixed(2)}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Top Rated Changers</CardTitle>
                  <CardDescription>Highest rated by community</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {topChangers.length ? (
                    topChangers.map((changer, index) => (
                      <div key={changer.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                            #{index + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm truncate">{changer.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{changer.location}</div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-semibold text-sm">{changer.buyRate.toFixed(2)}</div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span className="text-yellow-500">★</span>
                            <span>{changer.rating}</span>
                            {changer.verified && <Badge variant="secondary" className="text-xs px-1 py-0 h-4">✓</Badge>}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground text-center py-4">Loading changers...</div>
                  )}
                  {topChangers.length > 0 && (
                    <div className="pt-2 border-t border-border/40">
                      <Link href="/map" className="text-sm text-primary hover:underline">
                        View all changers on map →
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="lg:col-span-3 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    Smart Recommendation
                  </CardTitle>
                  <CardDescription>AI-powered insights based on today’s rate movement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-foreground font-medium leading-relaxed">
                        {recommendation}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link href="/analytics">
                        <Button variant="outline" size="sm" className="gap-2">
                          <TrendingUp className="h-4 w-4" />
                          View Trends
                        </Button>
                      </Link>
                      <Link href="/community">
                        <Button variant="outline" size="sm" className="gap-2">
                          <MapPin className="h-4 w-4" />
                          Find Nearby
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
