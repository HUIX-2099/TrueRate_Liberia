"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  TrendingUp,
  ArrowRight,
  Building2,
  Sprout,
  Store,
  Ship,
  Calculator,
  ShieldAlert,
} from "lucide-react"

const SECTORS = [
  { name: "Real Estate", icon: Building2, risk: "Medium" },
  { name: "Agriculture", icon: Sprout, risk: "Medium" },
  { name: "SME Retail", icon: Store, risk: "Low–Medium" },
  { name: "Import/Export", icon: Ship, risk: "Medium–High" },
]

export function DiasporaInvestmentPreview() {
  return (
    <Card className="border-violet-500/20 dark:border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-card shadow-[var(--shadow-institutional)] overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-violet-500/35 hover:-translate-y-0.5">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <CardTitle className="text-violet-700 dark:text-violet-400">
              Diaspora Investment Navigator
            </CardTitle>
            <CardDescription>
              Safely invest back home with ROI visibility and risk indicators
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SECTORS.map((s) => (
            <div
              key={s.name}
              className="flex flex-col items-center gap-1 rounded-lg border border-border/60 bg-muted/30 p-3 text-center"
            >
              <s.icon className="h-5 w-5 text-primary mx-auto" />
              <p className="font-medium text-xs">{s.name}</p>
              <Badge variant="secondary" className="text-[10px]">
                {s.risk}
              </Badge>
            </div>
          ))}
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <Calculator className="h-4 w-4 shrink-0 text-primary" />
            ROI calculator in USD & LRD · Inflation-adjusted projections
          </li>
          <li className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            Risk level indicators · Verified project listings
          </li>
        </ul>
        <Button asChild className="bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-700 gap-2">
          <Link href="/invest">
            Open Investment Navigator
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
