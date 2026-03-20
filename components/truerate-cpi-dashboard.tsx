"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TRUERATE_CPI_BASKET } from "@/lib/price-index/basket"
import { Activity, Fuel, Utensils, HardHat, Wifi } from "lucide-react"

const CATEGORY_META: Record<string, { label: string; icon: typeof Activity; color: string; bg: string }> = {
  food: { label: "Food", icon: Utensils, color: "text-amber-600 dark:text-amber-400", bg: "bg-muted/40 border border-border/40" },
  energy: { label: "Energy", icon: Fuel, color: "text-orange-600 dark:text-orange-400", bg: "bg-muted/40 border border-border/40" },
  construction: { label: "Construction", icon: HardHat, color: "text-blue-600 dark:text-blue-400", bg: "bg-muted/40 border border-border/40" },
  other: { label: "Services", icon: Wifi, color: "text-violet-600 dark:text-violet-400", bg: "bg-muted/40 border border-border/40" },
}

export function TruerateCpiDashboard() {
  const grouped = TRUERATE_CPI_BASKET.reduce<Record<string, typeof TRUERATE_CPI_BASKET>>(
    (acc, item) => {
      const key = item.category
      if (!acc[key]) acc[key] = []
      acc[key].push(item)
      return acc
    },
    {},
  )

  return (
    <Card className="relative border-border/50 rounded-2xl shadow-sm bg-card/80 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5" aria-hidden />
      <CardHeader className="pb-4 pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted/40 border border-border/40 ring-1 ring-primary/20">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold tracking-tight">TrueRate CPI Basket</CardTitle>
              <CardDescription className="mt-0.5 text-sm">
                {TRUERATE_CPI_BASKET.length} items tracked daily for cost-of-living index
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="w-fit gap-1 border-border/60 text-xs font-medium">
            LISGIS-aligned
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(grouped).map(([cat, items]) => {
            const meta = CATEGORY_META[cat] ?? CATEGORY_META.other
            const Icon = meta.icon
            return (
              <div
                key={cat}
                className="group rounded-xl border border-border/50 bg-muted/20 dark:bg-muted/10 p-4 transition-colors hover:border-primary/30 hover:bg-muted/30"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${meta.bg} ${meta.color}`}>
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <Badge variant="outline" className="text-[10px] font-semibold tabular-nums">
                    {items.length}
                  </Badge>
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  {meta.label}
                </p>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-2 text-sm py-1.5 border-b border-border/30 last:border-0 last:pb-0"
                    >
                      <span className="text-foreground font-medium truncate">{item.name}</span>
                      <span className="text-xs text-muted-foreground shrink-0">{item.unit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
