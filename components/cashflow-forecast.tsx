"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, PiggyBank, Calendar, ArrowRight } from "lucide-react"
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

interface ForecastData {
  week: string
  usdSales: number
  predictedLRD: number
  bestCaseLRD: number
  worstCaseLRD: number
}

export function CashflowForecast() {
  const { t, isMarketWomanMode } = useLanguage()
  const [weeklySales, setWeeklySales] = useState<string>('')
  const [currentRate, setCurrentRate] = useState<number>(198.5)
  const [predictions, setPredictions] = useState<ForecastData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [liveRes, predRes] = await Promise.all([
          fetch('/api/rates/live'),
          fetch('/api/rates/predictions?days=28')
        ])
        
        const liveData = await liveRes.json()
        const predData = await predRes.json()
        
        setCurrentRate(liveData.rate || 198.5)
        
        // Generate weekly forecast data
        const weeklyPredictions: ForecastData[] = []
        const preds = predData.predictions || []
        
        for (let week = 1; week <= 4; week++) {
          const weekPreds = preds.slice((week - 1) * 7, week * 7)
          if (weekPreds.length > 0) {
            // API returns 'predicted', not 'predictedRate'
            const getRate = (p: { predicted?: number; predictedRate?: number }) => 
              p.predicted || p.predictedRate || currentRate
            
            const avgRate = weekPreds.reduce((sum: number, p: { predicted?: number; predictedRate?: number }) => 
              sum + getRate(p), 0) / weekPreds.length
            const rates = weekPreds.map((p: { predicted?: number; predictedRate?: number }) => getRate(p))
            const minRate = Math.min(...rates)
            const maxRate = Math.max(...rates)
            
            weeklyPredictions.push({
              week: `Week ${week}`,
              usdSales: 0,
              predictedLRD: avgRate,
              bestCaseLRD: minRate,
              worstCaseLRD: maxRate
            })
          }
        }
        
        setPredictions(weeklyPredictions)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-64 bg-muted rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PiggyBank className="h-5 w-5 text-primary" />
          {t('cashflow.title')}
        </CardTitle>
        <CardDescription>{t('cashflow.subtitle')}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm font-medium mb-2 block">{t('cashflow.weeklySales')}</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder="Enter weekly USD sales..."
                value={weeklySales}
                onChange={(e) => setWeeklySales(e.target.value)}
                className={`pl-9 ${isMarketWomanMode ? 'text-xl h-12' : ''}`}
              />
            </div>
          </div>
          
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Current Rate</div>
            <div className="text-xl font-bold">{(currentRate ?? 0).toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">LRD/USD</div>
          </div>
          
          <div className="p-4 bg-secondary/10 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Today's Value</div>
            <div className="text-xl font-bold text-secondary">
              L${currentLRD.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>

        {salesAmount > 0 && (
          <>
            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{t('cashflow.predictedLRD')}</span>
                </div>
                <div className={`${isMarketWomanMode ? 'text-3xl' : 'text-2xl'} font-bold`}>
                  L${nextWeekLRD.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {nextWeekLRD > currentLRD ? (
                    <span className="text-destructive">+L${(nextWeekLRD - currentLRD).toFixed(0)} from today</span>
                  ) : (
                    <span className="text-secondary">-L${(currentLRD - nextWeekLRD).toFixed(0)} from today</span>
                  )}
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Monthly Total (4 weeks)</span>
                </div>
                <div className={`${isMarketWomanMode ? 'text-3xl' : 'text-2xl'} font-bold`}>
                  L${monthlyTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>
              
              <div className="p-4 border rounded-lg bg-accent/10">
                <div className="flex items-center gap-2 mb-2">
                  <PiggyBank className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">{t('cashflow.potentialSavings')}</span>
                </div>
                <div className={`${isMarketWomanMode ? 'text-3xl' : 'text-2xl'} font-bold text-accent`}>
                  L${potentialSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  If you time it right!
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `L$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`L$${value.toLocaleString()}`, '']}
                  />
                  <Area
                    type="monotone"
                    dataKey="worstCaseLRD"
                    stroke="transparent"
                    fill="hsl(var(--destructive))"
                    fillOpacity={0.1}
                    name="Worst Case"
                  />
                  <Area
                    type="monotone"
                    dataKey="bestCaseLRD"
                    stroke="transparent"
                    fill="hsl(var(--secondary))"
                    fillOpacity={0.1}
                    name="Best Case"
                  />
                  <Area
                    type="monotone"
                    dataKey="predictedLRD"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                    strokeWidth={2}
                    name="Predicted LRD"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Weekly Breakdown */}
            <div className="space-y-2">
              <h4 className="font-semibold">Weekly Breakdown</h4>
              <div className="grid gap-2">
                {forecastData.map((data, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{data.week}</Badge>
                      <span className="text-muted-foreground">${salesAmount.toLocaleString()} USD</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">
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
          <div className="text-center py-12 text-muted-foreground">
            <PiggyBank className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Enter your weekly USD sales to see your LRD cashflow forecast</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}



