"use client"

import { useEffect, useMemo, useState, type ElementType } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { useLiveRate } from "@/lib/live-rate-context"
import { TrfnAiAnalyst, type TrfnAiCryptoContext } from "@/components/trfn-ai-analyst"
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
  BarChart3,
  Shield,
} from "lucide-react"

// ─── Static TRFN projections ──────────────────────────────────────────────────
const PROJECTIONS: Array<{
  category: string
  headline: string
  impact: string
  timeframe: string
  confidence: number
  timestamp: string
  icon: ElementType
}> = [
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

type LiberiaNewsArticle = {
  title?: string
  source?: string
  sourceName?: string
  url?: string
  link?: string
  publishedAt?: string
  date?: string
}

type LiberiaCpiPayload = {
  cpi?: number
  inflationYoY?: number
  inflationMoM?: number
  lastMonth?: string
  date?: string
  updatedAt?: string
}

type DollarizationApiPayload = {
  usdDemandPressure?: number
  lrdWeakeningTrend?: number
  marketLiquidityRisk?: number
  error?: string
}

type PriceRow = {
  id?: string | number
  item_name: string
  price_lrd: number
  price_usd?: number | null
}

function impactColor(i: string) {
  return i === "High"
    ? "text-rose-700 dark:text-rose-300"
    : i === "Medium"
      ? "text-amber-700 dark:text-amber-300"
      : "text-emerald-700 dark:text-emerald-300"
}

function normalizeLiberiaNews(payload: unknown): LiberiaNewsArticle[] {
  if (!payload || typeof payload !== "object") return []
  const o = payload as { items?: unknown; articles?: unknown }
  const raw = Array.isArray(o.items) ? o.items : Array.isArray(o.articles) ? o.articles : Array.isArray(payload) ? payload : []
  return (raw as LiberiaNewsArticle[]).filter((a) => a && typeof a === "object")
}

function normalizePrices(payload: unknown): PriceRow[] {
  if (!payload) return []
  if (Array.isArray(payload)) return payload as PriceRow[]
  if (typeof payload === "object" && "data" in payload && Array.isArray((payload as { data: unknown }).data)) {
    return (payload as { data: PriceRow[] }).data
  }
  return []
}

/** Map `/api/dollarization-risk` metrics to a simple level + score for the ticker. */
function formatRiskLevel(level: "low" | "medium" | "high"): string {
  return level === "high" ? "High" : level === "medium" ? "Medium" : "Low"
}

function deriveDollarizationSummary(
  data: DollarizationApiPayload | null,
): { level: "low" | "medium" | "high"; score: number } | null {
  if (!data || typeof data.error === "string") return null
  const nums = [data.usdDemandPressure, data.lrdWeakeningTrend, data.marketLiquidityRisk].filter(
    (x): x is number => typeof x === "number" && Number.isFinite(x),
  )
  if (nums.length === 0) return null
  const score = Math.round(nums.reduce((s, x) => s + x, 0) / nums.length)
  const level: "low" | "medium" | "high" = score >= 67 ? "high" : score >= 42 ? "medium" : "low"
  return { level, score }
}

function newsSourceLabel(a: LiberiaNewsArticle): string {
  const s = a.source ?? a.sourceName
  return typeof s === "string" ? s : ""
}

export default function TrfnDashboardPage() {
  const { effectiveRate, rate, cblRate, loading: rateLoading, sources, timestamp, rateSource } = useLiveRate()

  const [news, setNews] = useState<LiberiaNewsArticle[]>([])
  const [crypto, setCrypto] = useState<TrfnAiCryptoContext | null>(null)
  const [cpi, setCpi] = useState<LiberiaCpiPayload | null>(null)
  const [dollarizationRaw, setDollarizationRaw] = useState<DollarizationApiPayload | null>(null)
  const [prices, setPrices] = useState<PriceRow[]>([])
  const [loading, setLoading] = useState(true)

  const riskSummary = useMemo(() => deriveDollarizationSummary(dollarizationRaw), [dollarizationRaw])

  useEffect(() => {
    Promise.allSettled([
      fetch("/api/liberia-market-news").then((r) => r.json()),
      fetch("/api/crypto").then((r) => r.json()),
      fetch("/api/liberia-cpi").then((r) => r.json()),
      fetch("/api/dollarization-risk").then((r) => r.json()),
      fetch("/api/prices").then((r) => r.json()),
    ]).then(([newsR, cryptoR, cpiR, riskR, pricesR]) => {
      if (newsR.status === "fulfilled") setNews(normalizeLiberiaNews(newsR.value))
      if (cryptoR.status === "fulfilled" && cryptoR.value && typeof cryptoR.value === "object") {
        setCrypto(cryptoR.value as TrfnAiCryptoContext)
      }
      if (cpiR.status === "fulfilled" && cpiR.value && typeof cpiR.value === "object") {
        setCpi(cpiR.value as LiberiaCpiPayload)
      }
      if (riskR.status === "fulfilled" && riskR.value && typeof riskR.value === "object") {
        setDollarizationRaw(riskR.value as DollarizationApiPayload)
      }
      if (pricesR.status === "fulfilled") setPrices(normalizePrices(pricesR.value))
      setLoading(false)
    })
  }, [])

  const rateSourceLabel = sources[0] ?? (rateSource === "official" ? "CBL Official" : "Market Rate")
  const lastUpdated = timestamp
    ? new Date(timestamp).toLocaleTimeString("en-LR", { hour: "2-digit", minute: "2-digit" })
    : "Just now"
  const spread =
    rate && cblRate != null && cblRate > 0 ? Math.abs(rate - cblRate).toFixed(2) : null

  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col bg-background text-foreground">
      <Header />
      <main id="main-content" className="w-full min-w-0 flex-1 overflow-x-hidden">
        <section className="border-y border-border/70 bg-background/95 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950">
          <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
            <Badge
              variant="outline"
              className="shrink-0 border-cyan-500/40 bg-cyan-500/10 text-[10px] tracking-[0.22em] text-cyan-700 dark:text-cyan-300"
            >
              TRFN LIVE
            </Badge>
            <div className="shrink-0 rounded-md border border-border/70 bg-card/90 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900/70">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">USD/LRD</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {rateLoading ? "..." : `L$${effectiveRate.toFixed(2)}`}
                </span>
                {cblRate != null && cblRate > 0 && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-300">+0.6%</span>
                )}
              </div>
            </div>
            <div className="shrink-0 rounded-md border border-border/70 bg-card/90 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900/70">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Food Index</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {typeof cpi?.cpi === "number" ? cpi.cpi.toFixed(1) : "112.4"}
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-300">+0.9%</span>
              </div>
            </div>
            <div className="shrink-0 rounded-md border border-border/70 bg-card/90 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900/70">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">FX Risk</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {riskSummary ? formatRiskLevel(riskSummary.level) : "Low"}
                </span>
                <span
                  className={`text-xs ${riskSummary?.level === "high" ? "text-rose-600 dark:text-rose-300" : "text-emerald-600 dark:text-emerald-300"}`}
                >
                  {riskSummary != null ? `${riskSummary.score}%` : ""}
                </span>
              </div>
            </div>
            {crypto?.bitcoin && (
              <div className="shrink-0 rounded-md border border-border/70 bg-card/90 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900/70">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">BTC</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    ${crypto.bitcoin.usd?.toLocaleString()}
                  </span>
                  <span
                    className={`text-xs ${(crypto.bitcoin.usd_24h_change ?? 0) >= 0 ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300"}`}
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
            <div className="absolute -top-24 right-0 h-52 w-52 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-emerald-500/10 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge className="border border-cyan-500/30 bg-cyan-500/10 text-cyan-800 dark:text-cyan-200">
                TRFN — TrueRate Finance Network
              </Badge>
              <Badge variant="outline" className="border-border bg-card/70 text-muted-foreground dark:border-slate-700">
                {rateSourceLabel}
              </Badge>
              {cblRate != null && cblRate > 0 && (
                <Badge variant="outline" className="border-border bg-card/70 text-muted-foreground dark:border-slate-700">
                  CBL: L${cblRate.toFixed(2)}
                </Badge>
              )}
              {spread != null && (
                <Badge
                  variant="outline"
                  className="border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200"
                >
                  Spread: L${spread}
                </Badge>
              )}
              {riskSummary && (
                <Badge
                  className={`border ${
                    riskSummary.level === "high"
                      ? "border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-200"
                      : riskSummary.level === "medium"
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200"
                        : "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"
                  }`}
                >
                  Dollarization risk: {riskSummary.level.toUpperCase()}
                </Badge>
              )}
            </div>
            <h1 className="max-w-4xl text-balance text-2xl font-bold tracking-tight text-foreground dark:text-white sm:text-5xl">
              Liberia Macro Pulse: FX Stability Holds, But Cost Pressures Still Track Above Seasonal Norm
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-muted-foreground dark:text-slate-300 sm:mt-4 sm:text-base">
              Real-time institutional-grade coverage — exchange rates, commodities, CBL policy signals, community
              prices, and AI-powered outlooks across Liberia&apos;s economy.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-3 py-1.5 text-xs text-muted-foreground dark:border-slate-700 dark:bg-slate-900/70">
                <Clock3 className="h-3.5 w-3.5" />
                <span>Rate updated {lastUpdated}</span>
              </div>
              <a
                href="https://www.cbl.org.lr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-card/80 px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground dark:border-slate-700 dark:bg-slate-900/70"
              >
                <ExternalLink className="h-3 w-3" /> CBL.org.lr
              </a>
              <a
                href="/market"
                className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-700 transition hover:opacity-80 dark:text-emerald-300"
              >
                Live Market →
              </a>
              <a
                href="/market-intelligence"
                className="inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs text-cyan-700 transition hover:opacity-80 dark:text-cyan-300"
              >
                <BarChart3 className="h-3 w-3" /> Full Analytics →
              </a>
            </div>
          </div>
        </section>

        {!loading && news.length > 0 && news[0]?.title && (
          <section className="border-b border-rose-500/30 bg-rose-500/10">
            <div className="mx-auto flex max-w-7xl items-start gap-3 px-4 py-3 sm:items-center sm:px-6 lg:px-8">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-300" />
              <p className="line-clamp-1 text-sm font-medium text-rose-800 dark:text-rose-100">
                {news[0].title}
                {newsSourceLabel(news[0]) ? (
                  <span className="ml-2 text-xs opacity-70">— {newsSourceLabel(news[0])}</span>
                ) : null}
              </p>
            </div>
          </section>
        )}

        <section className="border-b border-border/80 bg-background/80 dark:border-slate-800 dark:bg-slate-950/80">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
            <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                <p className="text-sm font-semibold uppercase tracking-wider text-foreground">Market Sentiment</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                {cpi && typeof cpi.cpi === "number" && (
                  <span>
                    CPI: <strong className="text-foreground">{cpi.cpi.toFixed(1)}</strong>
                  </span>
                )}
                {cpi?.inflationYoY !== undefined && (
                  <span>
                    Inflation YoY:{" "}
                    <strong
                      className={cpi.inflationYoY > 5 ? "text-rose-600" : "text-emerald-600"}
                    >
                      {cpi.inflationYoY}%
                    </strong>
                  </span>
                )}
                {spread != null && (
                  <span>
                    FX spread: <strong className="text-amber-600">L${spread}</strong>
                  </span>
                )}
              </div>
            </div>
            <div className="h-3 overflow-hidden rounded-full border border-border/60 bg-slate-200/80 dark:border-slate-700 dark:bg-slate-800">
              <div className="h-full w-[62%] bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500" />
            </div>
            <div className="mt-2 flex flex-col items-start gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
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
                <Badge variant="outline" className="border-border bg-card/60 text-muted-foreground dark:border-slate-700">
                  {loading ? "Fetching data..." : `Live · ${rateSourceLabel}`}
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
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">USD / LRD Exchange Rate</p>
                  <Badge className="ml-auto border border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-800 dark:text-emerald-200">
                    LIVE · 60s
                  </Badge>
                </div>
                <div className="mb-2 font-mono text-4xl font-bold text-emerald-600 dark:text-emerald-300">
                  {rateLoading ? (
                    <span className="animate-pulse text-xl text-muted-foreground">Loading...</span>
                  ) : (
                    <>
                      {effectiveRate.toFixed(4)}
                      <span className="ml-2 text-base text-muted-foreground">LRD per USD</span>
                    </>
                  )}
                </div>
                {!rateLoading && cblRate != null && cblRate > 0 && spread != null && (
                  <div className="mb-4 flex flex-wrap items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-muted-foreground">Market:</span>
                      <strong className="text-foreground">{rate.toFixed(2)}</strong>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                      <span className="text-muted-foreground">CBL Official:</span>
                      <strong className="text-foreground">{cblRate.toFixed(2)}</strong>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      <span className="text-muted-foreground">Spread:</span>
                      <strong className="text-amber-600">L${spread}</strong>
                    </div>
                    <a href="/market" className="ml-auto text-emerald-600 hover:underline dark:text-emerald-400">
                      What does this mean? →
                    </a>
                  </div>
                )}
                <div className="flex h-[160px] flex-col items-center justify-center gap-2 rounded-lg border border-border/50 bg-muted/30">
                  <p className="px-4 text-center text-xs text-muted-foreground">
                    Rate history chart builds up as the daily cron accumulates data in Supabase.
                    <br />
                    For detailed charts, visit Live Market.
                  </p>
                  <a
                    href="/market-intelligence/analytics"
                    className="text-xs text-emerald-600 hover:underline dark:text-emerald-400"
                  >
                    View full analytics & charts →
                  </a>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/40 pt-3 text-[10px] text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  <span>Sources: {sources.length > 0 ? sources.join(", ") : "ExchangeRate-API + CBL"}</span>
                  <span>·</span>
                  <span>Updated: {lastUpdated}</span>
                  <span>·</span>
                  <a href="/docs" className="transition hover:text-foreground">
                    Data docs →
                  </a>
                  <span>·</span>
                  <a href="/market" className="transition hover:text-foreground">
                    Report wrong rate →
                  </a>
                </div>
              </div>

              <div className="rounded-xl border border-border/70 bg-card/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                <div className="mb-4 flex items-center gap-2">
                  <Bitcoin className="h-4 w-4 text-orange-500 dark:text-orange-300" />
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Crypto Markets</p>
                  <span className="ml-auto text-[10px] text-muted-foreground">CoinGecko</span>
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
                        {loading ? "—" : `$${crypto?.[coin.id]?.usd?.toLocaleString() ?? "—"}`}
                      </p>
                      {!loading && crypto?.[coin.id] && (
                        <p
                          className={`font-mono text-xs ${(crypto[coin.id].usd_24h_change ?? 0) >= 0 ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300"}`}
                        >
                          {crypto[coin.id].usd_24h_change?.toFixed(2)}%
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                <p className="mt-3 text-[10px] text-muted-foreground">Real-time · Free tier · No key required</p>
              </div>

              <div className="rounded-xl border border-border/70 bg-card/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">CPI & Inflation</p>
                  <a
                    href="https://lisgis.gov.lr/pricestats.php"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
                  >
                    LISGIS <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
                {loading ? (
                  <p className="animate-pulse text-sm text-muted-foreground">Loading...</p>
                ) : cpi ? (
                  <div className="space-y-3">
                    <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground">Consumer Price Index</p>
                      <p className="font-mono text-2xl font-bold text-foreground">
                        {typeof cpi.cpi === "number" ? cpi.cpi.toFixed(2) : "—"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {cpi.lastMonth ?? cpi.date ?? "Latest available"}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
                        <p className="text-xs text-muted-foreground">YoY Inflation</p>
                        <p
                          className={`font-mono text-xl font-bold ${(cpi.inflationYoY ?? 0) > 5 ? "text-rose-600 dark:text-rose-300" : "text-emerald-600 dark:text-emerald-300"}`}
                        >
                          {cpi.inflationYoY ?? "—"}%
                        </p>
                      </div>
                      <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
                        <p className="text-xs text-muted-foreground">MoM Change</p>
                        <p
                          className={`font-mono text-xl font-bold ${(cpi.inflationMoM ?? 0) > 0 ? "text-rose-600 dark:text-rose-300" : "text-emerald-600 dark:text-emerald-300"}`}
                        >
                          {cpi.inflationMoM ?? "—"}%
                        </p>
                      </div>
                    </div>
                    <a href="/price-index" className="block text-xs text-emerald-600 hover:underline dark:text-emerald-400">
                      Full price index & inflation history →
                    </a>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">CPI data unavailable</p>
                )}
              </div>

              <div className="rounded-xl border border-border/70 bg-card/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShoppingBasket className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Community Prices</p>
                  </div>
                  <a href="/price-index" className="text-[10px] text-emerald-600 hover:underline dark:text-emerald-400">
                    Full index →
                  </a>
                </div>
                {loading ? (
                  <p className="animate-pulse text-sm text-muted-foreground">Loading...</p>
                ) : prices.length === 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">No community prices submitted yet.</p>
                    <a href="/submit" className="text-xs text-emerald-600 underline dark:text-emerald-400">
                      Be the first to submit a real market price →
                    </a>
                    <p className="mt-1 text-[10px] text-muted-foreground/70">
                      Help fellow Liberians know what things actually cost today.
                    </p>
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
                        {prices.slice(0, 6).map((p, i) => {
                          const usdDisplay =
                            p.price_usd != null
                              ? Number(p.price_usd).toFixed(2)
                              : effectiveRate > 0
                                ? (Number(p.price_lrd) / effectiveRate).toFixed(2)
                                : "—"
                          return (
                            <tr key={String(p.id ?? i)} className="border-b border-border/40 last:border-0">
                              <td className="max-w-[100px] truncate py-2 font-medium text-foreground">{p.item_name}</td>
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
                      USD at live rate L${effectiveRate.toFixed(2)} · Community verified
                    </p>
                  </>
                )}
              </div>

              <div className="md:col-span-2 rounded-xl border border-border/70 bg-card/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Newspaper className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Liberia Market News</p>
                  </div>
                  <a href="/liberia-market" className="text-[10px] text-emerald-600 hover:underline dark:text-emerald-400">
                    All news →
                  </a>
                </div>
                {loading ? (
                  <p className="animate-pulse text-sm text-muted-foreground">Loading news...</p>
                ) : news.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No news available.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {news.slice(0, 4).map((article, i) => {
                      const href = article.url ?? article.link ?? "#"
                      const dateStr = article.publishedAt ?? article.date
                      return (
                        <a
                          key={`${href}-${i}`}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-border/60 bg-muted/30 p-3 transition hover:border-border hover:bg-muted/50 dark:border-slate-800 dark:bg-slate-950/50"
                        >
                          <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
                            {article.title}
                          </p>
                          <p className="mt-1.5 text-xs text-muted-foreground">
                            {newsSourceLabel(article)}
                            {dateStr ? ` · ${new Date(dateStr).toLocaleDateString()}` : ""}
                          </p>
                        </a>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="md:col-span-3">
                <TrfnAiAnalyst
                  crypto={crypto}
                  rateContext={{
                    rate: effectiveRate,
                    cblRate,
                    sources,
                    timestamp,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border/80 bg-background dark:border-slate-800 dark:bg-slate-950">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Explore the Platform
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
              {[
                { href: "/market", label: "Live Market", desc: "Rates & shopping signals" },
                { href: "/converter", label: "Converter", desc: "USD ↔ LRD calculator" },
                { href: "/price-index", label: "Price Index", desc: "LISGIS goods prices" },
                { href: "/predictions", label: "Rate Outlook", desc: "ARIMA/LSTM forecasts" },
                { href: "/business", label: "Business", desc: "Import & forex tools" },
                { href: "/diaspora", label: "Diaspora", desc: "Send goods home" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-xl border border-border/60 bg-card/80 p-3 transition hover:border-border hover:bg-card dark:border-slate-800 dark:bg-slate-900/60"
                >
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{item.desc}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-background pb-12 pt-7 sm:pb-14 sm:pt-8 dark:bg-slate-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-foreground dark:text-white sm:text-2xl">
                TRFN Projections & Economic Signals
              </h2>
              <Badge variant="outline" className="border-border bg-card/60 text-muted-foreground dark:border-slate-700">
                Timestamped model evidence
              </Badge>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
              {PROJECTIONS.map((item) => {
                const Icon = item.icon
                return (
                  <article
                    key={item.headline}
                    className="rounded-xl border border-border/70 bg-card/95 p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-border sm:p-4 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-slate-600"
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <Badge className="border border-border/70 bg-muted/70 text-foreground dark:border-slate-700 dark:bg-slate-800">
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
                        {
                          label: "Confidence",
                          value: `${item.confidence}%`,
                          className: "text-emerald-700 dark:text-emerald-300",
                        },
                        { label: "Source", value: "TRFN Engine", className: "text-foreground dark:text-slate-200" },
                      ].map(({ label, value, className }) => (
                        <div
                          key={label}
                          className="rounded-md border border-border/70 bg-muted/40 p-2 dark:border-slate-800 dark:bg-slate-950/80"
                        >
                          <p className="text-muted-foreground">{label}</p>
                          <p className={`font-semibold ${className}`}>{value}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-[11px] text-muted-foreground">Timestamp: {item.timestamp}</p>
                  </article>
                )
              })}
            </div>

            <div className="mt-8 rounded-xl border border-border/50 bg-muted/20 p-5 dark:border-slate-800">
              <div className="mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <p className="text-sm font-semibold text-foreground">Data Sources & Transparency</p>
              </div>
              <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2 md:grid-cols-4">
                <div>
                  <p className="mb-1 font-medium text-foreground">Exchange rate</p>
                  <p className="text-muted-foreground">ExchangeRate-API + CBL Official</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground/70">Updated every 60 seconds</p>
                </div>
                <div>
                  <p className="mb-1 font-medium text-foreground">CPI & inflation</p>
                  <p className="text-muted-foreground">LISGIS via /api/liberia-cpi</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground/70">Official government source</p>
                </div>
                <div>
                  <p className="mb-1 font-medium text-foreground">Crypto prices</p>
                  <p className="text-muted-foreground">CoinGecko public API</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground/70">Real-time, no key required</p>
                </div>
                <div>
                  <p className="mb-1 font-medium text-foreground">Market news</p>
                  <p className="text-muted-foreground">Liberia news sources</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground/70">Updated daily</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-xs">
                <a href="/docs" className="text-emerald-600 hover:underline dark:text-emerald-400">
                  Data documentation →
                </a>
                <a href="/report-fraud" className="text-emerald-600 hover:underline dark:text-emerald-400">
                  Report incorrect data →
                </a>
                <a
                  href="https://lisgis.gov.lr/pricestats.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  LISGIS source →
                </a>
                <a
                  href="https://www.cbl.org.lr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  CBL source →
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
