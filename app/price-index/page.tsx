import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PriceIndex } from "@/components/liberia-features"
import { PriceIndexPeriodCompare } from "@/components/price-index-period-compare"
import { TruerateCpiDashboard } from "@/components/truerate-cpi-dashboard"
import { EssentialGoodsTracker } from "@/components/essential-goods-tracker"
import { WeeklyBasketIndex } from "@/components/weekly-basket-index"
import { InflationMoMComparison } from "@/components/inflation-mom-comparison"
import { PriceCheckerTool } from "@/components/price-checker-tool"
import { BuyNowAdvisorWrapper } from "@/components/crisis/BuyNowAdvisorWrapper"
import { fetchJson } from "@/lib/api/fetch-json"
import { getServerApiUrl } from "@/lib/api/server-base-url"
import { BarChart3, TrendingUp, Activity, Calendar, ShoppingCart, FileSpreadsheet, DollarSign, Shield, Clock } from "lucide-react"
import { PageHero } from "@/components/layout/page-hero"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Price Index | Liberia Essential Goods & Services",
  description:
    "Market transparency for Liberia: rice, fuel, transport & basic goods tracker, weekly grocery basket index, inflation comparison, and 'Is this overpriced?' price checker. Official LISGIS & Ministry of Commerce data.",
}

const fetchLiveRate = async () => {
  try {
    return await fetchJson<{ rate?: number }>(getServerApiUrl("/api/rates/live"), {
      next: { revalidate: 3600 },
    })
  } catch {
    return null
  }
}

type CpiApiResponse = {
  cpi?: number | null
  yoyInflation?: number | null
  inflationYoY?: number | null
  momChange?: number | null
  inflationMoM?: number | null
  referenceMonth?: string | null
  lastMonth?: string | null
  source?: string | null
  excelUrl?: string | null
}

