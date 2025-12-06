"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Bell,
  Smartphone,
  Calculator,
  ShoppingCart,
  Truck,
  Building,
  Fuel,
  Wheat,
  Newspaper,
  Clock,
  MapPin,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  Send,
} from "lucide-react"

interface PriceItem {
  name: string
  icon: React.ReactNode
  priceUSD: number
  priceLRD: number
  change: number
  category: string
}

interface NewsItem {
  title: string
  source: string
  time: string
  impact: "positive" | "negative" | "neutral"
  summary: string
}

// Market Price Index
export function PriceIndex({ rate }: { rate: number }) {
  const prices: PriceItem[] = [
    { name: "25kg Rice (Thai)", icon: <Wheat className="h-4 w-4" />, priceUSD: 28, priceLRD: 28 * rate, change: 2.5, category: "food" },
    { name: "25kg Rice (Local)", icon: <Wheat className="h-4 w-4" />, priceUSD: 22, priceLRD: 22 * rate, change: 1.8, category: "food" },
    { name: "Gallon of Gas", icon: <Fuel className="h-4 w-4" />, priceUSD: 4.50, priceLRD: 4.50 * rate, change: -0.5, category: "fuel" },
    { name: "Gallon of Diesel", icon: <Fuel className="h-4 w-4" />, priceUSD: 4.80, priceLRD: 4.80 * rate, change: 0.3, category: "fuel" },
    { name: "Cement (50kg)", icon: <Building className="h-4 w-4" />, priceUSD: 12, priceLRD: 12 * rate, change: 1.2, category: "construction" },
    { name: "Steel Rods (bundle)", icon: <Building className="h-4 w-4" />, priceUSD: 85, priceLRD: 85 * rate, change: 3.5, category: "construction" },
    { name: "Palm Oil (gallon)", icon: <ShoppingCart className="h-4 w-4" />, priceUSD: 8, priceLRD: 8 * rate, change: -1.0, category: "food" },
    { name: "Cooking Gas (14kg)", icon: <Fuel className="h-4 w-4" />, priceUSD: 18, priceLRD: 18 * rate, change: 0, category: "fuel" },
  ]

  const [filter, setFilter] = useState("all")

  const filteredPrices = filter === "all" 
    ? prices 
    : prices.filter(p => p.category === filter)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Liberia Price Index
            </CardTitle>
            <CardDescription>Real-time prices of essential goods</CardDescription>
          </div>
          <Badge variant="secondary">
            Updated Today
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={filter} onValueChange={setFilter} className="mb-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="food">Food</TabsTrigger>
            <TabsTrigger value="fuel">Fuel</TabsTrigger>
            <TabsTrigger value="construction">Build</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="space-y-3">
          {filteredPrices.map((item) => (
            <div 
              key={item.name} 
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs text-muted-foreground">
                    ${item.priceUSD.toFixed(2)} USD
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">{item.priceLRD.toLocaleString()} LRD</div>
                <div className={`text-xs flex items-center gap-1 justify-end ${
                  item.change > 0 ? "text-red-500" : item.change < 0 ? "text-green-500" : "text-muted-foreground"
                }`}>
                  {item.change > 0 ? <TrendingUp className="h-3 w-3" /> : item.change < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                  {item.change > 0 ? "+" : ""}{item.change}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Import/Export Calculator
export function ImportCalculator({ rate }: { rate: number }) {
  const [importValue, setImportValue] = useState("1000")
  const [importTax, setImportTax] = useState("10")
  const [markup, setMarkup] = useState("25")

  const numImport = parseFloat(importValue) || 0
  const numTax = parseFloat(importTax) || 0
  const numMarkup = parseFloat(markup) || 0

  const importCostUSD = numImport
  const taxAmountUSD = (numImport * numTax) / 100
  const totalCostUSD = importCostUSD + taxAmountUSD
  const totalCostLRD = totalCostUSD * rate
  const sellPriceLRD = totalCostLRD * (1 + numMarkup / 100)
  const profitLRD = sellPriceLRD - totalCostLRD

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Import Calculator
        </CardTitle>
        <CardDescription>Calculate your total import costs and profits</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <label className="text-xs font-medium">Import Value (USD)</label>
            <Input 
              type="number" 
              value={importValue}
              onChange={(e) => setImportValue(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium">Import Tax (%)</label>
            <Input 
              type="number" 
              value={importTax}
              onChange={(e) => setImportTax(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium">Markup (%)</label>
            <Input 
              type="number" 
              value={markup}
              onChange={(e) => setMarkup(e.target.value)}
              className="h-10"
            />
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Import Cost</span>
            <span>${importCostUSD.toLocaleString()} USD</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">+ Import Tax ({importTax}%)</span>
            <span>${taxAmountUSD.toLocaleString()} USD</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">= Total Cost</span>
            <span className="font-medium">${totalCostUSD.toLocaleString()} USD</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">In LRD (@ {rate.toFixed(2)})</span>
            <span className="font-medium">{totalCostLRD.toLocaleString()} LRD</span>
          </div>
          <div className="pt-3 border-t space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Sell Price (+ {markup}%)</span>
              <span className="text-lg font-bold text-primary">{sellPriceLRD.toLocaleString()} LRD</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Profit</span>
              <span className="text-green-500 font-medium">+{profitLRD.toLocaleString()} LRD</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// SMS Alert Signup
export function SMSAlertSignup() {
  const [phone, setPhone] = useState("")
  const [targetRate, setTargetRate] = useState("195")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (phone.length >= 10) {
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          SMS Rate Alerts
        </CardTitle>
        <CardDescription>Get alerts when rate hits your target - no internet needed!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-xs font-medium">Phone Number</label>
            <Input 
              type="tel" 
              placeholder="077 XXX XXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium">Alert When Rate Reaches</label>
            <Input 
              type="number" 
              value={targetRate}
              onChange={(e) => setTargetRate(e.target.value)}
              className="h-10"
            />
          </div>
        </div>
        <Button className="w-full gap-2" onClick={handleSubmit} disabled={submitted}>
          {submitted ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Alert Set!
            </>
          ) : (
            <>
              <Bell className="h-4 w-4" />
              Set SMS Alert
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          SMS alerts cost 1 LRD per message. Standard rates apply.
        </p>
      </CardContent>
    </Card>
  )
}

// Market News Feed
export function MarketNews() {
  const news: NewsItem[] = [
    {
      title: "CBL Announces New Foreign Exchange Measures",
      source: "Front Page Africa",
      time: "2 hours ago",
      impact: "neutral",
      summary: "The Central Bank of Liberia has announced new measures to stabilize the foreign exchange market...",
    },
    {
      title: "Remittance Inflows Increase 12% in Q4",
      source: "Daily Observer",
      time: "5 hours ago",
      impact: "positive",
      summary: "Diaspora remittances to Liberia have increased by 12% compared to the previous quarter...",
    },
    {
      title: "Rubber Export Season Begins",
      source: "New Dawn",
      time: "1 day ago",
      impact: "positive",
      summary: "The rubber export season has officially begun, expected to bring in significant foreign currency...",
    },
    {
      title: "Fuel Prices May Rise Next Month",
      source: "The Inquirer",
      time: "1 day ago",
      impact: "negative",
      summary: "LPRC warns that global oil prices may lead to fuel price increases in Liberia...",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          Market News
        </CardTitle>
        <CardDescription>Latest news affecting exchange rates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {news.map((item, i) => (
            <div key={i} className="flex gap-3 pb-4 border-b last:border-0 last:pb-0">
              <div className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${
                item.impact === "positive" ? "bg-green-500" :
                item.impact === "negative" ? "bg-red-500" : "bg-yellow-500"
              }`} />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm leading-tight mb-1">{item.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.summary}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{item.source}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {item.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button variant="ghost" className="w-full mt-4 text-sm">
          View All News <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  )
}

// Inflation Tracker
export function InflationTracker() {
  const monthlyData = [
    { month: "Jul", rate: 8.2 },
    { month: "Aug", rate: 8.5 },
    { month: "Sep", rate: 8.1 },
    { month: "Oct", rate: 7.8 },
    { month: "Nov", rate: 7.5 },
    { month: "Dec", rate: 7.2 },
  ]

  const currentInflation = monthlyData[monthlyData.length - 1].rate
  const previousInflation = monthlyData[monthlyData.length - 2].rate
  const change = currentInflation - previousInflation

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Inflation Rate
            </CardTitle>
            <CardDescription>Year-over-year consumer price index</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{currentInflation}%</div>
            <div className={`text-xs flex items-center gap-1 justify-end ${
              change < 0 ? "text-green-500" : "text-red-500"
            }`}>
              {change < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
              {change > 0 ? "+" : ""}{change.toFixed(1)}% from last month
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {monthlyData.map((item, i) => (
            <div key={item.month} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-8">{item.month}</span>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    i === monthlyData.length - 1 ? "bg-primary" : "bg-primary/50"
                  }`}
                  style={{ width: `${(item.rate / 12) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium w-10 text-right">{item.rate}%</span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
          <strong className="text-foreground">What this means:</strong> Lower inflation is good for the LRD. 
          When inflation decreases, the currency tends to be more stable.
        </div>
      </CardContent>
    </Card>
  )
}

// Quick Rate Share
export function QuickRateShare({ rate }: { rate: number }) {
  const shareText = `USD/LRD Exchange Rate: ${rate.toFixed(2)} LRD per 1 USD\n\nCheck live rates on TrueRate-Liberia`

  const shareViaWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank")
  }

  const shareViaSMS = () => {
    window.open(`sms:?body=${encodeURIComponent(shareText)}`, "_blank")
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Current Rate</div>
            <div className="text-2xl font-bold">{rate.toFixed(2)} LRD/USD</div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={shareViaWhatsApp}>
              Share via WhatsApp
            </Button>
            <Button size="sm" variant="outline" onClick={shareViaSMS}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}



