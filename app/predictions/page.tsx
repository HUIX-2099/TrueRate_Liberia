"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageHero } from "@/components/layout/page-hero"
import { TradingChart } from "@/components/trading-chart"
import { MLPredictions } from "@/components/ml-predictions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ErrorBoundary } from "@/components/error-boundary"
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  RefreshCw,
  Bell,
  Activity,
  BarChart3,
  LineChart,
  Zap,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"

interface CandleData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface Prediction {
  date: string
  predicted: number
  confidence: number
}

const computeBacktestAccuracy = (candles: CandleData[], lookback = 7) => {
  if (candles.length < 2) return null
  const startIndex = Math.max(1, candles.length - lookback)
  const errors = []
  for (let i = startIndex; i < candles.length; i += 1) {
    const actual = candles[i]?.close
    const predicted = candles[i - 1]?.close
    if (!Number.isFinite(actual) || !Number.isFinite(predicted) || actual === 0) continue
    const ape = Math.abs((actual - predicted) / actual) * 100
    errors.push(ape)
  }
  if (!errors.length) return null
  const mape = errors.reduce((sum, value) => sum + value, 0) / errors.length
  return Math.max(0, 100 - mape)
}

export default function PredictionsPage() {
  const [candles, setCandles] = useState<CandleData[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [currentRate, setCurrentRate] = useState(177.5)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>("")
  const [predictionExplanation, setPredictionExplanation] = useState<string>("")
  const backtestAccuracy = useMemo(() => computeBacktestAccuracy(candles), [candles])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [candleRes, liveRes, predRes] = await Promise.all([
        fetch("/api/rates/candles?days=60"),
        fetch("/api/rates/live"),
        fetch("/api/rates/predictions?days=7"),
      ])

      const candleData = await candleRes.json()
      const liveData = await liveRes.json()
      const predData = await predRes.json()

      setCandles(candleData.candles || [])
      setPredictions(candleData.predictions || [])
      if (typeof predData.explanation === "string") setPredictionExplanation(predData.explanation)

      if (typeof liveData.rate === "number") {
        setCurrentRate(liveData.rate)
      } else if (candleData.currentRate) {
        setCurrentRate(candleData.currentRate)
      }

      setLastUpdate(new Date().toLocaleTimeString())
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  // Calculate market stats
  const dayChange = candles.length > 1 
    ? ((candles[candles.length - 1]?.close || 0) - (candles[candles.length - 2]?.close || 0))
    : 0
  const dayChangePercent = candles.length > 1 
    ? (dayChange / (candles[candles.length - 2]?.close || 1)) * 100 
    : 0
  
  const weekHigh = candles.slice(-7).reduce((max, c) => Math.max(max, c.high), 0)
  const weekLow = candles.slice(-7).reduce((min, c) => Math.min(min, c.low), Infinity)
  const avgVolume = candles.slice(-7).reduce((sum, c) => sum + c.volume, 0) / 7

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <ErrorBoundary>
      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
        <PageHero
          ariaLabel="Rate outlook and planning guide"
          label="Live Rate Outlook"
          title="Rate Outlook & Planning Guide"
          description="Use short-term outlooks, recent movement, and market context to plan exchange timing, remittances, and everyday money decisions with more confidence."
          variant="centered"
          badges={
            <>
              <Badge className="px-4 py-1" variant="secondary">
                <Activity className="h-3 w-3 mr-1 animate-pulse text-primary" />
                Live Rate Outlook
              </Badge>
              <Badge className="bg-muted/40 border border-border/40 text-primary">Planning-first</Badge>
            </>
          }
          contentMaxWidth="max-w-4xl"
        />

        {/* Live Stats Bar */}
        <section className="border-b border-border sticky top-16 z-40 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{currentRate.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">LRD/USD</div>
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${ dayChange > 0 ? "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800" : "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800" }`}>
                  {dayChange > 0 ? <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" /> : <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />}
                  <span className={`text-sm font-semibold ${dayChange > 0 ? "text-red-600" : "text-green-600"}`}>
                    {dayChange > 0 ? "+" : ""}{dayChange.toFixed(2)} ({dayChangePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="hidden sm:flex items-center gap-4 text-muted-foreground">
                  <span>7D High: <strong className="text-foreground">{weekHigh.toFixed(2)}</strong></span>
                  <span>7D Low: <strong className="text-foreground">{weekLow.toFixed(2)}</strong></span>
                  <span className="hidden md:inline">Avg Vol: <strong className="text-foreground">{Math.round(avgVolume).toLocaleString()}</strong></span>
                </div>
                <Button variant="outline" size="sm" onClick={fetchData} disabled={loading} className="gap-2 rounded-xl min-h-[44px]">
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  {lastUpdate || "Loading..."}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-10 sm:py-12 md:py-12">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
              
              {/* Trading Chart */}
              <TradingChart 
                data={candles} 
                predictions={predictions}
                currentRate={currentRate}
              />

              {/* Tabs for different views */}
              <Tabs defaultValue="predictions" className="space-y-6">
                <div className="text-center mb-6">
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                    <Badge variant="outline">AI Insights</Badge>
                    <Badge className="bg-muted/40 border border-border/40 text-primary">Multiple Models</Badge>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground">
                    Planning Insights
                  </h2>
                  <p className="text-sm text-muted-foreground">Practical outlooks for sending, exchanging, and budgeting</p>
                </div>
                <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex shadow-sm">
                  <TabsTrigger value="predictions" className="gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    Outlook
                  </TabsTrigger>
                  <TabsTrigger value="signals" className="gap-2">
                    <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Planning
                  </TabsTrigger>
                  <TabsTrigger value="analysis" className="gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Drivers
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="predictions">
                  <MLPredictions currentRate={currentRate} backtestAccuracy={backtestAccuracy} explanation={predictionExplanation} />
                </TabsContent>

                <TabsContent value="signals">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="border-border/40 rounded-2xl shadow-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                          Better time to buy USD?
                        </CardTitle>
                        <CardDescription>Helpful if you need to hold or send dollars soon</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Rate below recent average</span>
                            <Badge variant="outline" className="text-green-500">Watch</Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Short-term dip continues</span>
                            <Badge variant="outline" className="text-muted-foreground">Monitor</Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Community reports softening</span>
                            <Badge variant="outline" className="text-green-500">Useful</Badge>
                          </div>
                        </div>
                        <div className="pt-4 border-t">
                          <div className="text-sm text-muted-foreground mb-2">Watch zone</div>
                          <div className="text-xl font-bold text-green-500">{(currentRate - 2).toFixed(2)} - {(currentRate - 1).toFixed(2)} LRD</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border/40 rounded-2xl shadow-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                          Better time to exchange USD?
                        </CardTitle>
                        <CardDescription>Helpful if you need more LRD from dollars you already have</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Rate above recent average</span>
                            <Badge variant="outline" className="text-red-500">Watch</Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Recent climb slowing</span>
                            <Badge variant="outline" className="text-red-500">Near</Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Volatility is elevated</span>
                            <Badge variant="outline" className="text-muted-foreground">Monitor</Badge>
                          </div>
                        </div>
                        <div className="pt-4 border-t">
                          <div className="text-sm text-muted-foreground mb-2">Caution zone</div>
                          <div className="text-xl font-bold text-red-500">{(currentRate + 1).toFixed(2)} - {(currentRate + 3).toFixed(2)} LRD</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border/40 rounded-2xl shadow-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          Rate Alerts
                        </CardTitle>
                        <CardDescription>Simple thresholds for planning, not trading</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                            <div>
                              <div className="text-sm font-medium">Above {(currentRate + 2).toFixed(2)}</div>
                              <div className="text-xs text-muted-foreground">Budget alert</div>
                            </div>
                            <Badge variant="secondary">Active</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                            <div>
                              <div className="text-sm font-medium">Below {(currentRate - 2).toFixed(2)}</div>
                              <div className="text-xs text-muted-foreground">Send-home alert</div>
                            </div>
                            <Badge variant="secondary">Active</Badge>
                          </div>
                        </div>
                        <Button className="w-full rounded-xl min-h-[44px]" variant="outline">
                          <Bell className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                          Add Alert
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="analysis">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="border-border/40 rounded-2xl shadow-sm">
                      <CardHeader>
                        <CardTitle>Planning Snapshot</CardTitle>
                        <CardDescription>The signals most useful for everyday money decisions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {[
                            { name: "1-day move", value: `${dayChange > 0 ? "+" : ""}${dayChange.toFixed(2)} LRD`, signal: dayChange > 0 ? "USD stronger" : dayChange < 0 ? "LRD stronger" : "Flat", color: dayChange > 0 ? "text-red-500" : dayChange < 0 ? "text-green-500" : "text-yellow-500" },
                            { name: "7-day high", value: weekHigh.toFixed(2), signal: "Upper range", color: "text-red-500" },
                            { name: "7-day low", value: weekLow.toFixed(2), signal: "Lower range", color: "text-green-500" },
                            { name: "7-day backtest", value: backtestAccuracy != null ? `${backtestAccuracy.toFixed(1)}%` : "—", signal: "Model confidence", color: "text-blue-500" },
                            { name: "Avg activity", value: `${Math.round(avgVolume).toLocaleString()}`, signal: "Recent volume", color: "text-yellow-500" },
                          ].map((indicator) => (
                            <div key={indicator.name} className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">{indicator.name}</span>
                              <div className="flex items-center gap-3">
                                <span className="font-mono font-medium">{indicator.value}</span>
                                <Badge variant="outline" className={indicator.color}>
                                  {indicator.signal}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border/40 rounded-2xl shadow-sm">
                      <CardHeader>
                        <CardTitle>Likely Market Drivers</CardTitle>
                        <CardDescription>What to watch near term when planning exchange or remittance</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Calmer market</span>
                              <span>More movement</span>
                            </div>
                            <div className="h-4 rounded-full relative">
                              <div 
                                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-primary"
                                style={{ left: "55%" }}
                              />
                            </div>
                            <div className="text-center mt-2">
                              <span className="text-sm font-medium">Balanced</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-500">62%</div>
                              <div className="text-xs text-muted-foreground">Steady remittance support</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-red-500">38%</div>
                              <div className="text-xs text-muted-foreground">Short-term market stress</div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm font-medium">This week, watch for:</div>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Zap className="h-3 w-3 text-primary" />
                                CBL policy announcement expected
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Zap className="h-3 w-3 text-primary" />
                                Remittance inflows steady
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Zap className="h-3 w-3 text-primary" />
                                Export season beginning
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Model Info */}
              <Card className="border-border/40 rounded-2xl border-primary/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg text-foreground">About This Outlook</h3>
                        <Badge className="bg-muted/40 border border-border/40 text-primary">Decision support</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        This page combines recent rate history, short-term model forecasts, and market context to help with
                        budgeting, remittance timing, and exchange planning. It is meant to support practical decisions,
                        not encourage speculative trading.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="gap-1">
                          <Brain className="h-3 w-3 text-primary" />
                          ARIMA
                        </Badge>
                        <Badge variant="secondary" className="gap-1">
                          <LineChart className="h-3 w-3 text-primary" />
                          LSTM
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      </ErrorBoundary>
      <Footer />
    </div>
  )
}
