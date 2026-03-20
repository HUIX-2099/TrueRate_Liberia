"use client"

import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { TrendingDown, TrendingUp, Shield, AlertTriangle, Info } from "lucide-react"
import { useLiveRate } from "@/lib/live-rate-context"

type HedgingStrategy = "forward" | "options" | "natural" | "none"

const STRATEGY_INFO: Record<HedgingStrategy, { label: string; description: string; costPct: number }> = {
  forward:  { label: "Forward contract",  description: "Lock in today's rate for a future date. Eliminates upside & downside.",  costPct: 0.5  },
  options:  { label: "FX options",        description: "Buy the right (not obligation) to exchange at a target rate.",           costPct: 1.2  },
  natural:  { label: "Natural hedge",     description: "Match USD revenues with USD expenses to offset exposure.",               costPct: 0.0  },
  none:     { label: "Unhedged",          description: "Accept full exchange rate risk. Maximise gains if LRD weakens.",         costPct: 0.0  },
}

export function FxHedgingCalculator({ className }: { className?: string }) {
  const { rate } = useLiveRate()
  const currentRate = typeof rate === "number" && rate > 0 ? rate : 194

  const [amountUsd, setAmountUsd] = useState(50000)
  const [horizonMonths, setHorizonMonths] = useState(6)
  const [strategy, setStrategy] = useState<HedgingStrategy>("forward")
  const [pessimisticRate, setPessimisticRate] = useState(currentRate * 1.1)
  const [optimisticRate, setOptimisticRate] = useState(currentRate * 0.95)

  const calc = useMemo(() => {
    const stratInfo = STRATEGY_INFO[strategy]
    const hedgingCost = amountUsd * (stratInfo.costPct / 100)
    const currentLrd = amountUsd * currentRate
    const pessimisticLrd = amountUsd * pessimisticRate
    const optimisticLrd = amountUsd * optimisticRate

    const unhedgedLoss = pessimisticLrd - currentLrd      // positive = worse in LRD terms
    const hedgedRate = strategy === "forward" ? currentRate : strategy === "options" ? Math.min(currentRate, pessimisticRate) : currentRate
    const hedgedLrd = amountUsd * hedgedRate
    const saving = strategy !== "none" ? Math.abs(pessimisticLrd - hedgedLrd) - hedgingCost : 0
    const breakeven = strategy !== "none" ? currentRate + (hedgingCost / amountUsd) : currentRate

    return {
      currentLrd,
      pessimisticLrd,
      optimisticLrd,
      hedgingCost,
      saving,
      breakeven,
      unhedgedLoss,
      costPct: stratInfo.costPct,
    }
  }, [amountUsd, horizonMonths, strategy, pessimisticRate, optimisticRate, currentRate])

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
  const fmtLrd = (n: number) =>
    new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n) + " LRD"

  return (
    <div className={cn("rounded-3xl border border-border/40 bg-card overflow-hidden", className)}>
      <div className="p-6 border-b border-border/30 bg-muted/10">
        <div className="flex items-center gap-3 mb-1">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="font-black text-foreground text-lg">FX Hedging Calculator</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Estimate the cost and benefit of protecting USD/LRD exposure for your business.
        </p>
      </div>

      <div className="p-6 grid sm:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">
              Exposure amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">$</span>
              <input
                type="number"
                min={1000}
                step={1000}
                value={amountUsd}
                onChange={(e) => setAmountUsd(Number(e.target.value))}
                className="w-full rounded-xl border border-border/50 bg-muted/20 pl-8 pr-4 py-2.5 text-sm font-mono text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">
              Horizon: {horizonMonths} month{horizonMonths > 1 ? "s" : ""}
            </label>
            <input
              type="range" min={1} max={24} value={horizonMonths}
              onChange={(e) => setHorizonMonths(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>1 mo</span><span>24 mo</span>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">
              Strategy
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(STRATEGY_INFO) as [HedgingStrategy, typeof STRATEGY_INFO[HedgingStrategy]][]).map(([key, info]) => (
                <button
                  key={key}
                  onClick={() => setStrategy(key)}
                  className={cn(
                    "rounded-xl border p-2.5 text-left transition-all text-xs font-semibold",
                    strategy === key
                      ? "border-primary/40 bg-muted/40 border border-border/40 text-primary"
                      : "border-border/40 bg-muted/10 text-muted-foreground hover:border-border"
                  )}
                >
                  {info.label}
                  {info.costPct > 0 && (
                    <span className="block text-[9px] mt-0.5 opacity-70">{info.costPct}% cost</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">
                Bear rate (LRD)
              </label>
              <input
                type="number"
                step={0.5}
                value={pessimisticRate}
                onChange={(e) => setPessimisticRate(Number(e.target.value))}
                className="w-full rounded-xl border border-border/50 bg-muted/20 px-3 py-2.5 text-sm font-mono text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">
                Bull rate (LRD)
              </label>
              <input
                type="number"
                step={0.5}
                value={optimisticRate}
                onChange={(e) => setOptimisticRate(Number(e.target.value))}
                className="w-full rounded-xl border border-border/50 bg-muted/20 px-3 py-2.5 text-sm font-mono text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border/30 bg-muted/20 p-4 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current snapshot</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-muted-foreground mb-0.5">Current rate</p>
                <p className="text-xl font-black tabular-nums text-foreground">{currentRate.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground mb-0.5">Value at current</p>
                <p className="text-xl font-black tabular-nums text-foreground">{fmtLrd(calc.currentLrd)}</p>
              </div>
            </div>
          </div>

          <div className={cn(
            "rounded-2xl border p-4 space-y-2",
            calc.saving > 0 ? "border-green-500/20 bg-green-500/5" : "border-border/30 bg-muted/10"
          )}>
            <div className="flex items-center gap-2">
              {calc.saving > 0 ? <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" /> : <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Bear scenario analysis</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-muted-foreground mb-0.5">Unhedged loss</p>
                <p className="text-lg font-black tabular-nums text-destructive">
                  −{fmt(calc.unhedgedLoss / currentRate)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground mb-0.5">Hedging cost</p>
                <p className="text-lg font-black tabular-nums text-foreground">{fmt(calc.hedgingCost)}</p>
              </div>
            </div>
            {calc.saving > 0 && (
              <div className="pt-2 border-t border-border/20">
                <p className="text-[10px] text-green-600 dark:text-green-400 font-black uppercase tracking-widest">
                  Net saving: {fmt(calc.saving / currentRate)}
                </p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border/30 bg-muted/10 p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Strategy summary</p>
            <p className="text-sm text-foreground font-medium leading-relaxed">
              {STRATEGY_INFO[strategy].description}
            </p>
            {strategy !== "none" && (
              <p className="text-xs text-muted-foreground mt-2">
                Breakeven rate: <span className="font-bold text-foreground">{calc.breakeven.toFixed(2)} LRD</span>
              </p>
            )}
          </div>

          <div className="flex items-start gap-2 p-3 rounded-xl bg-primary/5 border border-primary/10">
            <Info className="h-4 w-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Estimates only. Consult a licensed FX advisor before entering hedging agreements.
              Costs are indicative and vary by bank/broker.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
