"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  AlertTriangle,
  Bus,
  Clock3,
  Fuel,
  Gauge,
  Landmark,
  Plane,
  ShoppingBasket,
  TrendingDown,
  TrendingUp,
} from "lucide-react"

export default function TrfnDashboardPage() {
  const updatedAt = "Updated 1 hour ago"

  const tickerItems = [
    { label: "USD/LRD", value: "L$183.47", move: "+0.6%", tone: "up" as const },
    { label: "Fuel (gal)", value: "L$821", move: "-1.1%", tone: "down" as const },
    { label: "Food Index", value: "112.4", move: "+0.9%", tone: "up" as const },
    { label: "Transport Trend", value: "Firm", move: "+0.4%", tone: "up" as const },
  ]

  const projections = [
    {
      category: "Transport",
      headline: "Port congestion pressure likely to lift intra-city fares into next cycle",
      impact: "Medium",
      timeframe: "7-14 days",
      confidence: 78,
      timestamp: "12:05 WAT",
      icon: Bus,
    },
    {
      category: "Trade",
      headline: "Wholesale rice corridors show tight spread as dealer restocking accelerates",
      impact: "High",
      timeframe: "3-10 days",
      confidence: 84,
      timestamp: "11:43 WAT",
      icon: ShoppingBasket,
    },
    {
      category: "Policy",
      headline: "CBL liquidity messaging dampens near-term parallel-market speculation pulse",
      impact: "High",
      timeframe: "24-72 hrs",
      confidence: 81,
      timestamp: "11:18 WAT",
      icon: Landmark,
    },
    {
      category: "Tourism",
      headline: "Airport-linked demand pockets support hospitality pricing through weekend window",
      impact: "Medium",
      timeframe: "5-8 days",
      confidence: 73,
      timestamp: "10:56 WAT",
      icon: Plane,
    },
    {
      category: "Trade",
      headline: "Fuel-led logistics stability keeps distributor margins from widening aggressively",
      impact: "Medium",
      timeframe: "1-2 weeks",
      confidence: 76,
      timestamp: "10:31 WAT",
      icon: Fuel,
    },
    {
      category: "Policy",
      headline: "Public procurement pace may inject selective demand into construction imports",
      impact: "Medium",
      timeframe: "2-4 weeks",
      confidence: 69,
      timestamp: "09:58 WAT",
      icon: Gauge,
    },
  ]


  return (
    <div className="min-h-screen flex flex-col w-full min-w-0 bg-background text-foreground">
      <Header />
      <main id="main-content" className="flex-1 w-full min-w-0 overflow-x-hidden" role="main">
        <section className="border-y border-border/70 bg-background/95 backdrop-blur dark:bg-slate-950 dark:border-slate-800/80">
          <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto px-4 py-2 scrollbar-thin sm:px-6 lg:px-8">
            <Badge variant="outline" className="shrink-0 border-cyan-500/40 bg-cyan-500/10 text-[10px] tracking-[0.22em] text-cyan-700 dark:text-cyan-300">
              TRFN LIVE
            </Badge>
            {tickerItems.map((item) => (
              <div
                key={item.label}
                className="shrink-0 rounded-md border border-border/70 bg-card/90 px-3 py-1.5 transition-colors duration-200 hover:border-border dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-slate-700"
              >
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground dark:text-slate-400">{item.label}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground dark:text-slate-100">{item.value}</span>
                  <span className={`text-xs font-medium ${item.tone === "up" ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300"}`}>
                    {item.move}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background via-background to-muted/30 dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute -top-24 right-0 h-52 w-52 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-400/10" />
            <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-400/10" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge className="border border-cyan-500/30 bg-cyan-500/10 text-cyan-800 dark:text-cyan-200">TRFN - TrueRate Finance Network</Badge>
              <Badge variant="outline" className="border-border bg-card/70 text-muted-foreground dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">Source: TRFN Analysis Engine</Badge>
            </div>
            <h1 className="max-w-4xl text-2xl font-bold tracking-tight text-foreground text-balance dark:text-white sm:text-5xl">
              Liberia Macro Pulse: FX Stability Holds, But Cost Pressures Still Track Above Seasonal Norm
            </h1>
            <p className="mt-3 sm:mt-4 max-w-3xl text-sm text-muted-foreground dark:text-slate-300 sm:text-base">
              Real-time institutional-style market coverage for exchange rates, commodities, policy signals, and price-risk outlooks across Liberia.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-3 py-1.5 text-xs text-muted-foreground dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400">
              <Clock3 className="h-3.5 w-3.5" />
              <span>{updatedAt}</span>
            </div>
          </div>
        </section>

        <section className="border-b border-rose-500/30 bg-rose-500/10">
          <div className="mx-auto flex max-w-7xl items-start gap-3 px-4 py-3 sm:items-center sm:px-6 lg:px-8">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-300" />
            <p className="text-sm font-medium text-rose-800 dark:text-rose-100">
              Breaking News: Wholesale USD demand spikes in central Monrovia; intraday spread widening risk flagged by TRFN Analysis Engine (12:22 WAT).
            </p>
          </div>
        </section>

        <section className="border-b border-border/80 bg-background/80 dark:border-slate-800 dark:bg-slate-950/80">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
            <div className="mb-2 flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
              <p className="text-sm font-semibold uppercase tracking-wider text-foreground dark:text-slate-200">Market Sentiment</p>
            </div>
            <div className="h-3 overflow-hidden rounded-full border border-border/60 bg-slate-200/80 dark:border-slate-700 dark:bg-slate-800">
              <div className="h-full w-[62%] bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500" />
            </div>
            <div className="mt-2 flex flex-col items-start gap-1 text-xs text-muted-foreground dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
              <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300">
                <TrendingUp className="h-3.5 w-3.5" />
                Growth bias: 62%
              </span>
              <span className="inline-flex items-center gap-1 text-rose-700 dark:text-rose-300">
                <TrendingDown className="h-3.5 w-3.5" />
                Risk pressure: 38%
              </span>
            </div>
          </div>
        </section>

        <section className="bg-background pb-12 pt-7 sm:pb-14 sm:pt-8 dark:bg-slate-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-foreground dark:text-white sm:text-2xl">TRFN Projections & Economic Signals</h2>
              <Badge variant="outline" className="border-border bg-card/60 text-muted-foreground dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
                Timestamped model evidence
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
              {projections.map((item) => {
                const Icon = item.icon
                return (
                  <article
                    key={`${item.category}-${item.headline}`}
                    className="rounded-xl border border-border/70 bg-card/95 p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-border sm:p-4 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-slate-600 dark:hover:shadow-[0_0_0_1px_rgba(51,65,85,0.5)]"
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <Badge className="border border-border/70 bg-muted/70 text-foreground dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">{item.category}</Badge>
                      <Icon className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold leading-snug text-foreground dark:text-slate-100">{item.headline}</h3>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-md border border-border/70 bg-muted/40 p-2 dark:border-slate-800 dark:bg-slate-950/80">
                        <p className="text-muted-foreground dark:text-slate-500">Impact</p>
                        <p
                          className={`font-semibold ${
                            item.impact === "High"
                              ? "text-rose-700 dark:text-rose-300"
                              : item.impact === "Medium"
                                ? "text-amber-700 dark:text-amber-300"
                                : "text-emerald-700 dark:text-emerald-300"
                          }`}
                        >
                          {item.impact}
                        </p>
                      </div>
                      <div className="rounded-md border border-border/70 bg-muted/40 p-2 dark:border-slate-800 dark:bg-slate-950/80">
                        <p className="text-muted-foreground dark:text-slate-500">Timeframe</p>
                        <p className="font-semibold text-foreground dark:text-slate-200">{item.timeframe}</p>
                      </div>
                      <div className="rounded-md border border-border/70 bg-muted/40 p-2 dark:border-slate-800 dark:bg-slate-950/80">
                        <p className="text-muted-foreground dark:text-slate-500">Confidence</p>
                        <p className="font-semibold text-emerald-700 dark:text-emerald-300">{item.confidence}%</p>
                      </div>
                      <div className="rounded-md border border-border/70 bg-muted/40 p-2 dark:border-slate-800 dark:bg-slate-950/80">
                        <p className="text-muted-foreground dark:text-slate-500">Source</p>
                        <p className="font-semibold text-foreground dark:text-slate-200">TRFN Engine</p>
                      </div>
                    </div>

                    <p className="mt-3 text-[11px] text-muted-foreground dark:text-slate-500">Timestamp: {item.timestamp}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
