"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrueRateMarketIntelligence } from "@/components/market-intelligence/TrueRateMarketIntelligence"
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  RefreshCw,
  Shield,
  ShoppingCart,
  Store,
  TrendingUp,
} from "lucide-react"

interface MarketRiskData {
  marketRiskScore: number
  priceStabilityIndex: number
  riskLabel: string
  period: string
}

interface ColDashboard {
  costOfLivingIndex: { index: number; baseDate: string; currentDate: string } | null
  affordabilityIndex: { index: number; label: string } | null
}

export default function MarketIntelligencePage() {
  const [marketRisk, setMarketRisk] = useState<MarketRiskData | null>(null)
  const [colDashboard, setColDashboard] = useState<ColDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetch, setLastFetch] = useState<Date | null>(null)

  const loadSnapshot = async () => {
    setLoading(true)
    setError(null)
    try {
      const [riskRes, colRes] = await Promise.all([
        fetch("/api/market-risk?days=90"),
        fetch("/api/cost-of-living/dashboard?days=90"),
      ])

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
      } else setMarketRisk(null)

      if (colRes.ok) {
        try {
          const c = await colRes.json()
          setColDashboard({
            costOfLivingIndex: c.costOfLivingIndex ?? null,
            affordabilityIndex: c.affordabilityIndex ?? null,
          })
        } catch {
          setColDashboard(null)
        }
      } else setColDashboard(null)

      setLastFetch(new Date())
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSnapshot()
  }, [])

  const riskBadgeVariant = marketRisk
    ? marketRisk.riskLabel === "critical" || marketRisk.riskLabel === "high"
      ? "destructive"
      : marketRisk.riskLabel === "elevated"
        ? "secondary"
        : "default"
    : "outline"

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
        <section className="relative overflow-x-hidden min-h-[min(36vh,280px)] sm:min-h-[38vh] border-b border-border/30" aria-label="Market intelligence snapshot">
          <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none" aria-hidden>
            <div className="absolute inset-0 md:hidden" />
            <div className="absolute -top-20 -right-20 h-40 w-40 sm:h-52 sm:w-52 md:h-64 md:w-64 rounded-full bg-muted/20 border border-border/30" />
            <div className="absolute top-1/2 -left-10 h-32 w-32 sm:h-44 sm:w-44 md:h-52 md:w-52 rounded-full bg-muted/20 border border-border/30" />
          </div>
          <div className="container relative z-10 mx-auto px-4 py-8 md:py-10 max-w-6xl">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <p className="border-l-2 border-primary/40 pl-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                  TrueRate · Market intelligence
                </p>
                <h1 className="font-display text-2xl min-[360px]:text-3xl sm:text-4xl font-bold tracking-tight text-balance leading-[1.1]">
                  <span className="relative inline-block pb-1.5 text-foreground">
                    Market snapshot &amp; insights
                  </span>
                </h1>
                <p className="text-muted-foreground text-sm md:text-base pl-4 sm:pl-5 border-l-2 border-primary/30 bg-muted/30 dark:bg-muted/20 rounded-r-md py-1.5 pr-2 -ml-px">
                  Start here for risk and cost-of-living indicators. For live street prices and shopping advice, use{" "}
                  <strong className="text-foreground">Liberian Market Today</strong>. For charts, imports, and data tables, open the full analytics dashboard.
                </p>
                {lastFetch && (
                  <p className="text-xs text-muted-foreground">
                    Snapshot updated {lastFetch.toLocaleTimeString()}
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Button variant="outline" size="sm" onClick={loadSnapshot} disabled={loading} className="gap-2">
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button asChild size="sm" className="gap-2">
                  <Link href="/market-intelligence/analytics">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Full analytics
                  </Link>
                </Button>
              </div>
            </div>

            {error && (
              <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-destructive text-sm">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span className="flex-1 min-w-0">{error}</span>
                <Button variant="outline" size="sm" onClick={() => { setError(null); loadSnapshot() }}>
                  Try again
                </Button>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              <Link href="/market" className="group block rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted/40 border border-border/40 text-primary shrink-0">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover: shrink-0 text-muted-foreground" />
                </div>
                <h2 className="mt-4 font-semibold text-foreground">Liberian Market Today</h2>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  Live LRD/USD, what things cost in Monrovia, shopping signals, and practical tips — paired with this intelligence layer.
                </p>
              </Link>
              <Link href="/market-intelligence/analytics" className="group block rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/15 text-primary shrink-0">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover: shrink-0 text-muted-foreground" />
                </div>
                <h2 className="mt-4 font-semibold text-foreground">Full analytics dashboard</h2>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  Commodity &amp; import charts, ministry price tables, dollarization meter, sync logs, and data sources.
                </p>
              </Link>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px" />
        </section>

        <div className="container mx-auto px-4 py-8 space-y-10 max-w-6xl">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Key metrics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-2 pt-5">
                  <CardDescription className="text-xs font-medium flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted/40 border border-border/40 text-primary">
                      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </span>
                    Market risk
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-5">
                  <div className="text-2xl font-bold tabular-nums">{marketRisk?.marketRiskScore ?? "—"}</div>
                  <Badge variant={riskBadgeVariant} className="mt-2 text-xs capitalize">
                    {marketRisk?.riskLabel ?? "—"}
                  </Badge>
                </CardContent>
              </Card>
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-2 pt-5">
                  <CardDescription className="text-xs font-medium flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted/40 border border-border/40 text-primary">
                      <Shield className="h-4 w-4 text-primary" />
                    </span>
                    Price stability
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-5">
                  <div className="text-2xl font-bold tabular-nums">{marketRisk?.priceStabilityIndex ?? "—"}</div>
                  <p className="text-xs text-muted-foreground mt-2">Index 0–100</p>
                </CardContent>
              </Card>
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-2 pt-5">
                  <CardDescription className="text-xs font-medium flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted/40 border border-border/40 text-primary">
                      <ShoppingCart className="h-4 w-4 text-primary" />
                    </span>
                    Cost of living
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-5">
                  <div className="text-2xl font-bold tabular-nums">
                    {colDashboard?.costOfLivingIndex?.index ?? "—"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Base = 100</p>
                </CardContent>
              </Card>
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-2 pt-5">
                  <CardDescription className="text-xs font-medium flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted/40 border border-border/40 text-primary">
                      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </span>
                    Affordability
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
            <p className="mt-3 text-xs text-muted-foreground">
              Same Liberia Price Index basket as the full dashboard.{" "}
              <Link href="/price-index" className="text-primary font-medium hover:underline">
                Price index
              </Link>
              {" · "}
              <Link href="/market-intelligence/analytics" className="text-primary font-medium hover:underline">
                Charts &amp; tables
              </Link>
            </p>
          </section>

          <section className="scroll-mt-24">
            <TrueRateMarketIntelligence />
          </section>

          <Card className="border-primary/20 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Need more detail?</CardTitle>
              <CardDescription>
                LRD health drivers, commodity line charts, import volumes, ministry prices, sync logs, and source attribution live on one page.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/market-intelligence/analytics" className="gap-2">
                  Open full analytics
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/market">Back to Liberian Market Today</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
