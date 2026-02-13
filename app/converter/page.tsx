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
  MapPin,
  Star,
  Plus,
  Minus,
} from "lucide-react"
import { useEffect, useState, useMemo, useCallback, memo } from "react"
import Link from "next/link"
import { useDebounce, useThrottle, usePerformanceMonitor } from "@/lib/client-utils"

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

const ConverterPageComponent = () => {
  usePerformanceMonitor("ConverterPage")

  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("LRD")
  const [amount, setAmount] = useState("100")
  const [result, setResult] = useState("")
  const [copied, setCopied] = useState(false)
  const [liveRate, setLiveRate] = useState<number | null>(() => {
    if (typeof window === "undefined") return null
    try {
      const cached = window.localStorage.getItem("truerate-live-rate")
      const parsed = cached ? Number.parseFloat(cached) : null
      if (parsed && !Number.isNaN(parsed)) {
        ratesFromUSD.LRD = parsed
        return parsed
      }
    } catch {
      // Ignore localStorage errors
    }
    return null
  })
  const [lastUpdate, setLastUpdate] = useState("")
  const [dayChange, setDayChange] = useState(0.85)
  const [loading, setLoading] = useState(false)
  const [useCustomRate, setUseCustomRate] = useState(false)
  const [customRate, setCustomRate] = useState("")

  // Business Calculator states
  const [importValue, setImportValue] = useState("1000")
  const [importTaxRate, setImportTaxRate] = useState("10")
  const [shippingCost, setShippingCost] = useState("50")

  // Markup Calculator states
  const [costPrice, setCostPrice] = useState("50000")
  const [markupPercentage, setMarkupPercentage] = useState("25")

  // Price Index state
  const [priceIndexCategory, setPriceIndexCategory] = useState("all")

  // Debounced values for performance
  const debouncedAmount = useDebounce(amount, 300)
  const debouncedCustomRate = useDebounce(customRate, 300)

  const isLiveRateReady = typeof liveRate === "number"
  const liveRateValue = liveRate ?? 0
  const formatLrdFromUsd = (usd: number) =>
    isLiveRateReady ? (usd * liveRateValue).toLocaleString() : "—"
  const lrdRate = useCustomRate && Number(customRate)
    ? Number(customRate)
    : typeof liveRate === "number"
      ? liveRate
      : ratesFromUSD.LRD

  // Throttled API call for live rate
  const fetchRate = useThrottle(useCallback(async () => {
    try {
      const res = await fetch("/api/rates/live")
      const data = await res.json()
      if (typeof data.rate === "number") {
        setLiveRate(data.rate)
        ratesFromUSD.LRD = data.rate
        try {
          window.localStorage.setItem("truerate-live-rate", String(data.rate))
        } catch {
          // Ignore localStorage errors
        }
      }
      setLastUpdate(new Date().toLocaleTimeString())
    } catch (e) {
      // Use default rate
    }
  }, []), 30000) // Throttle to max once per 30 seconds

  useEffect(() => {
    fetchRate()
    const interval = setInterval(fetchRate, 60000)
    return () => clearInterval(interval)
  }, [fetchRate])

  useEffect(() => {
    if (!useCustomRate && typeof liveRate === "number") {
      setCustomRate(liveRate.toFixed(2))
    }
  }, [liveRate, useCustomRate])

  // Optimized conversion calculation with debounced values
  const convertedResult = useMemo(() => {
    const numAmount = Math.max(parseFloat(debouncedAmount) || 0, 0)
    const parsedCustomRate = Math.max(Number.parseFloat(debouncedCustomRate) || 0, 0)
    const useRate = useCustomRate && parsedCustomRate > 0 ? parsedCustomRate : liveRate
    const needsLiveRate = fromCurrency === "LRD" || toCurrency === "LRD"
    if (needsLiveRate && typeof useRate !== "number") {
      return ""
    }
    let fromRate = ratesFromUSD[fromCurrency]
    let toRate = ratesFromUSD[toCurrency]
    if (fromCurrency === "USD" && toCurrency === "LRD") {
      toRate = useRate as number
    }
    if (fromCurrency === "LRD" && toCurrency === "USD") {
      fromRate = useRate as number
    }
    return ((numAmount / fromRate) * toRate).toFixed(2)
  }, [debouncedAmount, fromCurrency, toCurrency, debouncedCustomRate, useCustomRate, liveRate])

  useEffect(() => {
    setResult(convertedResult)
  }, [convertedResult])

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const copyResult = async () => {
    try {
      if (!result || Number.isNaN(Number(result))) return
      await navigator.clipboard.writeText(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      setCopied(false)
    }
  }

  const shareResult = async () => {
    const fromC = currencies.find(c => c.code === fromCurrency)
    const toC = currencies.find(c => c.code === toCurrency)
    if (!result || Number.isNaN(Number(result))) return
    const text = `${amount} ${fromC?.code} = ${result} ${toC?.code}`
    try {
      if (navigator.share) {
        await navigator.share({ text })
        return
      }
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      setCopied(false)
    }
  }

  const speakResult = () => {
    if ("speechSynthesis" in window) {
      if (!result || Number.isNaN(Number(result))) return
      const fromC = currencies.find(c => c.code === fromCurrency)
      const toC = currencies.find(c => c.code === toCurrency)
      const text = `${amount} ${fromC?.name} equals ${result} ${toC?.name}`
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "en-US"
      window.speechSynthesis.speak(utterance)
    }
  }

  // Optimized Business Calculator with memoization
  const businessCalculator = useMemo(() => {
    const importValueNum = parseFloat(importValue) || 0
    const importTaxRateNum = parseFloat(importTaxRate) || 0
    const shippingCostNum = parseFloat(shippingCost) || 0
    const importTax = (importValueNum * importTaxRateNum) / 100
    const totalImportCost = importValueNum + importTax + shippingCostNum
    const totalLRD = isLiveRateReady ? totalImportCost * liveRateValue : null

    return {
      importValueNum,
      importTax,
      totalImportCost,
      totalLRD
    }
  }, [importValue, importTaxRate, shippingCost, isLiveRateReady, liveRateValue])

  // Optimized Markup Calculator with memoization
  const markupCalculator = useMemo(() => {
    const costPriceNum = parseFloat(costPrice) || 0
    const markupPercentageNum = parseFloat(markupPercentage) || 0
    const markupAmount = (costPriceNum * markupPercentageNum) / 100
    const sellPrice = costPriceNum + markupAmount

    return {
      costPriceNum,
      markupAmount,
      sellPrice
    }
  }, [costPrice, markupPercentage])

  const quickAmounts = fromCurrency === "USD" 
    ? [10, 20, 50, 100, 500, 1000] 
    : [1000, 5000, 10000, 50000, 100000, 500000]

  const fromC = currencies.find(c => c.code === fromCurrency)!
  const toC = currencies.find(c => c.code === toCurrency)!
  const remittanceAmount = Math.max(parseFloat(amount) || 0, 0)

  const formatUsd = (value: number) => {
    const rounded = Math.round(value * 100) / 100
    const hasCents = Math.abs(rounded % 1) > 0
    return hasCents ? `$${rounded.toFixed(2)}` : `$${rounded.toFixed(0)}`
  }

  const sendwaveFee = "$3.99"

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

          <div className="container relative mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-6 sm:py-8 md:py-12">
            <div className="text-center mb-8">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                <Badge className="gap-2" variant="secondary">
                  <RefreshCw className="h-3 w-3" />
                  Live Rates
                </Badge>
                <Badge className="bg-primary/10 text-primary">Real-time</Badge>
                <Badge variant="secondary">7 Currencies</Badge>
                <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400">No Fees</Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-balance">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Currency Converter
                </span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
                Instant conversions with real-time rates from 100+ sources. Trusted by thousands in Liberia.
              </p>
            </div>

            {/* Main Converter Card */}
            <Card className="max-w-2xl mx-auto shadow-2xl border-border/50 backdrop-blur-sm bg-card/80">
              <CardContent className="p-4 sm:p-6 md:p-8">
                {/* Live Rate Display */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 p-3 sm:p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-muted-foreground">Current Rate</div>
                      <div className="font-bold text-lg">
                        {useCustomRate && Number(customRate)
                          ? Number(customRate).toFixed(2)
                          : isLiveRateReady
                            ? liveRateValue.toFixed(2)
                            : "—"}{" "}
                        LRD/USD
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Market (street) rate • Updated {lastUpdate || "just now"}
                      </div>
                      {useCustomRate && (
                        <div className="text-xs text-muted-foreground">Custom rate active</div>
                      )}
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    dayChange > 0 ? "text-red-500" : "text-green-500"
                  }`}>
                    {dayChange > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {dayChange > 0 ? "+" : ""}{dayChange.toFixed(2)}%
                  </div>
                </div>

                <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-border p-3">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={useCustomRate}
                      onChange={(e) => setUseCustomRate(e.target.checked)}
                    />
                    Use custom USD/LRD rate
                  </label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={customRate}
                    onChange={(e) => setCustomRate(e.target.value)}
                    className="h-10 sm:max-w-[180px]"
                    placeholder="e.g. 185.50"
                    disabled={!useCustomRate}
                  />
                </div>

                {/* From Currency */}
                <div className="space-y-3 mb-4">
                  <Label className="text-sm font-medium">You Have</Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value)}
                      className="w-full sm:w-40 rounded-xl border border-input bg-background px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {currencies.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <Input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.01"
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
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={toCurrency}
                      onChange={(e) => setToCurrency(e.target.value)}
                      className="w-full sm:w-40 rounded-xl border border-input bg-background px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {currencies.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <div className="flex-1 relative">
                      <div className="h-12 rounded-xl bg-muted border border-input px-4 flex items-center">
                        <span className="text-xl font-bold text-foreground">
                          {result ? parseFloat(result).toLocaleString() : "—"}
                        </span>
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
                  <Button variant="outline" className="h-12 px-4" onClick={shareResult}>
                    <Share2 className="h-4 w-4" />
                  </Button>
          </div>

                {/* Conversion Rate Info */}
                <div className="mt-6 p-4 rounded-xl bg-muted/50 text-sm">
                  <div className="flex flex-wrap justify-between gap-2 text-muted-foreground">
                    <span>
                      1 {fromCurrency} = {(
                        (toCurrency === "LRD" ? lrdRate : ratesFromUSD[toCurrency]) /
                        (fromCurrency === "LRD" ? lrdRate : ratesFromUSD[fromCurrency])
                      ).toFixed(4)} {toCurrency}
                    </span>
                    <span>
                      1 {toCurrency} = {(
                        (fromCurrency === "LRD" ? lrdRate : ratesFromUSD[fromCurrency]) /
                        (toCurrency === "LRD" ? lrdRate : ratesFromUSD[toCurrency])
                      ).toFixed(6)} {fromCurrency}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-14 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-10 space-y-3">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                <Badge variant="outline">Essential Tools</Badge>
                <Badge className="bg-primary/10 text-primary">Free Calculators</Badge>
                <Badge variant="secondary">Business Ready</Badge>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-balance">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Conversion Utilities
                </span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
                Helpful calculators and comparisons for daily decisions and business planning.
              </p>
            </div>
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
                  <Card className="group border-primary/20 bg-gradient-to-br from-primary/5 to-card shadow-sm hover:shadow-lg transition-all">
                    <CardHeader className="pb-3">
                      <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                        <Banknote className="h-7 w-7 text-primary" />
                      </div>
                      <CardTitle className="text-lg text-primary">Business Calculator</CardTitle>
                      <CardDescription>Calculate import costs, taxes, and shipping</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Import Value ($)</label>
                          <Input
                            type="number"
                            value={importValue}
                            onChange={(e) => setImportValue(e.target.value)}
                            className="h-8 text-sm"
                            placeholder="1000"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Tax Rate (%)</label>
                          <Input
                            type="number"
                            value={importTaxRate}
                            onChange={(e) => setImportTaxRate(e.target.value)}
                            className="h-8 text-sm"
                            placeholder="10"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Shipping Cost ($)</label>
                        <Input
                          type="number"
                          value={shippingCost}
                          onChange={(e) => setShippingCost(e.target.value)}
                          className="h-8 text-sm"
                          placeholder="50"
                        />
                      </div>
                      <div className="space-y-2 pt-2 border-t">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Import Value</span>
                          <span className="font-medium">
                            ${businessCalculator.importValueNum.toLocaleString()} → {formatLrdFromUsd(businessCalculator.importValueNum)} LRD
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">+ Import Tax ({importTaxRate}%)</span>
                          <span className="font-medium">{businessCalculator.importTax.toLocaleString()} LRD</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">+ Shipping</span>
                          <span className="font-medium">{formatLrdFromUsd(parseFloat(shippingCost) || 0)} LRD</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="font-medium">Total Cost</span>
                          <span className="font-bold text-primary">
                            {businessCalculator.totalLRD === null ? "—" : `${businessCalculator.totalLRD.toLocaleString()} LRD`}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Markup Calculator */}
                  <Card className="group border-secondary/20 bg-gradient-to-br from-secondary/5 to-card shadow-sm hover:shadow-lg transition-all">
                    <CardHeader className="pb-3">
                      <div className="h-14 w-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-3 group-hover:bg-secondary/20 transition-colors">
                        <Percent className="h-7 w-7 text-secondary" />
                      </div>
                      <CardTitle className="text-lg text-secondary">Markup Calculator</CardTitle>
                      <CardDescription>Find the best sell price for your goods</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Cost Price (LRD)</label>
                          <Input
                            type="number"
                            value={costPrice}
                            onChange={(e) => setCostPrice(e.target.value)}
                            className="h-8 text-sm"
                            placeholder="50000"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Markup (%)</label>
                          <Input
                            type="number"
                            value={markupPercentage}
                            onChange={(e) => setMarkupPercentage(e.target.value)}
                            className="h-8 text-sm"
                            placeholder="25"
                          />
                        </div>
                      </div>
                      <div className="space-y-2 pt-2 border-t">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Cost Price</span>
                          <span className="font-medium">{markupCalculator.costPriceNum.toLocaleString()} LRD</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">+ Markup ({markupPercentage}%)</span>
                          <span className="font-medium">{markupCalculator.markupAmount.toLocaleString()} LRD</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="font-medium">Sell Price</span>
                          <span className="font-bold text-secondary">{markupCalculator.sellPrice.toLocaleString()} LRD</span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Profit Margin</span>
                          <span>{((markupCalculator.markupAmount / markupCalculator.sellPrice) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Price Index */}
                  <Card className="group border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-card shadow-sm hover:shadow-lg transition-all">
                    <CardHeader className="pb-3">
                      <div className="h-14 w-14 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3 group-hover:bg-amber-500/20 transition-colors">
                        <Sparkles className="h-7 w-7 text-amber-600" />
                      </div>
                      <CardTitle className="text-lg text-amber-600">Price Index</CardTitle>
                      <CardDescription>Common goods prices in USD & LRD</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Tabs value={priceIndexCategory} onValueChange={setPriceIndexCategory} className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                          <TabsTrigger value="food" className="text-xs">Food</TabsTrigger>
                          <TabsTrigger value="building" className="text-xs">Building</TabsTrigger>
                        </TabsList>
                        <TabsContent value="all" className="space-y-2 mt-3">
                          {[
                            { item: "25kg Rice (Thai)", usd: 28, category: "food" },
                            { item: "25kg Rice (Local)", usd: 15, category: "food" },
                            { item: "Gallon of Gas", usd: 4.5, category: "fuel" },
                            { item: "Gallon of Diesel", usd: 4.33, category: "fuel" },
                            { item: "Cement (50kg)", usd: 12, category: "building" },
                            { item: "Steel Rods (bundle)", usd: 400, category: "building" },
                            { item: "Palm Oil (gallon)", usd: 5.5, category: "food" },
                            { item: "Cooking Gas (14kg)", usd: 20, category: "fuel" },
                          ].map((item) => (
                            <div key={item.item} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{item.item}</span>
                              <span className="font-medium">${item.usd} / {formatLrdFromUsd(item.usd)} LRD</span>
                            </div>
                          ))}
                        </TabsContent>
                        <TabsContent value="food" className="space-y-2 mt-3">
                          {[
                            { item: "25kg Rice (Thai)", usd: 28 },
                            { item: "25kg Rice (Local)", usd: 15 },
                            { item: "Palm Oil (gallon)", usd: 5.5 },
                          ].map((item) => (
                            <div key={item.item} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{item.item}</span>
                              <span className="font-medium">${item.usd} / {formatLrdFromUsd(item.usd)} LRD</span>
                            </div>
                          ))}
                        </TabsContent>
                        <TabsContent value="building" className="space-y-2 mt-3">
                          {[
                            { item: "Cement (50kg)", usd: 12 },
                            { item: "Steel Rods (bundle)", usd: 400 },
                          ].map((item) => (
                            <div key={item.item} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{item.item}</span>
                              <span className="font-medium">${item.usd} / {formatLrdFromUsd(item.usd)} LRD</span>
                            </div>
                          ))}
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="changers" className="space-y-6">
                <div className="text-center mb-6 p-4 rounded-xl bg-muted/50">
                  <div className="text-sm text-muted-foreground mb-2">Best Buy/Sell Rates Today</div>
                  <div className="text-lg font-bold">Compare verified money changers across Monrovia</div>
                </div>
                <div className="grid gap-4">
                    {[
                    { name: "Liberty Exchange", location: "Broad St, Monrovia", buy: liveRateValue - 1.2, sell: liveRateValue + 1.8, rating: 4.9, verified: true, reviews: 234 },
                    { name: "Apex Exchange", location: "Carey St, Old Road", buy: liveRateValue - 1.5, sell: liveRateValue + 1.5, rating: 4.8, verified: true, reviews: 189 },
                    { name: "Global Money", location: "Waterside Market", buy: liveRateValue - 2.0, sell: liveRateValue + 2.0, rating: 4.6, verified: true, reviews: 142 },
                    { name: "Red Light Bureau", location: "Red Light Market", buy: liveRateValue - 2.2, sell: liveRateValue + 1.8, rating: 4.5, verified: false, reviews: 98 },
                    { name: "Paynesville Exchange", location: "Paynesville", buy: liveRateValue - 2.5, sell: liveRateValue + 2.2, rating: 4.4, verified: true, reviews: 87 },
                  ].map((changer, i) => (
                    <Card key={i} className={`border-border/60 shadow-sm hover:shadow-md transition-all ${changer.verified ? 'border-green-200 bg-green-50/30 dark:bg-green-950/20' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-lg ${changer.verified ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-muted'}`}>
                              {i + 1}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <div className="font-medium">{changer.name}</div>
                                {changer.verified && (
                                  <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                                    ✓ Verified
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {changer.location}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 sm:gap-6">
                            <div className="text-center">
                              <div className="text-xs text-muted-foreground">Buy Rate</div>
                              <div className="font-bold text-green-600">
                                {isLiveRateReady ? changer.buy.toFixed(2) : "—"}
                              </div>
                              <div className="text-xs text-green-600/70">You get more LRD</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-muted-foreground">Sell Rate</div>
                              <div className="font-bold text-red-600">
                                {isLiveRateReady ? changer.sell.toFixed(2) : "—"}
                              </div>
                              <div className="text-xs text-red-600/70">They pay less</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-muted-foreground">Rating</div>
                              <div className="font-bold flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                {changer.rating}
                              </div>
                              <div className="text-xs text-muted-foreground">{changer.reviews} reviews</div>
                            </div>
                            <Button size="sm" variant="outline" className="hidden sm:flex">
                              View Details <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-card">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-amber-600 mb-1">Pro Tip: Best Times to Exchange</div>
                        <div className="text-sm text-muted-foreground">
                          Rates are typically best between 10 AM - 12 PM and 2 PM - 4 PM when business activity is highest.
                          Monday through Thursday usually offer better rates than weekends.
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="remittance" className="space-y-6">
                <div className="text-center mb-6 p-4 rounded-xl bg-muted/50">
                  <div className="text-sm text-muted-foreground mb-2">Send Money Home Safely</div>
                  <div className="text-lg font-bold">Compare remittance services and fees</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Sending ${remittanceAmount.toLocaleString()} USD to Liberia
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                    { name: "Western Union", fee: "$5", rate: liveRateValue - 3, time: "5-10 Minutes", logoUrl: "/logos/unnamed.png", type: "agent", popular: false },
                    { name: "MoneyGram", fee: "$4.99", rate: liveRateValue - 2.5, time: "10-15 Minutes", logoUrl: "/logos/png-clipart-moneygram-international-inc-logo-money-transfer-western-union-international-tourism-text-trademark.png", type: "agent", popular: false },
                    { name: "Sendwave", fee: sendwaveFee, rate: liveRateValue - 1.5, time: "Same Day", logoUrl: "/logos/images.jpeg", type: "mobile", popular: true },
                    { name: "Orange Money", fee: "2%", rate: liveRateValue, time: "Instant", logoUrl: "/logos/orangemoney.png", type: "mobile", popular: false },
                    { name: "MTN Mobile Money", fee: "1.5%", rate: liveRateValue, time: "Instant", logoUrl: "/logos/mtn-momo-mobile-money-uganda-logo-png_seeklogo-556395.png", type: "mobile", popular: true },
                    { name: "Bank Transfer", fee: "$15-25", rate: liveRateValue + 0.5, time: "1-3 Business Days", logoUrl: null, type: "bank", popular: false },
                  ].map((service) => {
                    const feeAmount = service.fee.includes('%')
                      ? (remittanceAmount * parseFloat(service.fee.replace('%', '')) / 100)
                      : parseFloat(service.fee.replace('$', ''))
                    const totalReceived = isLiveRateReady ? (remittanceAmount * service.rate) - feeAmount : null
                    const feeDisplay = service.fee.includes('%')
                      ? `$${(remittanceAmount * parseFloat(service.fee.replace('%', '')) / 100).toFixed(2)} (${service.fee})`
                      : service.fee

                    return (
                      <Card key={service.name} className={`border-border/60 shadow-sm hover:shadow-lg transition-all ${service.popular ? 'border-primary/30 bg-primary/5' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                              {service.logoUrl ? (
                                <img
                                  src={service.logoUrl}
                                  alt={`${service.name} logo`}
                                  className="h-full w-full object-contain p-1"
                                  loading="lazy"
                                  referrerPolicy="no-referrer"
                                  crossOrigin="anonymous"
                                />
                              ) : service.type === "mobile" ? (
                                <Smartphone className="h-5 w-5" />
                              ) : service.type === "bank" ? (
                                <Building2 className="h-5 w-5" />
                              ) : (
                                <Globe className="h-5 w-5" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <div className="font-medium">{service.name}</div>
                                {service.popular && (
                                  <Badge className="text-xs bg-primary/20 text-primary border-primary/30">
                                    Popular
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {service.time}
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            <div>
                              <span className="text-muted-foreground">Transfer Fee: </span>
                              <span className="font-medium">{feeDisplay}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Exchange Rate: </span>
                              <span className="font-medium">
                                {isLiveRateReady ? service.rate.toFixed(2) : "—"}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="p-2 rounded bg-muted/70 text-xs">
                              <div className="flex justify-between">
                                <span>You send:</span>
                                <strong>{formatUsd(remittanceAmount)}</strong>
                              </div>
                              <div className="flex justify-between">
                                <span>Fee:</span>
                                <span className="text-red-600">-{feeDisplay}</span>
                              </div>
                              <div className="flex justify-between border-t pt-1 mt-1">
                                <span>They receive:</span>
                                <strong className="text-green-600">
                                  {totalReceived === null ? "—" : `${totalReceived.toLocaleString()} LRD`}
                                </strong>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground text-center">
                              Total cost: ${(remittanceAmount + (service.fee.includes('%') ? 0 : parseFloat(service.fee.replace('$', '')))).toFixed(2)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
                <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-card">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-blue-600 mb-1">💡 Smart Remittance Tips</div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>• Mobile money services (MTN, Orange) often have the best rates and lowest fees</div>
                          <div>• Agent-based services (Western Union, MoneyGram) are good for urgent transfers</div>
                          <div>• Always compare the total cost, not just the exchange rate</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Rate Highlights */}
        <section className="py-10 sm:py-12 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl mx-auto text-center mb-8 space-y-3">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                <Badge variant="outline">Market Overview</Badge>
                <Badge className="bg-primary/10 text-primary">Live Data</Badge>
                <Badge variant="secondary">Daily Summary</Badge>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-balance">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Rate Highlights
                </span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Quick context around today's USD/LRD market activity and key insights.
              </p>
            </div>
            <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-3">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-card shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </div>
                    <CardTitle className="text-base text-primary">Live USD/LRD</CardTitle>
                  </div>
                  <CardDescription className="text-primary/70">Updated {lastUpdate || "just now"}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-primary">
                    {isLiveRateReady ? liveRateValue.toFixed(2) : "—"}
                  </div>
                  <div className="text-xs text-primary/70 mt-1">LRD per USD</div>
                </CardContent>
              </Card>
              <Card className={`border-border/60 shadow-sm ${dayChange > 0 ? 'border-red-200 bg-red-50/50 dark:bg-red-950/20' : 'border-green-200 bg-green-50/50 dark:bg-green-950/20'}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    {dayChange > 0 ? (
                      <TrendingUp className="h-4 w-4 text-red-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-green-600" />
                    )}
                    <CardTitle className={`text-base ${dayChange > 0 ? "text-red-700 dark:text-red-400" : "text-green-700 dark:text-green-400"}`}>
                      Today's Change
                    </CardTitle>
                  </div>
                  <CardDescription className={`${dayChange > 0 ? "text-red-600/70" : "text-green-600/70"}`}>
                    Intraday movement
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className={`text-3xl font-bold ${dayChange > 0 ? "text-red-600" : "text-green-600"}`}>
                    {dayChange > 0 ? "+" : ""}{dayChange.toFixed(2)}%
                  </div>
                  <div className={`text-xs ${dayChange > 0 ? "text-red-600/70" : "text-green-600/70"} mt-1`}>
                    {dayChange > 0 ? "Rate increased" : "Rate decreased"}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-secondary/20 bg-gradient-to-br from-secondary/5 to-card shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-secondary" />
                    <CardTitle className="text-base text-secondary">Compare Locations</CardTitle>
                  </div>
                  <CardDescription className="text-secondary/70">Find the best local rates</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Link href="/map" className="inline-flex items-center text-sm text-secondary font-medium hover:underline">
                    Open Rate Map <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                  <div className="text-xs text-secondary/70 mt-1">Interactive map view</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-14 md:py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-t">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
              <Badge variant="outline">Stay Informed</Badge>
              <Badge className="bg-primary/10 text-primary">Smart Alerts</Badge>
              <Badge variant="secondary">Never Miss</Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-balance">
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Need Rate Alerts?
              </span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto text-sm sm:text-base">
              Get notified when the rate hits your target. Never miss a good exchange opportunity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/business">
                <Button size="lg" className="gap-2 shadow-sm">
                  <Bell className="h-4 w-4" />
                  Set Rate Alert
                </Button>
              </Link>
              <Link href="/predictions">
                <Button size="lg" variant="outline" className="gap-2 shadow-sm">
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

export default memo(ConverterPageComponent)
