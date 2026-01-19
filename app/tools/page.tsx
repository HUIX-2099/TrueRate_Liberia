"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calculator, DollarSign, PiggyBank, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"
import { SMSAlertSignup } from "@/components/liberia-features"
import { useEffect, useState } from "react"

export default function ToolsPage() {
  const [liveRate, setLiveRate] = useState(180)
  const [lastUpdate, setLastUpdate] = useState("Loading...")

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch("/api/rates/live")
        const data = await res.json()
        if (data?.rate) setLiveRate(data.rate)
        setLastUpdate(new Date().toLocaleTimeString())
      } catch (error) {
        console.error("[Tools] Failed to fetch rate", error)
        setLastUpdate("Recently")
      }
    }
    fetchRate()
  }, [])

  const alertLow = (liveRate - 2).toFixed(2)
  const alertHigh = (liveRate + 2).toFixed(2)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-4">Financial Tools</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                Smart Tools for Better Financial Decisions
              </h1>
              <p className="text-xl text-muted-foreground text-pretty">
                Free calculators and planners to help you manage money, compare costs, and plan for the future.
              </p>
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                      <DollarSign className="h-6 w-6 text-primary" />
                    </div>
                    <Badge>Popular</Badge>
                  </div>
                  <CardTitle className="text-2xl">Remittance Calculator</CardTitle>
                  <CardDescription>
                    Compare the real cost of sending money through different services including hidden fees and exchange
                    rate spreads
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/tools/remittance">
                    <Button className="w-full">
                      Open Calculator
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
                    <PiggyBank className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle className="text-2xl">Budget Planner</CardTitle>
                  <CardDescription>
                    Track your income and expenses in USD and LRD, see how exchange rate changes impact your budget
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/tools/budget">
                    <Button className="w-full">
                      Open Planner
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                    <Calculator className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-2xl">Currency Converter</CardTitle>
                  <CardDescription>
                    Convert between USD and LRD using real-time rates from verified money changers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/#converter">
                    <Button className="w-full bg-transparent" variant="outline">
                      Open Converter
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary">New</Badge>
                  </div>
                  <CardTitle className="text-2xl">Inflation Tracker</CardTitle>
                  <CardDescription>
                    See how purchasing power changes over time with inflation-adjusted rate tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/tools/inflation">
                    <Button className="w-full">
                      Open Tracker
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center">Why Use Our Tools?</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                        <Calculator className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">100% Free</h3>
                      <p className="text-sm text-muted-foreground">
                        All tools are completely free to use with no hidden charges or premium features
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="h-6 w-6 text-secondary" />
                      </div>
                      <h3 className="font-semibold mb-2">Real-Time Data</h3>
                      <p className="text-sm text-muted-foreground">
                        Powered by live exchange rates from verified sources across Liberia
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                        <PiggyBank className="h-6 w-6 text-accent" />
                      </div>
                      <h3 className="font-semibold mb-2">Save Money</h3>
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
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-8">
              <Badge className="mb-3" variant="secondary">
                Alerts
              </Badge>
              <h2 className="text-3xl font-bold mb-3">Get SMS Alerts</h2>
              <p className="text-muted-foreground">
                Get notified when the rate hits your target—even without internet access.
              </p>
            </div>
            <div className="max-w-xl mx-auto">
              <SMSAlertSignup />
            </div>
          </div>
        </section>

        {/* Alert Insights */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Alert Insights</h2>
              <p className="text-muted-foreground">
                Use the current rate to set realistic targets and avoid missed alerts.
              </p>
            </div>
            <div className="max-w-4xl mx-auto grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Current USD/LRD</CardTitle>
                  <CardDescription>Updated {lastUpdate}</CardDescription>
                </CardHeader>
                <CardContent className="text-2xl font-bold text-primary">
                  {liveRate.toFixed(2)} LRD
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Suggested Alert Band</CardTitle>
                  <CardDescription>±2 LRD from current</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {alertLow} – {alertHigh} LRD
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Best Use</CardTitle>
                  <CardDescription>Set for buy or sell timing</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Choose a target slightly above or below your typical rate.
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
