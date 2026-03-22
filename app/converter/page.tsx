"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageHero } from "@/components/layout/page-hero"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CurrencyIcon } from "@/components/currency-icon"
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
  Percent,
  Info,
  ChevronRight,
  Volume2,
  MapPin,
  Star,
  Plus,
  Minus,
} from "lucide-react"
import { useEffect, useState, useMemo, useCallback, memo } from "react"
import Link from "next/link"
import { useDebounce, useThrottle, usePerformanceMonitor } from "@/lib/client-utils"
import { useLiveRate } from "@/lib/live-rate-context"
import { RateSourceAttribution } from "@/components/rate-source-attribution"
import { RateFeedbackButtons } from "@/components/rate-feedback-buttons"
import { StaleRateWarning } from "@/components/stale-rate-warning"
import { OfflineBanner } from "@/components/offline-banner"
import { ErrorBoundary } from "@/components/error-boundary"
import { RateChangeAnimation } from "@/components/rate-change-animation"
import { RateBrief } from "@/components/rate-brief"
import { RateComparisonCallout } from "@/components/rate-comparison-callout"
import { PlanInLRD } from "@/components/plan-in-lrd"
import { RateTip } from "@/components/rate-tip"
import { RateSourceSelector } from "@/components/rate-source-selector"
import { TrueRateScore } from "@/components/true-rate-score"
import { RateAlertSetter } from "@/components/rate-alert-setter"
import { PriceIndex } from "@/components/liberia-features"
import { useLanguage } from "@/lib/i18n/language-context"
import { getTranslation } from "@/lib/i18n/translations"

// Multi-currency support
const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "LRD", name: "Liberian Dollar", symbol: "L$", flag: "🇱🇷" },
  { code: "SLL", name: "Sierra Leone Leone", symbol: "Le", flag: "🇸🇱" },
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
  SLL: 22000, // Sierra Leone Leone (approximate)
  EUR: 0.92,
  GBP: 0.79,
  NGN: 1580,
  GHS: 14.85,
  XOF: 603,
}

const RATE_CURRENT_IS_SOURCE_KEY = "rate.currentIsSource"

