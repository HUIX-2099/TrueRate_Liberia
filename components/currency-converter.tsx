"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowLeftRight, Calculator } from "lucide-react"

export function CurrencyConverter() {
  const [usdAmount, setUsdAmount] = useState<string>("100")
  const [lrdAmount, setLrdAmount] = useState<string>("")
  const [activeInput, setActiveInput] = useState<"usd" | "lrd">("usd")
  const [currentRate, setCurrentRate] = useState<number>(180)
  const [lastUpdate, setLastUpdate] = useState<string>("Loading...")
  const [lowDataMode, setLowDataMode] = useState(false)
  const parseAmount = (value: string) => {
    const normalized = value.replace(/,/g, "").trim()
    const parsed = Number.parseFloat(normalized)
    return Number.isFinite(parsed) ? parsed : null
  }
  const roundTo2 = (value: number) => Math.round(value * 100) / 100

  useEffect(() => {
    if (activeInput === "usd") {
      const numValue = parseAmount(usdAmount)
      if (numValue !== null && currentRate > 0) {
        setLrdAmount(roundTo2(numValue * currentRate).toFixed(2))
      } else {
        setLrdAmount("")
      }
    } else {
      const numValue = parseAmount(lrdAmount)
      if (numValue !== null && currentRate > 0) {
        setUsdAmount(roundTo2(numValue / currentRate).toFixed(2))
      } else {
        setUsdAmount("")
      }
    }
  }, [currentRate, activeInput])

  useEffect(() => {
    async function fetchRate() {
      try {
        if (typeof document !== "undefined" && document.hidden) return
        const response = await fetch("/api/rates/live")
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`)
        }
        const data = await response.json()
        if (typeof data.rate === "number") {
          setCurrentRate(data.rate)
          const updatedAt = data.timestamp ? new Date(data.timestamp) : new Date()
          setLastUpdate(updatedAt.toLocaleTimeString())
        }
      } catch (error) {
        console.error("[v0] Error fetching rate:", error)
        setLastUpdate("Offline")
      }
    }

    const connection = typeof navigator !== "undefined" ? (navigator as any).connection : null
    const isLowBandwidth = Boolean(connection?.saveData) || ["slow-2g", "2g"].includes(connection?.effectiveType)
    setLowDataMode(isLowBandwidth)
    const refreshMs = isLowBandwidth ? 300000 : 60000

    fetchRate()
    const interval = setInterval(fetchRate, refreshMs)
    return () => clearInterval(interval)
  }, [])

  const handleUsdChange = (value: string) => {
    setUsdAmount(value)
    setActiveInput("usd")
    const numValue = parseAmount(value)
    if (numValue !== null && currentRate > 0) {
      setLrdAmount(roundTo2(numValue * currentRate).toFixed(2))
    } else {
      setLrdAmount("")
    }
  }

  const handleLrdChange = (value: string) => {
    setLrdAmount(value)
    setActiveInput("lrd")
    const numValue = parseAmount(value)
    if (numValue !== null && currentRate > 0) {
      setUsdAmount(roundTo2(numValue / currentRate).toFixed(2))
    } else {
      setUsdAmount("")
    }
  }

  const swapCurrencies = () => {
    if (activeInput === "usd") {
      setActiveInput("lrd")
      const numValue = parseAmount(lrdAmount)
      if (numValue !== null && currentRate > 0) {
        setUsdAmount(roundTo2(numValue / currentRate).toFixed(2))
      } else {
        setUsdAmount("")
      }
    } else {
      setActiveInput("usd")
      const numValue = parseAmount(usdAmount)
      if (numValue !== null && currentRate > 0) {
        setLrdAmount(roundTo2(numValue * currentRate).toFixed(2))
      } else {
        setLrdAmount("")
      }
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Calculator className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Currency Converter</CardTitle>
            <CardDescription>Convert between USD and LRD</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="usd-input">US Dollar (USD)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              id="usd-input"
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={usdAmount}
              onChange={(e) => handleUsdChange(e.target.value)}
              className="pl-8 text-lg font-semibold"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button variant="outline" size="icon" onClick={swapCurrencies} className="rounded-full bg-transparent">
            <ArrowLeftRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lrd-input">Liberian Dollar (LRD)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">L$</span>
            <Input
              id="lrd-input"
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={lrdAmount}
              onChange={(e) => handleLrdChange(e.target.value)}
              className="pl-8 text-lg font-semibold"
            />
          </div>
        </div>

        <div className="rounded-lg bg-muted p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Exchange Rate</span>
            <span className="font-semibold text-foreground">{currentRate.toFixed(2)} LRD per USD</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Last Updated</span>
            <span className="font-medium text-foreground">{lastUpdate}</span>
          </div>
          {lowDataMode && (
            <div className="text-xs text-muted-foreground">
              Low-data mode: updates are less frequent to save bandwidth.
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          Rates are indicative and may vary by money changer. Check live rates for the most accurate pricing.
        </p>
      </CardContent>
    </Card>
  )
}
