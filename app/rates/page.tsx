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
      } catch {
        // Ignore invalid cached data.
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
        <section className="py-12 md:py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-4">Live Rates</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">USD to LRD Live Rate</h1>
              <p className="text-lg text-muted-foreground text-pretty">
                Real-time updates from verified changers across Liberia.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl">Current USD/LRD</CardTitle>
                  <CardDescription>Updated {lastUpdate}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-4xl font-bold text-primary">{liveRate.toFixed(2)} LRD</div>
                  <div className="text-sm text-muted-foreground">
                    Sources: {sourceCount ? `${sourceCount} changers` : "Loading..."}
                  </div>
                </CardContent>
              </Card>

              <Card>
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

        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid gap-6 lg:grid-cols-3">
              <Card>
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
                        <TrendingUp className="h-5 w-5 text-red-500" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-green-500" />
                      )}
                      <span className={change >= 0 ? "text-red-500" : "text-green-500"}>
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

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mini Rate Trend</CardTitle>
                  <CardDescription>Last 12 updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-20 w-full rounded-lg bg-background flex items-center justify-center">
                    {sparklinePath ? (
                      <svg viewBox="0 0 100 40" className="h-full w-full">
                        <path
                          d={sparklinePath}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-primary"
                        />
                      </svg>
                    ) : (
                      <span className="text-xs text-muted-foreground">Collecting data...</span>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Changers</CardTitle>
                  <CardDescription>Highest rated today</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {topChangers.length ? (
                    topChangers.map((changer) => (
                      <div key={changer.id} className="flex items-center justify-between text-sm">
                        <div className="min-w-0">
                          <div className="font-medium truncate">{changer.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{changer.location}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{changer.buyRate.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">⭐ {changer.rating}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">Loading changers...</div>
                  )}
                </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="text-lg">Financial Recommendation</CardTitle>
                  <CardDescription>Based on today’s rate movement</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {recommendation}
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
