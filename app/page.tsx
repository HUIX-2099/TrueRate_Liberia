"use client"

import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { TrustSignals } from "@/components/trust-signals"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { 
  ArrowRight, TrendingUp, MapPin, Calculator, Shield, 
  Briefcase, MessageSquare, Users, Gift, Brain, Crown
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BestRateWidget } from "@/components/best-rate-widget"
import { MarketLeaderboard } from "@/components/market-leaderboard"
import { PriceIndex, MarketNews, InflationTracker } from "@/components/liberia-features"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [liveRate, setLiveRate] = useState(192.50)
  const [countdown, setCountdown] = useState("00d 00h 00m 00s")

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch("/api/rates/live")
        const data = await res.json()
        if (data.rate) setLiveRate(data.rate)
      } catch (e) {
        // Use default
      }
    }
    fetchRate()
    const interval = setInterval(fetchRate, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const target = new Date("2026-03-25T00:00:00")
    const tick = () => {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) {
        setCountdown("00d 00h 00m 00s")
        return
      }
      const totalSeconds = Math.floor(diff / 1000)
      const days = Math.floor(totalSeconds / 86400)
      const hours = Math.floor((totalSeconds % 86400) / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60
      setCountdown(
        `${days.toString().padStart(2, "0")}d ${hours.toString().padStart(2, "0")}h ${minutes
          .toString()
          .padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`,
      )
    }

    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Launching Soon Section */}
        <section className="py-6 sm:py-8 sm:py-10 md:py-14 bg-gradient-to-b from-muted/40 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto rounded-2xl border border-border/60 bg-card/80 shadow-sm backdrop-blur">
              <div className="px-5 py-6 sm:px-6 sm:py-6 sm:py-8 md:px-10 md:py-10 text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="outline">We’re Launching Soon</Badge>
                  <Badge className="bg-primary/10 text-primary">New</Badge>
                </div>
                <h2 className="text-2xl sm:text-2xl sm:text-2xl sm:text-3xl md:text-4xl font-bold text-balance">
                  A smarter way to track Liberia’s FX market is almost here
                </h2>
                <p className="text-base sm:text-base sm:text-lg text-muted-foreground text-pretty max-w-3xl mx-auto">
                  Precision FX insights, all in one place.
                </p>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Launch countdown
                  </span>
                  <div className="rounded-full border border-border/60 bg-background/80 px-4 py-2 text-sm font-semibold">
                    {countdown}
                  </div>
                  <span className="text-xs text-muted-foreground">March 25, 2026 • 12:00 AM</span>
                </div>
                <div className="flex justify-center">
                  <Button asChild>
                    <Link href="/contact">Get Early Access</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Hero />

        {/* Today's Best Rate Widget - Prime Position */}
        <section className="py-6 sm:py-8 sm:py-10 md:py-10 sm:py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-3">
              <div className="text-center space-y-2">
                <Badge variant="outline">Best rate near you</Badge>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-balance">
                  Check the top verified USD/LRD rate right now
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Distance, travel time, and trust signals update with your location.
                </p>
              </div>
              <BestRateWidget />
            </div>
          </div>
        </section>

        {/* Quick Access Cards */}
        <section className="py-14 sm:py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-10 sm:mb-12">
              <Badge variant="outline" className="mb-3">Fast tools</Badge>
              <h2 className="text-2xl sm:text-2xl sm:text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-balance">Quick Access Tools</h2>
              <p className="text-base sm:text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Everything you need to stay informed about USD/LRD exchange rates
              </p>
            </div>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              <Link href="/converter">
                <Card className="group h-full border-border/60 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
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

              <Link href="/analytics">
                <Card className="group h-full border-border/60 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                        <TrendingUp className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">Rate Analytics</h3>
                        <p className="text-sm text-muted-foreground">View trends, charts, and historical data</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/predictions">
                <Card className="group h-full border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-background shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
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

              <Link href="/business">
                <Card className="group h-full border-primary/30 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
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

              <Link href="/map">
                <Card className="group h-full border-border/60 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
                        <MapPin className="h-6 w-6 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">Find Changers</h3>
                        <p className="text-sm text-muted-foreground">Interactive map with live rates near you</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/forums">
                <Card className="group h-full border-border/60 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
                        <MessageSquare className="h-6 w-6 text-violet-500" />
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

              <Link href="/community">
                <Card className="group h-full border-border/60 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10">
                        <Users className="h-6 w-6 text-pink-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">Community</h3>
                        <p className="text-sm text-muted-foreground">Report rates, earn points, win badges</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/report-fraud">
                <Card className="group h-full border-border/60 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
                        <Shield className="h-6 w-6 text-destructive" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">Report Fraud</h3>
                        <p className="text-sm text-muted-foreground">Help keep the community safe</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/voice">
                <Card className="group h-full border-border/60 bg-gradient-to-br from-secondary/10 to-background shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
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
        <section className="py-12 sm:py-14 md:py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8 space-y-2">
                <Badge variant="outline">Live leaderboard</Badge>
                <h2 className="text-2xl sm:text-2xl sm:text-2xl sm:text-3xl md:text-4xl font-bold">Top Best Rates in Monrovia</h2>
                <p className="text-base sm:text-base sm:text-lg text-muted-foreground">
                  Live rankings updated every 15 minutes
                </p>
              </div>
              <MarketLeaderboard />
            </div>
          </div>
        </section>

        {/* Liberia Market Insights Section */}
        <section className="py-12 sm:py-14 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-10 sm:mb-12">
              <Badge className="mb-4" variant="outline">For Liberians</Badge>
              <h2 className="text-2xl sm:text-2xl sm:text-2xl sm:text-3xl md:text-4xl font-bold mb-3">Market Insights & Tools</h2>
              <p className="text-base sm:text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                Essential information for everyday decisions in Liberia
              </p>
            </div>
            <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <div className="lg:col-span-2">
                <PriceIndex rate={liveRate} />
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
        <section className="py-10 sm:py-10 sm:py-12 bg-gradient-to-r from-secondary/10 via-primary/5 to-accent/10">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto rounded-2xl border border-border/60 bg-background/70 px-5 py-6 sm:px-6 sm:py-6 sm:py-8 md:px-10 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left shadow-sm">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Gift className="h-8 w-8 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold">Invite Friends, Get Rewards!</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Both you and your friend get 1 month of premium SMS alerts FREE
                  </p>
                </div>
              </div>
              <Button size="lg" className="gap-2" asChild>
                <Link href="/community#referral">
                  Start Sharing
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-14 sm:py-16 md:py-20 bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute bottom-0 left-1/4 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
          </div>
          <div className="container relative mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-2xl sm:text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-balance">Ready to Get Started?</h2>
            <p className="text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto opacity-90 text-pretty">
              Join thousands of Liberians who trust TrueRate for accurate exchange rate information
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/converter">
                  Try Converter <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
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
