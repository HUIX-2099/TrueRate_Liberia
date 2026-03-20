"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Scale, CheckCircle2, AlertTriangle, ThumbsUp, Loader2 } from "lucide-react"

interface PriceCheckResult {
  item: { key?: string; name?: string; benchmarkLRD: number }
  priceLRD: number
  verdict: "fair" | "overpriced" | "underpriced"
  percentDiff: number
  message: string
  source: string
}

const VERDICT_CONFIG = {
  fair: {
    icon: CheckCircle2,
    label: "Fair price",
    className: "text-green-600 dark:text-green-400",
    bg: "bg-muted/40 border border-border/40 border-green-500/20",
  },
  overpriced: {
    icon: AlertTriangle,
    label: "Overpriced",
    className: "text-amber-600 dark:text-amber-400",
    bg: "bg-muted/40 border border-border/40 border-amber-500/20",
  },
  underpriced: {
    icon: ThumbsUp,
    label: "Good deal",
    className: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-muted/40 border border-border/40 border-emerald-500/20",
  },
} as const

function formatLRD(n: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n) + " LRD"
}

export function PriceCheckerTool() {
  const [items, setItems] = useState<Array<{ key?: string; name: string }>>([])
  const [selectedKey, setSelectedKey] = useState<string>("")
  const [priceInput, setPriceInput] = useState("")
  const [result, setResult] = useState<PriceCheckResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/price-index")
      .then((res) => res.ok ? res.json() : Promise.resolve(null))
      .then((data: { items?: Array<{ key?: string; name: string }> }) => {
        if (Array.isArray(data?.items) && data.items.length) {
          setItems(data.items)
          if (!selectedKey && data.items[0]) {
            setSelectedKey(data.items[0].key ?? data.items[0].name ?? "")
          }
        }
      })
      .catch(() => {})
  }, [])

  const options = useMemo(() => {
    const withKey = items.filter((i) => i.key || i.name)
    return withKey.map((i) => ({ value: i.key ?? i.name ?? "", label: i.name }))
  }, [items])

  const handleCheck = async () => {
    const key = selectedKey || options[0]?.value
    const price = priceInput.replace(/,/g, "").trim()
    if (!key || !price || Number.isNaN(Number(price))) {
      setError("Select an item and enter a price in LRD.")
      return
    }
    setError(null)
    setResult(null)
    setLoading(true)
    try {
      const res = await fetch(
        `/api/price-check?item=${encodeURIComponent(key)}&priceLRD=${encodeURIComponent(price)}`
      )
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Check failed")
        setResult(null)
        return
      }
      setResult(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed")
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const config = result ? VERDICT_CONFIG[result.verdict] : null
  const VerdictIcon = config?.icon ?? Scale

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" />
          Is this overpriced?
        </CardTitle>
        <CardDescription>
          Enter a price and compare to the market. We use the TrueRate Price Index (LISGIS / Ministry of Commerce).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="price-check-item">Item</Label>
            <Select value={selectedKey || undefined} onValueChange={(v) => { setSelectedKey(v); setError(null); setResult(null); }}>
              <SelectTrigger id="price-check-item">
                <SelectValue placeholder="Select an item..." />
              </SelectTrigger>
              <SelectContent>
                {options.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="price-check-lrd">Price you saw (LRD)</Label>
            <Input
              id="price-check-lrd"
              type="text"
              inputMode="numeric"
              placeholder="e.g. 2000"
              value={priceInput}
              onChange={(e) => {
                setPriceInput(e.target.value)
                setError(null)
                setResult(null)
              }}
            />
          </div>
        </div>
        <Button onClick={handleCheck} disabled={loading} className="w-full sm:w-auto">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
              Checking...
            </>
          ) : (
            <>
              <Scale className="mr-2 h-4 w-4 text-primary" />
              Check price
            </>
          )}
        </Button>

        {error && (
          <div className="rounded-lg border border-amber-500/30 bg-muted/40 border-border/40 p-3 text-sm text-amber-800 dark:text-amber-200">
            {error}
          </div>
        )}

        {result && config && (
          <div className={`rounded-lg border p-4 ${config.bg}`}>
            <div className="flex items-start gap-3">
              <VerdictIcon className={`h-8 w-8 shrink-0 ${config.className}`} />
              <div className="min-w-0 flex-1">
                <p className={`font-semibold ${config.className}`}>{config.label}</p>
                <p className="mt-1 text-sm text-foreground">{result.message}</p>
                <div className="mt-3 flex flex-wrap gap-4 text-sm">
                  <span>
                    Your price: <strong>{formatLRD(result.priceLRD)}</strong>
                  </span>
                  <span>
                    Market benchmark: <strong>{formatLRD(result.item.benchmarkLRD)}</strong>
                  </span>
                  <span>
                    Difference:{" "}
                    <strong className={result.percentDiff > 0 ? "text-amber-600" : result.percentDiff < 0 ? "text-green-600" : ""}>
                      {result.percentDiff > 0 ? "+" : ""}
                      {result.percentDiff}%
                    </strong>
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{result.source}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
