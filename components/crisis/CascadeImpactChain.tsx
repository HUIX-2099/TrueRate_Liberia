"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bus, ShoppingBasket, Building2, Zap, Briefcase, Fuel, ArrowRight, TrendingUp } from "lucide-react"
import type { SectorImpact } from "@/lib/crisis/cascade-model"

const ICON_MAP: Record<string, React.ElementType> = {
  Bus,
  ShoppingBasket,
  Building2,
  Zap,
  Briefcase,
}

interface CascadeImpactChainProps {
  fuelChangePercent: number
  sectors: SectorImpact[]
  overallCOLChangePercent: number
}

export function CascadeImpactChain({ fuelChangePercent, sectors, overallCOLChangePercent }: CascadeImpactChainProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/40 border border-border/40 border-red-500/20">
        <Fuel className="h-8 w-8 shrink-0 text-primary" />
        <div>
          <div className="font-bold text-lg text-red-600 dark:text-red-400">
            Fuel +{fuelChangePercent}%
          </div>
          <p className="text-sm text-muted-foreground">Initial price shock</p>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex flex-col items-center gap-1 text-muted-foreground">
          <ArrowRight className="h-5 w-5 rotate-90 text-muted-foreground" />
          <span className="text-xs">Ripple effect</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sectors.map((sector) => {
          const Icon = ICON_MAP[sector.icon] ?? Briefcase
          return (
            <Card key={sector.sectorId} className="border-border/40 rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-sm">{sector.sectorName}</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    +{sector.changePercent}%
                  </Badge>
                </div>

                <div className="space-y-2">
                  {sector.items.slice(0, 3).map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground truncate mr-2">{item.name}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="line-through text-muted-foreground/60">
                          {item.oldPrice.toLocaleString()}
                        </span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span className="font-semibold text-destructive">
                          {item.newPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-border/20 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Lag: ~{sector.lagDays} days</span>
                  <span className="font-semibold text-destructive">
                    +{sector.monthlyImpactLRD.toLocaleString()} LRD/mo
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/40 border border-border/40 border-orange-500/20">
        <TrendingUp className="h-6 w-6 shrink-0 text-green-600 dark:text-green-400" />
        <div>
          <div className="font-bold text-orange-600 dark:text-orange-400">
            Overall cost of living: +{overallCOLChangePercent}%
          </div>
          <p className="text-xs text-muted-foreground">Weighted average across all sectors</p>
        </div>
      </div>
    </div>
  )
}
