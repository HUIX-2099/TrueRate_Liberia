"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, ChevronRight } from "lucide-react"
import Link from "next/link"
import { CountyFlag } from "@/lib/county-flags"

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
      <Card className="rounded-md border-border/60 shadow-sm">
        <CardContent className="py-10">
          <div className="flex gap-4">
            <div className="flex-1 h-20 rounded-md bg-muted/50 animate-pulse" />
            <div className="flex-1 h-32 rounded-md bg-muted/50 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const monrovia = regional.find((r) => r.region === "Monrovia")
  const upcountry = regional.find((r) => r.region === "Upcountry")

  return (
    <Card className="rounded-md border-border/60 shadow-sm overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2.5 text-lg font-semibold">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
            <MapPin className="h-4.5 w-4.5 text-primary" />
          </div>
          Regional breakdown
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Average USD/LRD rate by region. Monrovia (Montserrado) vs upcountry counties.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Monrovia vs Upcountry */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Monrovia vs Upcountry</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-md border border-border/50 bg-muted/30 p-4 text-center">
              <p className="text-sm font-medium text-foreground mb-2">Monrovia</p>
              <p className="text-2xl font-bold font-mono tabular-nums text-foreground">
                {(monrovia ?? regional[0])?.avgRate.toFixed(2) ?? "—"}
              </p>
              <p className="text-xs text-muted-foreground">LRD</p>
              <p className="text-xs text-muted-foreground mt-1">{(monrovia ?? regional[0])?.count ?? 0}</p>
            </div>
            <div className="rounded-md border border-border/50 bg-muted/30 p-4 text-center">
              <p className="text-sm font-medium text-foreground mb-2">Upcountry</p>
              <p className="text-2xl font-bold font-mono tabular-nums text-foreground">
                {(upcountry ?? regional[1])?.avgRate.toFixed(2) ?? "—"}
              </p>
              <p className="text-xs text-muted-foreground">LRD</p>
              <p className="text-xs text-muted-foreground mt-1">{(upcountry ?? regional[1])?.count ?? 0}</p>
            </div>
          </div>
        </div>

        {/* By county */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">By county</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {byCounty.slice(0, 10).map((c) => (
              <div
                key={c.county}
                className="rounded-md border border-border/50 bg-muted/30 p-3 text-center"
              >
                <div className="flex justify-center mb-2">
                  <CountyFlag county={c.county} className="h-7 w-9 rounded shadow-sm" />
                </div>
                <p className="text-lg font-bold font-mono tabular-nums text-foreground">{c.avgRate.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">LRD</p>
                <p className="text-sm font-medium text-foreground mt-1.5">{c.county}</p>
              </div>
            ))}
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
