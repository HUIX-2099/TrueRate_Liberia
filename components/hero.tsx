"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export function Hero() {
  const [rate, setRate] = useState<number | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string>("Loading…")

  useEffect(() => {
    let isMounted = true
    async function fetchRate() {
      try {
        const res = await fetch("/api/rates/live")
        const data = await res.json()
        if (isMounted && typeof data.rate === "number") {
          setRate(data.rate)
          setLastUpdate("Just now")
        }
      } catch (e) {
        // keep graceful fallback
      }
    }
    fetchRate()
    const id = setInterval(fetchRate, 60000)
    return () => {
      isMounted = false
      clearInterval(id)
    }
  }, [])

  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              <span className="text-muted-foreground">Live • {lastUpdate}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              The most accurate exchange rates in <span className="text-primary">Liberia</span>
            </h1>

            <p className="text-lg text-muted-foreground text-pretty max-w-xl">
              TrueRate aggregates data from 100+ trusted sources including the Central Bank, licensed changers, and
              international APIs to deliver real-time USD/LRD rates with AI-powered predictions.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/converter">
                  Try Converter
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 bg-transparent" asChild>
                <Link href="/predictions">
                  <TrendingUp className="h-4 w-4" />
                  View Predictions
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-foreground">100+</span>
                <span className="text-sm text-muted-foreground">Data Sources</span>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-foreground">99.2%</span>
                <span className="text-sm text-muted-foreground">Accuracy</span>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-foreground">60s</span>
                <span className="text-sm text-muted-foreground">Updates</span>
              </div>
            </div>
          </div>

          <div className="relative lg:ml-auto">
            <div className="relative rounded-2xl border border-border bg-card p-6 shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Current Rate</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-secondary">
                    <TrendingUp className="h-3 w-3" />
                    +0.8%
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-foreground">
                    {rate ? `${rate.toFixed(2)} LRD` : "—"}
                  </div>
                  <div className="text-sm text-muted-foreground">per 1 USD</div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Buy Rate</div>
                    <div className="text-lg font-semibold text-foreground">
                      {rate ? (rate - 2).toFixed(2) : "—"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Sell Rate</div>
                    <div className="text-lg font-semibold text-foreground">
                      {rate ? (rate + 2).toFixed(2) : "—"}
                    </div>
                  </div>
                </div>
                <div className="pt-2 text-xs text-muted-foreground">Aggregated from 100+ sources</div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-secondary/20 blur-3xl" />
            <div className="absolute -top-4 -left-4 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
