"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, PiggyBank, Calendar, ArrowRight, Sparkles } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts"

/** Format LRD for chart axis: 8.2B, 250M, 1.5k */
function formatLRDShort(value: number): string {
  if (value >= 1e9) return `L$${(value / 1e9).toFixed(1)}B`
  if (value >= 1e6) return `L$${(value / 1e6).toFixed(1)}M`
  if (value >= 1e3) return `L$${(value / 1e3).toFixed(0)}k`
  return `L$${value.toFixed(0)}`
}

interface ForecastData {
  week: string
  usdSales: number
  predictedLRD: number
  bestCaseLRD: number
  worstCaseLRD: number
}

type CashflowForecastProps = {
  /** LRD per USD from parent (e.g. `useLiveRate().effectiveRate`); if omitted, fetches `/api/rates/live` */
  rate?: number
  /** CBL official rate for context display */
  cblRate?: number
}

export function CashflowForecast({ rate: externalRate, cblRate }: CashflowForecastProps = {}) {
  const { t, isMarketWomanMode } = useLanguage()
  const [weeklySales, setWeeklySales] = useState<string>("")
  const [currentRate, setCurrentRate] = useState<number>(198.5)
  const [predictions, setPredictions] = useState<ForecastData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      try {
        setLoading(true)
        const predRes = await fetch("/api/rates/predictions?days=28")
        const predData = await predRes.json()
        if (cancelled) return

        let baseRate = 198.5
        if (typeof externalRate === "number" && externalRate > 100 && externalRate < 300) {
          baseRate = externalRate
        } else {
          const liveRes = await fetch("/api/rates/live")
          const liveData = await liveRes.json()
          baseRate = typeof liveData.rate === "number" ? liveData.rate : 198.5
        }
        setCurrentRate(baseRate)

        const weeklyPredictions: ForecastData[] = []
        const preds = predData.predictions || []

        const getRate = (p: { predicted?: number; predictedRate?: number }) =>
          p.predicted ?? p.predictedRate ?? baseRate

        for (let week = 1; week <= 4; week++) {
          const weekPreds = preds.slice((week - 1) * 7, week * 7)
          if (weekPreds.length > 0) {
            const avgRate =
              weekPreds.reduce((sum: number, p: { predicted?: number; predictedRate?: number }) => sum + getRate(p), 0) /
              weekPreds.length
            const rates = weekPreds.map((p: { predicted?: number; predictedRate?: number }) => getRate(p))
            const minRate = Math.min(...rates)
            const maxRate = Math.max(...rates)

            weeklyPredictions.push({
              week: `Week ${week}`,
              usdSales: 0,
              predictedLRD: avgRate,
              bestCaseLRD: minRate,
              worstCaseLRD: maxRate,
            })
          }
        }

        setPredictions(weeklyPredictions)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void fetchData()
    return () => {
      cancelled = true
    }
  }, [externalRate])

  const salesAmount = parseFloat(weeklySales) || 0
  
  const forecastData = predictions.map(pred => ({
    ...pred,
    usdSales: salesAmount,
    predictedLRD: salesAmount * pred.predictedLRD,
    bestCaseLRD: salesAmount * pred.bestCaseLRD,
    worstCaseLRD: salesAmount * pred.worstCaseLRD
  }))

  const currentLRD = salesAmount * currentRate
  const nextWeekLRD = forecastData[0]?.predictedLRD || currentLRD
  const monthlyTotal = forecastData.reduce((sum, d) => sum + d.predictedLRD, 0)
  const potentialSavings = Math.max(0, ...forecastData.map(d => d.worstCaseLRD - d.bestCaseLRD))

  if (loading) {
    return (
      <Card className="rounded-2xl border-border/60 shadow-sm animate-pulse overflow-hidden">
        <CardContent className="p-6">
          <div className="h-48 bg-muted/50 rounded-xl" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-2xl border-border/60 shadow-sm overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <PiggyBank className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          {t('cashflow.title')}
        </CardTitle>
        <CardDescription>{t('cashflow.subtitle')}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Input row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <label className="text-sm font-medium text-foreground mb-1.5 block">{t('cashflow.weeklySales')}</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-emerald-600 dark:text-emerald-400" />
              <Input
                type="number"
                placeholder="e.g. 44555554"
                value={weeklySales}
                onChange={(e) => setWeeklySales(e.target.value)}
                className={`pl-9 rounded-lg h-11 ${isMarketWomanMode ? 'text-xl h-12' : ''}`}
              />
            </div>
          </div>
          <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Current Rate</div>
            <div className="text-2xl font-bold tabular-nums">{(currentRate ?? 0).toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">LRD/USD</div>
            {typeof cblRate === "number" && cblRate > 100 && cblRate < 300 && (
              <div className="mt-2 text-xs text-muted-foreground">
                CBL official: <span className="font-medium text-foreground">{cblRate.toFixed(2)}</span>
              </div>
            )}
          </div>
          <div className="p-4 rounded-xl bg-muted/40 border border-border/40 border-secondary/20">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Today&apos;s Value</div>
            <div className="text-xl sm:text-2xl font-bold text-secondary tabular-nums">
              L${currentLRD.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>

        {salesAmount > 0 && (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-border/60 bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">{t('cashflow.predictedLRD')}</span>
                </div>
                <div className={`font-bold tabular-nums ${isMarketWomanMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
                  L${nextWeekLRD.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-xs mt-1.5">
                  {nextWeekLRD >= currentLRD ? (
                    <span className="text-destructive">+L${(nextWeekLRD - currentLRD).toLocaleString(undefined, { maximumFractionDigits: 0 })} from today</span>
                  ) : (
                    <span className="text-destructive">-L${(currentLRD - nextWeekLRD).toLocaleString(undefined, { maximumFractionDigits: 0 })} from today</span>
                  )}
                </div>
              </div>
              <div className="p-4 rounded-xl border border-border/60 bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-muted-foreground">Monthly Total (4 weeks)</span>
                </div>
                <div className={`font-bold tabular-nums ${isMarketWomanMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
                  L${monthlyTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>
              <div className="p-4 rounded-xl border border-secondary/30 bg-secondary/5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm font-medium text-muted-foreground">{t('cashflow.potentialSavings')}</span>
                </div>
                <div className={`font-bold tabular-nums text-secondary ${isMarketWomanMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
                  L${potentialSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">If you time it right!</p>
              </div>
            </div>

            {/* Chart */}
            <div className="rounded-xl border border-border/60 bg-muted/20 p-4 min-h-[260px]">
              <p className="text-sm font-medium text-muted-foreground mb-3">Weekly forecast</p>
              <div className="h-56 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={forecastData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} vertical={false} />
                    <XAxis
                      dataKey="week"
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      axisLine={{ stroke: "var(--border)" }}
                      tickLine={false}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      tickFormatter={(value) => formatLRDShort(value)}
                      width={48}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        color: "var(--card-foreground)",
                      }}
                      formatter={(value) => [`L$${typeof value === "number" ? value.toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0}`, 'LRD']}
                      labelFormatter={(label) => label}
                    />
                    <Area
                      type="monotone"
                      dataKey="worstCaseLRD"
                      stroke="transparent"
                      fill="var(--destructive)"
                      fillOpacity={0.12}
                      name="Worst case"
                    />
                    <Area
                      type="monotone"
                      dataKey="bestCaseLRD"
                      stroke="transparent"
                      fill="var(--secondary)"
                      fillOpacity={0.12}
                      name="Best case"
                    />
                    <Area
                      type="monotone"
                      dataKey="predictedLRD"
                      stroke="var(--primary)"
                      fill="var(--primary)"
                      fillOpacity={0.25}
                      strokeWidth={2}
                      name="Predicted LRD"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Weekly Breakdown */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Weekly Breakdown</h4>
              <div className="grid gap-2">
                {forecastData.map((data, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 sm:px-4 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Badge variant="outline" className="shrink-0 rounded-md font-medium">
                        {data.week}
                      </Badge>
                      <span className="text-sm text-muted-foreground tabular-nums">
                        ${salesAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:pl-4">
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="font-semibold tabular-nums text-foreground">
                        L${data.predictedLRD.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {salesAmount <= 0 && (
          <div className="text-center py-10 px-4 rounded-xl bg-muted/20 border border-dashed border-border/60">
            <PiggyBank className="h-10 w-10 mx-auto mb-3 /60 text-emerald-600 dark:text-emerald-400" />
            <p className="text-sm text-muted-foreground">Enter your weekly USD sales above to see your LRD cashflow forecast</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}



