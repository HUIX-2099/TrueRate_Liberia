import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PriceIndex } from "@/components/liberia-features"
import { fetchJson } from "@/lib/api/fetch-json"

export const dynamic = "force-dynamic"

const fetchLiveRate = async () => {
  try {
    return await fetchJson<{ rate?: number }>("/api/rates/live", {
      next: { revalidate: 3600 },
    })
  } catch {
    return null
  }
}

export default async function PriceIndexPage() {
  const [cpiData, liveRate] = await Promise.all([
    fetchJson("/api/liberia-cpi", { next: { revalidate: 3600 } }).catch(() => null),
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
  const effectiveData = normalizedCpi ?? fallback
  const lastUpdated = effectiveData.referenceMonth ?? null

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 sm:py-14 md:py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-4">Official CPI</Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance"><span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">Liberia Price Index</span></h1>
              <p className="text-base sm:text-lg text-muted-foreground text-pretty">
                Official Consumer Price Index (CPI) data and inflation trends for Liberia, refreshed daily from LISGIS. Prices in LRD so the national currency is the main unit of account for daily life.
              </p>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Latest CPI (Index)</CardTitle>
                  <CardDescription>{lastUpdated ?? "Latest published period"}</CardDescription>
                </CardHeader>
                <CardContent className="text-2xl font-bold text-primary">
                  {effectiveData.cpi !== null && effectiveData.cpi !== undefined
                    ? formatNumber.format(effectiveData.cpi)
                    : "—"}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Inflation (YoY)</CardTitle>
                  <CardDescription>{lastUpdated ?? "Latest published period"}</CardDescription>
                </CardHeader>
                <CardContent className="text-2xl font-bold text-primary">
                  {effectiveData.yoyInflation !== null && effectiveData.yoyInflation !== undefined
                    ? `${formatNumber.format(effectiveData.yoyInflation)}%`
                    : "—"}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Inflation (MoM)</CardTitle>
                  <CardDescription>{lastUpdated ?? "Latest published period"}</CardDescription>
                </CardHeader>
                <CardContent className="text-2xl font-bold text-primary">
                  {effectiveData.momChange !== null && effectiveData.momChange !== undefined
                    ? `${formatNumber.format(effectiveData.momChange)}%`
                    : "—"}
                </CardContent>
              </Card>
            </div>
            <div className="mt-6 text-center text-xs text-muted-foreground">
              Source:{" "}
              <a
                href={normalizedCpi?.excelUrl ?? "https://lisgis.gov.lr/pricestats.php"}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                {normalizedCpi?.source ? `${normalizedCpi.source} CPI Release` : "LISGIS CPI Release"}
              </a>
            </div>
            {!normalizedCpi?.cpi && (
              <div className="mt-2 text-center text-sm text-muted-foreground">
                Latest official data unavailable – showing last known CPI (Dec 2025).
              </div>
            )}
          </div>
        </section>

        <section className="py-10 sm:py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-4">
              <p className="text-sm text-muted-foreground text-center max-w-2xl mx-auto">
                Daily life in Liberia is quoted in LRD: market baskets, typical salaries, and retail prices are usually discussed in Liberian dollars. Below, essential goods are shown in LRD first.
              </p>
              <PriceIndex rate={priceIndexRate} />
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Data Sources</CardTitle>
                  <CardDescription>Official and automatically refreshed</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    CPI and inflation data are fetched from the Liberia Institute of Statistics and Geo-Information
                    Services (LISGIS) price statistics page. We parse the latest CPI table entry and read the official
                    Excel release.
                  </p>
                  <p>
                    The LISGIS Excel file is cached monthly while the HTML index is cached daily to respect bandwidth
                    limits. If LISGIS is unavailable, we show the fallback message above.
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
