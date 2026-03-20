import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PriceIndexPeriodCompare } from "@/components/price-index-period-compare"
import { TruerateCpiDashboard } from "@/components/truerate-cpi-dashboard"
import { EssentialGoodsTracker } from "@/components/essential-goods-tracker"
import { WeeklyBasketIndex } from "@/components/weekly-basket-index"
import { InflationMoMComparison } from "@/components/inflation-mom-comparison"
import { BuyNowAdvisorWrapper } from "@/components/crisis/BuyNowAdvisorWrapper"
import { fetchJson } from "@/lib/api/fetch-json"
import { getServerApiUrl } from "@/lib/api/server-base-url"
import { BarChart3, TrendingUp, Activity, Calendar, FileSpreadsheet, DollarSign, Shield, Clock } from "lucide-react"
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
      <main className="flex-1 pb-16 md:pb-0 overflow-x-hidden bg-gradient-to-b from-background via-background to-muted/10">
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
          <div className="relative rounded-xl sm:rounded-2xl border border-border/40 bg-card/95 p-3.5 sm:p-5 md:p-6 shadow-md sm:shadow-lg sm:shadow-primary/5 transition-all duration-300 ring-1 ring-black/5 dark:ring-white/5">
            <div className="absolute inset-x-0 top-0 h-px pointer-events-none rounded-t-2xl" />
            <BuyNowAdvisorWrapper />
            <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full blur-3xl pointer-events-none" />
          </div>
        </PageHero>

        {/* Essential goods */}
        <section className="py-8 sm:py-12 border-t border-border/50 bg-muted/[0.04]" aria-labelledby="essential-goods-heading">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-5 sm:mb-7">
                <div>
                  <h2 id="essential-goods-heading" className="text-lg sm:text-2xl font-bold tracking-tight text-foreground text-balance">
                    Essential Goods &amp; Services
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-2xl">
                    Clear weekly basket and market prices in one place.
                  </p>
                </div>
                <Badge variant="outline" className="w-fit text-xs font-medium border-border/60 bg-background/70">
                  Live data
                </Badge>
              </header>
              <div className="space-y-4 sm:space-y-6">
                <EssentialGoodsTracker />
                <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                  <WeeklyBasketIndex />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CPI & inflation snapshot */}
        <section className="py-7 sm:py-10 bg-muted/20 border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-2.5 mb-5 sm:mb-6">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-background/80 border border-border/50">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">CPI &amp; Inflation</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">{lastUpdated ?? "Latest published period"}</p>
                </div>
              </div>
            <div className="grid gap-3 sm:gap-6 grid-cols-1 sm:grid-cols-3">
              <Card className="border-primary/20 bg-card/95 relative shadow-sm">
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary/40" />
                <CardHeader className="pb-2 pt-4 sm:pt-5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-muted/40 border border-border/40">
                      <BarChart3 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-[13px] sm:text-sm font-semibold">Latest CPI</CardTitle>
                      <CardDescription className="flex items-center gap-1 text-[10px]">
                        <Calendar className="h-3 w-3 text-primary" />
                        {lastUpdated ?? "Latest"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xl sm:text-3xl font-bold tabular-nums text-primary">
                    {effectiveData.cpi !== null && effectiveData.cpi !== undefined
                      ? formatNumber.format(effectiveData.cpi)
                      : "—"}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">Consumer Price Index</p>
                </CardContent>
              </Card>
              <Card className="border-amber-500/20 bg-card/95 relative shadow-sm">
                <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500/40" />
                <CardHeader className="pb-2 pt-4 sm:pt-5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-muted/40 border border-border/40">
                      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <CardTitle className="text-[13px] sm:text-sm font-semibold">Inflation (YoY)</CardTitle>
                      <CardDescription className="flex items-center gap-1 text-[10px]">
                        <Calendar className="h-3 w-3 text-primary" />
                        {lastUpdated ?? "Latest"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xl sm:text-3xl font-bold tabular-nums text-amber-600 dark:text-amber-400">
                    {effectiveData.yoyInflation !== null && effectiveData.yoyInflation !== undefined
                      ? `${formatNumber.format(effectiveData.yoyInflation)}%`
                      : "—"}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">Year-over-year change</p>
                </CardContent>
              </Card>
              <Card className={`relative bg-card/95 shadow-sm ${effectiveData.momChange != null && effectiveData.momChange < 0 ? "border-green-500/20" : "border-red-500/20"}`}>
                <div className={`absolute top-0 left-0 right-0 h-1 ${ effectiveData.momChange != null && effectiveData.momChange < 0 ? "bg-green-500/40" : "bg-red-500/40" }`} />
                <CardHeader className="pb-2 pt-4 sm:pt-5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-muted/40 border border-border/40">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-[13px] sm:text-sm font-semibold">Inflation (MoM)</CardTitle>
                      <CardDescription className="flex items-center gap-1 text-[10px]">
                        <Calendar className="h-3 w-3 text-primary" />
                        {lastUpdated ?? "Latest"}
                        {momIsFallback && " (indicative)"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className={`text-xl sm:text-3xl font-bold tabular-nums ${ effectiveData.momChange != null && effectiveData.momChange < 0 ? "text-green-600 dark:text-green-400" : "text-red-500" }`}>
                    {effectiveData.momChange !== null && effectiveData.momChange !== undefined
                      ? `${formatNumber.format(effectiveData.momChange)}%`
                      : "—"}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">Month-over-month change</p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
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

        {/* Trends and context */}
        <section className="py-7 sm:py-12 border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto space-y-5 sm:space-y-6">
              <div>
                <h2 className="text-base sm:text-xl font-semibold tracking-tight text-foreground">Trends & context</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-2xl">
                  Deeper inflation movement and period comparisons.
                </p>
              </div>
              <TruerateCpiDashboard />
              <div className="grid gap-6 sm:grid-cols-2">
                <PriceIndexPeriodCompare />
                <InflationMoMComparison
                  cpiMomChange={effectiveData.momChange}
                  cpiReferenceMonth={effectiveData.referenceMonth}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Data sources */}
        <section className="py-8 sm:py-12 border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <Card className="border-border/50 bg-card/95 shadow-sm">
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
