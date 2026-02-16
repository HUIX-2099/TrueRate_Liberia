"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calculator, DollarSign, PiggyBank, TrendingUp, ArrowRight, Smartphone } from "lucide-react"
import Link from "next/link"
import { SMSAlertSignup } from "@/components/liberia-features"
import { PushNotifications } from "@/components/push-notifications"
import { useState } from "react"
import { useLiveRate } from "@/lib/live-rate-context"

export default function ToolsPage() {
  const { rate: liveRate } = useLiveRate()
  const [lastUpdate, setLastUpdate] = useState("Just now")

  const alertLow = (liveRate - 2).toFixed(2)
  const alertHigh = (liveRate + 2).toFixed(2)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 sm:py-14 md:py-24 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                <Badge className="mb-2">Financial Tools</Badge>
                <Badge className="bg-primary/10 text-primary">100% Free</Badge>
                <Badge variant="secondary">Real-time Data</Badge>
                <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400">Save Money</Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Smart Tools for Better Financial Decisions
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
                Free calculators and planners to help you manage money, compare costs, and plan for the future.
              </p>
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="py-12 sm:py-14 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 space-y-3">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                <Badge variant="outline">Essential Calculators</Badge>
                <Badge className="bg-primary/10 text-primary">Free Forever</Badge>
                <Badge variant="secondary">Live Data</Badge>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-balance">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Financial Planning Tools
                </span>
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Everything you need to make informed financial decisions in Liberia
              </p>
            </div>
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <DollarSign className="h-7 w-7 text-primary" />
                    </div>
                    <Badge className="bg-primary/10 text-primary">Popular</Badge>
                  </div>
                  <CardTitle className="text-2xl text-primary">Remittance Calculator</CardTitle>
                  <CardDescription>
                    Compare the real cost of sending money through different services including hidden fees and exchange
                    rate spreads
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/tools/remittance">
                    <Button className="w-full shadow-sm gap-2">
                      Open Calculator
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-secondary/20 bg-gradient-to-br from-secondary/5 to-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardHeader className="pb-4">
                  <div className="h-14 w-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                    <PiggyBank className="h-7 w-7 text-secondary" />
                  </div>
                  <CardTitle className="text-2xl text-secondary">Budget Planner</CardTitle>
                  <CardDescription>
                    Track your income and expenses in USD and LRD, see how exchange rate changes impact your budget
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/tools/budget">
                    <Button className="w-full shadow-sm gap-2">
                      Open Planner
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardHeader className="pb-4">
                  <div className="h-14 w-14 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                    <Calculator className="h-7 w-7 text-amber-600" />
                  </div>
                  <CardTitle className="text-2xl text-amber-600">Currency Converter</CardTitle>
                  <CardDescription>
                    Convert between USD and LRD using real-time rates from verified money changers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/#converter">
                    <Button className="w-full shadow-sm gap-2" variant="outline">
                      Open Converter
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="h-14 w-14 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                      <TrendingUp className="h-7 w-7 text-green-600" />
                    </div>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">New</Badge>
                  </div>
                  <CardTitle className="text-2xl text-green-600">Inflation Tracker</CardTitle>
                  <CardDescription>
                    See how purchasing power changes over time with inflation-adjusted rate tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/tools/inflation">
                    <Button className="w-full shadow-sm gap-2">
                      Open Tracker
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-muted/30 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center mb-4">
                    <Smartphone className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-xl">No smartphone?</CardTitle>
                  <CardDescription>
                    Get the rate on any phone. Dial <span className="font-mono font-semibold">*XXX#</span> (coming soon). We&apos;re working with mobile networks to bring USSD to Liberia.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-3">Until then: use SMS alerts or ask someone to share the rate from the app.</p>
                  <Link href="/docs#ussd">
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      How USSD will work
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 sm:py-14 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12 space-y-3">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                <Badge variant="outline">Why It Helps</Badge>
                <Badge className="bg-primary/10 text-primary">Free & Powerful</Badge>
                <Badge variant="secondary">Save Money</Badge>
              </div>
              <h2 className="text-3xl font-bold text-balance">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Why Use Our Tools?
                </span>
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Designed specifically for Liberian users to make better financial decisions
              </p>
            </div>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-card shadow-sm hover:shadow-md transition-all">
                  <CardContent className="pt-8 pb-6">
                    <div className="text-center">
                      <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Calculator className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2 text-primary">100% Free</h3>
                      <p className="text-sm text-muted-foreground">
                        All tools are completely free to use with no hidden charges or premium features
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-secondary/20 bg-gradient-to-br from-secondary/5 to-card shadow-sm hover:shadow-md transition-all">
                  <CardContent className="pt-8 pb-6">
                    <div className="text-center">
                      <div className="h-14 w-14 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="h-7 w-7 text-secondary" />
                      </div>
                      <h3 className="font-semibold mb-2 text-secondary">Real-Time Data</h3>
                      <p className="text-sm text-muted-foreground">
                        Powered by live exchange rates from verified sources across Liberia
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-card shadow-sm hover:shadow-md transition-all">
                  <CardContent className="pt-8 pb-6">
                    <div className="text-center">
                      <div className="h-14 w-14 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                        <PiggyBank className="h-7 w-7 text-green-600" />
                      </div>
                      <h3 className="font-semibold mb-2 text-green-600">Save Money</h3>
                      <p className="text-sm text-muted-foreground">
                        Compare costs and spot hidden fees to make the most economical choices
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* SMS Alerts */}
        <section className="py-12 sm:py-14 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-8 space-y-3">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                <Badge variant="secondary">SMS Alerts</Badge>
                <Badge className="bg-primary/10 text-primary">No Internet Needed</Badge>
                <Badge variant="outline">Instant Notifications</Badge>
              </div>
              <h2 className="text-3xl font-bold mb-3 text-balance">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Get SMS Alerts
                </span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Get notified when the rate hits your target—even without internet access.
              </p>
            </div>
            <div className="max-w-xl mx-auto mb-8">
              <SMSAlertSignup />
            </div>
            <div className="max-w-2xl mx-auto">
              <PushNotifications />
            </div>
          </div>
        </section>

        {/* Alert Insights */}
        <section className="py-10 sm:py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-8 space-y-3">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                <Badge variant="outline">Smart Insights</Badge>
                <Badge className="bg-primary/10 text-primary">Realistic Targets</Badge>
                <Badge variant="secondary">Avoid Missed Alerts</Badge>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-balance">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Alert Insights
                </span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Use the current rate to set realistic targets and avoid missed alerts.
              </p>
            </div>
            <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-3">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-card shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </div>
                    <CardTitle className="text-base text-primary">Current USD/LRD</CardTitle>
                  </div>
                  <CardDescription className="text-primary/70">Updated {lastUpdate}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-primary">{liveRate.toFixed(2)}</div>
                  <div className="text-xs text-primary/70 mt-1">LRD per USD</div>
                </CardContent>
              </Card>
              <Card className="border-secondary/20 bg-gradient-to-br from-secondary/5 to-card shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-4 w-4 rounded-full bg-secondary/20 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-secondary"></div>
                    </div>
                    <CardTitle className="text-base text-secondary">Suggested Alert Band</CardTitle>
                  </div>
                  <CardDescription className="text-secondary/70">±2 LRD from current</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold text-secondary">{alertLow} – {alertHigh}</div>
                  <div className="text-xs text-secondary/70 mt-1">LRD range</div>
                </CardContent>
              </Card>
              <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-card shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-4 w-4 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-amber-600"></div>
                    </div>
                    <CardTitle className="text-base text-amber-600">Best Use</CardTitle>
                  </div>
                  <CardDescription className="text-amber-600/70">Set for buy or sell timing</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-sm text-muted-foreground">
                    Choose a target slightly above or below your typical rate.
                  </div>
                  <div className="text-xs text-amber-600/70 mt-1">Smart targeting</div>
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
