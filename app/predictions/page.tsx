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
  Activity,
  BarChart3,
  LineChart,
} from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useLiveRate } from "@/lib/live-rate-context"

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
  const errors: number[] = []
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
  const {
    effectiveRate,
    rate,
    cblRate,
    loading: rateLoading,
    sources,
    timestamp,
    refresh: refreshRate,
  } = useLiveRate()

  const [candles, setCandles] = useState<CandleData[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>("")
  const [predictionExplanation, setPredictionExplanation] = useState<string>("")
  const backtestAccuracy = useMemo(() => computeBacktestAccuracy(candles), [candles])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)

      const [candleRes, predRes] = await Promise.allSettled([
        fetch("/api/rates/candles?days=60"),
        fetch("/api/rates/predictions?days=7"),
      ])

      if (candleRes.status === "fulfilled" && candleRes.value.ok) {
        const candleData = (await candleRes.value.json()) as { candles?: CandleData[] }
        setCandles(candleData.candles ?? [])
      }

      if (predRes.status === "fulfilled" && predRes.value.ok) {
        const predData = (await predRes.value.json()) as {
          predictions?: Prediction[]
          explanation?: string
        }
        setPredictions(predData.predictions ?? [])
        setPredictionExplanation(typeof predData.explanation === "string" ? predData.explanation : "")
      }

      setLastUpdate(new Date().toLocaleTimeString())
    } catch (err) {
      console.error("Predictions fetch error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchData()
    const interval = setInterval(() => void fetchData(), 60_000)
    return () => clearInterval(interval)
  }, [fetchData])

  useEffect(() => {
    if (loading || rateLoading || effectiveRate <= 0) return
    setCandles((prev) => {
      if (prev.length === 0) return prev
      const idx = prev.length - 1
      const last = prev[idx]!
      if (Math.abs(last.close - effectiveRate) < 1e-4) return prev
      const next = [...prev]
      next[idx] = { ...last, close: effectiveRate }
      return next
    })
  }, [effectiveRate, rateLoading, loading])

  const currentRate = effectiveRate

  const trend =
    predictions.length > 1
      ? predictions[predictions.length - 1]!.predicted > predictions[0]!.predicted
        ? "up"
        : "down"
      : null

  const sevenDayHigh =
    candles.length > 0
      ? Math.max(...candles.slice(-7).map((c) => c.high).filter(Number.isFinite))
      : null

  const sevenDayLow =
    candles.length > 0
      ? Math.min(...candles.slice(-7).map((c) => c.low).filter(Number.isFinite))
      : null

  const avgVolume =
    candles.length > 0
      ? Math.round(
          candles.slice(-7).reduce((s, c) => s + (c.volume || 0), 0) / Math.min(candles.length, 7),
        )
      : null

  const handleRefresh = () => {
    void refreshRate()
    void fetchData()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main
        id="main-content"
        className="flex-1 overflow-x-hidden pb-20 md:pb-0"
        role="main"
      >
        <PageHero
          ariaLabel="Rate outlook"
          label="Live Rate Outlook"
          title="Rate Outlook & Planning Guide"
          description="Use short-term outlooks, recent movement, and market context to plan exchange timing, remittances, and everyday money decisions with more confidence."
          variant="centered"
          pill={{
            text: rateLoading ? "Loading rate..." : `${effectiveRate.toFixed(2)} LRD/USD`,
            live: !rateLoading,
          }}
          contentMaxWidth="max-w-4xl"
        >
          <div className="mx-auto mt-6 grid w-full max-w-xl grid-cols-3 gap-2 sm:max-w-2xl sm:gap-3">
            {[
              {
                icon: <TrendingUp className="h-4 w-4 text-emerald-600" />,
                value: sevenDayHigh != null ? sevenDayHigh.toFixed(2) : "—",
                caption: "7D High",
              },
              {
                icon: <TrendingDown className="h-4 w-4 text-rose-600" />,
                value: sevenDayLow != null ? sevenDayLow.toFixed(2) : "—",
                caption: "7D Low",
              },
              {
                icon: <Activity className="h-4 w-4 text-primary" />,
                value: avgVolume != null ? avgVolume.toLocaleString() : "—",
                caption: "Avg Vol",
              },
            ].map((s) => (
              <div
                key={s.caption}
                className="flex flex-col items-center justify-center gap-1 rounded-xl border border-border/50 bg-muted/20 py-3"
              >
                {s.icon}
                <span className="text-lg font-bold tabular-nums text-foreground">{s.value}</span>
                <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {s.caption}
                </span>
              </div>
            ))}
          </div>
        </PageHero>

        {!rateLoading && (
          <div className="border-b border-border/60 bg-muted/30 dark:bg-slate-950/50">
            <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-3 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                    <span className="text-muted-foreground">Market Rate:</span>
                    <strong className="font-mono text-foreground">{rate.toFixed(2)} LRD</strong>
                  </div>
                  {cblRate != null && cblRate > 0 && (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                        <span className="text-muted-foreground">CBL Official:</span>
                        <strong className="font-mono text-foreground">{cblRate.toFixed(2)} LRD</strong>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Spread:</span>
                        <strong className="font-mono text-amber-600">
                          L${Math.abs(rate - cblRate).toFixed(2)}
                        </strong>
                      </div>
                    </>
                  )}
                  {trend && (
                    <div
                      className={`flex items-center gap-1 ${trend === "up" ? "text-rose-600" : "text-emerald-600"}`}
                    >
                      {trend === "up" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span className="text-xs font-medium">
                        7-day forecast: {trend === "up" ? "Rising" : "Falling"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {sources[0] ?? "ExchangeRate-API + CBL"} · Updated{" "}
                    {timestamp ? new Date(timestamp).toLocaleTimeString() : "just now"}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={handleRefresh}
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    {lastUpdate || "Refresh"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <ErrorBoundary>
            <TradingChart
              data={candles}
              predictions={predictions}
              currentRate={currentRate}
            />
          </ErrorBoundary>

          <Tabs defaultValue="outlook">
            <TabsList>
              <TabsTrigger value="outlook">Outlook</TabsTrigger>
              <TabsTrigger value="planning">Planning</TabsTrigger>
              <TabsTrigger value="drivers">Drivers</TabsTrigger>
            </TabsList>

            <TabsContent value="outlook" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Brain className="h-5 w-5 text-primary" />
                    AI Insights
                    <Badge variant="outline" className="ml-2 text-xs">
                      Multiple Models
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Planning Insights — practical outlooks for sending, exchanging, and budgeting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ErrorBoundary>
                    <MLPredictions
                      currentRate={currentRate}
                      explanation={predictionExplanation}
                      backtestAccuracy={backtestAccuracy}
                    />
                  </ErrorBoundary>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="planning" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Planning guidance</CardTitle>
                  <CardDescription>When to exchange, when to wait, and how to plan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  {!rateLoading ? (
                    <>
                      <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
                        <p className="mb-1 font-semibold text-foreground">
                          Today&apos;s rate: L${effectiveRate.toFixed(2)}
                        </p>
                        <p>
                          {cblRate != null && cblRate > 0
                            ? `The market rate is L${Math.abs(rate - cblRate).toFixed(2)} ${rate > cblRate ? "above" : "below"} the CBL official rate of L${cblRate.toFixed(2)}.`
                            : "Compare with the CBL official rate before exchanging large amounts."}
                        </p>
                      </div>
                      <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
                        <p className="mb-1 font-semibold text-foreground">Remittance timing</p>
                        <p>
                          {trend === "up"
                            ? "Forecast shows the LRD may weaken slightly. If you are sending USD to family, they may receive slightly more LRD if the rate continues rising. Monitor over 2–3 days."
                            : trend === "down"
                              ? "Forecast shows the LRD may strengthen. Sending remittances sooner may give your family a better rate."
                              : "Rate outlook is stable. No strong signal to delay or rush your remittance."}
                        </p>
                      </div>
                      <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
                        <p className="mb-1 font-semibold text-foreground">Business planning</p>
                        <p>
                          For import/export businesses, the 7-day outlook helps with invoice timing and FX hedging
                          decisions. Visit the{" "}
                          <a href="/business" className="text-primary hover:underline">
                            Business Dashboard
                          </a>{" "}
                          for detailed tools.
                        </p>
                      </div>
                    </>
                  ) : (
                    <p>Loading rate data...</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="drivers" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Rate drivers</CardTitle>
                  <CardDescription>Key factors influencing the USD/LRD rate today</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {[
                    { label: "CBL monetary policy", impact: "Moderate", color: "text-amber-600" },
                    { label: "Remittance inflows", impact: "Stabilizing", color: "text-emerald-600" },
                    { label: "Import demand (fuel, rice)", impact: "Upward pressure", color: "text-rose-600" },
                    { label: "Export revenue (rubber, iron ore)", impact: "Stabilizing", color: "text-emerald-600" },
                    { label: "Parallel market activity", impact: "Monitor", color: "text-amber-600" },
                  ].map((d) => (
                    <div
                      key={d.label}
                      className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 px-4 py-3"
                    >
                      <span className="text-foreground">{d.label}</span>
                      <span className={`font-medium ${d.color}`}>{d.impact}</span>
                    </div>
                  ))}
                  <p className="pt-2 text-xs text-muted-foreground">
                    Sources: CBL data · ExchangeRate-API · LISGIS · TrueRate market analysis
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="border-border/50 bg-muted/20">
            <CardContent className="pb-4 pt-4">
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Models used:</span>
                {["SMA", "EMA", "Linear Regression", "ARIMA", "Seasonal"].map((m) => (
                  <Badge key={m} variant="outline" className="text-[10px]">
                    {m}
                  </Badge>
                ))}
                <span className="sm:ml-auto">Trained on CBL historical data</span>
              </div>
              {predictionExplanation && (
                <p className="mt-2 text-xs text-muted-foreground">{predictionExplanation}</p>
              )}
              <p className="mt-3 border-t border-border/40 pt-3 text-xs text-muted-foreground">
                Forecasts are indicative only. Verify against live money changers or your bank before exchanging or
                sending money.
              </p>
              <div className="mt-3 flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This page combines recent rate history, short-term model forecasts, and market context to help with
                  budgeting, remittance timing, and exchange planning. It supports practical decisions, not speculative
                  trading.
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Brain className="h-3 w-3 text-primary" />
                  ARIMA
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <LineChart className="h-3 w-3 text-primary" />
                  Ensemble
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <BarChart3 className="h-3 w-3 text-primary" />
                  CBL history
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
