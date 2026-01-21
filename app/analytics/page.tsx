"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Activity, RefreshCw, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const RateHistory = dynamic(() => import("@/components/rate-history").then((mod) => mod.RateHistory), {
  ssr: false,
  loading: () => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Exchange Rate History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Loading chart...
        </div>
      </CardContent>
    </Card>
  ),
})

export default function AnalyticsPage() {
  const [currentRate, setCurrentRate] = useState<number>(0)
  const [dayChange, setDayChange] = useState<number>(0)
  const [weekChange, setWeekChange] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>("Loading...")
  const [sourceCount, setSourceCount] = useState<number>(0)
  const [showPercent, setShowPercent] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const [liveResponse, histResponse] = await Promise.all([
          fetch("/api/rates/live"),
          fetch("/api/rates/historical"),
        ])

        const liveData = await liveResponse.json()
        const histData = await histResponse.json()

        if (typeof liveData.rate === "number") {
          setCurrentRate(liveData.rate)
        }
        if (Array.isArray(liveData?.official?.sources)) {
          setSourceCount(liveData.official.sources.length)
        }
        setLastUpdated(new Date().toLocaleTimeString())

        if (histData.historical && histData.historical.length > 0) {
          const historical = histData.historical
          const current = historical[historical.length - 1].rate

          // Calculate 24h change
          if (historical.length > 1) {
            const yesterday = historical[historical.length - 2].rate
            setDayChange(((current - yesterday) / yesterday) * 100)
          }

          // Calculate 7d change
          if (historical.length > 7) {
            const weekAgo = historical[historical.length - 8].rate
            setWeekChange(((current - weekAgo) / weekAgo) * 100)
          }
        }
      } catch (error) {
        console.error("[v0] Error fetching analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const dayDelta = (currentRate * dayChange) / 100
  const weekDelta = (currentRate * weekChange) / 100

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="py-12 sm:py-14 md:py-24 flex-1 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 space-y-4">
            <Badge variant="outline" className="gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              Analytics Hub
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-balance">
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Rate Trends & Analytics
              </span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Real-time insights, historical context, and AI-powered market analysis for USD/LRD.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Data
              </Button>
              <Button
                variant={showPercent ? "default" : "outline"}
                className="gap-2"
                onClick={() => setShowPercent((prev) => !prev)}
              >
                {showPercent ? "Show LRD Change" : "Show % Change"}
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto mb-12">
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Rate</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "—" : currentRate.toFixed(2)} LRD</div>
                <p className="text-xs text-muted-foreground">
                  per 1 USD • Updated {lastUpdated}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">24h Change</CardTitle>
                {dayChange >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-secondary" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${dayChange >= 0 ? "text-secondary" : "text-destructive"}`}>
                  {loading
                    ? "—"
                    : showPercent
                      ? `${dayChange >= 0 ? "+" : ""}${dayChange.toFixed(2)}%`
                      : `${dayDelta >= 0 ? "+" : ""}${dayDelta.toFixed(2)} LRD`}
                </div>
                <p className="text-xs text-muted-foreground">
                  {loading ? "—" : `${dayChange >= 0 ? "+" : ""}${dayChange.toFixed(2)}%`}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">7d Trend</CardTitle>
                {weekChange >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-secondary" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${weekChange >= 0 ? "text-secondary" : "text-destructive"}`}>
                  {loading
                    ? "—"
                    : showPercent
                      ? `${weekChange >= 0 ? "+" : ""}${weekChange.toFixed(2)}%`
                      : `${weekDelta >= 0 ? "+" : ""}${weekDelta.toFixed(2)} LRD`}
                </div>
                <p className="text-xs text-muted-foreground">
                  {loading ? "—" : `${weekChange >= 0 ? "+" : ""}${weekChange.toFixed(2)}%`}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-6xl mx-auto mb-12">
            <RateHistory />
          </div>

          {/* Market Insights */}
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="summary">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="patterns">Patterns</TabsTrigger>
                <TabsTrigger value="quality">Data Quality</TabsTrigger>
              </TabsList>
              <TabsContent value="summary">
                <Card className="border-border/60 shadow-sm">
                  <CardHeader>
                    <CardTitle>Today’s Snapshot</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      The USD/LRD rate is currently {loading ? "loading" : `${currentRate.toFixed(2)} LRD`} per USD.
                      The 24‑hour change is {Math.abs(dayChange).toFixed(2)}%{" "}
                      {dayChange >= 0 ? "higher" : "lower"}.
                    </p>
                    <p>
                      Sources tracked: {sourceCount || "—"} verified changers and institutional feeds.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="patterns">
                <Card className="border-border/60 shadow-sm">
                  <CardHeader>
                    <CardTitle>Weekly Patterns</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    The 7‑day trend shows a {Math.abs(weekChange).toFixed(2)}%{" "}
                    {weekChange >= 0 ? "increase" : "decrease"} with stronger USD demand toward weekends.
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="quality">
                <Card className="border-border/60 shadow-sm">
                  <CardHeader>
                    <CardTitle>Data Quality</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Aggregated from live institutional feeds and community reports, refreshed every minute with
                    consistency checks for anomalies.
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