const ConverterPageComponent = () => {
  usePerformanceMonitor("ConverterPage")

  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  // Use stable default (en) until mounted to avoid server/client hydration mismatch from language in localStorage
  const currentIsSourceText = mounted ? t(RATE_CURRENT_IS_SOURCE_KEY) : getTranslation("en", RATE_CURRENT_IS_SOURCE_KEY)
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("LRD")
  const [amount, setAmount] = useState("100")
  const [result, setResult] = useState("")
  const [copied, setCopied] = useState(false)
  const { rate: contextLrdRate, sources: rateSources, timestamp: rateTimestamp, cblRate: contextCblRate, cblLastUpdated: contextCblLastUpdated, refresh: refreshLiveRate, effectiveRate: contextEffectiveRate } = useLiveRate()
  const [liveRates, setLiveRates] = useState<Record<string, number> | null>(null)
  // Same rate for convert, plan, compare: always use live context effective rate for LRD (market vs official by user choice).
  const liveRate = typeof contextEffectiveRate === "number" ? contextEffectiveRate : (liveRates?.LRD ?? null)
  const [lastUpdate, setLastUpdate] = useState("")
  const [lastUpdateLabel, setLastUpdateLabel] = useState<string | undefined>(undefined)
  useEffect(() => {
    if (!rateTimestamp) { setLastUpdateLabel(undefined); return }
    function tick() {
      try {
        const d = new Date(rateTimestamp)
        const diff = (Date.now() - d.getTime()) / 60_000
        if (diff < 60) setLastUpdateLabel(`${Math.floor(diff)}m ago`)
        else setLastUpdateLabel(d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }))
      } catch { setLastUpdateLabel(undefined) }
    }
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [rateTimestamp])
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


  // Debounced values for performance
  const debouncedAmount = useDebounce(amount, 300)
  const debouncedCustomRate = useDebounce(customRate, 300)

  const isLiveRateReady = typeof liveRate === "number"
  const liveRateValue = liveRate ?? 0
  const formatLrdFromUsd = (usd: number) =>
    isLiveRateReady ? (usd * liveRateValue).toLocaleString() : "—"
  const effectiveRates: Record<string, number> = {
    ...ratesFromUSD,
    ...(liveRates ?? {}),
    LRD: typeof contextEffectiveRate === "number" ? contextEffectiveRate : (liveRates?.LRD ?? ratesFromUSD.LRD),
  }

  // Throttled API call for live rates (all currencies)
  const fetchRate = useThrottle(useCallback(async () => {
    try {
      const res = await fetch("/api/rates/multi")
      const data = await res.json()
      if (data?.rates && typeof data.rates === "object") {
        setLiveRates(data.rates)
        try {
          window.localStorage.setItem("truerate-live-rates", JSON.stringify(data.rates))
        } catch {
          // Ignore localStorage errors
        }
      }
      setLastUpdate(new Date().toLocaleTimeString())
    } catch (e) {
      // Use default rates
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

  const getRate = (code: string) =>
    useCustomRate && code === "LRD" && Number(customRate)
      ? Number(customRate)
      : effectiveRates[code] ?? ratesFromUSD[code]

  // Optimized conversion calculation with debounced values
  const convertedResult = useMemo(() => {
    const numAmount = Math.max(parseFloat(debouncedAmount) || 0, 0)
    const fromRate = getRate(fromCurrency)
    const toRate = getRate(toCurrency)
    if (!fromRate || !toRate) return ""
    return ((numAmount / fromRate) * toRate).toFixed(2)
  }, [debouncedAmount, fromCurrency, toCurrency, liveRates, contextEffectiveRate, useCustomRate, customRate])

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
      <ErrorBoundary>
      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
        <PageHero
          ariaLabel="Currency converter"
          label="Live Rates"
          title="Currency Converter"
          description="Convert with live rates from verified sources so you can make clear, confident money decisions."
          variant="centered"
          badges={
            <>
              <Badge className="gap-2" variant="secondary">
                <RefreshCw className="h-3 w-3 text-muted-foreground" />
                Live Rates
              </Badge>
              <Badge className="bg-primary/10 text-primary">Real-time</Badge>
              <Badge variant="secondary">7 Currencies</Badge>
              <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400">No Fees</Badge>
            </>
          }
          contentMaxWidth="max-w-4xl"
        >
          <OfflineBanner
              lastUpdatedLabel={lastUpdateLabel}
              className="max-w-2xl mx-auto mb-4"
            />
            {/* Main Converter Card */}
            <Card className="max-w-2xl mx-auto shadow-2xl border-border/50 backdrop-blur-sm bg-card/80">
              <CardContent className="p-4 sm:p-6 md:p-8">
                {/* Live Rate Display */}
                <div className="mb-6 rounded-2xl border border-border/60 shadow-sm">
                  <div className="p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" aria-hidden />
                          Current Rate
                        </div>
                        <div className="mt-2 flex items-baseline gap-3 flex-wrap">
                          <span className="font-bold text-3xl sm:text-[2rem] tabular-nums tracking-tight text-foreground">
                            {useCustomRate && Number(customRate)
                              ? Number(customRate).toFixed(2)
                              : isLiveRateReady
                                ? (
                                    <RateChangeAnimation rate={liveRateValue}>
                                      {liveRateValue.toFixed(2)}
                                    </RateChangeAnimation>
                                  )
                                : "—"}{" "}
                            <span className="text-lg font-semibold text-muted-foreground">LRD/USD</span>
                          </span>
                          {!useCustomRate && (
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-sm font-medium ${ dayChange > 0 ? "text-red-600 bg-muted/40 border border-border/40 dark:bg-red-500/20" : "text-green-600 bg-muted/40 border border-border/40 dark:bg-green-500/20" }`}>
                              {dayChange > 0 ? <TrendingUp className="h-3.5 w-3.5 text-green-600 dark:text-green-400" /> : <TrendingDown className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />}
                              {dayChange > 0 ? "+" : ""}{dayChange.toFixed(2)}%
                            </span>
                          )}
                        </div>
                        {useCustomRate && (
                          <p className="text-xs text-muted-foreground mt-1.5">Custom rate active</p>
                        )}
                      </div>
                    </div>

                    {!useCustomRate && (
                      <>
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <RateSourceSelector variant="pills" />
                          <RateSourceAttribution
                            sources={rateSources}
                            timestamp={rateTimestamp}
                            cblRate={contextCblRate}
                            cblLastUpdated={contextCblLastUpdated}
                            compositeRate={isLiveRateReady ? liveRateValue : undefined}
                            compact
                          />
                        </div>

                        {isLiveRateReady && (
                          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="rounded-lg border border-border/50 bg-muted/40 px-3 py-2 text-sm">
                              <span className="text-muted-foreground">Market</span>
                              <span className="ml-2 font-semibold tabular-nums">
                                {contextLrdRate != null ? contextLrdRate.toFixed(2) : "—"} LRD/USD
                              </span>
                            </div>
                            <div className="rounded-lg border border-border/50 bg-muted/40 px-3 py-2 text-sm">
                              <span className="text-muted-foreground">Official (CBL)</span>
                              <span className="ml-2 font-semibold tabular-nums">
                                {contextCblRate != null && contextCblRate > 0 ? contextCblRate.toFixed(2) : "—"} LRD/USD
                              </span>
                            </div>
                          </div>
                        )}

                        <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{currentIsSourceText}</p>

                        <div className="mt-4 pt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/50">
                          <StaleRateWarning timestamp={rateTimestamp} onRefresh={refreshLiveRate} compact />
                          <RateFeedbackButtons
                            rate={isLiveRateReady ? liveRateValue : undefined}
                            compact
                          />
                          <RateBrief variant="inline" />
                        </div>

                        <div className="mt-3">
                          <RateTip className="text-xs" />
                        </div>
                      </>
                    )}
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
                    <Select value={fromCurrency} onValueChange={setFromCurrency}>
                      <SelectTrigger className="w-full sm:w-44 h-12 rounded-xl gap-2 text-primary">
                        <SelectValue>
                          <span className="flex items-center gap-2">
                            <CurrencyIcon code={fromCurrency} flag={fromC.flag} size="default" />
                            <span>{fromC.code}</span>
                            <span className="text-muted-foreground hidden sm:inline">· {fromC.name}</span>
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            <span className="flex items-center gap-2">
                              <CurrencyIcon code={c.code} flag={c.flag} size="default" />
                              <span>{c.code}</span>
                              <span className="text-muted-foreground">· {c.name}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <ArrowUpDown className="h-5 w-5 text-primary" />
                  </Button>
                </div>

                {/* To Currency */}
                <div className="space-y-3 mb-6">
                  <Label className="text-sm font-medium">{toCurrency === "LRD" ? "Amount in LRD" : "You Get"}</Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Select value={toCurrency} onValueChange={setToCurrency}>
                      <SelectTrigger className="w-full sm:w-44 h-12 rounded-xl gap-2 text-primary">
                        <SelectValue>
                          <span className="flex items-center gap-2">
                            <CurrencyIcon code={toCurrency} flag={toC.flag} size="default" />
                            <span>{toC.code}</span>
                            <span className="text-muted-foreground hidden sm:inline">· {toC.name}</span>
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            <span className="flex items-center gap-2">
                              <CurrencyIcon code={c.code} flag={c.flag} size="default" />
                              <span>{c.code}</span>
                              <span className="text-muted-foreground">· {c.name}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex-1 relative">
                      <div className="h-12 rounded-xl bg-muted border border-input px-4 flex items-center gap-2">
                        <CurrencyIcon code={toCurrency} flag={toC.flag} size="sm" />
                        <span className="text-xl font-bold text-foreground">
                          {result ? parseFloat(result).toLocaleString() : "—"}
                        </span>
                        <span className="ml-1 text-muted-foreground text-sm">{toCurrency}</span>
                      </div>
                    </div>
                  </div>
                  {fromCurrency === "USD" && toCurrency === "LRD" && result && !Number.isNaN(parseFloat(result)) && (
                    <>
                      <p className="text-sm text-muted-foreground mt-2">
                        Your {parseFloat(amount) || 0} USD is worth {toC.symbol}{parseFloat(result).toLocaleString()} today.
                      </p>
                      {isLiveRateReady && (
                        <RateComparisonCallout
                          currentRate={liveRateValue}
                          usdAmount={parseFloat(amount) || undefined}
                          compact
                          className="mt-2"
                        />
                      )}
                    </>
                  )}
                  {fromCurrency === "LRD" && toCurrency === "USD" && result && !Number.isNaN(parseFloat(result)) && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Your {parseFloat(amount) || 0} LRD is worth {toC.symbol}{parseFloat(result).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD today.
                    </p>
                  )}
          </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button 
                    className="flex-1 h-12 text-base gap-2" 
                    onClick={copyResult}
                  >
                    {copied ? <Check className="h-4 w-4 text-green-600 dark:text-green-400" /> : <Copy className="h-4 w-4 text-primary" />}
                    {copied ? "Copied!" : "Copy Result"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 px-4"
                    onClick={speakResult}
                  >
                    <Volume2 className="h-4 w-4 text-primary" />
                  </Button>
                  <Button variant="outline" className="h-12 px-4" onClick={shareResult}>
                    <Share2 className="h-4 w-4 text-primary" />
                  </Button>
          </div>

                {/* Conversion Rate Info */}
                <div className="mt-6 p-4 rounded-xl bg-muted/50 text-sm">
                  <div className="flex flex-wrap justify-between gap-2 text-muted-foreground">
                    <span>
                      1 {fromCurrency} = {(getRate(toCurrency) / getRate(fromCurrency)).toFixed(4)} {toCurrency}
                    </span>
                    <span>
                      1 {toCurrency} = {(getRate(fromCurrency) / getRate(toCurrency)).toFixed(6)} {fromCurrency}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <TrueRateScore />
              <RateAlertSetter />
            </div>
        </PageHero>

        {/* Features Section */}
        <section className="py-10 sm:py-14 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-[100vw] xl:max-w-none">
            <div className="text-center mb-10 space-y-3">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                <Badge variant="outline">Essential Tools</Badge>
                <Badge className="bg-primary/10 text-primary">Free Calculators</Badge>
                <Badge variant="secondary">Business Ready</Badge>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-balance">
                <span className="text-foreground">
                  Conversion Utilities
                </span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
                Helpful calculators and comparisons for daily decisions and business planning.
              </p>
            </div>
            <Tabs defaultValue="tools" className="space-y-8">
              <TabsList className="grid w-full grid-cols-1 gap-1.5 rounded-xl border border-border/50 bg-muted/40 p-1.5 h-auto sm:grid-cols-3">
                <TabsTrigger value="tools" className="w-full gap-2 min-h-[44px] px-3 py-2.5 text-xs sm:text-sm">
                  <Calculator className="h-4 w-4 text-primary" />
                  Quick Tools
                </TabsTrigger>
                <TabsTrigger value="changers" className="w-full gap-2 min-h-[44px] px-3 py-2.5 text-xs sm:text-sm">
                  <Building2 className="h-4 w-4 text-primary" />
                  Compare Changers
                </TabsTrigger>
                <TabsTrigger value="remittance" className="w-full gap-2 min-h-[44px] px-3 py-2.5 text-xs sm:text-sm">
                  <Globe className="h-4 w-4 text-primary" />
                  Remittance
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tools" className="space-y-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Plan in LRD */}
                  <PlanInLRD rate={isLiveRateReady ? liveRateValue : null} />

                  {/* Business Calculator */}
                  <Card className="group border-primary/20 bg-gradient-to-br from-primary/5 to-card shadow-sm hover:shadow-lg transition-all">
                    <CardHeader className="pb-3">
                      <div className="h-14 w-14 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                        <Banknote className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
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
                      <div className="h-14 w-14 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center mb-3 group-hover:bg-secondary/20 transition-colors">
                        <Percent className="h-7 w-7 text-primary" />
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

                  {/* Price Index — same as /price-index: scrollable list, search, category tabs */}
                  <PriceIndex
                    rate={liveRateValue || 180}
                    showExport
                    showRefresh
                    highlightBasketItems
                    showMarketIntelligenceLink
                  />
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
                                <MapPin className="h-3 w-3 text-blue-600 dark:text-blue-400" />
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
                                <Star className="h-3 w-3 fill-yellow-400 text-amber-600 dark:text-amber-400" />
                                {changer.rating}
                              </div>
                              <div className="text-xs text-muted-foreground">{changer.reviews} reviews</div>
                            </div>
                            <Button size="sm" variant="outline" className="hidden sm:flex">
                              View Details <ChevronRight className="h-4 w-4 ml-1 text-muted-foreground" />
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
                      <Info className="h-5 w-5 mt-0.5 text-blue-600 dark:text-blue-400" />
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
                                <Smartphone className="h-5 w-5 text-primary" />
                              ) : service.type === "bank" ? (
                                <Building2 className="h-5 w-5 text-primary" />
                              ) : (
                                <Globe className="h-5 w-5 text-primary" />
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
                                <Clock className="h-3 w-3 text-blue-600 dark:text-blue-400" />
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
                      <Info className="h-5 w-5 mt-0.5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <div className="font-medium text-blue-600 mb-1">Remittance tips</div>
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
          <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-[100vw] xl:max-w-none">
            <div className="max-w-4xl mx-auto text-center mb-8 space-y-3">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                <Badge variant="outline">Market Overview</Badge>
                <Badge className="bg-primary/10 text-primary">Live Data</Badge>
                <Badge variant="secondary">Daily Summary</Badge>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-balance">
                <span className="text-foreground">
                  Rate Highlights
                </span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Quick context around today&apos;s USD/LRD market activity and key insights.
              </p>
            </div>
            <div className="max-w-4xl mx-auto grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3">
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
                      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                    )}
                    <CardTitle className={`text-base ${dayChange > 0 ? "text-red-700 dark:text-red-400" : "text-green-700 dark:text-green-400"}`}>
                      Today&apos;s Change
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
                    <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <CardTitle className="text-base text-secondary">Compare Locations</CardTitle>
                  </div>
                  <CardDescription className="text-secondary/70">Find the best local rates</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Link href="/market" className="inline-flex items-center text-sm text-secondary font-medium hover:underline">
                    View Market <ChevronRight className="ml-1 h-4 w-4 text-muted-foreground" />
                  </Link>
                  <div className="text-xs text-secondary/70 mt-1">Rates by region</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-14 md:py-16 border-t">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
              <Badge variant="outline">Stay Informed</Badge>
              <Badge className="bg-primary/10 text-primary">Rate Alerts</Badge>
              <Badge variant="secondary">Never Miss</Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-balance">
              <span className="text-foreground">
                Need Rate Alerts?
              </span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto text-sm sm:text-base">
              Plan in LRD: need a target amount? We&apos;ll tell you how much to send at today&apos;s rate and alert you if the rate moves so you can send at a better time. Less at the mercy of the rate—more stability for using LRD.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tools">
                <Button size="lg" className="gap-2 shadow-sm">
                  <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Set Rate Alert
                </Button>
              </Link>
              <Link href="/predictions">
                <Button size="lg" variant="outline" className="gap-2 shadow-sm">
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                  View Rate Outlook
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      </ErrorBoundary>
      <Footer />
    </div>
  )
}

export default memo(ConverterPageComponent)
