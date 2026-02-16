"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"
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
      <Card className="border-border/60">
        <CardContent className="py-12">
          <div className="h-32 bg-muted/50 rounded-lg animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/60 overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5 text-primary" />
          Regional breakdown
        </CardTitle>
        <CardDescription>
          Average USD/LRD rate by region. Monrovia (Montserrado) vs upcountry counties.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-2">Monrovia vs Upcountry</div>
            <div className="space-y-2">
              {regional.map((r) => (
                <div
                  key={r.region}
                  className="flex items-center justify-between gap-2 p-3 rounded-lg bg-muted/50 border border-border/40"
                >
                  <span className="font-medium">{r.region}</span>
                  <span className="font-mono font-semibold text-primary">{r.avgRate.toFixed(2)} LRD</span>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {r.count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-2">By county</div>
            <div className="space-y-1.5 max-h-[180px] overflow-y-auto">
              {byCounty.slice(0, 8).map((c) => (
                <div key={c.county} className="flex items-center justify-between py-2 text-sm border-b border-border/40 last:border-0">
                  <span>{c.county}</span>
                  <span className="font-mono text-muted-foreground">{c.avgRate.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Link
          href="/analytics"
          className="inline-block mt-4 text-sm font-medium text-primary hover:underline"
        >
          View full analytics →
        </Link>
      </CardContent>
    </Card>
  )
}
