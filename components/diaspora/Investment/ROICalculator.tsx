"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { MetricCard } from "@/components/ui/metric-card"
import { cn } from "@/lib/utils"

export interface ROICalculatorProps {
  defaultAmountUsd?: number
  defaultYears?: number
  defaultInflationPct?: number
  className?: string
}

export function ROICalculator({
  defaultAmountUsd = 10000,
  defaultYears = 5,
  defaultInflationPct = 8,
  className,
}: ROICalculatorProps) {
  const [amountUsd, setAmountUsd] = useState(defaultAmountUsd)
  const [years, setYears] = useState(defaultYears)
  const [inflationPct, setInflationPct] = useState(defaultInflationPct)

  const nominalProjection = amountUsd * Math.pow(1.12, years)
  const inflationFactor = Math.pow(1 + inflationPct / 100, years)
  const realProjection = nominalProjection / inflationFactor

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="roi-amount" className="text-xs">USD amount</Label>
          <Input
            id="roi-amount"
            type="number"
            min={100}
            step={100}
            value={amountUsd}
            onChange={(e) => setAmountUsd(Number(e.target.value) || 0)}
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="roi-years" className="text-xs">Years</Label>
          <Input
            id="roi-years"
            type="number"
            min={1}
            max={30}
            value={years}
            onChange={(e) => setYears(Number(e.target.value) || 1)}
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="roi-inflation" className="text-xs">Inflation % (p.a.)</Label>
          <Input
            id="roi-inflation"
            type="number"
            min={0}
            max={30}
            step={0.5}
            value={inflationPct}
            onChange={(e) => setInflationPct(Number(e.target.value) || 0)}
            className="h-10"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <MetricCard
          label="Nominal projection"
          value={`$${nominalProjection.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          subtext={`~12% p.a. assumed`}
        />
        <MetricCard
          label="Inflation-adjusted (real)"
          value={`$${realProjection.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          subtext={`Today's purchasing power`}
          variant="positive"
        />
      </div>
    </div>
  )
}
