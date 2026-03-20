"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { DollarizationRiskIndicator } from "@/components/dollarization-risk-indicator"
import { TrueRateMarketIntelligence } from "@/components/market-intelligence/TrueRateMarketIntelligence"
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  TrendingUp,
  Package,
  AlertTriangle,
  Shield,
  RefreshCw,
  Activity,
  ShoppingCart,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  ExternalLink,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Database,
  Building2,
  DollarSign,
  PackageCheck,
  Scale,
  Link2,
} from "lucide-react"

interface VolatilitySeries {
  commodityId: string
  commodityName: string
  points: Array<{ date: string; value?: number; volatility?: number }>
}

interface MarketRiskData {
  marketRiskScore: number
  priceStabilityIndex: number
  riskLabel: string
  period: string
}

interface VolumeAnalysis {
  period: string
  totalVolume: number
}

interface SyncLogEntry {
  source: string
  lastSync: string
  status: string
  recordsCount?: number
  message?: string
}

interface ColDashboard {
  costOfLivingIndex: { index: number; baseDate: string; currentDate: string; basket: Array<{ commodityName: string; price: number }> } | null
  affordabilityIndex: { index: number; label: string; currentBasketAvg: number } | null
  aggregatedPrices: Array<{ date: string; basketAvg: number }>
}

interface DataSourceEntry {
  id: string
  name: string
  description: string
  url: string | null
  type: "live" | "sample" | "derived"
  usedBy: string[]
}

interface MarketInputDataState {
  importVolumeByCategory: { period: string; byCategory: Array<{ category: string; volume: number; unit: string; sharePercent: number; valueUsd?: number; valueLocal?: number }>; totalVolume: number }
  majorImporters: Array<{ name: string; category?: string; volumeSharePercent: number; valueUsd?: number; rank: number }>
  wholesaleBenchmarks: Array<{ commodityName: string; unit: string; benchmarkPrice: number; currency: string; minPrice?: number; maxPrice?: number }>
  tradeFlowTrends: Array<{ period: string; direction: string; changePercent: number; totalVolume: number; topCategory: string }>
  commodityAvailability: Array<{ commodityName: string; availability: string; narrative?: string }>
}

interface PriceMonitoringState {
  essentialPrices: Array<{ id: string; name: string; unit: string; price: number; currency: string; category: string; minPrice?: number; maxPrice?: number }>
  costOfLivingIndex: number | null
  fxCorrelation: { correlation: number; interpretation: string; period: string; basketPercentChange: number; fxPercentChange: number } | null
  useCases: string[]
}

