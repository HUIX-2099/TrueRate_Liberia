"use client"

import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { TrustSignals } from "@/components/trust-signals"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { 
  ArrowRight, TrendingUp, MapPin, Calculator, Shield, 
  Briefcase, MessageSquare, Users, Gift, Brain, Crown, Bell
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RegionalBreakdownWidget } from "@/components/regional-breakdown-widget"
import { MarketLeaderboard } from "@/components/market-leaderboard"
import { PriceIndex, MarketNews, InflationTracker } from "@/components/liberia-features"
import { useEffect, useState } from "react"
import { useLiveRate } from "@/lib/live-rate-context"

export default function HomePage() {
  const { rate: liveRate } = useLiveRate()
  const [leaderboardUpdatedAt, setLeaderboardUpdatedAt] = useState("")

  useEffect(() => {
    setLeaderboardUpdatedAt(new Date().toLocaleTimeString())
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
        <Hero />

        {/* Regional breakdown + Quick Tools */}
        <section className="py-10 sm:py-14 md:py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 max-w-[100vw] xl:max-w-none">
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="text-center space-y-3">
                <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                  <Badge variant="outline">Regional breakdown</Badge>
                  <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400">Live</Badge>
                  <Badge variant="secondary">By county</Badge>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance">
                  <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                    Rates by Region
                  </span>
                </h2>
                <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                  Compare average USD/LRD rates across Monrovia and upcountry. Use the tools below for quick access.
                </p>
                {/* Quick-access tools */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" className="gap-1.5" asChild>
                    <Link href="/converter">
                      <Calculator className="h-4 w-4" />
                      Converter
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5" asChild>
                    <Link href="/tools">
                      <Bell className="h-4 w-4" />
                      Alerts
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5" asChild>
                    <Link href="/map">
                      <MapPin className="h-4 w-4" />
                      Map
                    </Link>
                  </Button>
                </div>
              </div>
              <RegionalBreakdownWidget />
            </div>
          </div>
        </section>

        {/* Quick Access Cards */}
        <section className="py-10 sm:py-14 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 max-w-[100vw] xl:max-w-none">
            <div className="text-center mb-10 sm:mb-12 space-y-3">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                <Badge variant="outline">Essential Tools</Badge>
                <Badge className="bg-primary/10 text-primary">Free Access</Badge>
                <Badge variant="secondary">All-in-One</Badge>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Everything You Need to Exchange Safely
                </span>
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Built for Liberians, by Liberians. Access rates offline, report bad rates and fraud so others don&apos;t get cheated, and stay informed.
              </p>
            </div>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              <Link href="/converter" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl">
                <Card className="group h-full border-border/60 shadow-sm rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <Calculator className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">Currency Converter</h3>
                        <p className="text-sm text-muted-foreground">Multi-currency conversion with real-time rates</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/analytics" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl">
                <Card className="group h-full border-border/60 shadow-sm rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <TrendingUp className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">Rate Analytics</h3>
                        <p className="text-sm text-muted-foreground">View trends, charts, and historical data</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/predictions" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl">
                <Card className="group h-full border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-background shadow-sm rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                        <Brain className="h-6 w-6 text-amber-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">AI Predictions</h3>
                          <Badge className="bg-amber-500/20 text-amber-600 text-xs">ML Powered</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">LSTM & XGBoost rate forecasts up to 90 days</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/business" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl">
                <Card className="group h-full border-primary/30 shadow-sm rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary/40">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <Briefcase className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">Business Tools</h3>
                          <Badge className="text-xs">New</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Invoice protection, import calculator, booking</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/map" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl">
                <Card className="group h-full border-border/60 shadow-sm rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                        <MapPin className="h-6 w-6 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">Find Changers</h3>
                        <p className="text-sm text-muted-foreground">Interactive map with live rates near you</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/forums" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl">
                <Card className="group h-full border-border/60 shadow-sm rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <MessageSquare className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">Forums</h3>
                          <Badge variant="outline" className="text-xs animate-pulse">Live</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Discuss rates, share tips, report scams</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/community" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl">
                <Card className="group h-full border-border/60 shadow-sm rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">Community</h3>
                        <p className="text-sm text-muted-foreground">Report rates, earn points, win badges</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/report-fraud" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl">
                <Card className="group h-full border-border/60 shadow-sm rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-destructive/30">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
                        <Shield className="h-6 w-6 text-destructive" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">Report Fraud</h3>
                        <p className="text-sm text-muted-foreground">Report bad rates and fraud so others don&apos;t get cheated. Fair rates + accountability = trust in LRD.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/voice" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl">
                <Card className="group h-full border-border/60 bg-gradient-to-br from-secondary/10 to-background shadow-sm rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-secondary/30">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                        <Crown className="h-6 w-6 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">Market Woman Mode</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Big numbers + voice readout for easy use</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* Market Leaderboard Section */}
        <section className="py-10 sm:py-14 md:py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 max-w-[100vw] xl:max-w-none">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-6 sm:mb-8 space-y-3">
                <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                  <Badge variant="outline">Live Leaderboard</Badge>
                  <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400 animate-pulse">Real-time</Badge>
                  <Badge variant="secondary">Every 15 min</Badge>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance">
                  <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                    Top Best Rates in Monrovia
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground">
                  Live rankings updated every 15 minutes •{" "}
                  <span className="inline-block min-w-[8ch] tabular-nums" aria-live="polite">
                    {leaderboardUpdatedAt || "—"}
                  </span>
                </p>
              </div>
              <MarketLeaderboard maxItems={3} />
            </div>
          </div>
        </section>

        {/* Liberia Market Insights Section */}
        <section className="py-10 sm:py-14 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 max-w-[100vw] xl:max-w-none">
            <div className="text-center mb-8 sm:mb-12 space-y-3">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                <Badge variant="outline">For Liberians</Badge>
                <Badge className="bg-primary/10 text-primary">Essential Data</Badge>
                <Badge variant="secondary">Daily Updates</Badge>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Liberia Price Index & Market Insights
                </span>
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                Real-time prices of essential goods and market intelligence for informed decisions
              </p>
              <Button asChild variant="outline" size="sm" className="mt-2 rounded-full border-primary/40 text-primary hover:bg-primary/10">
                <Link href="/price-index" className="flex items-center gap-1.5">
                  View full Price Index <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-primary font-semibold shadow-sm">
                  Live prices
                </span>
                <span className="rounded-full border border-secondary/40 bg-secondary/15 px-3 py-1 text-secondary font-semibold shadow-sm">
                  Inflation tracker
                </span>
                <span className="rounded-full border border-muted-foreground/30 bg-muted/20 px-3 py-1">Local news</span>
                <a
                  href="https://lisgis.gov.lr/pricestats.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-amber-700 dark:text-amber-400 font-medium hover:bg-amber-500/20 transition-colors"
                >
                  Source: LISGIS
                </a>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-3 max-w-6xl mx-auto">
              <div className="min-w-0 lg:col-span-2">
                <PriceIndex rate={liveRate} variant="essential" />
              </div>
              <div className="space-y-6">
                <InflationTracker />
              </div>
            </div>
            <div className="max-w-6xl mx-auto mt-6">
              <MarketNews />
            </div>
          </div>
        </section>

        <Features />
        <TrustSignals />

        {/* Referral CTA */}
        <section className="py-10 sm:py-14 md:py-16 bg-gradient-to-r from-secondary/10 via-primary/5 to-accent/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 max-w-[100vw] xl:max-w-none">
            <div className="max-w-5xl mx-auto rounded-xl sm:rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card/90 to-secondary/5 px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-12 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-center md:text-left shadow-sm backdrop-blur-sm">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center shadow-sm">
                  <Gift className="h-8 w-8 text-secondary" />
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                    <Badge variant="outline">Referral Program</Badge>
                    <Badge className="bg-secondary/10 text-secondary">Free Premium</Badge>
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold">
                    <span className="bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent">
                      Invite Friends, Get Rewards!
                    </span>
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground max-w-md">
                    Both you and your friend get 1 month of premium SMS alerts — completely free.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <Button size="lg" className="gap-2 w-full md:w-auto shadow-sm" asChild>
                  <Link href="/community#referral">
                    Start Sharing
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full md:w-auto" asChild>
                  <Link href="/community">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute bottom-0 left-1/4 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
          </div>
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 max-w-[100vw] xl:max-w-none text-center">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
              <Badge
                variant="secondary"
                className="text-primary-foreground bg-primary-foreground/20 border border-primary-foreground/40 font-semibold shadow-sm"
              >
                Ready to Start
              </Badge>
              <Badge
                variant="secondary"
                className="text-primary-foreground bg-primary-foreground/20 border border-primary-foreground/40 font-semibold shadow-sm"
              >
                Trusted by Thousands
              </Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-4 mb-4 text-balance">
              <span className="bg-gradient-to-r from-primary-foreground via-secondary to-primary-foreground bg-clip-text text-transparent">
                Ready to Get Started?
              </span>
            </h2>
            <p className="text-base sm:text-lg mb-8 sm:mb-10 max-w-2xl mx-auto opacity-90 text-pretty">
              Join thousands of Liberians who trust TrueRate for accurate exchange rate information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="shadow-lg shadow-primary/30 gap-2">
                <Link href="/converter">
                  Try Converter
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent shadow-sm"
                asChild
              >
                <Link href="/predictions">View AI Predictions</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
