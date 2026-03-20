"use client"

import { Building2, Fuel, Minus, TrendingDown, TrendingUp, UtensilsCrossed } from "lucide-react"
import { cn } from "@/lib/utils"

type TrendKind = "up" | "down" | "flat"

const COMMODITIES: Array<{
  id: string
  name: string
  detail: string
  priceLine: string
  trend: TrendKind
  trendLabel: string
  note: string
  icon: typeof UtensilsCrossed
}> = [
  {
    id: "rice",
    name: "Rice",
    detail: "25kg staple bag",
    priceLine: "USD 28",
    trend: "up",
    trendLabel: "+2%",
    note: "Up vs last week—staple pressure still visible.",
    icon: UtensilsCrossed,
  },
  {
    id: "fuel",
    name: "Fuel",
    detail: "Gasoline (gallon)",
    priceLine: "USD 4.20 / gal",
    trend: "flat",
    trendLabel: "Stable",
    note: "Flat—watch global oil and transport if you're budgeting travel.",
    icon: Fuel,
  },
  {
    id: "cement",
    name: "Cement",
    detail: "50kg bag",
    priceLine: "USD 12.50 / bag",
    trend: "down",
    trendLabel: "−1%",
    note: "Slight ease—helpful for builds & renovations.",
    icon: Building2,
  },
]

function TrendPill({ trend, label }: { trend: TrendKind; label: string }) {
  const Icon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums",
        trend === "up" && "bg-rose-500/12 text-rose-700 dark:text-rose-400",
        trend === "down" && "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400",
        trend === "flat" && "bg-muted text-muted-foreground"
      )}
    >
      <Icon className="h-3 w-3 shrink-0 text-primary" aria-hidden />
      {label}
    </span>
  )
}

export function CommodityTracker() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {COMMODITIES.map(({ id, name, detail, priceLine, trend, trendLabel, note, icon: Icon }) => (
        <div
          key={id}
          className={cn(
            "group relative rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-colors duration-200",
            "hover:border-border/80"
          )}
        >
          <div className="relative flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background/80 border border-border/40 shadow-sm transition-colors">
                  <Icon className="h-5 w-5 text-primary" aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-tight">{name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{detail}</p>
                </div>
              </div>
              <TrendPill trend={trend} label={trendLabel} />
            </div>
            <p className="text-lg font-bold tabular-nums text-foreground tracking-tight">{priceLine}</p>
            <p className="text-xs text-muted-foreground leading-relaxed border-t border-border/30 pt-3">{note}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
