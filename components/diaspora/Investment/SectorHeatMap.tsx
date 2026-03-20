"use client"

import { Building2, Sprout, Store, Ship } from "lucide-react"
import { StatusBadge } from "@/components/ui/status-badge"
import { cn } from "@/lib/utils"

const SECTORS = [
  { id: "real_estate", name: "Real Estate", icon: Building2, risk: "Medium", level: 2 },
  { id: "agriculture", name: "Agriculture", icon: Sprout, risk: "Medium", level: 2 },
  { id: "sme_retail", name: "SME Retail", icon: Store, risk: "Low–Medium", level: 1 },
  { id: "import_export", name: "Import/Export", icon: Ship, risk: "Medium–High", level: 3 },
] as const

const HEAT_COLORS = [
  "bg-emerald-500/20 border-emerald-500/40 text-emerald-700 dark:text-emerald-400",
  "bg-amber-500/20 border-amber-500/40 text-amber-700 dark:text-amber-400",
  "bg-destructive/20 border-destructive/40 text-destructive",
]

export function SectorHeatMap() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {SECTORS.map(({ id, name, icon: Icon, risk, level }) => (
        <div
          key={id}
          className={cn(
            "rounded-xl border p-4 flex flex-col items-center gap-2 text-center transition-shadow hover:shadow-[var(--shadow-institutional-hover)]",
            HEAT_COLORS[level - 1]
          )}
        >
          <Icon className="h-6 w-6 shrink-0 text-primary" aria-hidden />
          <p className="font-medium text-sm">{name}</p>
          <StatusBadge label={risk} variant={level === 1 ? "stable" : level === 2 ? "watch" : "volatile"} size="sm" />
        </div>
      ))}
    </div>
  )
}
