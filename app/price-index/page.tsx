import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const fetchIndicator = async (indicator: string) => {
  const url = `https://api.worldbank.org/v2/country/LBR/indicator/${indicator}?format=json`
  const res = await fetch(url, { next: { revalidate: 86400 } })
  if (!res.ok) return null
  const data = await res.json()
  const series = Array.isArray(data?.[1]) ? data[1] : []
  const latest = series.find((entry: { value: number | null }) => typeof entry.value === "number")
  return latest ?? null
}

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
  const [cpi, inflation, liveRate] = await Promise.all([
    fetchIndicator("FP.CPI.TOTL"),
    fetchIndicator("FP.CPI.TOTL.ZG"),
    fetchLiveRate(),
  ])

  const formatNumber = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 })
  const cpiValue = typeof cpi?.value === "number" ? cpi.value : null
  const inflationValue = typeof inflation?.value === "number" ? inflation.value : null
  const latestRate = typeof liveRate?.rate === "number" ? liveRate.rate : null

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
                Official Consumer Price Index (CPI) data and inflation trends for Liberia, updated automatically when
                new data is published.
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
                  <CardDescription>{cpi?.date ? `Year ${cpi.date}` : "Latest published year"}</CardDescription>
                </CardHeader>
                <CardContent className="text-2xl font-bold text-primary">
                  {cpiValue !== null ? formatNumber.format(cpiValue) : "—"}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Inflation (YoY)</CardTitle>
                  <CardDescription>{inflation?.date ? `Year ${inflation.date}` : "Latest published year"}</CardDescription>
                </CardHeader>
                <CardContent className="text-2xl font-bold text-primary">
                  {inflationValue !== null ? `${formatNumber.format(inflationValue)}%` : "—"}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Live USD/LRD</CardTitle>
                  <CardDescription>TrueRate live feed</CardDescription>
                </CardHeader>
                <CardContent className="text-2xl font-bold text-primary">
                  {latestRate !== null ? `${formatNumber.format(latestRate)} LRD` : "—"}
                </CardContent>
              </Card>
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
                    CPI and inflation data are pulled from the World Bank Open Data API for Liberia (indicator codes
                    FP.CPI.TOTL and FP.CPI.TOTL.ZG). These are official figures, typically updated annually.
                  </p>
                  <p>
                    The live USD/LRD rate is fetched from TrueRate’s live feed and refreshed hourly for context.
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
