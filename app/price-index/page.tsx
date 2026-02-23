import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PriceIndex } from "@/components/liberia-features"
import { PriceIndexPeriodCompare } from "@/components/price-index-period-compare"
import { fetchJson } from "@/lib/api/fetch-json"
import { getServerApiUrl } from "@/lib/api/server-base-url"
import { BarChart3, TrendingUp, Activity, Calendar, ShoppingCart, FileSpreadsheet } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Price Index | Liberia Essential Goods & Services",
  description:
    "Official essential goods and services prices for Liberia from the Ministry of Commerce and LISGIS. CPI, inflation trends, and daily prices in LRD.",
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

export default async function PriceIndexPage() {
  const [cpiData, liveRate] = await Promise.all([
    fetchJson(getServerApiUrl("/api/liberia-cpi"), { next: { revalidate: 3600 } }).catch(() => null),
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
        {/* Hero */}
        <section className="relative py-10 sm:py-14 md:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-primary/4 to-transparent" aria-hidden />
          <div className="container relative mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4 font-medium">Official CPI &amp; LISGIS</Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-balance mb-4">
                <span className="bg-gradient-to-r from-primary via-emerald-600 to-primary bg-clip-text text-transparent">
                  Liberia Price Index
                </span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
                Essential goods and services prices from the Ministry of Commerce and LISGIS. CPI and inflation refreshed regularly; prices in LRD.
              </p>
            </div>
          </div>
        </section>

        {/* Essential goods */}
        <section className="py-8 sm:py-12 border-t border-border/60">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight">Essential Goods &amp; Services</h2>
                    <p className="text-sm text-muted-foreground">
                      Daily life in Liberia is quoted in LRD. Prices from Ministry of Commerce and LISGIS.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <PriceIndexPeriodCompare />
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
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">CPI &amp; Inflation</h2>
                  <p className="text-sm text-muted-foreground">{lastUpdated ?? "Latest published period"}</p>
                </div>
              </div>
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-3">
              <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <BarChart3 className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-sm font-semibold">Latest CPI (Index)</CardTitle>
                  </div>
                  <CardDescription className="flex items-center gap-1.5 text-xs">
                    <Calendar className="h-3.5 w-3.5" />
                    {lastUpdated ?? "Latest published period"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl sm:text-3xl font-bold tabular-nums text-primary">
                    {effectiveData.cpi !== null && effectiveData.cpi !== undefined
                      ? formatNumber.format(effectiveData.cpi)
                      : "—"}
                  </p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-sm font-semibold">Inflation (YoY)</CardTitle>
                  </div>
                  <CardDescription className="flex items-center gap-1.5 text-xs">
                    <Calendar className="h-3.5 w-3.5" />
                    {lastUpdated ?? "Latest published period"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl sm:text-3xl font-bold tabular-nums text-primary">
                    {effectiveData.yoyInflation !== null && effectiveData.yoyInflation !== undefined
                      ? `${formatNumber.format(effectiveData.yoyInflation)}%`
                      : "—"}
                  </p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-sm font-semibold">Inflation (MoM)</CardTitle>
                  </div>
                  <CardDescription className="flex items-center gap-1.5 text-xs">
                    <Calendar className="h-3.5 w-3.5" />
                    {lastUpdated ?? "Latest published period"}
                    {momIsFallback && " (indicative)"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl sm:text-3xl font-bold tabular-nums text-primary">
                    {effectiveData.momChange !== null && effectiveData.momChange !== undefined
                      ? `${formatNumber.format(effectiveData.momChange)}%`
                      : "—"}
                  </p>
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
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                      <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
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
