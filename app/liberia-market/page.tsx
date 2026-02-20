import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MarketSnapshot } from "@/components/market-snapshot"
import { LiberiaMarketNews, NEWS_OUTLET_LABELS } from "@/components/liberia-market-news"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchJson } from "@/lib/api/fetch-json"
import { Newspaper } from "lucide-react"

export const metadata: Metadata = {
  title: "Liberia Market News | TrueRate Liberia",
  description:
    "Live Liberia market snapshot, currency movements, and the latest business and economy headlines.",
  openGraph: {
    title: "Liberia Market News | TrueRate Liberia",
    description:
      "Auto-updating Liberia market news with live USD/LRD rates and verified local sources.",
    type: "website",
  },
}

export const revalidate = 3600

const fetchUsdToLrd = async () => {
  // Prefer free, no-key API; fallback to internal live rate endpoint.
  try {
    const data = await fetchJson<any>("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 },
    })
    const rate = Number(data?.rates?.LRD)
    if (!Number.isNaN(rate) && rate > 0) {
      return {
        rate,
        updatedAt: data?.time_last_update_utc ?? new Date().toUTCString(),
      }
    }
  } catch (error) {
    console.error("[LiberiaMarket] FX API failed", error)
  }

  try {
    const data = await fetchJson<{ rate?: number }>("/api/rates/live", {
      next: { revalidate: 3600 },
    })
    const rate = Number(data?.rate)
    if (!Number.isNaN(rate) && rate > 0) {
      return {
        rate,
        updatedAt: new Date().toUTCString(),
      }
    }
  } catch (error) {
    console.error("[LiberiaMarket] Fallback FX failed", error)
  }

  return {
    rate: 180.0,
    updatedAt: new Date().toUTCString(),
  }
}

export default async function LiberiaMarketPage() {
  const snapshot = await fetchUsdToLrd()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
        <section className="py-12 sm:py-14 md:py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                <Badge variant="secondary">Auto-updating</Badge>
                <Badge className="bg-primary/10 text-primary">Live Rates</Badge>
                <Badge variant="outline">Verified Sources</Badge>
                <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400">Hourly Updates</Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Liberia Market News
                </span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground text-pretty max-w-3xl mx-auto">
                We fetch headlines from news outlets that influence the Liberian dollar and economy — refreshed hourly.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-14 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 space-y-3">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                <Badge variant="outline">Market Intelligence</Badge>
                <Badge className="bg-primary/10 text-primary">Real-time Data</Badge>
                <Badge variant="secondary">Verified Sources</Badge>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-balance">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  What&apos;s Moving the Rate
                </span>
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Headlines from outlets that move the Liberian dollar and economy, ranked by relevance to USD/LRD.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              <div className="space-y-6">
                <LiberiaMarketNews />
              </div>
              <div className="space-y-6">
                <MarketSnapshot rate={snapshot.rate} updatedAt={snapshot.updatedAt} />
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-card shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-primary flex items-center gap-2">
                      <Newspaper className="h-5 w-5" />
                      News Outlets We Use
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-3">
                    <p>
                      Headlines are fetched from outlets that influence the Liberian dollar and economy:
                    </p>
                    <ul className="space-y-1.5 list-disc list-inside">
                      {NEWS_OUTLET_LABELS.map((label) => (
                        <li key={label}>{label}</li>
                      ))}
                    </ul>
                    <div className="bg-muted/50 p-3 rounded-lg text-xs">
                      <span className="font-medium text-foreground">Refresh:</span> Every 1–2 hours (ISR) to stay within rate limits.
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/60 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">✓</span>
                      </div>
                      How We Curate
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>
                      We keep only items relevant to markets, currency, trade, and investment. FX-related terms (rates, CBL, remittance, inflation) get higher rank.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
