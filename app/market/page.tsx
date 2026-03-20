"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useLiveRate } from "@/lib/live-rate-context"
import { clampToValidRate } from "@/lib/canonical-rate"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MapPin, TrendingDown, TrendingUp, ArrowRight, DollarSign, BarChart3,
  ShoppingBasket, Fuel, Bus, Home, Phone, Stethoscope,
  AlertTriangle, CheckCircle2, Clock, Shield, Zap,
  ShoppingCart, ChevronRight, ArrowUpDown,
  Lightbulb, Users, ThumbsUp, ThumbsDown, Minus,
  GraduationCap, BookOpen, Utensils, Smartphone,
} from "lucide-react"
import { RateSourceAttribution } from "@/components/rate-source-attribution"
import { StaleRateWarning } from "@/components/stale-rate-warning"
import { RateSourceSelector } from "@/components/rate-source-selector"
import { RateChangeAnimation } from "@/components/rate-change-animation"
import { RateFeedbackButtons } from "@/components/rate-feedback-buttons"
import { useLanguage } from "@/lib/i18n/language-context"
import { RateBrief } from "@/components/rate-brief"

type MarketMood = "good" | "fair" | "caution" | "wait"

const MARKET_ITEMS = [
  { id: "rice", name: "Rice (25kg)", lrd: 4500, icon: <ShoppingBasket className="h-4 w-4 text-primary" />, category: "food" as const },
  { id: "fuel", name: "Fuel (gallon)", lrd: 900, icon: <Fuel className="h-4 w-4 text-primary" />, category: "energy" as const },
  { id: "taxi", name: "Taxi ride", lrd: 150, icon: <Bus className="h-4 w-4 text-blue-600 dark:text-blue-400" />, category: "transport" as const },
  { id: "kekeh", name: "Kekeh ride", lrd: 75, icon: <Bus className="h-4 w-4 text-blue-600 dark:text-blue-400" />, category: "transport" as const },
  { id: "meal", name: "Cooked meal", lrd: 300, icon: <Utensils className="h-4 w-4 text-primary" />, category: "food" as const },
  { id: "phone", name: "Phone credit", lrd: 250, icon: <Phone className="h-4 w-4 text-primary" />, category: "other" as const },
  { id: "cooking-oil", name: "Cooking oil (gal)", lrd: 2800, icon: <ShoppingBasket className="h-4 w-4 text-primary" />, category: "food" as const },
  { id: "cement", name: "Cement (50kg)", lrd: 3200, icon: <Home className="h-4 w-4 text-primary" />, category: "construction" as const },
  { id: "water", name: "Water (sachet x30)", lrd: 450, icon: <ShoppingBasket className="h-4 w-4 text-primary" />, category: "food" as const },
  { id: "data", name: "Mobile data 1GB", lrd: 500, icon: <Smartphone className="h-4 w-4 text-primary" />, category: "other" as const },
]

const MOOD_CONFIG: Record<MarketMood, { label: string; color: string; bg: string; border: string; icon: React.ReactNode; advice: string; detail: string }> = {
  good: {
    label: "Good Time to Shop",
    color: "text-green-700 dark:text-green-400",
    bg: "bg-muted/40 border border-border/40",
    border: "border-green-500/30",
    icon: <ThumbsUp className="h-6 w-6 text-primary" />,
    advice: "Rates look steady today. Buy what you need, and compare prices if you are buying in bulk.",
    detail: "Recent rate movement is small. Most everyday items should be within the usual range, but stall prices can still differ.",
  },
  fair: {
    label: "Fair — Proceed Normally",
    color: "text-blue-700 dark:text-blue-400",
    bg: "bg-muted/40 border border-border/40",
    border: "border-blue-500/30",
    icon: <Minus className="h-6 w-6 text-muted-foreground" />,
    advice: "Conditions look normal. Handle your regular spending and avoid rushing large purchases.",
    detail: "There are minor rate changes but no strong signal. Everyday shopping is usually fine at this level.",
  },
  caution: {
    label: "Caution — Prices Rising",
    color: "text-orange-700 dark:text-orange-400",
    bg: "bg-muted/40 border border-border/40",
    border: "border-orange-500/30",
    icon: <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />,
    advice: "The rate is moving up. Focus on essentials and double-check prices before paying.",
    detail: "When rates rise, import-heavy goods often get more expensive. Buy urgent items first and pause non-urgent spending.",
  },
  wait: {
    label: "Wait If You Can",
    color: "text-red-700 dark:text-red-400",
    bg: "bg-muted/40 border border-border/40",
    border: "border-red-500/30",
    icon: <ThumbsDown className="h-6 w-6 text-primary" />,
    advice: "Rate movement is unstable. If possible, wait on large purchases for now.",
    detail: "Sharp moves can push market prices up quickly. Prioritize urgent needs and watch for a calmer rate window.",
  },
}

