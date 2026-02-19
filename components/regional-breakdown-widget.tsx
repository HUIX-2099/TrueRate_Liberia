"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, ChevronRight } from "lucide-react"
import Link from "next/link"

interface RegionalItem {
  region: string
  county?: string
  avgRate: number
  count: number
}

interface CountyItem {
  county: string
  region: string
  avgRate: number
  count: number
}

export function RegionalBreakdownWidget() {
  const [regional, setRegional] = useState<RegionalItem[]>([])
  const [byCounty, setByCounty] = useState<CountyItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/rates/regional")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.regional)) setRegional(data.regional)
        if (Array.isArray(data.byCounty)) setByCounty(data.byCounty)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardContent className="py-10">
          <div className="flex gap-4">
            <div className="flex-1 h-20 rounded-lg bg-muted/50 animate-pulse" />
            <div className="flex-1 h-32 rounded-lg bg-muted/50 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-xl border-border/60 shadow-sm overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2.5 text-lg font-semibold">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <MapPin className="h-4.5 w-4.5 text-primary" />
          </div>
          Regional breakdown
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Average USD/LRD rate by region. Monrovia (Montserrado) vs upcountry counties.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Monrovia vs Upcountry</p>
            <div className="space-y-2">
              {regional.map((r) => (
                <div
                  key={r.region}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border/50 bg-muted/30 px-4 py-3"
                >
                  <span className="font-medium text-foreground">{r.region}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-base font-semibold tabular-nums text-foreground">{r.avgRate.toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground">LRD</span>
                  </div>
                  <Badge variant="secondary" className="text-xs font-normal shrink-0">
                    {r.count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">By county</p>
            <div className="rounded-lg border border-border/50 bg-muted/20 divide-y divide-border/50 max-h-[200px] overflow-y-auto">
              {byCounty.slice(0, 8).map((c) => (
                <div
                  key={c.county}
                  className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm hover:bg-muted/40 transition-colors"
                >
                  <span className="font-medium text-foreground">{c.county}</span>
                  <span className="font-mono tabular-nums text-muted-foreground">{c.avgRate.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Link href="/analytics" className="inline-block">
          <Button variant="ghost" size="sm" className="gap-1.5 text-primary hover:text-primary hover:bg-primary/10 -ml-2">
            View full analytics
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
