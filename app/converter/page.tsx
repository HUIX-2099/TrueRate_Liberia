"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  ArrowUpDown,
  Copy,
  Check,
  TrendingUp,
  TrendingDown,
  Calculator,
  Banknote,
  CreditCard,
  Building2,
  Smartphone,
  Globe,
  Clock,
  RefreshCw,
  Share2,
  Bell,
  DollarSign,
  Percent,
  Info,
  ChevronRight,
  Sparkles,
  Volume2,
} from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

// Multi-currency support
const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "LRD", name: "Liberian Dollar", symbol: "L$", flag: "🇱🇷" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", flag: "🇳🇬" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵", flag: "🇬🇭" },
  { code: "XOF", name: "CFA Franc", symbol: "CFA", flag: "🌍" },
]

// Exchange rates relative to USD
const ratesFromUSD: Record<string, number> = {
  USD: 1,
  LRD: 192.50, // Updated accurate rate
  EUR: 0.92,
  GBP: 0.79,
  NGN: 1580,
  GHS: 14.85,
  XOF: 603,
}

export default function ConverterPage() {
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("LRD")
  const [amount, setAmount] = useState("100")
  const [result, setResult] = useState("0")
  const [copied, setCopied] = useState(false)
  const [liveRate, setLiveRate] = useState(192.50)
  const [lastUpdate, setLastUpdate] = useState("")
  const [dayChange, setDayChange] = useState(0.85)
  const [loading, setLoading] = useState(false)

  // Fetch live rate
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch("/api/rates/live")
        const data = await res.json()
        if (data.rate) {
          setLiveRate(data.rate)
          ratesFromUSD.LRD = data.rate
        }
        setLastUpdate(new Date().toLocaleTimeString())
      } catch (e) {
        // Use default rate
      }
    }
    fetchRate()
    const interval = setInterval(fetchRate, 60000)
    return () => clearInterval(interval)
  }, [])

  // Calculate conversion
  useEffect(() => {
    const numAmount = parseFloat(amount) || 0
    const fromRate = ratesFromUSD[fromCurrency]
    const toRate = ratesFromUSD[toCurrency]
    const converted = (numAmount / fromRate) * toRate
    setResult(converted.toFixed(2))
  }, [amount, fromCurrency, toCurrency])

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const copyResult = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const speakResult = () => {
    if ("speechSynthesis" in window) {
      const fromC = currencies.find(c => c.code === fromCurrency)
      const toC = currencies.find(c => c.code === toCurrency)
      const text = `${amount} ${fromC?.name} equals ${result} ${toC?.name}`
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "en-US"
      window.speechSynthesis.speak(utterance)
    }
  }

  const quickAmounts = fromCurrency === "USD" 
    ? [10, 20, 50, 100, 500, 1000] 
    : [1000, 5000, 10000, 50000, 100000, 500000]

  const fromC = currencies.find(c => c.code === fromCurrency)!
  const toC = currencies.find(c => c.code === toCurrency)!

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

          <div className="container relative mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-12">
            <div className="text-center mb-8">
              <Badge className="mb-4" variant="secondary">
                <RefreshCw className="h-3 w-3 mr-1" />
                Live Rates • Updated {lastUpdate || "Loading..."}
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-balance">
                Currency <span className="text-primary">Converter</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Instant conversions with real-time rates from 100+ sources. Trusted by thousands in Liberia.
              </p>
            </div>

            {/* Main Converter Card */}
            <Card className="max-w-2xl mx-auto shadow-2xl border-border/50 backdrop-blur-sm bg-card/80">
              <CardContent className="p-4 sm:p-6 md:p-8">
                {/* Live Rate Display */}
                <div className="flex items-center justify-between mb-6 p-3 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Current Rate</div>
                      <div className="font-bold text-lg">{liveRate.toFixed(2)} LRD/USD</div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    dayChange > 0 ? "text-red-500" : "text-green-500"
                  }`}>
                    {dayChange > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {dayChange > 0 ? "+" : ""}{dayChange.toFixed(2)}%
                  </div>
                </div>

                {/* From Currency */}
                <div className="space-y-3 mb-4">
                  <Label className="text-sm font-medium">You Have</Label>
                  <div className="flex gap-2">
                    <select
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value)}
                      className="w-32 sm:w-40 rounded-xl border border-input bg-background px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {currencies.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="flex-1 h-12 text-xl font-bold rounded-xl"
                      placeholder="Enter amount"
                    />
                  </div>
                  {/* Quick amounts */}
                  <div className="flex flex-wrap gap-2">
                    {quickAmounts.map((amt) => (
                      <Button
                        key={amt}
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-xs rounded-full"
                        onClick={() => setAmount(amt.toString())}
                      >
                        {fromC.symbol}{amt.toLocaleString()}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center my-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all hover:bg-primary hover:text-primary-foreground"
                    onClick={swapCurrencies}
                  >
                    <ArrowUpDown className="h-5 w-5" />
                  </Button>
                </div>

                {/* To Currency */}
                <div className="space-y-3 mb-6">
                  <Label className="text-sm font-medium">You Get</Label>
                  <div className="flex gap-2">
                    <select
                      value={toCurrency}
                      onChange={(e) => setToCurrency(e.target.value)}
                      className="w-32 sm:w-40 rounded-xl border border-input bg-background px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {currencies.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <div className="flex-1 relative">
                      <div className="h-12 rounded-xl bg-muted border border-input px-4 flex items-center">
                        <span className="text-xl font-bold text-foreground">{parseFloat(result).toLocaleString()}</span>
                        <span className="ml-2 text-muted-foreground">{toCurrency}</span>
                      </div>
                    </div>
                  </div>
          </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button 
                    className="flex-1 h-12 text-base gap-2" 
                    onClick={copyResult}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied!" : "Copy Result"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 px-4"
                    onClick={speakResult}
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="h-12 px-4">
                    <Share2 className="h-4 w-4" />
                  </Button>
          </div>

                {/* Conversion Rate Info */}
                <div className="mt-6 p-4 rounded-xl bg-muted/50 text-sm">
                  <div className="flex flex-wrap justify-between gap-2 text-muted-foreground">
                    <span>
                      1 {fromCurrency} = {(ratesFromUSD[toCurrency] / ratesFromUSD[fromCurrency]).toFixed(4)} {toCurrency}
                    </span>
                    <span>
                      1 {toCurrency} = {(ratesFromUSD[fromCurrency] / ratesFromUSD[toCurrency]).toFixed(6)} {fromCurrency}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <Tabs defaultValue="tools" className="space-y-8">
              <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
                <TabsTrigger value="tools" className="gap-2">
                  <Calculator className="h-4 w-4" />
                  Quick Tools
                </TabsTrigger>
                <TabsTrigger value="changers" className="gap-2">
                  <Building2 className="h-4 w-4" />
                  Compare Changers
                </TabsTrigger>
                <TabsTrigger value="remittance" className="gap-2">
                  <Globe className="h-4 w-4" />
                  Remittance
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tools" className="space-y-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Business Calculator */}
                  <Card className="group hover:shadow-lg transition-all cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                        <Banknote className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">Business Calculator</CardTitle>
                      <CardDescription>Calculate import costs, taxes, and margins</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Import Value</span>
                          <span className="font-medium">$1,000 → {(1000 * liveRate).toLocaleString()} LRD</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">+ Import Tax (10%)</span>
                          <span className="font-medium">{(100 * liveRate).toLocaleString()} LRD</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="font-medium">Total Cost</span>
                          <span className="font-bold text-primary">{(1100 * liveRate).toLocaleString()} LRD</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Markup Calculator */}
                  <Card className="group hover:shadow-lg transition-all cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-3 group-hover:bg-secondary/20 transition-colors">
                        <Percent className="h-6 w-6 text-secondary" />
                      </div>
                      <CardTitle className="text-lg">Markup Calculator</CardTitle>
                      <CardDescription>Find the best sell price for your goods</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Cost Price</span>
                          <span className="font-medium">50,000 LRD</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">+ Markup (25%)</span>
                          <span className="font-medium">12,500 LRD</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="font-medium">Sell Price</span>
                          <span className="font-bold text-secondary">62,500 LRD</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Price Index */}
                  <Card className="group hover:shadow-lg transition-all cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3 group-hover:bg-amber-500/20 transition-colors">
                        <Sparkles className="h-6 w-6 text-amber-500" />
                      </div>
                      <CardTitle className="text-lg">Price Index</CardTitle>
                      <CardDescription>Common goods prices in USD & LRD</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {[
                          { item: "25kg Rice", usd: 28, lrd: 28 * liveRate },
                          { item: "Gallon of Gas", usd: 4.5, lrd: 4.5 * liveRate },
                          { item: "Cement (50kg)", usd: 12, lrd: 12 * liveRate },
                        ].map((item) => (
                          <div key={item.item} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{item.item}</span>
                            <span className="font-medium">${item.usd} / {item.lrd.toLocaleString()} LRD</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="changers" className="space-y-6">
                <div className="grid gap-4">
                  {[
                    { name: "Apex Exchange", location: "Broad St, Monrovia", buy: liveRate - 1.5, sell: liveRate + 1.5, rating: 4.8 },
                    { name: "Global Money", location: "Carey St", buy: liveRate - 2, sell: liveRate + 2, rating: 4.6 },
                    { name: "Quick Cash", location: "Waterside", buy: liveRate - 2.5, sell: liveRate + 2, rating: 4.5 },
                    { name: "City Exchange", location: "Sinkor", buy: liveRate - 1.8, sell: liveRate + 1.8, rating: 4.7 },
                  ].map((changer, i) => (
                    <Card key={i} className="hover:shadow-md transition-all">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center font-bold text-lg">
                              {i + 1}
                            </div>
                            <div>
                              <div className="font-medium">{changer.name}</div>
                              <div className="text-sm text-muted-foreground">{changer.location}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className="text-xs text-muted-foreground">Buy Rate</div>
                              <div className="font-bold text-green-500">{changer.buy.toFixed(2)}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-muted-foreground">Sell Rate</div>
                              <div className="font-bold text-red-500">{changer.sell.toFixed(2)}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-muted-foreground">Rating</div>
                              <div className="font-bold">⭐ {changer.rating}</div>
                            </div>
                            <Button size="sm" variant="outline" className="hidden sm:flex">
                              View <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="remittance" className="space-y-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "Western Union", fee: "$5", rate: liveRate - 3, time: "Minutes" },
                    { name: "MoneyGram", fee: "$4.99", rate: liveRate - 2.5, time: "Minutes" },
                    { name: "World Remit", fee: "$3.99", rate: liveRate - 1.5, time: "Same Day" },
                    { name: "Orange Money", fee: "2%", rate: liveRate, time: "Instant" },
                    { name: "MTN Mobile Money", fee: "1.5%", rate: liveRate, time: "Instant" },
                    { name: "Bank Transfer", fee: "$15-25", rate: liveRate + 0.5, time: "1-3 Days" },
                  ].map((service) => (
                    <Card key={service.name} className="hover:shadow-lg transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                            {service.name.includes("Mobile") || service.name.includes("Orange") || service.name.includes("MTN") ? (
                              <Smartphone className="h-5 w-5" />
                            ) : service.name.includes("Bank") ? (
                              <Building2 className="h-5 w-5" />
                            ) : (
                              <Globe className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{service.name}</div>
                            <div className="text-xs text-muted-foreground">{service.time}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Fee: </span>
                            <span className="font-medium">{service.fee}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Rate: </span>
                            <span className="font-medium">{service.rate.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="mt-3 p-2 rounded bg-muted text-xs">
                          $100 → <strong>{(100 * service.rate).toLocaleString()} LRD</strong>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 border-t">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Need Rate Alerts?</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Get notified when the rate hits your target. Never miss a good exchange opportunity.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/business">
                <Button size="lg" className="gap-2">
                  <Bell className="h-4 w-4" />
                  Set Rate Alert
                </Button>
              </Link>
              <Link href="/predictions">
                <Button size="lg" variant="outline" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  View Predictions
                </Button>
              </Link>
          </div>
        </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