export default function MarketPage() {
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
    rateSource,
  } = useLiveRate()
  const [sourceCount, setSourceCount] = useState(0)
  const [recentRates, setRecentRates] = useState<number[]>([])
  const [previousDayRate, setPreviousDayRate] = useState<number | null>(null)

  const displayRate = useMemo(() => clampToValidRate(effectiveRate), [effectiveRate])

  const [lastUpdate, setLastUpdate] = useState("Just now")
  useEffect(() => {
    if (rateLoading) { setLastUpdate("Loading…"); return }
    if (!rateTimestamp) { setLastUpdate("Just now"); return }
    function tick() {
      try {
        const d = new Date(rateTimestamp)
        const diff = (Date.now() - d.getTime()) / 60_000
        if (diff < 1) setLastUpdate("Just now")
        else if (diff < 60) setLastUpdate(`${Math.floor(diff)}m ago`)
        else setLastUpdate(d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }))
      } catch { setLastUpdate("Just now") }
    }
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [rateLoading, rateTimestamp])

  useEffect(() => {
    const fetchChangers = async () => {
      try {
        const res = await fetch("/api/rates/live")
        const data = await res.json()
        if (Array.isArray(data?.changers)) {
          setSourceCount(data.changers.length)
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
    window.localStorage.setItem("truerate-last-rate", displayRate.toString())
  }, [displayRate])

  useEffect(() => {
    if (!Number.isFinite(displayRate)) return
    setRecentRates((prev) => {
      const seeded = prev.length === 0 ? [displayRate, displayRate] : [...prev, displayRate]
      const next = seeded.slice(-12)
      window.localStorage.setItem("truerate-recent-rates", JSON.stringify(next))
      return next
    })
  }, [displayRate])

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
    return displayRate - previousDayRate
  }, [displayRate, previousDayRate])

  const changePercent = useMemo(() => {
    if (change === null || previousDayRate === null || previousDayRate === 0) return null
    return (change / previousDayRate) * 100
  }, [change, previousDayRate])

  const volatility = useMemo(() => {
    if (recentRates.length < 3) return null
    const mean = recentRates.reduce((a, b) => a + b, 0) / recentRates.length
    const variance = recentRates.reduce((sum, r) => sum + (r - mean) ** 2, 0) / recentRates.length
    return Math.sqrt(variance)
  }, [recentRates])

  const marketMood: MarketMood = useMemo(() => {
    if (change === null) return "fair"
    const absChange = Math.abs(change)
    const vol = volatility ?? 0

    if (change >= 3 || vol > 2) return "wait"
    if (change >= 1.5 || vol > 1.2) return "caution"
    if (change <= -0.5) return "good"
    if (absChange < 1) return "good"
    return "fair"
  }, [change, volatility])

  const mood = MOOD_CONFIG[marketMood]

  const todayStr = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1 pb-20 md:pb-0 overflow-x-hidden" role="main">

        {/* Hero: Market Mood + Live Rate */}
        <section className="relative overflow-x-hidden min-h-[min(36vh,280px)] sm:min-h-[38vh] bg-background border-b border-border/30" aria-label="Liberian market today">
          <div className="container relative z-10 mx-auto px-4 sm:px-6 max-w-6xl py-8 sm:py-12 md:py-16">
            <div className="text-center mb-3">
              <p className="text-xs text-muted-foreground mb-1">{todayStr}</p>
              <Badge variant="secondary" className="gap-1.5 px-3 py-1 mb-4">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-70" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Live Market Update · {lastUpdate}
              </Badge>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground text-center mb-3">Market Update</p>
              <h1 className="font-display text-2xl min-[360px]:text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-balance leading-[1.1]">
                <span className="relative inline-block pb-1.5 text-foreground">
                  Liberian Market Today
                </span>
              </h1>
              <p className="text-base text-muted-foreground text-pretty max-w-2xl mx-auto">
                Live rates and everyday price checks to help you decide what to buy now and what to postpone.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                <Link
                  href="/market-intelligence"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Market snapshot
                </Link>
                <span className="text-muted-foreground/50 text-sm hidden sm:inline" aria-hidden>
                  ·
                </span>
                <Link
                  href="/market-intelligence/analytics"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground hover:underline"
                >
                  Detailed charts
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px" />
          <div className="container relative z-10 mx-auto px-4 sm:px-6 max-w-6xl pb-8">
            {/* Market Mood Signal */}
            <div className={`max-w-2xl mx-auto mt-8 rounded-2xl border ${mood.border} ${mood.bg} p-5 sm:p-6`}>
              <div className="flex items-start gap-4">
                <div className={`h-10 w-10 rounded-lg bg-background/70 border border-border/40 flex items-center justify-center shrink-0 ${mood.color}`}>
                  {mood.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h2 className={`text-xl sm:text-2xl font-bold ${mood.color}`}>{mood.label}</h2>
                  </div>
                  <p className="text-sm text-foreground font-medium mb-2">{mood.advice}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{mood.detail}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rate + Market Stats Row */}
        <section className="py-8 sm:py-10 bg-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="grid gap-5">

              {/* Live Rate Card */}
              <Card className="rounded-2xl border-border/40 shadow-sm">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-70" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live Rate</span>
                      {sourceCount > 0 && (
                        <span className="text-xs text-muted-foreground">· {sourceCount} changers</span>
                      )}
                    </div>
                    <RateSourceSelector variant="pills" className="text-xs" />
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6 mb-4">
                    <div>
                      <div className="text-5xl sm:text-6xl font-bold text-foreground tracking-tight tabular-nums">
                        <RateChangeAnimation rate={displayRate ?? 0}>
                          {displayRate ? displayRate.toFixed(2) : "—"}
                        </RateChangeAnimation>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">LRD per 1 USD</div>
                    </div>

                    {change !== null && (
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${ change >= 0 ? "bg-muted/40 border border-border/40 text-red-700 dark:text-red-400" : "bg-muted/40 border border-border/40 text-green-700 dark:text-green-400" }`}>
                        {change >= 0
                          ? <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                          : <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                        }
                        <span className="text-sm font-bold tabular-nums">
                          {change >= 0 ? "+" : ""}{change.toFixed(2)}
                        </span>
                        {changePercent !== null && (
                          <span className="text-xs opacity-80">
                            ({changePercent >= 0 ? "+" : ""}{changePercent.toFixed(1)}%)
                          </span>
                        )}
                        <span className="text-xs">today</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    <div className="rounded-xl bg-muted/40 border border-border/40 p-3 text-center">
                      <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">Buy Rate</div>
                      <div className="text-xl font-bold text-secondary tabular-nums">
                        {(rateSource === "official" && cblBuying != null)
                          ? cblBuying.toFixed(2)
                          : (displayRate ? Math.max(0, displayRate - 2).toFixed(2) : "—")}
                      </div>
                    </div>
                    <div className="rounded-xl bg-muted/40 border border-border/40 p-3 text-center">
                      <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">Sell Rate</div>
                      <div className="text-xl font-bold text-destructive tabular-nums">
                        {(rateSource === "official" && cblSelling != null)
                          ? cblSelling.toFixed(2)
                          : (displayRate ? (displayRate + 2).toFixed(2) : "—")}
                      </div>
                    </div>
                    <div className="rounded-xl bg-muted/50 p-3 text-center">
                      <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">Market</div>
                      <div className="text-xl font-bold text-foreground tabular-nums">
                        {liveRate != null && liveRate > 0 ? liveRate.toFixed(2) : "—"}
                      </div>
                    </div>
                    <div className="rounded-xl bg-muted/50 p-3 text-center">
                      <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">CBL Official</div>
                      <div className="text-xl font-bold text-foreground tabular-nums">
                        {cblRate != null && cblRate > 0 ? cblRate.toFixed(2) : "—"}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center mb-3"><RateBrief variant="inline" /></div>

                  <div className="flex flex-wrap gap-2 pt-3 border-t border-border/30">
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
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* What Things Cost Today */}
        <section className="py-8 sm:py-10 bg-muted/10 border-t border-border/20">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">What Things Cost Today</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Common prices in Monrovia at the current rate</p>
              </div>
              <Badge variant="outline" className="gap-1 text-xs shrink-0">
                <Clock className="h-3 w-3 text-blue-600 dark:text-blue-400" /> Live
              </Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {MARKET_ITEMS.map((item) => {
                const usd = item.lrd / displayRate
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-border/30 bg-card hover:border-border/60 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`opacity-80 ${ item.category === "food" ? "text-green-600 dark:text-green-400" : item.category === "energy" ? "text-orange-600 dark:text-orange-400" : item.category === "transport" ? "text-blue-600 dark:text-blue-400" : item.category === "construction" ? "text-amber-700 dark:text-amber-400" : "text-indigo-600 dark:text-indigo-400" }`}>
                        {item.icon}
                      </div>
                      <span className="text-xs text-muted-foreground leading-tight">{item.name}</span>
                    </div>
                    <div className="text-lg font-bold tabular-nums text-foreground">
                      {item.lrd.toLocaleString()} <span className="text-xs font-medium text-muted-foreground">LRD</span>
                    </div>
                    <div className="text-xs text-primary font-semibold tabular-nums">
                      ${usd.toFixed(2)} USD
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Shopping Guidance Cards */}
        <section className="py-8 sm:py-10 bg-background border-t border-border/20">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Shopping guidance</h2>
              <p className="text-xs text-muted-foreground mt-1 max-w-xl">
                Plain-language guidance based on today&apos;s rate. For deeper risk and trend charts, see{" "}
                <Link href="/market-intelligence" className="text-primary font-medium hover:underline">
                  market intelligence
                </Link>
                .
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

              <Card className="rounded-2xl border-border/40">
                <CardContent className="p-5">
                  <div className="h-9 w-9 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center mb-3">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 text-sm">Grocery Shopping</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {marketMood === "good" || marketMood === "fair"
                      ? "Prices are within normal range. Good day to stock up on essentials — rice, oil, and staples are at typical levels."
                      : "Prices are slightly elevated. Buy what you need, but consider waiting for bulk purchases like rice bags."}
                  </p>
                  <div className={`text-xs font-semibold ${marketMood === "good" ? "text-green-600 dark:text-green-400" : marketMood === "fair" ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"}`}>
                    {marketMood === "good" ? "Stable for normal shopping" : marketMood === "fair" ? "Normal conditions" : "Essentials first"}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border/40">
                <CardContent className="p-5">
                  <div className="h-9 w-9 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center mb-3">
                    <Fuel className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 text-sm">Fuel & Transport</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {change !== null && change > 1.5
                        ? "A rising rate can pressure fuel prices. Top up only if you need to."
                        : "Fuel and transport look steady right now. No urgent need to pre-buy."}
                  </p>
                  <div className={`text-xs font-semibold ${change !== null && change > 1.5 ? "text-orange-600 dark:text-orange-400" : "text-green-600 dark:text-green-400"}`}>
                    {change !== null && change > 1.5 ? "Watch fuel costs" : "Stable trend"}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border/40">
                <CardContent className="p-5">
                  <div className="h-9 w-9 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center mb-3">
                    <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 text-sm">USD to LRD Exchange</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {change !== null && change > 0
                      ? "LRD is weakening. You get more LRD per USD, but import prices can rise."
                      : change !== null && change < -0.5
                        ? "LRD is strengthening. This is usually better for USD to LRD exchange."
                        : "Rate is steady. Exchange according to your normal needs."}
                  </p>
                  <div className={`text-xs font-semibold ${change !== null && change < 0 ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"}`}>
                    {change !== null && change < -0.5 ? "Better exchange window" : "Normal conditions"}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border/40">
                <CardContent className="p-5">
                  <div className="h-9 w-9 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center mb-3">
                    <Home className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 text-sm">Construction & Building</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {change !== null && change > 2
                      ? "Cement and iron rod prices often rise when rates jump. Delay non-urgent orders if possible."
                      : "Building material prices are at normal levels. Proceed with planned purchases."}
                  </p>
                  <div className={`text-xs font-semibold ${change !== null && change > 2 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                    {change !== null && change > 2 ? "Consider waiting" : "Normal prices"}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* $100 Purchasing Power */}
        <section className="py-8 sm:py-10 bg-muted/10 border-t border-border/20">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">What $100 Gets You Today</h2>
              <p className="text-sm text-muted-foreground">
                Purchasing power at {displayRate?.toFixed(2) ?? "—"} LRD/USD = {(displayRate * 100).toLocaleString()} LRD
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {(() => {
                const budget = displayRate * 100
                const items = [
                  { icon: <ShoppingBasket className="h-6 w-6 text-primary" />, qty: Math.floor(budget / 4500), unit: "Bags of Rice", sub: "25kg each" },
                  { icon: <Fuel className="h-6 w-6 text-primary" />, qty: Math.floor(budget / 900), unit: "Gallons of Fuel", sub: "PMS gasoline" },
                  { icon: <Utensils className="h-6 w-6 text-primary" />, qty: Math.floor(budget / 300), unit: "Cooked Meals", sub: "Standard plate" },
                  { icon: <Bus className="h-6 w-6 text-blue-600 dark:text-blue-400" />, qty: Math.floor(budget / 150), unit: "Taxi Rides", sub: "Within Monrovia" },
                  { icon: <Phone className="h-6 w-6 text-primary" />, qty: Math.floor(budget / 250), unit: "Phone Top-ups", sub: "250 LRD each" },
                  { icon: <Smartphone className="h-6 w-6 text-primary" />, qty: Math.floor(budget / 500), unit: "GB of Data", sub: "Mobile internet" },
                ]
                return items.map((item, i) => (
                  <div key={i} className="p-4 rounded-xl border border-border/30 bg-card text-center">
                    <div className="mx-auto mb-2">{item.icon}</div>
                    <div className="text-2xl font-bold text-foreground tabular-nums">{item.qty}</div>
                    <div className="text-xs font-medium text-foreground mt-0.5">{item.unit}</div>
                    <div className="text-[10px] text-muted-foreground">{item.sub}</div>
                  </div>
                ))
              })()}
            </div>
          </div>
        </section>

        {/* Today Suggestion */}
        <section className="py-8 sm:py-10 bg-background border-t border-border/20">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <Card className="rounded-2xl border-border/40 bg-card shadow-sm max-w-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Today&apos;s suggestion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground font-medium leading-relaxed mb-4">
                  {marketMood === "good" && "Rate movement is calm. Do normal shopping, and compare two sellers before larger purchases."}
                  {marketMood === "fair" && "No major signal today. Stick to your plan and avoid panic buying."}
                  {marketMood === "caution" && "Spend carefully. Prioritize essentials and postpone non-urgent large purchases."}
                  {marketMood === "wait" && "Keep spending tight today. Buy urgent needs first and watch for better rate stability."}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link href="/tools/remittance">
                    <Button size="sm" variant="outline" className="gap-1.5 rounded-xl text-xs">
                      <ArrowUpDown className="h-3.5 w-3.5 text-primary" /> Compare Providers
                    </Button>
                  </Link>
                  <Link href="/tools/budget">
                    <Button size="sm" variant="outline" className="gap-1.5 rounded-xl text-xs">
                      <ShoppingBasket className="h-3.5 w-3.5 text-primary" /> Plan Budget
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Market Tips */}
        <section className="py-8 sm:py-10 bg-muted/10 border-t border-border/20">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <h2 className="text-xl font-bold text-foreground mb-5 text-center">Practical tips for today</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="rounded-2xl border-border/30">
                <CardContent className="p-5">
                  <div className="flex gap-3">
                    <div className="h-2 w-2 rounded-full bg-foreground/60 mt-2 shrink-0" aria-hidden>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm mb-1">Compare rates before you exchange</h3>
                      <p className="text-xs text-muted-foreground">
                        Don&apos;t take the first rate offered. Check live rates and ask two or three changers before you commit.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border/30">
                <CardContent className="p-5">
                  <div className="flex gap-3">
                    <div className="h-2 w-2 rounded-full bg-foreground/60 mt-2 shrink-0" aria-hidden>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm mb-1">Shop earlier when possible</h3>
                      <p className="text-xs text-muted-foreground">
                        In many markets, prices are more predictable earlier in the day. If you need LRD, exchange before late-day swings.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border/30">
                <CardContent className="p-5">
                  <div className="flex gap-3">
                    <div className="h-2 w-2 rounded-full bg-foreground/60 mt-2 shrink-0" aria-hidden>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm mb-1">Watch sudden rate jumps</h3>
                      <p className="text-xs text-muted-foreground">
                        When the rate jumps quickly, import-heavy goods like rice and fuel may become more expensive soon after. Prioritize essentials.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border/30">
                <CardContent className="p-5">
                  <div className="flex gap-3">
                    <div className="h-2 w-2 rounded-full bg-foreground/60 mt-2 shrink-0" aria-hidden>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm mb-1">Split bulk buys with neighbors</h3>
                      <p className="text-xs text-muted-foreground">
                        Group buying can reduce cost per unit. Share larger items with family or neighbors when it fits your budget.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border/30">
                <CardContent className="p-5">
                  <div className="flex gap-3">
                    <div className="h-2 w-2 rounded-full bg-foreground/60 mt-2 shrink-0" aria-hidden>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm mb-1">Use SMS rate alerts</h3>
                      <p className="text-xs text-muted-foreground">
                        Get a message when the rate hits your target so you can time exchange or larger spending with less guesswork.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border/30">
                <CardContent className="p-5">
                  <div className="flex gap-3">
                    <div className="h-2 w-2 rounded-full bg-foreground/60 mt-2 shrink-0" aria-hidden>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm mb-1">Check prices before you go</h3>
                      <p className="text-xs text-muted-foreground">
                        Check today&apos;s commodity prices before heading out so you have a fair baseline when vendors quote.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-8 sm:py-10 bg-background border-t border-border/20">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h2 className="text-xl font-bold text-foreground mb-5 text-center">More market tools</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { href: "/tools", label: "All tools" },
                { href: "/tools/remittance", label: "Remittance" },
                { href: "/tools/inflation", label: "Inflation" },
                { href: "/price-index", label: "Price index" },
                { href: "/market-intelligence", label: "Market snapshot" },
                { href: "/market-intelligence/analytics", label: "Detailed charts" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="group">
                  <Card className="rounded-2xl border-border/30 h-full transition-all group-hover:border-primary/20 group-hover:shadow-sm">
                    <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
                      <span className="text-sm font-medium text-foreground">{link.label}</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
