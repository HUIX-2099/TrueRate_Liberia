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

  useEffect(() => {
    if (usdAmount && activeInput === "usd") {
      const numValue = Number.parseFloat(usdAmount)
      if (!isNaN(numValue)) {
        setLrdAmount((numValue * currentRate).toFixed(2))
      }
    }
  }, [currentRate])

  useEffect(() => {
    async function fetchRate() {
      try {
        const response = await fetch("/api/rates/live")
        const data = await response.json()
        if (data.averageRate) {
          setCurrentRate(data.averageRate)
          setLastUpdate("Just now")
        }
      } catch (error) {
        console.error("[v0] Error fetching rate:", error)
      }
    }

    fetchRate()
    const interval = setInterval(fetchRate, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const handleUsdChange = (value: string) => {
    setUsdAmount(value)
    setActiveInput("usd")
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue)) {
      setLrdAmount((numValue * currentRate).toFixed(2))
    } else {
      setLrdAmount("")
    }
  }

  const handleLrdChange = (value: string) => {
    setLrdAmount(value)
    setActiveInput("lrd")
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue)) {
      setUsdAmount((numValue / currentRate).toFixed(2))
    } else {
      setUsdAmount("")
    }
  }

  const swapCurrencies = () => {
    const tempUsd = usdAmount
    setUsdAmount(lrdAmount)
    setLrdAmount(tempUsd)
    setActiveInput(activeInput === "usd" ? "lrd" : "usd")
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
        </div>

        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          Rates are indicative and may vary by money changer. Check live rates for the most accurate pricing.
        </p>
      </CardContent>
    </Card>
  )
}