/** Full charts, tables, sync logs, and data sources — linked from `/market-intelligence`. */
export function MarketIntelligenceFullDashboard() {
  const [commoditySeries, setCommoditySeries] = useState<VolatilitySeries[]>([])
  const [marketRisk, setMarketRisk] = useState<MarketRiskData | null>(null)
  const [volumeAnalysis, setVolumeAnalysis] = useState<VolumeAnalysis[]>([])
  const [syncLogs, setSyncLogs] = useState<SyncLogEntry[]>([])
  const [colDashboard, setColDashboard] = useState<ColDashboard | null>(null)
  const [sources, setSources] = useState<DataSourceEntry[]>([])
  const [inputData, setInputData] = useState<MarketInputDataState | null>(null)
  const [priceMonitoring, setPriceMonitoring] = useState<PriceMonitoringState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetch, setLastFetch] = useState<Date | null>(null)
  const [glossaryOpen, setGlossaryOpen] = useState(false)

  const fetchAll = async () => {
    setLoading(true)
    setError(null)
    try {
      const [volRes, riskRes, volAnalysisRes, syncRes, colRes, sourcesRes, inputDataRes, priceMonRes] = await Promise.all([
        fetch("/api/monitoring/volatility?days=90&window=7"),
        fetch("/api/market-risk?days=90"),
        fetch("/api/trade-analytics/volumes?periods=24"),
        fetch("/api/sync-logs"),
        fetch("/api/cost-of-living/dashboard?days=90"),
        fetch("/api/market-intelligence/sources"),
        fetch("/api/market-intelligence/input-data"),
        fetch("/api/price-monitoring/essential?days=90"),
      ])

      if (volRes.ok) {
        try {
          const v = await volRes.json()
          setCommoditySeries(Array.isArray(v?.series) ? v.series : [])
        } catch {
          setCommoditySeries([])
        }
      } else {
        setCommoditySeries([])
      }
      if (riskRes.ok) {
        try {
          const r = await riskRes.json()
          setMarketRisk({
            marketRiskScore: Number(r.marketRiskScore) || 0,
            priceStabilityIndex: Number(r.priceStabilityIndex) || 0,
            riskLabel: r.riskLabel ?? "low",
            period: r.period ?? "",
          })
        } catch {
          setMarketRisk(null)
        }
      } else {
        setMarketRisk(null)
      }
      if (volAnalysisRes.ok) {
        try {
          const va = await volAnalysisRes.json()
          setVolumeAnalysis(Array.isArray(va?.volumeAnalysis) ? va.volumeAnalysis : [])
        } catch {
          setVolumeAnalysis([])
        }
      } else {
        setVolumeAnalysis([])
      }
      if (syncRes.ok) {
        try {
          const s = await syncRes.json()
          setSyncLogs(Array.isArray(s?.logs) ? s.logs : [])
        } catch {
          setSyncLogs([])
        }
      } else {
        setSyncLogs([])
      }
      if (colRes.ok) {
        try {
          const c = await colRes.json()
          setColDashboard({
            costOfLivingIndex: c.costOfLivingIndex ?? null,
            affordabilityIndex: c.affordabilityIndex ?? null,
            aggregatedPrices: Array.isArray(c?.aggregatedPrices) ? c.aggregatedPrices : [],
          })
        } catch {
          setColDashboard(null)
        }
      } else {
        setColDashboard(null)
      }
      if (sourcesRes.ok) {
        try {
          const so = await sourcesRes.json()
          setSources(Array.isArray(so?.sources) ? so.sources : [])
        } catch {
          setSources([])
        }
      } else {
        setSources([])
      }
      if (inputDataRes.ok) {
        try {
          const id = await inputDataRes.json()
          setInputData({
            importVolumeByCategory: id.importVolumeByCategory ?? { period: "", byCategory: [], totalVolume: 0 },
            majorImporters: Array.isArray(id.majorImporters) ? id.majorImporters : [],
            wholesaleBenchmarks: Array.isArray(id.wholesaleBenchmarks) ? id.wholesaleBenchmarks : [],
            tradeFlowTrends: Array.isArray(id.tradeFlowTrends) ? id.tradeFlowTrends : [],
            commodityAvailability: Array.isArray(id.commodityAvailability) ? id.commodityAvailability : [],
          })
        } catch {
          setInputData(null)
        }
      } else {
        setInputData(null)
      }
      if (priceMonRes.ok) {
        try {
          const pm = await priceMonRes.json()
          setPriceMonitoring({
            essentialPrices: Array.isArray(pm.essentialPrices) ? pm.essentialPrices : [],
            costOfLivingIndex: pm.costOfLivingIndex ?? null,
            fxCorrelation: pm.fxCorrelation ?? null,
            useCases: Array.isArray(pm.useCases) ? pm.useCases : [],
          })
        } catch {
          setPriceMonitoring(null)
        }
      } else {
        setPriceMonitoring(null)
      }
      setLastFetch(new Date())
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const commodityChartData = (() => {
    const byDate = new Map<string, Record<string, number | string>>()
    for (const s of commoditySeries) {
      for (const p of s.points) {
        if (p.value == null) continue
        const row = byDate.get(p.date) ?? { date: p.date }
        row[s.commodityId] = p.value
        byDate.set(p.date, row)
      }
    }
    return [...byDate.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([, row]) => row)
      .slice(-60)
  })()

  const chartColors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]
  const commodityChartConfig = commoditySeries.slice(0, 4).reduce(
    (acc, s, i) => ({
      ...acc,
      [s.commodityId]: { label: s.commodityName, color: chartColors[i] ?? chartColors[0] },
    }),
    {} as Record<string, { label: string; color: string }>
  )

  const importChartData = volumeAnalysis.slice(-12).map((v) => ({
    period: v.period,
    volume: v.totalVolume,
    label: v.period,
  }))

  const colChartData = (colDashboard?.aggregatedPrices ?? []).slice(-30).map((p) => ({
    date: p.date,
    basket: p.basketAvg,
  }))

  const riskBadgeVariant = marketRisk
    ? marketRisk.riskLabel === "critical" || marketRisk.riskLabel === "high"
      ? "destructive"
      : marketRisk.riskLabel === "elevated"
        ? "secondary"
        : "default"
    : "outline"

  return (
    <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden bg-background">
        <div className="border-b border-border bg-muted/30 dark:bg-muted/20">
          <div className="container mx-auto px-4 py-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <Link href="/market-intelligence" className="text-muted-foreground hover:text-foreground transition-colors">
              Overview
            </Link>
            <span className="text-muted-foreground/40" aria-hidden>/</span>
            <span className="font-medium text-foreground">Full analytics</span>
            <span className="hidden sm:inline text-muted-foreground/30 mx-1" aria-hidden>|</span>
            <Link href="/market" className="text-primary font-medium hover:underline">
              Liberian Market Today
            </Link>
          </div>
        </div>
        {/* Hero header */}
        <section className="relative border-b border-border bg-muted/10">
          <div className="container mx-auto px-4 py-8 md:py-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  Market analytics dashboard
                </h1>
                <p className="text-muted-foreground mt-1.5 text-sm md:text-base max-w-xl">
                  Deep dive: commodity charts, import volumes, ministry price tables, sync logs, and data sources.
                </p>
                <a
                  href="#truerate-market-intelligence"
                  className="inline-flex items-center gap-1.5 mt-2 text-sm font-medium text-primary hover:underline"
                >
                  Jump to weekly insights
                </a>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {lastFetch && (
                  <span className="hidden sm:inline text-xs text-muted-foreground">
                    Updated {lastFetch.toLocaleTimeString()}
                  </span>
                )}
                <Button variant="outline" size="sm" onClick={fetchAll} disabled={loading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </div>
            {error && (
              <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 dark:bg-destructive/10 px-4 py-3 text-destructive text-sm">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span className="flex-1 min-w-0">{error}</span>
                <Button variant="outline" size="sm" onClick={() => { setError(null); fetchAll() }} className="border-destructive/50 text-destructive hover:bg-destructive/10">
                  Try again
                </Button>
              </div>
            )}
          </div>
        </section>

        <div className="container mx-auto px-4 py-8 space-y-10 max-w-6xl">
          {/* Intro + Glossary */}
          <section className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/30 dark:bg-muted/40 px-4 py-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Understanding this dashboard</p>
              <p>
                This page shows key market indicators for Liberia: how stable prices are, how affordable essentials are,
                and how import volumes change over time. All prices are in <strong>LRD (Liberian dollars)</strong> unless
                noted. Use the four metrics at the top for a quick snapshot; scroll down for detailed charts and data sources.
              </p>
            </div>
            <Collapsible open={glossaryOpen} onOpenChange={setGlossaryOpen}>
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-muted/50 dark:hover:bg-muted/40 transition-colors">
                <span className="flex items-center gap-2">
                  {glossaryOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  Understanding the metrics
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 rounded-lg border border-border bg-muted/20 dark:bg-muted/30 p-4 text-sm text-muted-foreground space-y-4">
                  <div>
                    <p className="font-medium text-foreground">Market risk (score 0–100)</p>
                    <p>A higher score means more risk from price swings, supply changes, or import shifts. Low is better for stability.</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Price stability (index 0–100)</p>
                    <p>Measures how steady commodity prices are over time. Higher means more stable; lower means more volatile.</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Cost of living index (base = 100)</p>
                    <p>Compares the current cost of a fixed basket of goods to a base period. Above 100 means things cost more than the base; below 100 means cheaper.</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Affordability</p>
                    <p>Reflects how affordable the basket is relative to typical income. Labels (e.g. moderate, high) describe the level.</p>
                  </div>
                  <p className="pt-2 border-t border-border text-muted-foreground">
                    Market risk, price stability, cost of living, and affordability all use the same <strong className="text-foreground">Liberia Price Index</strong> basket (essential goods) so metrics are comparable.
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </section>

          {/* TrueRate Market Intelligence — weekly auto-generated insights */}
          <TrueRateMarketIntelligence />

          {/* Key metrics */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Key metrics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border border-border bg-card shadow-sm hover:shadow dark:shadow-none dark:border-muted-foreground/20 transition-shadow">
                <CardHeader className="pb-2 pt-5">
                  <CardDescription className="flex items-center justify-between gap-2 text-xs font-medium">
                    <span className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted/40 border border-border/40 text-primary">
                        <AlertTriangle className="h-4 w-4" />
                      </span>
                      Market risk
                    </span>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground" aria-label="What is market risk?">
                          <HelpCircle className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[240px]">
                        Risk from price volatility, supply changes, and import shifts. Lower score = more stable market.
                      </TooltipContent>
                    </UITooltip>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-5">
                  <div className="text-2xl font-bold tabular-nums">{marketRisk?.marketRiskScore ?? "—"}</div>
                  <Badge variant={riskBadgeVariant} className="mt-2 text-xs">
                    {marketRisk?.riskLabel ?? "—"}
                  </Badge>
                </CardContent>
              </Card>
              <Card className="border border-border bg-card shadow-sm hover:shadow dark:shadow-none dark:border-muted-foreground/20 transition-shadow">
                <CardHeader className="pb-2 pt-5">
                  <CardDescription className="flex items-center justify-between gap-2 text-xs font-medium">
                    <span className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted/40 border border-border/40 text-primary">
                        <Shield className="h-4 w-4" />
                      </span>
                      Price stability
                    </span>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground" aria-label="What is price stability?">
                          <HelpCircle className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[240px]">
                        How steady prices are (0–100). Higher = more stable; lower = more volatile.
                      </TooltipContent>
                    </UITooltip>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-5">
                  <div className="text-2xl font-bold tabular-nums">{marketRisk?.priceStabilityIndex ?? "—"}</div>
                  <p className="text-xs text-muted-foreground mt-2">Index 0–100</p>
                </CardContent>
              </Card>
              <Card className="border border-border bg-card shadow-sm hover:shadow dark:shadow-none dark:border-muted-foreground/20 transition-shadow">
                <CardHeader className="pb-2 pt-5">
                  <CardDescription className="flex items-center justify-between gap-2 text-xs font-medium">
                    <span className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted/40 border border-border/40 text-primary">
                        <ShoppingCart className="h-4 w-4" />
                      </span>
                      Cost of living
                    </span>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground" aria-label="What is cost of living index?">
                          <HelpCircle className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[240px]">
                        Basket cost vs base period (100). Above 100 = more expensive; below = cheaper.
                      </TooltipContent>
                    </UITooltip>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-5">
                  <div className="text-2xl font-bold tabular-nums">
                    {colDashboard?.costOfLivingIndex?.index ?? "—"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Base = 100</p>
                </CardContent>
              </Card>
              <Card className="border border-border bg-card shadow-sm hover:shadow dark:shadow-none dark:border-muted-foreground/20 transition-shadow">
                <CardHeader className="pb-2 pt-5">
                  <CardDescription className="flex items-center justify-between gap-2 text-xs font-medium">
                    <span className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted/40 border border-border/40 text-primary">
                        <TrendingUp className="h-4 w-4" />
                      </span>
                      Affordability
                    </span>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground" aria-label="What is affordability?">
                          <HelpCircle className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[240px]">
                        How affordable the basket is. Reflects cost relative to typical income.
                      </TooltipContent>
                    </UITooltip>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-5">
                  <div className="text-2xl font-bold tabular-nums">
                    {colDashboard?.affordabilityIndex?.index ?? "—"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 capitalize">
                    {colDashboard?.affordabilityIndex?.label?.replace(/_/g, " ") ?? "—"}
                  </p>
                </CardContent>
              </Card>
            </div>
            <p className="mt-3 text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
              <Link2 className="h-3.5 w-3.5 shrink-0" />
              All four metrics use the same Liberia Price Index basket (essential goods: rice, palm oil, cement, fuel, sugar) for consistency.
              <a href="/price-index" className="text-primary hover:underline font-medium">View Price Index</a>
            </p>
          </section>

          {/* LRD health indicator */}
          <section aria-label="LRD health">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              LRD health indicator
            </h2>
            <p className="text-xs text-muted-foreground mb-4 max-w-2xl">
              A simple 0–100 stability score (live). Higher means stronger LRD stability. Drivers: USD preference, LRD trend, and liquidity stress.
            </p>
            <div className="max-w-2xl">
              <DollarizationRiskIndicator />
            </div>
          </section>

          {/* Charts */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Trends & charts
            </h2>
            <div className="space-y-6">
              <Card className="border border-border bg-card shadow-sm dark:shadow-none dark:border-muted-foreground/20">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="h-5 w-5 text-primary" />
                    Commodity price trends
                  </CardTitle>
                  <CardDescription>
                    Daily price levels (LRD) for monitored commodities. <span className="block mt-1 text-muted-foreground/90">Horizontal axis: time. Vertical axis: price in Liberian dollars (LRD). Each line is one commodity (e.g. rice, palm oil).</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-[300px] flex items-center justify-center rounded-lg bg-muted/30 dark:bg-muted/40">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <RefreshCw className="h-8 w-8 animate-spin" />
                        <span className="text-sm">Loading chart…</span>
                      </div>
                    </div>
                  ) : commodityChartData.length === 0 ? (
                    <div className="h-[300px] flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 dark:bg-muted/30 text-muted-foreground text-sm">
                      <Activity className="h-10 w-10 opacity-50" />
                      <p className="font-medium">No commodity price data yet</p>
                      <p className="text-xs max-w-sm text-center">Run data sync (cron) or ensure monitoring APIs are available.</p>
                      <Button variant="outline" size="sm" onClick={fetchAll}>Refresh</Button>
                    </div>
                  ) : (
                    <ChartContainer
                      config={commodityChartConfig}
                      className="h-[300px] w-full"
                    >
                      <LineChart
                        data={commodityChartData.map((r) => ({
                          ...r,
                          date: r.date ? new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--muted-foreground)" opacity={0.4} />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} stroke="var(--muted-foreground)" />
                        <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} stroke="var(--muted-foreground)" tickFormatter={(v) => Number(v).toFixed(0)} />
                        <Tooltip content={<ChartTooltipContent />} />
                        {commoditySeries.slice(0, 4).map((s) => (
                          <Line
                            key={s.commodityId}
                            type="monotone"
                            dataKey={s.commodityId}
                            stroke={commodityChartConfig[s.commodityId]?.color ?? "var(--primary)"}
                            strokeWidth={2}
                            dot={false}
                            name={s.commodityName}
                          />
                        ))}
                        <Legend />
                      </LineChart>
                    </ChartContainer>
                  )}
                </CardContent>
              </Card>

              <Card className="border border-border bg-card shadow-sm dark:shadow-none dark:border-muted-foreground/20">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="h-5 w-5 text-primary" />
                    Import volume trends
                  </CardTitle>
                  <CardDescription>
                    Total import volume by period. <span className="block mt-1 text-muted-foreground/90">Each bar is one time period (e.g. month). Height = total volume of imports. Helps spot seasonal or trend changes.</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-[280px] flex items-center justify-center rounded-lg bg-muted/30 dark:bg-muted/40">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <RefreshCw className="h-8 w-8 animate-spin" />
                        <span className="text-sm">Loading chart…</span>
                      </div>
                    </div>
                  ) : importChartData.length === 0 ? (
                    <div className="h-[280px] flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 dark:bg-muted/30 text-muted-foreground text-sm">
                      <Package className="h-10 w-10 opacity-50" />
                      <p className="font-medium">No import volume data yet</p>
                      <p className="text-xs max-w-sm text-center">Trade analytics data will appear after sync or when API is configured.</p>
                      <Button variant="outline" size="sm" onClick={fetchAll}>Refresh</Button>
                    </div>
                  ) : (
                    <ChartContainer
                      config={{ volume: { label: "Volume", color: "var(--primary)" } }}
                      className="h-[280px] w-full"
                    >
                      <BarChart data={importChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--muted-foreground)" opacity={0.4} />
                        <XAxis dataKey="period" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} stroke="var(--muted-foreground)" />
                        <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} stroke="var(--muted-foreground)" tickFormatter={(v) => (Number(v) / 1000).toFixed(0) + "k"} />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="volume" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Volume" />
                      </BarChart>
                    </ChartContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Price monitoring — essential commodities (Ministry) */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Price monitoring (essential commodities)
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Ministry-monitored essential goods: Rice (25kg, 50kg), Cooking oil, Cement, Fuel. Correlate LRD/USD with commodity prices, build the Cost of Living Index, and see how exchange rates affect daily life in Monrovia.
            </p>
            {loading && !priceMonitoring ? (
              <div className="rounded-lg border border-border bg-muted/20 dark:bg-muted/30 p-8 text-center text-muted-foreground">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p>Loading essential commodity prices…</p>
              </div>
            ) : !priceMonitoring ? (
              <Card className="border border-border bg-card border-dashed dark:border-muted-foreground/20">
                <CardContent className="py-8 text-center">
                  <Scale className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-60" />
                  <p className="text-sm font-medium text-foreground mb-1">Price monitoring not loaded</p>
                  <p className="text-xs text-muted-foreground mb-4">Click Refresh to load essential commodity prices and FX correlation.</p>
                  <Button variant="outline" size="sm" onClick={fetchAll}>Refresh</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <Card className="border border-border bg-card shadow-sm dark:shadow-none dark:border-muted-foreground/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Scale className="h-4 w-4 text-primary" />
                      Essential commodity prices (LRD)
                    </CardTitle>
                    <CardDescription>Current prices by unit. Source: Ministry / Commerce Today–style monitoring.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {priceMonitoring.essentialPrices.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No price data</p>
                    ) : (
                      <div className="table-wrapper overflow-x-auto rounded-lg border border-border ">
                        <table className="w-full text-sm min-w-[500px]">
                          <thead>
                            <tr className="border-b border-border bg-muted/30 dark:bg-muted/40 text-muted-foreground text-left">
                              <th className="py-3 px-4 font-medium min-h-[44px]">Commodity</th>
                              <th className="py-3 px-4 font-medium">Unit</th>
                              <th className="py-3 px-4 font-medium text-right">Price (LRD)</th>
                              <th className="py-3 px-4 font-medium text-right">Range</th>
                            </tr>
                          </thead>
                          <tbody>
                            {priceMonitoring.essentialPrices.map((p) => (
                              <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 dark:hover:bg-muted/30 transition-colors">
                                <td className="py-3 px-4 font-medium text-foreground">{p.name}</td>
                                <td className="py-3 px-4 text-muted-foreground">{p.unit}</td>
                                <td className="py-3 px-4 text-right font-mono tabular-nums text-foreground">{p.price.toLocaleString()}</td>
                                <td className="py-3 px-4 text-right text-muted-foreground text-xs">
                                  {p.minPrice != null && p.maxPrice != null ? `${p.minPrice.toLocaleString()} – ${p.maxPrice.toLocaleString()}` : "—"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border border-border bg-card shadow-sm dark:shadow-none dark:border-muted-foreground/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Link2 className="h-4 w-4 text-primary" />
                        LRD/USD & commodity correlation
                      </CardTitle>
                      <CardDescription>How exchange rates relate to basket prices in this period</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {priceMonitoring.fxCorrelation ? (
                        <div className="space-y-2 text-sm">
                          <p className="text-muted-foreground">{priceMonitoring.fxCorrelation.interpretation}</p>
                          <div className="flex flex-wrap gap-3 text-xs">
                            <span className="tabular-nums">Correlation: {priceMonitoring.fxCorrelation.correlation.toFixed(2)}</span>
                            <span className="text-muted-foreground">Basket: {priceMonitoring.fxCorrelation.basketPercentChange >= 0 ? "+" : ""}{priceMonitoring.fxCorrelation.basketPercentChange}%</span>
                            <span className="text-muted-foreground">LRD/USD: {priceMonitoring.fxCorrelation.fxPercentChange >= 0 ? "+" : ""}{priceMonitoring.fxCorrelation.fxPercentChange}%</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{priceMonitoring.fxCorrelation.period}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Insufficient data for correlation</p>
                      )}
                    </CardContent>
                  </Card>
                  <Card className="border border-border bg-card shadow-sm dark:shadow-none dark:border-muted-foreground/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <ShoppingCart className="h-4 w-4 text-primary" />
                        Cost of Living Index
                      </CardTitle>
                      <CardDescription>Basket-based index (base = 100). Feeds from essential commodity prices.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {priceMonitoring.costOfLivingIndex != null ? (
                        <p className="text-2xl font-bold tabular-nums text-foreground">{priceMonitoring.costOfLivingIndex.toFixed(1)}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground">See Cost of living index card below</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
                {priceMonitoring.useCases.length > 0 && (
                  <div className="rounded-lg border border-border bg-muted/20 dark:bg-muted/30 px-4 py-3">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Use cases for TrueRate</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {priceMonitoring.useCases.map((u, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{u}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Cost of living + Sync logs */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Cost of living & sync
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border border-border bg-card shadow-sm dark:shadow-none dark:border-muted-foreground/20">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    Cost of living index
                  </CardTitle>
                  <CardDescription>
                    Basket trend and current snapshot. <span className="block mt-1 text-muted-foreground/90">The list shows sample prices (LRD) for items in the basket; the chart shows how the basket average changes over time.</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {colDashboard?.costOfLivingIndex?.basket && (
                    <div className="rounded-lg border border-border bg-muted/30 dark:bg-muted/40 p-4 space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Current basket (LRD) — sample items</p>
                      <ul className="text-sm space-y-2">
                        {colDashboard.costOfLivingIndex.basket.slice(0, 5).map((b) => (
                          <li key={b.commodityName} className="flex justify-between items-center gap-2">
                            <span>{b.commodityName}</span>
                            <span className="font-mono tabular-nums text-foreground">{Number(b.price).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {colChartData.length > 0 ? (
                    <ChartContainer
                      config={{ basket: { label: "Basket avg", color: "var(--chart-1)" } }}
                      className="h-[200px] w-full"
                    >
                      <LineChart
                        data={colChartData.map((r) => ({
                          ...r,
                          date: new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--muted-foreground)" opacity={0.4} />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} stroke="var(--muted-foreground)" />
                        <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} stroke="var(--muted-foreground)" tickFormatter={(v) => Number(v).toFixed(0)} />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="basket" stroke="var(--chart-1)" strokeWidth={2} dot={false} name="Basket avg" />
                      </LineChart>
                    </ChartContainer>
                  ) : (
                    <div className="h-[120px] flex items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 dark:bg-muted/30 text-muted-foreground text-sm">
                      No basket series data
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border border-border bg-card shadow-sm dark:shadow-none dark:border-muted-foreground/20">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Data sync logs
                  </CardTitle>
                  <CardDescription>
                    Last sync time per source. <span className="block mt-1 text-muted-foreground/90">Shows when CBL rates, commodity prices, and trade data were last updated. Green = success; red = failed.</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Loading…
                    </div>
                  ) : syncLogs.length === 0 ? (
                    <div className="py-8 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 dark:bg-muted/30 text-center text-muted-foreground text-sm">
                      No sync logs
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                      {syncLogs.map((log) => (
                        <div
                          key={log.source}
                          className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/20 dark:bg-muted/30 p-3 text-sm transition-colors hover:bg-muted/30 dark:hover:bg-muted/40"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {log.status === "success" ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            ) : log.status === "failed" ? (
                              <XCircle className="h-5 w-5 text-destructive shrink-0" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
                            )}
                            <div className="min-w-0">
                              <p className="font-medium truncate">{log.source}</p>
                              {log.message && (
                                <p className="text-xs text-muted-foreground truncate">{log.message}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right shrink-0 text-xs text-muted-foreground">
                            <p>{new Date(log.lastSync).toLocaleDateString()}</p>
                            <p>{new Date(log.lastSync).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}</p>
                            {log.recordsCount != null && (
                              <p className="mt-0.5">{log.recordsCount} records</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Market input data — always visible: import volume, importers, benchmarks */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Market input data
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Import volume by category, major importing companies, and wholesale pricing benchmarks.
            </p>
            {loading && !inputData ? (
              <div className="rounded-lg border border-border bg-muted/20 dark:bg-muted/30 p-8 text-center text-muted-foreground">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p>Loading import volume, importers, and benchmarks…</p>
              </div>
            ) : !inputData ? (
              <Card className="border border-border bg-card border-dashed dark:border-muted-foreground/20">
                <CardContent className="py-8 text-center">
                  <Database className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-60" />
                  <p className="text-sm font-medium text-foreground mb-1">Market input data not loaded</p>
                  <p className="text-xs text-muted-foreground mb-4">Click Refresh to load import volume by category, major importers, and wholesale benchmarks.</p>
                  <Button variant="outline" size="sm" onClick={fetchAll}>Refresh</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border border-border bg-card shadow-sm dark:shadow-none dark:border-muted-foreground/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Package className="h-4 w-4 text-primary" />
                        Import volume by product category
                      </CardTitle>
                      <CardDescription>Volume by category (e.g. rice, cement, fuel). Period: {inputData.importVolumeByCategory.period || "—"}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {inputData.importVolumeByCategory.byCategory.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No category data</p>
                      ) : (
                        <div className="space-y-2 max-h-[260px] overflow-y-auto">
                          {inputData.importVolumeByCategory.byCategory.map((c) => (
                            <div key={c.category} className="flex justify-between items-center gap-2 rounded border border-border bg-muted/20 dark:bg-muted/30 px-3 py-2.5 text-sm">
                              <span className="font-medium text-foreground">{c.category}</span>
                              <span className="tabular-nums text-muted-foreground">{c.volume.toLocaleString()} {c.unit} ({c.sharePercent.toFixed(1)}%)</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {inputData.importVolumeByCategory.totalVolume > 0 && (
                        <p className="text-xs text-muted-foreground mt-2">Total: {inputData.importVolumeByCategory.totalVolume.toLocaleString()} MT</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border border-border bg-card shadow-sm dark:shadow-none dark:border-muted-foreground/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Building2 className="h-4 w-4 text-primary" />
                        Major importing companies
                      </CardTitle>
                      <CardDescription>Top importers by volume share</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {inputData.majorImporters.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No importer data</p>
                      ) : (
                        <div className="space-y-2 max-h-[260px] overflow-y-auto">
                          {inputData.majorImporters.map((m) => (
                            <div key={m.name} className="flex justify-between items-center gap-2 rounded border border-border bg-muted/20 dark:bg-muted/30 px-3 py-2.5 text-sm">
                              <div>
                                <span className="font-medium text-foreground">{m.name}</span>
                                {m.category && <span className="text-muted-foreground text-xs ml-1">({m.category})</span>}
                              </div>
                              <span className="tabular-nums font-medium">{m.volumeSharePercent.toFixed(1)}%</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card className="border border-border bg-card shadow-sm dark:shadow-none dark:border-muted-foreground/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      Wholesale pricing benchmarks
                    </CardTitle>
                    <CardDescription>Benchmark prices (LRD) per unit for key commodities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {inputData.wholesaleBenchmarks.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No benchmark data</p>
                    ) : (
                      <div className="table-wrapper overflow-x-auto rounded-lg border border-border ">
                        <table className="w-full text-sm min-w-[500px]">
                          <thead>
                            <tr className="border-b border-border bg-muted/30 dark:bg-muted/40 text-muted-foreground text-left">
                              <th className="py-3 px-4 font-medium min-h-[44px]">Commodity</th>
                              <th className="py-3 px-4 font-medium">Unit</th>
                              <th className="py-3 px-4 font-medium text-right">Benchmark (LRD)</th>
                              <th className="py-3 px-4 font-medium text-right">Range</th>
                            </tr>
                          </thead>
                          <tbody>
                            {inputData.wholesaleBenchmarks.map((b) => (
                              <tr key={b.commodityName} className="border-b border-border/50 last:border-0 hover:bg-muted/20 dark:hover:bg-muted/30 transition-colors">
                                <td className="py-3 px-4 font-medium text-foreground">{b.commodityName}</td>
                                <td className="py-3 px-4 text-muted-foreground">{b.unit}</td>
                                <td className="py-3 px-4 text-right font-mono tabular-nums text-foreground">{b.benchmarkPrice.toLocaleString()}</td>
                                <td className="py-3 px-4 text-right text-muted-foreground text-xs">
                                  {b.minPrice != null && b.maxPrice != null ? `${b.minPrice.toLocaleString()} – ${b.maxPrice.toLocaleString()}` : "—"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border border-border bg-card shadow-sm dark:shadow-none dark:border-muted-foreground/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                        Trade flow trends
                      </CardTitle>
                      <CardDescription>Period-over-period import direction and top category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {inputData.tradeFlowTrends.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No trend data</p>
                      ) : (
                        <div className="space-y-2 max-h-[220px] overflow-y-auto">
                          {inputData.tradeFlowTrends.map((t) => (
                            <div key={t.period} className="flex justify-between items-center gap-2 rounded border border-border bg-muted/20 dark:bg-muted/30 px-3 py-2 text-sm">
                              <div>
                                <span className="font-medium text-foreground">{t.period}</span>
                                <span className="text-muted-foreground text-xs ml-1">→ {t.topCategory}</span>
                              </div>
                              <Badge variant={t.direction === "up" ? "default" : t.direction === "down" ? "secondary" : "outline"}>
                                {t.changePercent >= 0 ? "+" : ""}{t.changePercent.toFixed(1)}%
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border border-border bg-card shadow-sm dark:shadow-none dark:border-muted-foreground/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <PackageCheck className="h-4 w-4 text-primary" />
                        Commodity availability
                      </CardTitle>
                      <CardDescription>Supply availability by commodity</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {inputData.commodityAvailability.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No availability data</p>
                      ) : (
                        <div className="space-y-2">
                          {inputData.commodityAvailability.map((a) => (
                            <div key={a.commodityName} className="flex justify-between items-center gap-2 rounded border border-border bg-muted/20 dark:bg-muted/30 px-3 py-2 text-sm">
                              <span className="font-medium text-foreground">{a.commodityName}</span>
                              <Badge
                                variant={
                                  a.availability === "high" ? "default" :
                                  a.availability === "adequate" ? "secondary" :
                                  a.availability === "tight" ? "outline" : "destructive"
                                }
                              >
                                {a.availability}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </section>

          {/* Data sources */}
          {sources.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Data sources
              </h2>
              <Card className="border border-border bg-card shadow-sm dark:shadow-none dark:border-muted-foreground/20">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Where the data comes from
                  </CardTitle>
                  <CardDescription>
                    Each metric and chart uses one or more sources below. &quot;Live&quot; = real data from MoCI/CBL; &quot;Sample&quot; = demo data when APIs are not configured.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {sources.map((src) => (
                      <li
                        key={src.id}
                        className="rounded-lg border border-border bg-muted/20 dark:bg-muted/30 p-4 transition-colors hover:bg-muted/30 dark:hover:bg-muted/40"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0 flex-1 space-y-1">
                            <p className="font-medium">{src.name}</p>
                            <p className="text-sm text-muted-foreground leading-snug">{src.description}</p>
                            {src.usedBy.length > 0 && (
                              <p className="text-xs text-muted-foreground pt-1">
                                Used by: {src.usedBy.join(", ")}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge
                              variant={
                                src.type === "live"
                                  ? "default"
                                  : src.type === "sample"
                                    ? "secondary"
                                    : "outline"
                              }
                              className="capitalize"
                            >
                              {src.type}
                            </Badge>
                            {src.url && (
                              <a
                                href={src.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                              >
                                Link
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </section>
          )}
        </div>
    </main>
  )
}