export default async function PriceIndexPage() {
  const [cpiData, liveRate] = await Promise.all([
    fetchJson<CpiApiResponse | null>(getServerApiUrl("/api/liberia-cpi"), { next: { revalidate: 3600 } }).catch(() => null),
    fetchLiveRate(),
  ])

  const formatNumber = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 })
  const latestRate = typeof liveRate?.rate === "number" ? liveRate.rate : null
  const priceIndexRate = latestRate ?? 180
  const fallback = {
    cpi: 791.12,
    yoyInflation: 4.0,
    momChange: -0.4,
    referenceMonth: "December 2025",
  }
  const normalizedCpi = cpiData
    ? {
        cpi: cpiData?.cpi ?? null,
        yoyInflation: cpiData?.yoyInflation ?? cpiData?.inflationYoY ?? null,
        momChange: cpiData?.momChange ?? cpiData?.inflationMoM ?? null,
        referenceMonth: cpiData?.referenceMonth ?? cpiData?.lastMonth ?? null,
        source: cpiData?.source,
        excelUrl: cpiData?.excelUrl,
      }
    : null
  const effectiveData = normalizedCpi
    ? {
        cpi: normalizedCpi.cpi ?? fallback.cpi,
        yoyInflation: normalizedCpi.yoyInflation ?? fallback.yoyInflation,
        momChange: normalizedCpi.momChange ?? fallback.momChange,
        referenceMonth: normalizedCpi.referenceMonth ?? fallback.referenceMonth,
        source: normalizedCpi.source,
        excelUrl: normalizedCpi.excelUrl,
      }
    : fallback
  const lastUpdated = effectiveData.referenceMonth ?? null
  const momIsFallback =
    normalizedCpi &&
    (normalizedCpi.momChange === null || normalizedCpi.momChange === undefined)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
        <PageHero
          ariaLabel="Price index and market insights"
          label="Essential goods"
          title="Liberia Price Index & Market Insights"
          description="Real-time essential goods prices, inflation trends, and local market news — one place for cost of living and market intelligence."
          variant="left"
          pill={{ text: "Live · Essential goods", live: true }}
          stats={[
            { value: priceIndexRate.toFixed(2), caption: "LRD per USD", icon: <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> },
            { value: "LISGIS", caption: "Official data", icon: <Shield className="h-4 w-4 text-primary" />, iconClassName: "bg-secondary/15 text-secondary" },
            { value: "Live", caption: "Prices", icon: <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />, iconClassName: "bg-green-500/15 text-green-600 dark:text-green-400" },
          ]}
        >
          <div className="relative rounded-xl sm:rounded-2xl border border-border/50 bg-card/95 p-4 sm:p-5 md:p-6 shadow-lg sm:shadow-xl sm:shadow-primary/5 transition-all duration-300 ring-1 ring-black/5 dark:ring-white/5">
            <div className="absolute inset-x-0 top-0 h-px pointer-events-none rounded-t-2xl" />
            <BuyNowAdvisorWrapper />
            <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full blur-3xl pointer-events-none" />
          </div>
        </PageHero>

        {/* Essential goods — dashboard layout */}
        <section className="py-10 sm:py-14 border-t border-border/60 bg-muted/5" aria-labelledby="essential-goods-heading">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto space-y-8">
              <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-muted/40 border border-border/40">
                    <ShoppingCart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 id="essential-goods-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                      Essential Goods &amp; Services
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground max-w-xl">
                      Daily life in Liberia is quoted in LRD. Prices from Ministry of Commerce and LISGIS.
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="w-fit gap-1.5 text-xs font-medium">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-70" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                  </span>
                  Live data
                </Badge>
              </header>

              <div className="grid gap-6 lg:gap-8">
                <TruerateCpiDashboard />
                <div className="grid gap-6 sm:grid-cols-2">
                  <PriceIndexPeriodCompare />
                  <WeeklyBasketIndex />
                </div>
                <EssentialGoodsTracker />
              </div>

              <div className="mb-8">
                <InflationMoMComparison
                  cpiMomChange={effectiveData.momChange}
                  cpiReferenceMonth={effectiveData.referenceMonth}
                />
              </div>
              <div className="mb-8">
                <PriceCheckerTool />
              </div>
              <PriceIndex
                rate={priceIndexRate}
                showCategoryTabs
                showSearch
                showExport
                showRefresh
                highlightBasketItems
                showMarketIntelligenceLink
              />
            </div>
          </div>
        </section>

        {/* CPI & inflation */}
        <section className="py-8 sm:py-12 bg-muted/30 border-t border-border/60">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/40 border border-border/40">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">CPI &amp; Inflation</h2>
                  <p className="text-sm text-muted-foreground">{lastUpdated ?? "Latest published period"}</p>
                </div>
              </div>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
              <Card className="border-primary/20 relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary/40" />
                <CardHeader className="pb-2 pt-5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/40 border border-border/40">
                      <BarChart3 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">Latest CPI</CardTitle>
                      <CardDescription className="flex items-center gap-1 text-[10px]">
                        <Calendar className="h-3 w-3 text-primary" />
                        {lastUpdated ?? "Latest"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl sm:text-3xl font-bold tabular-nums text-primary">
                    {effectiveData.cpi !== null && effectiveData.cpi !== undefined
                      ? formatNumber.format(effectiveData.cpi)
                      : "—"}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">Consumer Price Index</p>
                </CardContent>
              </Card>
              <Card className="border-amber-500/20 relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500/40" />
                <CardHeader className="pb-2 pt-5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/40 border border-border/40">
                      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">Inflation (YoY)</CardTitle>
                      <CardDescription className="flex items-center gap-1 text-[10px]">
                        <Calendar className="h-3 w-3 text-primary" />
                        {lastUpdated ?? "Latest"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl sm:text-3xl font-bold tabular-nums text-amber-600 dark:text-amber-400">
                    {effectiveData.yoyInflation !== null && effectiveData.yoyInflation !== undefined
                      ? `${formatNumber.format(effectiveData.yoyInflation)}%`
                      : "—"}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">Year-over-year change</p>
                </CardContent>
              </Card>
              <Card className={`relative ${effectiveData.momChange != null && effectiveData.momChange < 0 ? "border-green-500/20" : "border-red-500/20"}`}>
                <div className={`absolute top-0 left-0 right-0 h-1 ${ effectiveData.momChange != null && effectiveData.momChange < 0 ? "bg-green-500/40" : "bg-red-500/40" }`} />
                <CardHeader className="pb-2 pt-5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/40 border border-border/40">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">Inflation (MoM)</CardTitle>
                      <CardDescription className="flex items-center gap-1 text-[10px]">
                        <Calendar className="h-3 w-3 text-primary" />
                        {lastUpdated ?? "Latest"}
                        {momIsFallback && " (indicative)"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className={`text-2xl sm:text-3xl font-bold tabular-nums ${ effectiveData.momChange != null && effectiveData.momChange < 0 ? "text-green-600 dark:text-green-400" : "text-red-500" }`}>
                    {effectiveData.momChange !== null && effectiveData.momChange !== undefined
                      ? `${formatNumber.format(effectiveData.momChange)}%`
                      : "—"}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">Month-over-month change</p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>Source:</span>
              <a
                href={normalizedCpi?.excelUrl ?? "https://lisgis.gov.lr/pricestats.php"}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline font-medium"
              >
                {normalizedCpi?.source ? `${normalizedCpi.source} CPI Release` : "LISGIS CPI Release"}
              </a>
            </div>
            {!normalizedCpi?.cpi && (
              <p className="mt-3 text-center text-sm text-muted-foreground">
                Latest official data unavailable – showing last known CPI (Dec 2025).
              </p>
            )}
            </div>
          </div>
        </section>

        {/* Data sources */}
        <section className="py-8 sm:py-12 border-t border-border/60">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/40 border border-border/40">
                      <FileSpreadsheet className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Data Sources</CardTitle>
                      <CardDescription>Official and automatically refreshed</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    Essential goods and services prices and CPI data are sourced from the Ministry of Commerce and the
                    Liberia Institute of Statistics and Geo-Information Services (LISGIS) price statistics page. We
                    parse the latest CPI table and official Excel releases.
                  </p>
                  <p>
                    The LISGIS Excel file is cached monthly and the HTML index daily to respect bandwidth limits. When
                    LISGIS is unavailable, we show indicative prices from CBL and market surveys.
                  </p>
                  <p>
                    If you have a local retail price feed for Liberia (e.g., daily market basket prices), share the
                    source and we can integrate it here.
                  </p>
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
