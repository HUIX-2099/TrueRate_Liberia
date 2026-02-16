"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLiveRate } from "@/lib/live-rate-context"
import { FileText } from "lucide-react"

const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "LRD", name: "Liberian Dollar", symbol: "L$" },
] as const

export function BulkConverter() {
  const { rate } = useLiveRate()
  const [fromCurrency, setFromCurrency] = useState<"USD" | "LRD">("USD")
  const [amountsText, setAmountsText] = useState("")

  const lrdPerUsd = rate ?? 192.5

  const { rows, total } = useMemo(() => {
    const lines = amountsText
      .split(/[\n,;]+/)
      .map((s) => parseFloat(s.trim()))
      .filter((n) => Number.isFinite(n) && n > 0)
    if (fromCurrency === "USD") {
      const rows = lines.map((usd) => ({ from: usd, to: usd * lrdPerUsd }))
      const totalFrom = rows.reduce((s, r) => s + r.from, 0)
      const totalTo = rows.reduce((s, r) => s + r.to, 0)
      return { rows, total: { from: totalFrom, to: totalTo } }
    }
    const rows = lines.map((lrd) => ({ from: lrd, to: lrd / lrdPerUsd }))
    const totalFrom = rows.reduce((s, r) => s + r.from, 0)
    const totalTo = rows.reduce((s, r) => s + r.to, 0)
    return { rows, total: { from: totalFrom, to: totalTo } }
  }, [amountsText, fromCurrency, lrdPerUsd])

  const fromSymbol = fromCurrency === "USD" ? "$" : "L$"
  const toSymbol = fromCurrency === "USD" ? "L$" : "$"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Bulk conversion
        </CardTitle>
        <CardDescription>
          Enter multiple amounts (one per line or comma-separated). We&apos;ll convert all at the current rate.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="space-y-2">
            <Label>From</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value as "USD" | "LRD")}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.code} ({c.name})</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px] space-y-2">
            <Label>Amounts (one per line or comma-separated)</Label>
            <textarea
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="100&#10;250&#10;500"
              value={amountsText}
              onChange={(e) => setAmountsText(e.target.value)}
            />
          </div>
        </div>
        {rows.length > 0 && (
          <>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-2 font-medium">#</th>
                    <th className="text-right p-2 font-medium">{fromCurrency}</th>
                    <th className="text-right p-2 font-medium">{fromCurrency === "USD" ? "LRD" : "USD"}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="p-2">{i + 1}</td>
                      <td className="text-right p-2 tabular-nums">
                        {fromCurrency === "USD"
                          ? `$${row.from.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                          : `L$${row.from.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                      </td>
                      <td className="text-right p-2 tabular-nums">
                        {fromCurrency === "USD"
                          ? `L$${row.to.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                          : `$${row.to.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-primary bg-primary/5 font-semibold">
                    <td className="p-2">Total</td>
                    <td className="text-right p-2 tabular-nums">
                      {fromCurrency === "USD"
                        ? `$${total.from.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                        : `L$${total.from.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    </td>
                    <td className="text-right p-2 tabular-nums">
                      {fromCurrency === "USD"
                        ? `L$${total.to.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                        : `$${total.to.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <p className="text-xs text-muted-foreground">
              Rate: 1 USD = {lrdPerUsd.toFixed(2)} LRD
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
