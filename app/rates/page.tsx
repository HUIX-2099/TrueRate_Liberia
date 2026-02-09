"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, TrendingDown, TrendingUp } from "lucide-react"

interface Changer {
  id: string
  name: string
  location: string
  buyRate: number
  sellRate: number
  rating: number
  verified: boolean
}

export default function RatesPage() {
  const [liveRate, setLiveRate] = useState(180)
  const [lastUpdate, setLastUpdate] = useState("Loading...")
  const [sourceCount, setSourceCount] = useState(0)
  const [changers, setChangers] = useState<Changer[]>([])
  const [recentRates, setRecentRates] = useState<number[]>([])
  const [previousDayRate, setPreviousDayRate] = useState<number | null>(null)

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch("/api/rates/live")
        const data = await res.json()
        const rate = data?.rate ?? data?.averageRate
        if (rate) setLiveRate(rate)
        if (Array.isArray(data?.changers)) setSourceCount(data.changers.length)
        if (Array.isArray(data?.changers)) setChangers(data.changers)
        setLastUpdate(new Date().toLocaleTimeString())
      } catch (error) {
        console.error("[Rates] Failed to fetch rate", error)
        setLastUpdate("Recently")
      }
    }
    fetchRate()
    const interval = setInterval(fetchRate, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const today = new Date().toDateString()
    const storedDate = window.localStorage.getItem("truerate-last-date")
    const storedRate = window.localStorage.getItem("truerate-last-rate")
    const storedPrev = window.localStorage.getItem("truerate-prev-day-rate")

    if (storedDate && storedDate !== today && storedRate) {
      window.localStorage.setItem("truerate-prev-day-rate", storedRate)
      setPreviousDayRate(Number.parseFloat(storedRate))
    } else if (storedPrev) {
      setPreviousDayRate(Number.parseFloat(storedPrev))
    }

    window.localStorage.setItem("truerate-last-date", today)
    window.localStorage.setItem("truerate-last-rate", liveRate.toString())
  }, [liveRate])

  useEffect(() => {
    if (!Number.isFinite(liveRate)) return
    setRecentRates((prev) => {
      const seeded = prev.length === 0 ? [liveRate, liveRate] : [...prev, liveRate]
      const next = seeded.slice(-12)
      window.localStorage.setItem("truerate-recent-rates", JSON.stringify(next))
      return next
    })
  }, [liveRate])

  useEffect(() => {
    const stored = window.localStorage.getItem("truerate-recent-rates")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length) {
          setRecentRates(parsed.filter((value) => typeof value === "number"))
        }
      } catch (error) {
        console.error("[Rates] Invalid cached recent rates JSON", error)
        window.localStorage.removeItem("truerate-recent-rates")
      }
    }
  }, [])

  const change = useMemo(() => {
    if (previousDayRate === null) return null
    return liveRate - previousDayRate
  }, [liveRate, previousDayRate])

  const recommendation = useMemo(() => {
    if (change === null) {
      return "Track the rate today and set an alert near your typical buy/sell target."
    }
    if (change >= 1.5) {
      return "Rate is rising fast; consider buying USD sooner or set a sell alert."
    }
    if (change <= -1.5) {
      return "Rate is easing; consider waiting or setting a lower buy target."
    }
    return "Rate is stable; compare changers and set a tight alert band."
  }, [change])

  const sparklinePath = useMemo(() => {
    if (recentRates.length < 2) return ""
    const min = Math.min(...recentRates)
    const max = Math.max(...recentRates)
    const range = max - min || 1
    const points = recentRates.map((value, index) => {
      const x = (index / (recentRates.length - 1)) * 100
      const y = 40 - ((value - min) / range) * 40
      return `${x},${y}`
    })
    return `M ${points.join(" L ")}`
  }, [recentRates])

  const topChangers = useMemo(() => {
    return [...changers].sort((a, b) => b.rating - a.rating).slice(0, 3)
  }, [changers])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 sm:py-14 md:py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                <Badge variant="outline">Live Rates</Badge>
                <Badge variant="secondary">Updated {lastUpdate}</Badge>
                <Badge variant="outline">
                  {sourceCount ? `${sourceCount} changers` : "Loading sources"}
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance"><span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">USD to LRD Live Rate</span></h1>
              <p className="text-base sm:text-lg text-muted-foreground text-pretty">
                Real-time updates from verified changers across Liberia.
              </p>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
              <Card className="border-primary/30 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">Current USD/LRD</CardTitle>
                  <CardDescription>Updated {lastUpdate}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-1">{liveRate.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground font-medium">LRD per USD</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded-lg border border-border/60 px-3 py-2 text-center bg-muted/20">
                      <div className="text-muted-foreground">Sources</div>
                      <div className="font-semibold text-foreground">
                        {sourceCount ? `${sourceCount}` : "..."}
                      </div>
                    </div>
                    <div className="rounded-lg border border-border/60 px-3 py-2 text-center bg-green-50 dark:bg-green-950/20">
                      <div className="text-muted-foreground">Buy</div>
                      <div className="font-semibold text-green-700 dark:text-green-400">
                        {Math.max(liveRate - 1.5, 0).toFixed(2)}
                      </div>
                    </div>
                    <div className="rounded-lg border border-border/60 px-3 py-2 text-center bg-blue-50 dark:bg-blue-950/20">
                      <div className="text-muted-foreground">Sell</div>
                      <div className="font-semibold text-blue-700 dark:text-blue-400">
                        {(liveRate + 1.5).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">Explore the Market</CardTitle>
                  <CardDescription>Compare locations and trends</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    See where rates are best and compare verified changers by county.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Link href="/map">
                      <Button variant="outline" className="gap-2">
                        <MapPin className="h-4 w-4" />
                        Open Rate Map
                      </Button>
                    </Link>
                    <Link href="/analytics">
                      <Button className="gap-2">
                        <TrendingUp className="h-4 w-4" />
                        View Analytics
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid gap-6 lg:grid-cols-3">
              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Daily Change</CardTitle>
                  <CardDescription>Compared to previous day</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {change === null ? (
                    <div className="text-sm text-muted-foreground">Not enough history yet.</div>
                  ) : (
                    <div className="flex items-center gap-2 text-2xl font-bold">
                      {change >= 0 ? (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      )}
                      <span className={change >= 0 ? "text-green-600" : "text-red-600"}>
                        {change >= 0 ? "+" : ""}
                        {change.toFixed(2)} LRD
                      </span>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Stored locally and updates on your next daily visit.
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Rate Trend</CardTitle>
                  <CardDescription>Last 12 updates • {recentRates.length} data points</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-24 w-full rounded-lg bg-gradient-to-b from-muted/20 to-muted/5 border border-border/40 flex items-center justify-center relative overflow-hidden">
                    {sparklinePath ? (
                      <svg viewBox="0 0 100 40" className="h-full w-full absolute inset-0">
                        <defs>
                          <linearGradient id="sparkline-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
                          </linearGradient>
                        </defs>
                        <path
                          d={`${sparklinePath} L 100,40 L 0,40 Z`}
                          fill="url(#sparkline-gradient)"
                          stroke="none"
                        />
                        <path
                          d={sparklinePath}
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <span className="text-xs text-muted-foreground">Collecting data...</span>
                    )}
                  </div>
                  {recentRates.length >= 2 && (
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                      <span>Range: {(Math.min(...recentRates)).toFixed(2)} - {(Math.max(...recentRates)).toFixed(2)}</span>
                      <span className="text-primary font-medium">
                        {recentRates[recentRates.length - 1] > recentRates[recentRates.length - 2] ? '↗' : recentRates[recentRates.length - 1] < recentRates[recentRates.length - 2] ? '↘' : '→'}
                        {(recentRates[recentRates.length - 1] - recentRates[recentRates.length - 2]).toFixed(2)}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Top Rated Changers</CardTitle>
                  <CardDescription>Highest rated by community</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {topChangers.length ? (
                    topChangers.map((changer, index) => (
                      <div key={changer.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                            #{index + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm truncate">{changer.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{changer.location}</div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-semibold text-sm">{changer.buyRate.toFixed(2)}</div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span className="text-yellow-500">★</span>
                            <span>{changer.rating}</span>
                            {changer.verified && <Badge variant="secondary" className="text-xs px-1 py-0 h-4">✓</Badge>}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground text-center py-4">Loading changers...</div>
                  )}
                  {topChangers.length > 0 && (
                    <div className="pt-2 border-t border-border/40">
                      <Link href="/map" className="text-sm text-primary hover:underline">
                        View all changers on map →
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="lg:col-span-3 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    Smart Recommendation
                  </CardTitle>
                  <CardDescription>AI-powered insights based on today’s rate movement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-foreground font-medium leading-relaxed">
                        {recommendation}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link href="/analytics">
                        <Button variant="outline" size="sm" className="gap-2">
                          <TrendingUp className="h-4 w-4" />
                          View Trends
                        </Button>
                      </Link>
                      <Link href="/community">
                        <Button variant="outline" size="sm" className="gap-2">
                          <MapPin className="h-4 w-4" />
                          Find Nearby
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
