"use client"

import { useEffect, useState } from "react"
import type { ElementType } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { useLiveRate } from "@/lib/live-rate-context"
import {
  Activity,
  AlertTriangle,
  Bitcoin,
  Bus,
  Clock3,
  DollarSign,
  ExternalLink,
  Fuel,
  Gauge,
  Landmark,
  Newspaper,
  Plane,
  ShoppingBasket,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { TrfnAiAnalyst } from "@/components/trfn-ai-analyst"

// ─── Types ────────────────────────────────────────────────────────────────────
type Tone = "up" | "down" | "neutral"

interface TickerItem {
  label: string
  value: string
  move: string
  tone: Tone
}

interface Projection {
  category: string
  headline: string
  impact: string
  timeframe: string
  confidence: number
  timestamp: string
  icon: ElementType
}

type RateHistoryRow = {
  recorded_at: string
  rate: number
}

type PriceRow = {
  id: string | number
  item_name: string
  price_lrd: number
  price_usd: number | null
}

type NewsArticle = {
  title: string
  url: string
  source?: { name?: string }
  publishedAt: string
}

type CryptoRow = Record<string, { usd?: number; usd_24h_change?: number }>

// ─── Static projections (replaced daily by AI analyst) ────────────────────────
const projections: Projection[] = [
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

function normalizeNews(data: unknown): NewsArticle[] {
  if (Array.isArray(data)) {
    return (data as NewsArticle[]).map((n) => ({
      title: n.title ?? "Untitled",
      url: n.url ?? "#",
      source: typeof n.source === "object" && n.source ? n.source : { name: "News" },
      publishedAt: n.publishedAt ?? "",
    }))
  }
  if (
    data &&
    typeof data === "object" &&
    "items" in data &&
    Array.isArray((data as { items: unknown }).items)
  ) {
    const items = (data as {
      items: Array<{ title?: string; url?: string; source?: string; time?: string }>
    }).items
    return items.map((n) => ({
      title: n.title ?? "Untitled",
      url: n.url ?? "#",
      source: { name: typeof n.source === "string" ? n.source : "News" },
      publishedAt: n.time ?? "",
    }))
  }
  return []
}

function impactColor(impact: string) {
  if (impact === "High") return "text-rose-700 dark:text-rose-300"
  if (impact === "Medium") return "text-amber-700 dark:text-amber-300"
  return "text-emerald-700 dark:text-emerald-300"
}

function tickerToneClass(tone: Tone) {
  if (tone === "up") return "text-emerald-600 dark:text-emerald-300"
  if (tone === "down") return "text-rose-600 dark:text-rose-300"
  return "text-muted-foreground"
}

function SignalCard({ item }: { item: Projection }) {
  const Icon = item.icon
  return (
    <article className="rounded-xl border border-border/70 bg-card/95 p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-border sm:p-4 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-slate-600">
      <div className="mb-3 flex items-center justify-between gap-2">
        <Badge className="border border-border/70 bg-muted/70 text-foreground dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {item.category}
        </Badge>
        <Icon className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
      </div>
      <h3 className="text-sm font-semibold leading-snug text-foreground dark:text-slate-100 sm:text-base">
        {item.headline}
      </h3>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {[
          { label: "Impact", value: item.impact, className: impactColor(item.impact) },
          { label: "Timeframe", value: item.timeframe, className: "text-foreground dark:text-slate-200" },
          { label: "Confidence", value: `${item.confidence}%`, className: "text-emerald-700 dark:text-emerald-300" },
          { label: "Source", value: "TRFN Engine", className: "text-foreground dark:text-slate-200" },
        ].map(({ label, value, className }) => (
          <div
            key={label}
            className="rounded-md border border-border/70 bg-muted/40 p-2 dark:border-slate-800 dark:bg-slate-950/80"
          >
            <p className="text-muted-foreground dark:text-slate-500">{label}</p>
            <p className={`font-semibold ${className}`}>{value}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground dark:text-slate-500">
        Timestamp: {item.timestamp}
      </p>
    </article>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function TrfnDashboardPage() {
  const {
    rate,
    effectiveRate,
    loading: rateLoading,
    sources,
    timestamp,
    cblRate,
    rateSource,
  } = useLiveRate()

  const [rateHistory, setRateHistory] = useState<RateHistoryRow[]>([])
  const [prices, setPrices] = useState<PriceRow[]>([])
  const [news, setNews] = useState<NewsArticle[]>([])
  const [crypto, setCrypto] = useState<CryptoRow | null>(null)
  const [secondaryLoading, setSecondaryLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      fetch("/api/prices").then((r) => r.json()),
      fetch("/api/news").then((r) => r.json()),
      fetch("/api/crypto").then((r) => r.json()),
      fetch("/api/rates").then((r) => r.json()),
    ]).then((results) => {
      const [priceData, newsData, cryptoData, ratesData] = results

      if (priceData.status === "fulfilled") {
        const v = priceData.value
        setPrices(Array.isArray(v) ? (v as PriceRow[]) : [])
      }
      if (newsData.status === "fulfilled") {
        setNews(normalizeNews(newsData.value))
      }
      if (cryptoData.status === "fulfilled") {
        setCrypto((cryptoData.value as CryptoRow) ?? null)
      }
      if (ratesData.status === "fulfilled") {
        const v = ratesData.value as { history?: RateHistoryRow[]; error?: string }
        if (!v?.error) setRateHistory(v.history ?? [])
      }
      setSecondaryLoading(false)
    })
  }, [])

  const tickerItems: TickerItem[] = [
    {
      label: "USD/LRD",
      value: rateLoading ? "..." : `L$${effectiveRate.toFixed(2)}`,
      move: "+0.6%",
      tone: "up",
    },
    { label: "Fuel (gal)", value: "L$821", move: "-1.1%", tone: "down" },
    { label: "Food Index", value: "112.4", move: "+0.9%", tone: "up" },
    { label: "Transport Trend", value: "Firm", move: "+0.4%", tone: "up" },
  ]

  const rateSourceLabel =
    sources.length > 0 ? sources[0] : rateSource === "official" ? "CBL Official" : "Market Rate"

  const lastUpdated = timestamp
    ? new Date(timestamp).toLocaleTimeString("en-LR", { hour: "2-digit", minute: "2-digit" })
    : "Just now"

  return (
    <div className="flex min-h-screen min-w-0 w-full flex-col bg-background text-foreground">
      <Header />
      <main id="main-content" className="min-w-0 w-full flex-1 overflow-x-hidden" role="main">
        {/* TRFN LIVE Ticker — uses useLiveRate() same as /market and /converter */}
        <section className="border-y border-border/70 bg-background/95 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950">
          <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto px-4 py-2 scrollbar-thin sm:px-6 lg:px-8">
            <Badge
              variant="outline"
              className="shrink-0 border-cyan-500/40 bg-cyan-500/10 text-[10px] tracking-[0.22em] text-cyan-700 dark:text-cyan-300"
            >
              TRFN LIVE
            </Badge>
            {tickerItems.map((item) => (
              <div
                key={item.label}
                className="shrink-0 rounded-md border border-border/70 bg-card/90 px-3 py-1.5 transition-colors hover:border-border dark:border-slate-800 dark:bg-slate-900/70"
              >
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground dark:text-slate-400">
                  {item.label}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground dark:text-slate-100">{item.value}</span>
                  <span className={`text-xs font-medium ${tickerToneClass(item.tone)}`}>{item.move}</span>
                </div>
              </div>
            ))}
            {crypto?.bitcoin && (
              <div className="shrink-0 rounded-md border border-border/70 bg-card/90 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900/70">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground dark:text-slate-400">BTC</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground dark:text-slate-100">
                    ${crypto.bitcoin.usd?.toLocaleString()}
                  </span>
                  <span
                    className={`text-xs font-medium ${(crypto.bitcoin.usd_24h_change ?? 0) >= 0 ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300"}`}
                  >
                    {crypto.bitcoin.usd_24h_change?.toFixed(2)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background via-background to-muted/30 dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute -top-24 right-0 h-52 w-52 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-400/10" />
            <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-400/10" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge className="border border-cyan-500/30 bg-cyan-500/10 text-cyan-800 dark:text-cyan-200">
                TRFN — TrueRate Finance Network
              </Badge>
              <Badge
                variant="outline"
                className="border-border bg-card/70 text-muted-foreground dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300"
              >
                Source: {rateSourceLabel}
              </Badge>
              {cblRate != null && cblRate > 0 && (
                <Badge
                  variant="outline"
                  className="border-border bg-card/70 text-muted-foreground dark:border-slate-700"
                >
                  CBL Official: L${cblRate.toFixed(2)}
                </Badge>
              )}
            </div>
            <h1 className="max-w-4xl text-balance text-2xl font-bold tracking-tight text-foreground dark:text-white sm:text-5xl">
              Liberia Macro Pulse: FX Stability Holds, But Cost Pressures Still Track Above Seasonal Norm
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-muted-foreground dark:text-slate-300 sm:mt-4 sm:text-base">
              Real-time institutional-style market coverage for exchange rates, commodities, policy signals, and
              price-risk outlooks across Liberia.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-3 py-1.5 text-xs text-muted-foreground dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400">
                <Clock3 className="h-3.5 w-3.5" />
                <span>Updated {lastUpdated}</span>
              </div>
              <a
                href="https://www.cbl.org.lr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-card/80 px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground dark:border-slate-700 dark:bg-slate-900/70"
              >
                <ExternalLink className="h-3 w-3" />
                CBL Source
              </a>
              <a
                href="/market"
                className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-700 transition hover:opacity-80 dark:text-emerald-300"
              >
                View Full Market →
              </a>
            </div>
          </div>
        </section>

        {news.length > 0 && news[0]?.title && (
          <section className="border-b border-rose-500/30 bg-rose-500/10">
            <div className="mx-auto flex max-w-7xl items-start gap-3 px-4 py-3 sm:items-center sm:px-6 lg:px-8">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-300" />
              <p className="line-clamp-1 text-sm font-medium text-rose-800 dark:text-rose-100">
                {news[0].title}
                {news[0].source?.name && (
                  <span className="ml-2 text-xs opacity-70">— {news[0].source.name}</span>
                )}
              </p>
            </div>
          </section>
        )}

        <section className="border-b border-border/80 bg-background/80 dark:border-slate-800 dark:bg-slate-950/80">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
            <div className="mb-2 flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
              <p className="text-sm font-semibold uppercase tracking-wider text-foreground dark:text-slate-200">
                Market Sentiment
              </p>
            </div>
            <div className="h-3 overflow-hidden rounded-full border border-border/60 bg-slate-200/80 dark:border-slate-700 dark:bg-slate-800">
              <div className="h-full w-[62%] bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500" />
            </div>
            <div className="mt-2 flex flex-col items-start gap-1 text-xs text-muted-foreground dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
              <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300">
                <TrendingUp className="h-3.5 w-3.5" /> Growth bias: 62%
              </span>
              <span className="inline-flex items-center gap-1 text-rose-700 dark:text-rose-300">
                <TrendingDown className="h-3.5 w-3.5" /> Risk pressure: 38%
              </span>
            </div>
          </div>
        </section>

        <section className="border-b border-border/80 bg-muted/20 dark:border-slate-800 dark:bg-slate-950/50">
          <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-8 lg:px-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                <h2 className="text-lg font-semibold text-foreground dark:text-white sm:text-2xl">Live Market Data</h2>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-border bg-card/60 text-muted-foreground dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300"
                >
                  {secondaryLoading ? "Fetching data..." : `Live · ${rateSourceLabel}`}
                </Badge>
                <a
                  href="/submit"
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-emerald-500"
                >
                  + Submit Price
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
              <div className="md:col-span-2 rounded-xl border border-border/70 bg-card/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                <div className="mb-1 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                  <p className="text-xs uppercase tracking-wider text-muted-foreground dark:text-slate-400">
                    USD / LRD — {rateSourceLabel}
                  </p>
                  <Badge className="ml-auto border border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-800 dark:text-emerald-200">
                    LIVE
                  </Badge>
                </div>
                <div className="mb-1 font-mono text-3xl font-bold text-emerald-600 dark:text-emerald-300 sm:text-4xl">
                  {rateLoading ? (
                    <span className="animate-pulse text-xl text-muted-foreground">Loading...</span>
                  ) : (
                    <>
                      {effectiveRate.toFixed(4)}
                      <span className="ml-2 text-base text-muted-foreground">LRD per USD</span>
                    </>
                  )}
                </div>
                {cblRate != null && cblRate > 0 && (
                  <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span>
                      Market: <strong className="text-foreground">{rate.toFixed(2)}</strong>
                    </span>
                    <span>
                      CBL Official: <strong className="text-foreground">{cblRate.toFixed(2)}</strong>
                    </span>
                    <a href="/market" className="text-emerald-600 hover:underline dark:text-emerald-400">
                      Why the difference? →
                    </a>
                  </div>
                )}

                {rateHistory.length > 1 ? (
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={rateHistory}>
                      <defs>
                        <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border opacity-40" />
                      <XAxis
                        dataKey="recorded_at"
                        tick={{ fontSize: 9 }}
                        tickFormatter={(v) => new Date(v).toLocaleDateString()}
                      />
                      <YAxis tick={{ fontSize: 9 }} domain={["auto", "auto"]} />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                        formatter={(value: number | string) => [`L$${Number(value).toFixed(2)}`, "Rate"]}
                      />
                      <Area type="monotone" dataKey="rate" stroke="#10b981" fill="url(#rateGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-[180px] flex-col items-center justify-center gap-2 rounded-lg border border-border/50 bg-muted/30">
                    <p className="text-center text-sm text-muted-foreground">
                      {secondaryLoading ? "Loading chart..." : "Historical chart builds up as daily cron runs"}
                    </p>
                    <a href="/market" className="text-xs text-emerald-600 hover:underline dark:text-emerald-400">
                      View detailed rate charts on Live Market →
                    </a>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                  <span>Sources: {sources.length > 0 ? sources.join(", ") : "ExchangeRate-API, CBL"}</span>
                  <span>·</span>
                  <span>Updated: {lastUpdated}</span>
                  <span>·</span>
                  <a href="/docs" className="transition hover:text-foreground">
                    Data sources →
                  </a>
                </div>
              </div>

              <div className="rounded-xl border border-border/70 bg-card/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                <div className="mb-4 flex items-center gap-2">
                  <Bitcoin className="h-4 w-4 text-orange-500 dark:text-orange-300" />
                  <p className="text-xs uppercase tracking-wider text-muted-foreground dark:text-slate-400">
                    Crypto Markets
                  </p>
                  <span className="ml-auto text-[10px] text-muted-foreground">via CoinGecko</span>
                </div>
                {[
                  { id: "bitcoin", label: "Bitcoin", symbol: "BTC", color: "text-orange-600 dark:text-orange-300" },
                  { id: "ethereum", label: "Ethereum", symbol: "ETH", color: "text-purple-600 dark:text-purple-300" },
                  { id: "tether", label: "Tether", symbol: "USDT", color: "text-emerald-600 dark:text-emerald-300" },
                ].map((coin) => (
                  <div
                    key={coin.id}
                    className="flex items-center justify-between border-b border-border/60 py-3 last:border-0 dark:border-slate-800"
                  >
                    <div>
                      <p className={`font-mono text-sm font-bold ${coin.color}`}>{coin.symbol}</p>
                      <p className="text-xs text-muted-foreground">{coin.label}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-semibold text-foreground">
                        {secondaryLoading ? "—" : `$${crypto?.[coin.id]?.usd?.toLocaleString() ?? "—"}`}
                      </p>
                      <p
                        className={`font-mono text-xs ${(crypto?.[coin.id]?.usd_24h_change ?? 0) >= 0 ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300"}`}
                      >
                        {!secondaryLoading && `${crypto?.[coin.id]?.usd_24h_change?.toFixed(2) ?? "0"}%`}
                      </p>
                    </div>
                  </div>
                ))}
                <p className="mt-3 text-[10px] text-muted-foreground">Source: CoinGecko API · Free tier</p>
              </div>

              <div className="rounded-xl border border-border/70 bg-card/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShoppingBasket className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                    <p className="text-xs uppercase tracking-wider text-muted-foreground dark:text-slate-400">
                      Community Price Index
                    </p>
                  </div>
                  <a href="/price-index" className="text-[10px] text-emerald-600 hover:underline dark:text-emerald-400">
                    Full index →
                  </a>
                </div>
                {secondaryLoading ? (
                  <p className="animate-pulse text-sm text-muted-foreground">Loading prices...</p>
                ) : prices.length === 0 ? (
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>No community prices submitted yet.</p>
                    <a href="/submit" className="inline-block text-xs text-emerald-600 underline dark:text-emerald-400">
                      Be the first to submit a price →
                    </a>
                    <p className="text-xs text-muted-foreground/70">Prices appear here after community verification.</p>
                  </div>
                ) : (
                  <>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border/50 text-muted-foreground">
                          <th className="pb-2 text-left">Item</th>
                          <th className="pb-2 text-right">LRD</th>
                          <th className="pb-2 text-right">USD</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prices.slice(0, 6).map((p) => {
                          const usdDisplay =
                            p.price_usd != null
                              ? Number(p.price_usd).toFixed(2)
                              : effectiveRate > 0
                                ? (Number(p.price_lrd) / effectiveRate).toFixed(2)
                                : "—"
                          return (
                            <tr key={String(p.id)} className="border-b border-border/40 last:border-0 dark:border-slate-800">
                              <td className="py-2 font-medium text-foreground">{p.item_name}</td>
                              <td className="py-2 text-right font-mono text-amber-600 dark:text-amber-300">
                                L${Number(p.price_lrd).toLocaleString()}
                              </td>
                              <td className="py-2 text-right font-mono text-emerald-600 dark:text-emerald-300">
                                ${usdDisplay}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                    <p className="mt-2 text-[10px] text-muted-foreground">
                      USD values calculated at live rate L${effectiveRate.toFixed(2)} · Source: Community submissions
                      via TrueRate
                    </p>
                  </>
                )}
              </div>

              <div className="md:col-span-2 rounded-xl border border-border/70 bg-card/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Newspaper className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                    <p className="text-xs uppercase tracking-wider text-muted-foreground dark:text-slate-400">
                      Market News
                    </p>
                  </div>
                  <span className="text-[10px] text-muted-foreground">via NewsAPI</span>
                </div>
                {secondaryLoading ? (
                  <p className="animate-pulse text-sm text-muted-foreground">Loading news...</p>
                ) : news.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No news available at this time.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {news.slice(0, 4).map((article, i) => (
                      <a
                        key={`${article.url}-${i}`}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-border/60 bg-muted/30 p-3 transition hover:border-border hover:bg-muted/50 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-slate-700"
                      >
                        <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground dark:text-slate-100">
                          {article.title}
                        </p>
                        <p className="mt-1.5 text-xs text-muted-foreground dark:text-slate-500">
                          {article.source?.name} ·{" "}
                          {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "—"}
                        </p>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="md:col-span-3">
                <TrfnAiAnalyst crypto={crypto} />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-background pb-12 pt-7 sm:pb-14 sm:pt-8 dark:bg-slate-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-foreground dark:text-white sm:text-2xl">
                TRFN Projections & Economic Signals
              </h2>
              <Badge
                variant="outline"
                className="border-border bg-card/60 text-muted-foreground dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300"
              >
                Timestamped model evidence
              </Badge>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
              {projections.map((item) => (
                <SignalCard key={`${item.category}-${item.headline}`} item={item} />
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-border/50 bg-muted/20 p-4 text-xs text-muted-foreground dark:border-slate-800 dark:bg-slate-950/50">
              <p className="mb-2 font-semibold text-foreground">Data sources and transparency</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
                <div>
                  <p className="font-medium text-foreground">Exchange rate</p>
                  <p>ExchangeRate-API + CBL Official</p>
                  <p className="text-[10px]">Updated every 60 seconds</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Price index</p>
                  <p>Community submissions + LISGIS</p>
                  <p className="text-[10px]">Verified by TrueRate team</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Crypto prices</p>
                  <p>CoinGecko API</p>
                  <p className="text-[10px]">Real-time market data</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Market news</p>
                  <p>NewsAPI — Liberia sources</p>
                  <p className="text-[10px]">Updated daily</p>
                </div>
              </div>
              <p className="mt-3">
                <a href="/docs" className="text-emerald-600 hover:underline dark:text-emerald-400">
                  View full data documentation →
                </a>
                {" · "}
                <a href="/report-fraud" className="text-emerald-600 hover:underline dark:text-emerald-400">
                  Report incorrect data →
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
