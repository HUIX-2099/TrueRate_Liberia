"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { TrendingUp, Brain, Target, AlertCircle, Calendar } from "lucide-react"
import { useEffect, useState } from "react"

interface Prediction {
  date: string
  predictedRate: number
  confidence: number
  lower: number
  upper: number
}

interface HistoricalData {
  date: string
  rate: number
}

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState(7)

  useEffect(() => {
    async function fetchPredictions() {
      try {
        const [predResponse, histResponse] = await Promise.all([
          fetch(`/api/rates/predictions?days=${timeframe}`),
          fetch("/api/rates/historical"),
        ])

        const predData = await predResponse.json()
        const histData = await histResponse.json()

        setPredictions(predData.predictions || [])
        setHistoricalData(histData.historical || [])
      } catch (error) {
        console.error("[v0] Error fetching predictions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPredictions()
  }, [timeframe])

  const combinedData = [
    ...historicalData.slice(-30).map((d) => ({
      date: d.date,
      historical: d.rate,
      predicted: null,
      lower: null,
      upper: null,
      type: "historical",
    })),
    ...predictions.map((p) => ({
      date: p.date,
      historical: null,
      predicted: p.predictedRate,
      lower: p.lower,
      upper: p.upper,
      type: "prediction",
      confidence: p.confidence,
    })),
  ]

  const avgPrediction =
    predictions.length > 0 ? predictions.reduce((sum, p) => sum + (p.predictedRate || 0), 0) / predictions.length : 0

  const currentRate = historicalData.length > 0 ? historicalData[historicalData.length - 1]?.rate || 0 : 0

  const predictedChange = currentRate > 0 ? avgPrediction - currentRate : 0
  const predictedChangePercent = currentRate > 0 ? ((predictedChange / currentRate) * 100).toFixed(2) : "0.00"

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
              </div>
              <Badge className="mb-4">ML-Powered Forecasting</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Exchange Rate Predictions</h1>
              <p className="text-lg text-muted-foreground text-pretty">
                AI-powered forecasts using machine learning to predict future USD/LRD exchange rates based on historical
                trends, economic indicators, and market patterns.
              </p>
            </div>
          </div>
        </section>

        {/* Prediction Summary */}
        <section className="py-8 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Current Rate</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{(currentRate || 0).toFixed(2)} LRD</div>
                    <div className="text-sm text-muted-foreground mt-1">Per 1 USD</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Predicted Average ({timeframe} days)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{(avgPrediction || 0).toFixed(2)} LRD</div>
                    <div
                      className={`text-sm font-medium mt-1 flex items-center gap-1 ${
                        predictedChange > 0 ? "text-destructive" : "text-secondary"
                      }`}
                    >
                      <TrendingUp className="h-4 w-4" />
                      {predictedChange > 0 ? "+" : ""}
                      {predictedChangePercent}%
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Model Confidence</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {predictions.length > 0 ? ((predictions[0]?.confidence || 0) * 100).toFixed(0) : 0}%
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">High accuracy</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Prediction Chart */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <CardTitle className="text-2xl">Forecast Visualization</CardTitle>
                      <CardDescription>Historical data and ML predictions with confidence intervals</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={timeframe === 7 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeframe(7)}
                      >
                        7 Days
                      </Button>
                      <Button
                        variant={timeframe === 14 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeframe(14)}
                      >
                        14 Days
                      </Button>
                      <Button
                        variant={timeframe === 30 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeframe(30)}
                      >
                        30 Days
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-[400px] flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-lg font-medium mb-2">Analyzing data...</div>
                        <div className="text-sm text-muted-foreground">Running ML models</div>
                      </div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={combinedData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) =>
                            new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                          }
                        />
                        <YAxis domain={["dataMin - 5", "dataMax + 5"]} tick={{ fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                          labelFormatter={(value) =>
                            new Date(value).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })
                          }
                        />
                        <Legend />
                        <ReferenceLine
                          x={historicalData.length > 0 ? historicalData[historicalData.length - 1].date : ""}
                          stroke="hsl(var(--muted-foreground))"
                          strokeDasharray="3 3"
                          label="Today"
                        />
                        <Area
                          type="monotone"
                          dataKey="upper"
                          stroke="transparent"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.1}
                          name="Upper Bound"
                        />
                        <Area
                          type="monotone"
                          dataKey="lower"
                          stroke="transparent"
                          fill="hsl(var(--background))"
                          fillOpacity={1}
                          name="Lower Bound"
                        />
                        <Line
                          type="monotone"
                          dataKey="historical"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={false}
                          name="Historical Rate"
                        />
                        <Line
                          type="monotone"
                          dataKey="predicted"
                          stroke="hsl(var(--secondary))"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={false}
                          name="Predicted Rate"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Prediction Table */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Daily Predictions</h2>
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-border">
                        <tr>
                          <th className="text-left p-4 font-semibold">Date</th>
                          <th className="text-left p-4 font-semibold">Predicted Rate</th>
                          <th className="text-left p-4 font-semibold">Confidence</th>
                          <th className="text-left p-4 font-semibold">Range</th>
                          <th className="text-left p-4 font-semibold">Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {predictions.map((prediction, index) => {
                          const prevRate =
                            index === 0
                              ? currentRate
                              : predictions[index - 1]?.predictedRate || prediction.predictedRate
                          const change = (prediction.predictedRate || 0) - prevRate
                          const changePercent = prevRate > 0 ? ((change / prevRate) * 100).toFixed(2) : "0.00"

                          return (
                            <tr key={prediction.date} className="border-b border-border last:border-0">
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  {new Date(prediction.date).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </div>
                              </td>
                              <td className="p-4">
                                <span className="font-semibold">{(prediction.predictedRate || 0).toFixed(2)}</span>
                                <span className="text-sm text-muted-foreground ml-1">LRD</span>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-secondary"
                                      style={{ width: `${(prediction.confidence || 0) * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-sm">{((prediction.confidence || 0) * 100).toFixed(0)}%</span>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className="text-sm text-muted-foreground">
                                  {(prediction.lower || 0).toFixed(2)} - {(prediction.upper || 0).toFixed(2)}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className={`font-medium ${change > 0 ? "text-destructive" : "text-secondary"}`}>
                                  {change > 0 ? "+" : ""}
                                  {changePercent}%
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Model Info */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">How Our ML Model Works</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <Target className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Data Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Historical exchange rate data (5+ years)</li>
                      <li>• International financial data APIs</li>
                      <li>• Market changer rates and volumes</li>
                      <li>• Economic indicators (inflation, GDP)</li>
                      <li>• Regional and global market trends</li>
                      <li>• Remittance flow patterns</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Brain className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>ML Techniques</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Time series analysis (ARIMA)</li>
                      <li>• Linear regression with seasonality</li>
                      <li>• Moving average calculations</li>
                      <li>• Confidence interval estimation</li>
                      <li>• Volatility and trend analysis</li>
                      <li>• Real-time model updates</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-6">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <AlertCircle className="h-6 w-6 text-accent flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-2">Important Disclaimer</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        These predictions are generated using machine learning models and should be used for
                        informational purposes only. Actual exchange rates may vary significantly due to unforeseen
                        economic events, policy changes, or market volatility. Always verify current rates before making
                        financial decisions.
                      </p>
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
