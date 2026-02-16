"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Activity, RefreshCw, Sparkles, Calendar, MapPin } from "lucide-react"
import { RateHistoryExport } from "@/components/rate-history-export"
import { RateBrief } from "@/components/rate-brief"
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
  const [thisWeekAvg, setThisWeekAvg] = useState<number | null>(null)
  const [lastWeekAvg, setLastWeekAvg] = useState<number | null>(null)
  const [regional, setRegional] = useState<Array<{ region: string; county?: string; avgRate: number; count: number }>>([])
  const [byCounty, setByCounty] = useState<Array<{ county: string; region: string; avgRate: number; count: number }>>([])

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const [liveResponse, histResponse, regionalResponse] = await Promise.all([
          fetch("/api/rates/live"),
          fetch("/api/rates/historical"),
          fetch("/api/rates/regional"),
        ])

        const liveData = await liveResponse.json()
        const histData = await histResponse.json()
        const regionalData = await regionalResponse.json()

        if (typeof liveData.rate === "number") {
          setCurrentRate(liveData.rate)
        }
        if (Array.isArray(liveData?.official?.sources)) {
          setSourceCount(liveData.official.sources.length)
        }
        setLastUpdated(new Date().toLocaleTimeString())

        if (Array.isArray(regionalData.regional)) setRegional(regionalData.regional)
        if (Array.isArray(regionalData.byCounty)) setByCounty(regionalData.byCounty)

        if (histData.historical && histData.historical.length > 0) {
          const historical = histData.historical
          const current = historical[historical.length - 1].rate

          if (historical.length > 1) {
            const yesterday = historical[historical.length - 2].rate
            setDayChange(((current - yesterday) / yesterday) * 100)
          }

          if (historical.length > 7) {
            const weekAgo = historical[historical.length - 8].rate
            setWeekChange(((current - weekAgo) / weekAgo) * 100)
          }

          const n = historical.length
          if (n >= 7) {
            const thisWeekRates = historical.slice(-7).map((p: { rate: number }) => p.rate)
            const lastWeekRates = n >= 14 ? historical.slice(-14, -7).map((p: { rate: number }) => p.rate) : thisWeekRates
            setThisWeekAvg(thisWeekRates.reduce((a: number, b: number) => a + b, 0) / thisWeekRates.length)
            setLastWeekAvg(lastWeekRates.reduce((a: number, b: number) => a + b, 0) / lastWeekRates.length)
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
            <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
              <Badge variant="outline" className="gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                Analytics Hub
              </Badge>
              <Badge className="bg-primary/10 text-primary">Live Data</Badge>
              <Badge variant="secondary">AI-Powered</Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-balance">
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Rate Trends & Analytics
              </span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Real-time insights, historical context, and AI-powered market analysis for USD/LRD.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 flex-wrap">
              <Button
                variant="outline"
                className="gap-2 shadow-sm"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Data
              </Button>
              <Button
                variant={showPercent ? "default" : "outline"}
                className="gap-2 shadow-sm"
                onClick={() => setShowPercent((prev) => !prev)}
              >
                {showPercent ? "Show LRD Change" : "Show % Change"}
              </Button>
              <RateHistoryExport />
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto mb-12">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-card shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-primary">Current Rate</CardTitle>
                <Activity className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-3xl font-bold text-primary">{loading ? "—" : currentRate.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">
                  LRD per USD • Updated {lastUpdated}
                </div>
                <div className="text-xs">
                  <span className="rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5 text-primary">
                    {sourceCount} sources
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className={`border-border/60 shadow-sm ${dayChange >= 0 ? 'border-green-200 bg-green-50/50 dark:bg-green-950/20' : 'border-red-200 bg-red-50/50 dark:bg-red-950/20'}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium">24h Change</CardTitle>
                {dayChange >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                <div className={`text-3xl font-bold ${dayChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {loading
                    ? "—"
                    : showPercent
                      ? `${dayChange >= 0 ? "+" : ""}${dayChange.toFixed(2)}%`
                      : `${dayDelta >= 0 ? "+" : ""}${dayDelta.toFixed(2)}`}
                </div>
                <div className="text-xs text-muted-foreground">
                  {showPercent ? "Percentage change" : "LRD change"}
                </div>
              </CardContent>
            </Card>

            <Card className={`border-border/60 shadow-sm ${weekChange >= 0 ? 'border-green-200 bg-green-50/50 dark:bg-green-950/20' : 'border-red-200 bg-red-50/50 dark:bg-red-950/20'}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium">7d Trend</CardTitle>
                {weekChange >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                <div className={`text-3xl font-bold ${weekChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {loading
                    ? "—"
                    : showPercent
                      ? `${weekChange >= 0 ? "+" : ""}${weekChange.toFixed(2)}%`
                      : `${weekDelta >= 0 ? "+" : ""}${weekDelta.toFixed(2)}`}
                </div>
                <div className="text-xs text-muted-foreground">
                  {showPercent ? "Percentage change" : "LRD change"}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Compare periods */}
          {thisWeekAvg != null && lastWeekAvg != null && (
            <div className="max-w-5xl mx-auto mb-12">
              <Card className="border-border/60 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Compare periods
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="p-3 rounded-lg bg-muted/50 border border-border/40">
                      <div className="text-xs text-muted-foreground mb-1">This week (avg)</div>
                      <div className="text-xl font-bold text-primary">{thisWeekAvg.toFixed(2)} LRD</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 border border-border/40">
                      <div className="text-xs text-muted-foreground mb-1">Last week (avg)</div>
                      <div className="text-xl font-bold">{lastWeekAvg.toFixed(2)} LRD</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 border border-border/40 flex flex-col justify-center">
                      <div className="text-xs text-muted-foreground mb-1">Week-over-week</div>
                      <div className={`text-xl font-bold ${((thisWeekAvg - lastWeekAvg) / lastWeekAvg) * 100 >= 0 ? "text-red-600" : "text-green-600"}`}>
                        {(((thisWeekAvg - lastWeekAvg) / lastWeekAvg) * 100 >= 0 ? "+" : "")}
                        {(((thisWeekAvg - lastWeekAvg) / lastWeekAvg) * 100).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">Comparison of 7-day average rate vs previous 7 days.</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Rate brief — why the rate moved */}
          <div className="max-w-5xl mx-auto mb-12">
            <RateBrief variant="card" weekChangePercent={weekChange} />
          </div>

          {/* Regional breakdown */}
          {(regional.length > 0 || byCounty.length > 0) && (
            <div className="max-w-5xl mx-auto mb-12">
              <Card className="border-border/60 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Regional breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-2">Monrovia vs Upcountry</div>
                      <div className="space-y-2">
                        {regional.map((r) => (
                          <div key={r.region} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/50 border border-border/40">
                            <span className="text-sm font-medium">{r.region}</span>
                            <span className="text-sm font-mono font-semibold">{r.avgRate.toFixed(2)} LRD</span>
                            <span className="text-xs text-muted-foreground shrink-0">({r.count})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-2">By county</div>
                      <div className="space-y-2 max-h-[200px] overflow-y-auto">
                        {byCounty.slice(0, 8).map((c) => (
                          <div key={c.county} className="flex items-center justify-between py-1.5 text-sm">
                            <span>{c.county}</span>
                            <span className="font-mono text-muted-foreground">{c.avgRate.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">Average rates by region; Monrovia (Montserrado) vs upcountry counties.</p>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="max-w-6xl mx-auto mb-12">
            <RateHistory />
          </div>

          {/* Market Insights */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                <Badge variant="outline">Market Insights</Badge>
                <Badge className="bg-secondary/10 text-secondary">AI Analysis</Badge>
                <Badge variant="secondary">Real-time</Badge>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Market Intelligence
                </span>
              </h2>
              <p className="text-sm text-muted-foreground">AI-powered analysis and market insights</p>
            </div>
            <Tabs defaultValue="summary">
              <TabsList className="grid w-full grid-cols-3 shadow-sm">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="patterns">Patterns</TabsTrigger>
                <TabsTrigger value="quality">Data Quality</TabsTrigger>
              </TabsList>
              <TabsContent value="summary">
                <Card className="border-border/60 shadow-sm bg-gradient-to-br from-card to-muted/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      Today's Snapshot
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-background/80 rounded-lg border border-border/40">
                      <div>
                        <div className="text-sm text-muted-foreground">Current Rate</div>
                        <div className="text-2xl font-bold text-primary">
                          {loading ? "Loading..." : `${currentRate.toFixed(2)} LRD`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">24h Change</div>
                        <div className={`text-lg font-semibold ${dayChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {loading ? "—" : `${dayChange >= 0 ? "+" : ""}${dayChange.toFixed(2)}%`}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Sources tracked: {sourceCount || "—"} verified changers and institutional feeds with real-time consistency checks.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="patterns">
                <Card className="border-border/60 shadow-sm bg-gradient-to-br from-card to-muted/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-secondary" />
                      Weekly Patterns
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3">
                      <div className="flex items-center justify-between p-3 bg-background/80 rounded-lg border border-border/40">
                        <span className="text-sm font-medium">7-Day Trend</span>
                        <span className={`text-sm font-semibold px-2 py-1 rounded-full ${weekChange >= 0 ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"}`}>
                          {weekChange >= 0 ? "+" : ""}{weekChange.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-background/80 rounded-lg border border-border/40">
                        <span className="text-sm font-medium">Weekend Demand</span>
                        <span className="text-sm text-muted-foreground">Higher USD demand</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="quality">
                <Card className="border-border/60 shadow-sm bg-gradient-to-br from-card to-muted/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Data Quality
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3">
                      <div className="flex items-center justify-between p-3 bg-background/80 rounded-lg border border-border/40">
                        <span className="text-sm font-medium">Data Sources</span>
                        <span className="text-sm text-muted-foreground">Institutional feeds</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-background/80 rounded-lg border border-border/40">
                        <span className="text-sm font-medium">Refresh Rate</span>
                        <span className="text-sm text-muted-foreground">Every minute</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-background/80 rounded-lg border border-border/40">
                        <span className="text-sm font-medium">Validation</span>
                        <span className="text-sm text-muted-foreground">Consistency checks</span>
                      </div>
                    </div>
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
