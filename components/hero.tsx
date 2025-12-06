"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, TrendingUp, TrendingDown, Zap, Shield, Globe } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export function Hero() {
  const [rate, setRate] = useState<number | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string>("Loading…")
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('up')
  const [changePercent, setChangePercent] = useState(0.8)

  useEffect(() => {
    let isMounted = true
    async function fetchRate() {
      try {
        const res = await fetch("/api/rates/live")
        const data = await res.json()
        if (isMounted && typeof data.rate === "number") {
          setRate(data.rate)
          setLastUpdate("Just now")
          // Simulate trend (in production this would come from API)
          const change = (Math.random() - 0.5) * 2
          setChangePercent(Math.abs(change))
          setTrend(change > 0 ? 'up' : change < 0 ? 'down' : 'stable')
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
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/2 -left-20 h-60 w-60 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-40 w-40 rounded-full bg-accent/10 blur-2xl" />
      </div>

      <div className="container relative mx-auto px-6 sm:px-8 md:px-12 lg:px-16 py-16 md:py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-8">
            {/* Live Badge */}
            <div className="inline-flex items-center gap-3 rounded-full border border-border/50 bg-card/80 backdrop-blur-sm px-5 py-2 text-sm w-fit shadow-lg">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
              </span>
              <span className="text-muted-foreground font-medium">Live Updates</span>
              <span className="text-foreground font-semibold">• {lastUpdate}</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-[1.1]">
                The most accurate{" "}
                <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                  exchange rates
                </span>{" "}
                in Liberia
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground text-pretty max-w-2xl leading-relaxed">
                TrueRate aggregates data from <strong className="text-foreground">100+ trusted sources</strong> including 
                the Central Bank, licensed changers, and international APIs to deliver real-time USD/LRD rates 
                with <strong className="text-foreground">AI-powered predictions</strong>.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2 h-14 px-8 text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all" asChild>
                <Link href="/converter">
                  Try Converter
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 h-14 px-8 text-lg bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all" asChild>
                <Link href="/predictions">
                  <TrendingUp className="h-5 w-5" />
                  View Predictions
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-8 pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-foreground">100+</span>
                  <span className="text-sm text-muted-foreground">Data Sources</span>
                </div>
              </div>
              <div className="h-12 w-px bg-border hidden sm:block" />
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-foreground">99.2%</span>
                  <span className="text-sm text-muted-foreground">Accuracy</span>
                </div>
              </div>
              <div className="h-12 w-px bg-border hidden sm:block" />
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-foreground">60s</span>
                  <span className="text-sm text-muted-foreground">Updates</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Rate Card */}
          <div className="relative lg:ml-auto w-full max-w-md mx-auto lg:mx-0">
            {/* Main Card */}
            <div className="relative rounded-3xl border border-border/50 bg-card/80 backdrop-blur-xl p-8 shadow-2xl">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="px-3 py-1">
                    <span className="relative flex h-2 w-2 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                    </span>
                    Live Rate
                  </Badge>
                </div>
                <span className={`inline-flex items-center gap-1 text-sm font-semibold ${
                  trend === 'up' ? 'text-destructive' : trend === 'down' ? 'text-secondary' : 'text-muted-foreground'
                }`}>
                  {trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {trend === 'up' ? '+' : '-'}{changePercent.toFixed(2)}%
                </span>
              </div>

              {/* Main Rate Display */}
              <div className="text-center mb-8">
                <div className="text-6xl md:text-7xl font-bold text-foreground tracking-tight">
                  {rate ? rate.toFixed(2) : "—"}
                </div>
                <div className="text-lg text-muted-foreground mt-2">LRD per 1 USD</div>
              </div>

              {/* Buy/Sell Rates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-secondary/10 p-4 text-center">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Buy Rate</div>
                  <div className="text-2xl font-bold text-secondary">
                    {rate ? (rate - 2).toFixed(2) : "—"}
                  </div>
                </div>
                <div className="rounded-2xl bg-destructive/10 p-4 text-center">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Sell Rate</div>
                  <div className="text-2xl font-bold text-destructive">
                    {rate ? (rate + 2).toFixed(2) : "—"}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Aggregated from 100+ sources</span>
                <Link href="/analytics" className="text-xs font-medium text-primary hover:underline">
                  View History →
                </Link>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-gradient-to-br from-secondary/30 to-secondary/5 blur-2xl" />
            <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-gradient-to-br from-primary/30 to-primary/5 blur-2xl" />
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  )
}
