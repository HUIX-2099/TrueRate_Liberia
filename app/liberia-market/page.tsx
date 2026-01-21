import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MarketSnapshot } from "@/components/market-snapshot"
import { LiberiaMarketNews } from "@/components/liberia-market-news"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 },
    })
    if (res.ok) {
      const data = await res.json()
      const rate = Number(data?.rates?.LRD)
      if (!Number.isNaN(rate) && rate > 0) {
        return {
          rate,
          updatedAt: data?.time_last_update_utc ?? new Date().toUTCString(),
        }
      }
    }
  } catch (error) {
    console.error("[LiberiaMarket] FX API failed", error)
  }

  try {
    const res = await fetch("https://truerateliberia.com/api/rates/live", {
      next: { revalidate: 3600 },
    })
    if (res.ok) {
      const data = await res.json()
      const rate = Number(data?.rate)
      if (!Number.isNaN(rate) && rate > 0) {
        return {
          rate,
          updatedAt: new Date().toUTCString(),
        }
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
      <main className="flex-1">
        <section className="py-10 sm:py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <Badge className="mb-4" variant="secondary">
                Auto-updating
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-balance"><span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Liberia Market News
              </span></h1>
              <p className="text-base sm:text-lg text-muted-foreground text-pretty">
                Live exchange rate snapshot and verified Liberia business headlines — refreshed hourly for accuracy.
              </p>
            </div>
          </div>
        </section>

        <section className="py-10 bg-background">
          <div className="container mx-auto px-4 grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              <LiberiaMarketNews />
            </div>
            <div className="space-y-6">
              <MarketSnapshot rate={snapshot.rate} updatedAt={snapshot.updatedAt} />
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How We Curate</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-3">
                  <p>
                    Sources prioritize Liberian institutions and reputable outlets. We only keep items relevant to
                    markets, currency, trade, and investment.
                  </p>
                  <p>
                    Refresh cadence: every 1–2 hours using Next.js ISR to avoid rate limits while staying current.
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
