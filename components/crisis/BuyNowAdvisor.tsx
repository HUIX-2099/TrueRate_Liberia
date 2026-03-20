"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, TrendingUp, TrendingDown, Minus, Clock, AlertTriangle, CheckCircle2, Timer } from "lucide-react"
import { useState, useMemo } from "react"

interface CommodityData {
  id: string
  name: string
  unit: string
  currentPrice: number
  avgPrice30d: number
  trend: "up" | "down" | "stable"
  volatility: "low" | "medium" | "high"
  priceHistory: number[]
  currency: "LRD"
}

const COMMODITY_DATA: CommodityData[] = [
  {
    id: "fuel",
    name: "Fuel (PMS)",
    unit: "gallon",
    currentPrice: 900,
    avgPrice30d: 760,
    trend: "up",
    volatility: "high",
    priceHistory: [700, 700, 720, 750, 780, 800, 850, 900],
    currency: "LRD",
  },
  {
    id: "rice",
    name: "Rice (25kg bag)",
    unit: "bag",
    currentPrice: 4500,
    avgPrice30d: 4100,
    trend: "up",
    volatility: "medium",
    priceHistory: [4000, 4050, 4100, 4150, 4200, 4300, 4400, 4500],
    currency: "LRD",
  },
  {
    id: "palm-oil",
    name: "Palm Oil",
    unit: "gallon",
    currentPrice: 1900,
    avgPrice30d: 1750,
    trend: "up",
    volatility: "medium",
    priceHistory: [1700, 1720, 1750, 1780, 1800, 1850, 1880, 1900],
    currency: "LRD",
  },
  {
    id: "cement",
    name: "Cement",
    unit: "50kg bag",
    currentPrice: 3000,
    avgPrice30d: 2800,
    trend: "up",
    volatility: "low",
    priceHistory: [2700, 2750, 2780, 2800, 2850, 2900, 2950, 3000],
    currency: "LRD",
  },
  {
    id: "cooking-gas",
    name: "Cooking Gas (LPG 14kg)",
    unit: "refill",
    currentPrice: 6200,
    avgPrice30d: 5600,
    trend: "up",
    volatility: "high",
    priceHistory: [5400, 5500, 5500, 5600, 5700, 5900, 6100, 6200],
    currency: "LRD",
  },
  {
    id: "charcoal",
    name: "Charcoal",
    unit: "bag",
    currentPrice: 1600,
    avgPrice30d: 1500,
    trend: "stable",
    volatility: "low",
    priceHistory: [1450, 1480, 1500, 1500, 1520, 1550, 1570, 1600],
    currency: "LRD",
  },
]

type Recommendation = "buy_now" | "wait" | "stock_up" | "find_alternative"

interface BuyAdvice {
  recommendation: Recommendation
  confidence: number
  reasoning: string
  bestDay: string
  priceVsAvg: number
}

function getAdvice(commodity: CommodityData): BuyAdvice {
  const priceVsAvg = ((commodity.currentPrice - commodity.avgPrice30d) / commodity.avgPrice30d) * 100

  const recentTrend = commodity.priceHistory.slice(-4)
  const isAccelerating = recentTrend.every((p, i) => i === 0 || p >= recentTrend[i - 1])

  let recommendation: Recommendation
  let confidence: number
  let reasoning: string

  if (priceVsAvg > 20 && isAccelerating) {
    recommendation = "find_alternative"
    confidence = 0.85
    reasoning = `Price is ${priceVsAvg.toFixed(0)}% above the 30-day average and still rising. Consider cheaper alternatives if available.`
  } else if (priceVsAvg > 10 && commodity.trend === "up") {
    recommendation = "stock_up"
    confidence = 0.75
    reasoning = `Prices are rising and likely to go higher. Buy what you need now to avoid paying even more later.`
  } else if (priceVsAvg > 5) {
    recommendation = "buy_now"
    confidence = 0.65
    reasoning = `Price is above average but not extreme. Buy normal quantities — waiting may not help.`
  } else if (priceVsAvg < -5) {
    recommendation = "stock_up"
    confidence = 0.80
    reasoning = `Price is below the 30-day average! Good time to buy extra if you can afford to.`
  } else {
    recommendation = "wait"
    confidence = 0.55
    reasoning = `Price is near the average. No urgency — buy as needed and watch for deals.`
  }

  const dayOfWeek = new Date().getDay()
  const bestDay = dayOfWeek >= 4 ? "Monday/Tuesday" : "Friday/Saturday"

  return { recommendation, confidence, reasoning, bestDay, priceVsAvg: Number(priceVsAvg.toFixed(1)) }
}

