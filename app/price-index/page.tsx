// Run: npm install xlsx   (or pnpm add xlsx / yarn add xlsx)
// Optional types: npm install --save-dev @types/xlsx
// If XLSX parsing is tricky, consider fallback: npm install exceljs
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PriceIndex } from "@/components/liberia-features"

const fetchLiveRate = async () => {
  try {
    const res = await fetch("https://truerateliberia.com/api/rates/live", {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export default async function PriceIndexPage() {
  const [cpiData, liveRate] = await Promise.all([
    fetch("https://truerateliberia.com/api/liberia-cpi", { next: { revalidate: 3600 } })
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null),
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
  const effectiveData = cpiData ?? fallback
  const lastUpdated = effectiveData.referenceMonth ?? null

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-4">Official CPI</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Liberia Price Index</h1>
              <p className="text-lg text-muted-foreground text-pretty">
                Official Consumer Price Index (CPI) data and inflation trends for Liberia, refreshed daily from LISGIS.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 bg-background">
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
                href={cpiData?.excelUrl ?? "https://lisgis.gov.lr/pricestats.php"}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                {cpiData?.source ? `${cpiData.source} CPI Release` : "LISGIS CPI Release"}
              </a>
            </div>
            {!cpiData?.cpi && (
              <div className="mt-2 text-center text-sm text-muted-foreground">
                Latest official data unavailable – showing last known CPI (Dec 2025).
              </div>
            )}
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <PriceIndex rate={priceIndexRate} />
            </div>
          </div>
        </section>

        <section className="py-12 bg-muted/30">
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
