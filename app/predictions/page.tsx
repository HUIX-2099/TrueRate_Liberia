"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TradingChart } from "@/components/trading-chart"
import { MLPredictions } from "@/components/ml-predictions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Target,
  AlertCircle,
  Calendar,
  RefreshCw,
  Download,
  Share2,
  Bell,
  Activity,
  BarChart3,
  LineChart,
  Zap,
} from "lucide-react"
import { useEffect, useState } from "react"

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

export default function PredictionsPage() {
  const [candles, setCandles] = useState<CandleData[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [currentRate, setCurrentRate] = useState(177.5)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>("")

  const fetchData = async () => {
    try {
      setLoading(true)
      const [candleRes, liveRes] = await Promise.all([
        fetch("/api/rates/candles?days=60"),
        fetch("/api/rates/live"),
      ])

      const candleData = await candleRes.json()
      const liveData = await liveRes.json()

      setCandles(candleData.candles || [])
      setPredictions(candleData.predictions || [])
      
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
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-background via-background to-primary/5">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 left-1/4 h-40 w-40 rounded-full bg-secondary/10 blur-2xl" />
          </div>
          
          <div className="container relative mx-auto px-6 sm:px-8 md:px-12 lg:px-16 py-12 md:py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                  <Brain className="h-8 w-8 text-white" />
                </div>
              </div>
              <Badge className="mb-4 px-4 py-1" variant="secondary">
                <Activity className="h-3 w-3 mr-1 animate-pulse" />
                Live ML Analysis
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
                AI-Powered Rate <span className="text-primary">Predictions</span>
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Advanced machine learning models analyze historical patterns, economic indicators, 
                and market sentiment to forecast USD/LRD exchange rate movements.
              </p>
            </div>
          </div>
        </section>

        {/* Live Stats Bar */}
        <section className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-16 z-40">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{currentRate.toFixed(2)}</span>
                  <span className="text-sm text-muted-foreground">LRD/USD</span>
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  dayChange > 0 ? "text-red-500" : "text-green-500"
                }`}>
                  {dayChange > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {dayChange > 0 ? "+" : ""}{dayChange.toFixed(2)} ({dayChangePercent.toFixed(2)}%)
                    </div>
                    </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>7D High: <strong className="text-foreground">{weekHigh.toFixed(2)}</strong></span>
                <span>7D Low: <strong className="text-foreground">{weekLow.toFixed(2)}</strong></span>
                <span className="hidden md:inline">Avg Vol: <strong className="text-foreground">{Math.round(avgVolume).toLocaleString()}</strong></span>
                <Button variant="ghost" size="sm" onClick={fetchData} disabled={loading}>
                  <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
                  {lastUpdate}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 md:py-12">
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
                <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
                  <TabsTrigger value="predictions" className="gap-2">
                    <Brain className="h-4 w-4" />
                    <span className="hidden sm:inline">ML</span> Predictions
                  </TabsTrigger>
                  <TabsTrigger value="signals" className="gap-2">
                    <Target className="h-4 w-4" />
                    <span className="hidden sm:inline">Trading</span> Signals
                  </TabsTrigger>
                  <TabsTrigger value="analysis" className="gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Market</span> Analysis
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="predictions">
                  <MLPredictions currentRate={currentRate} />
                </TabsContent>

                <TabsContent value="signals">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Trading Signals */}
              <Card>
                <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-500" />
                          Buy Signal
                        </CardTitle>
                        <CardDescription>When to buy USD</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>RSI Oversold (&lt;30)</span>
                            <Badge variant="outline" className="text-green-500">Active</Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>MACD Crossover</span>
                            <Badge variant="outline" className="text-muted-foreground">Watching</Badge>
                    </div>
                          <div className="flex justify-between text-sm">
                            <span>Support Level Test</span>
                            <Badge variant="outline" className="text-green-500">Active</Badge>
                    </div>
                  </div>
                        <div className="pt-4 border-t">
                          <div className="text-sm text-muted-foreground mb-2">Recommended Buy Zone</div>
                          <div className="text-xl font-bold text-green-500">{(currentRate - 2).toFixed(2)} - {(currentRate - 1).toFixed(2)} LRD</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingDown className="h-5 w-5 text-red-500" />
                          Sell Signal
                        </CardTitle>
                        <CardDescription>When to sell USD</CardDescription>
                </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>RSI Overbought (&gt;70)</span>
                            <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Resistance Level</span>
                            <Badge variant="outline" className="text-red-500">Near</Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Volume Spike</span>
                            <Badge variant="outline" className="text-muted-foreground">Watching</Badge>
                      </div>
                    </div>
                        <div className="pt-4 border-t">
                          <div className="text-sm text-muted-foreground mb-2">Recommended Sell Zone</div>
                          <div className="text-xl font-bold text-red-500">{(currentRate + 1).toFixed(2)} - {(currentRate + 3).toFixed(2)} LRD</div>
                        </div>
                </CardContent>
              </Card>

              <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Bell className="h-5 w-5 text-primary" />
                          Price Alerts
                        </CardTitle>
                        <CardDescription>Set your targets</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                            <div>
                              <div className="text-sm font-medium">Above {(currentRate + 2).toFixed(2)}</div>
                              <div className="text-xs text-muted-foreground">Sell alert</div>
                            </div>
                            <Badge variant="secondary">Active</Badge>
                                </div>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                            <div>
                              <div className="text-sm font-medium">Below {(currentRate - 2).toFixed(2)}</div>
                              <div className="text-xs text-muted-foreground">Buy alert</div>
                                  </div>
                            <Badge variant="secondary">Active</Badge>
                                </div>
                  </div>
                        <Button className="w-full" variant="outline">
                          <Bell className="h-4 w-4 mr-2" />
                          Add Alert
                        </Button>
                </CardContent>
              </Card>
            </div>
                </TabsContent>

                <TabsContent value="analysis">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                        <CardTitle>Technical Indicators</CardTitle>
                        <CardDescription>Current market technical analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                        <div className="space-y-4">
                          {[
                            { name: "RSI (14)", value: "52.3", signal: "Neutral", color: "text-yellow-500" },
                            { name: "MACD", value: "0.45", signal: "Bullish", color: "text-green-500" },
                            { name: "Stochastic", value: "68.2", signal: "Overbought", color: "text-red-500" },
                            { name: "ADX", value: "23.5", signal: "Trending", color: "text-blue-500" },
                            { name: "CCI", value: "-45.2", signal: "Oversold", color: "text-green-500" },
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

                <Card>
                  <CardHeader>
                        <CardTitle>Market Sentiment</CardTitle>
                        <CardDescription>Based on community reports and trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                        <div className="space-y-6">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Fear</span>
                              <span>Greed</span>
                            </div>
                            <div className="h-4 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 relative">
                              <div 
                                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-primary"
                                style={{ left: "55%" }}
                              />
                            </div>
                            <div className="text-center mt-2">
                              <span className="text-sm font-medium">Neutral</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-500">62%</div>
                              <div className="text-xs text-muted-foreground">Bullish on USD</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-red-500">38%</div>
                              <div className="text-xs text-muted-foreground">Bearish on USD</div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm font-medium">Recent Market Events</div>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Zap className="h-3 w-3 text-yellow-500" />
                                CBL policy announcement expected
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Zap className="h-3 w-3 text-green-500" />
                                Remittance inflows steady
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Zap className="h-3 w-3 text-blue-500" />
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
              <Card className="border-primary/20">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <AlertCircle className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-2">About Our Prediction Model</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        Our ML model combines ARIMA time-series analysis, LSTM neural networks, 
                        and ensemble methods trained on 3+ years of USD/LRD exchange data. 
                        The model considers seasonal patterns, economic indicators, remittance flows, 
                        and regional market trends to generate forecasts.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">ARIMA</Badge>
                        <Badge variant="secondary">LSTM</Badge>
                        <Badge variant="secondary">Random Forest</Badge>
                        <Badge variant="secondary">XGBoost</Badge>
                        <Badge variant="secondary">Ensemble</Badge>
                      </div>
                    </div>
                  </div>
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