const RECOMMENDATION_STYLES: Record<Recommendation, { bg: string; text: string; label: string; icon: React.ElementType }> = {
  buy_now: { bg: "bg-muted/40 border border-border/40", text: "text-blue-700 dark:text-blue-400", label: "Buy Now", icon: ShoppingCart },
  wait: { bg: "bg-muted/40 border border-border/40", text: "text-green-700 dark:text-green-400", label: "Wait", icon: Timer },
  stock_up: { bg: "bg-muted/40 border border-border/40", text: "text-orange-700 dark:text-orange-400", label: "Stock Up", icon: AlertTriangle },
  find_alternative: { bg: "bg-muted/40 border border-border/40", text: "text-red-700 dark:text-red-400", label: "Find Alternative", icon: TrendingUp },
}

export function BuyNowAdvisor() {
  const [selected, setSelected] = useState(COMMODITY_DATA[0].id)
  const commodity = COMMODITY_DATA.find((c) => c.id === selected) ?? COMMODITY_DATA[0]
  const advice = useMemo(() => getAdvice(commodity), [commodity])
  const style = RECOMMENDATION_STYLES[advice.recommendation]
  const Icon = style.icon

  return (
    <Card className="border-border/40 rounded-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <ShoppingCart className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Should I Buy Now?</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selected} onValueChange={setSelected}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {COMMODITY_DATA.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name} — {c.currentPrice.toLocaleString()} LRD/{c.unit}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className={`p-4 rounded-xl ${style.bg} border border-${style.text.split(" ")[0].replace("text-", "")}/20`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`h-10 w-10 rounded-full ${style.bg} flex items-center justify-center`}>
              <Icon className={`h-5 w-5 ${style.text}`} />
            </div>
            <div>
              <div className={`font-bold ${style.text}`}>{style.label}</div>
              <div className="text-xs text-muted-foreground">
                {Math.round(advice.confidence * 100)}% confidence
              </div>
            </div>
          </div>
          <p className="text-sm">{advice.reasoning}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="text-xs text-muted-foreground mb-1">Current vs 30d avg</div>
            <div className={`font-bold ${advice.priceVsAvg > 0 ? "text-destructive" : "text-green-600"}`}>
              {advice.priceVsAvg > 0 ? "+" : ""}{advice.priceVsAvg}%
            </div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="text-xs text-muted-foreground mb-1">Best day to buy</div>
            <div className="font-bold text-sm">{advice.bestDay}</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="text-xs text-muted-foreground mb-1">Current price</div>
            <div className="font-bold">{commodity.currentPrice.toLocaleString()} LRD</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="text-xs text-muted-foreground mb-1">30-day average</div>
            <div className="font-bold">{commodity.avgPrice30d.toLocaleString()} LRD</div>
          </div>
        </div>

        {/* Mini price chart */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Price trend (8 weeks)</div>
          <div className="flex items-end gap-1 h-16">
            {commodity.priceHistory.map((price, i) => {
              const max = Math.max(...commodity.priceHistory)
              const min = Math.min(...commodity.priceHistory)
              const range = max - min || 1
              const height = ((price - min) / range) * 100
              const isLast = i === commodity.priceHistory.length - 1
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-t transition-all ${isLast ? "bg-primary" : "bg-muted-foreground/20"}`}
                  style={{ height: `${Math.max(10, height)}%` }}
                />
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
