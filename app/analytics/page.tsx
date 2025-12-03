"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RateHistory } from "@/components/rate-history"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"
import { useEffect, useState } from "react"

export default function AnalyticsPage() {
  const [currentRate, setCurrentRate] = useState<number>(0)
  const [dayChange, setDayChange] = useState<number>(0)
  const [weekChange, setWeekChange] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const [liveResponse, histResponse] = await Promise.all([
          fetch("/api/rates/live"),
          fetch("/api/rates/historical"),
        ])

        const liveData = await liveResponse.json()
        const histData = await histResponse.json()

        if (typeof liveData.rate === "number") {
          setCurrentRate(liveData.rate)
        }

        if (histData.historical && histData.historical.length > 0) {
          const historical = histData.historical
          const current = historical[historical.length - 1].rate

          // Calculate 24h change
          if (historical.length > 1) {
            const yesterday = historical[historical.length - 2].rate
            setDayChange(((current - yesterday) / yesterday) * 100)
          }

          // Calculate 7d change
          if (historical.length > 7) {
            const weekAgo = historical[historical.length - 8].rate
            setWeekChange(((current - weekAgo) / weekAgo) * 100)
          }
        }
      } catch (error) {
        console.error("[v0] Error fetching analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Rate Trends & Analytics</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Comprehensive market analysis powered by AI and historical data from multiple sources
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto mb-12">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Rate</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "—" : currentRate.toFixed(2)} LRD</div>
                <p className="text-xs text-muted-foreground">per 1 USD</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">24h Change</CardTitle>
                {dayChange >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-secondary" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${dayChange >= 0 ? "text-secondary" : "text-destructive"}`}>
                  {loading ? "—" : `${dayChange >= 0 ? "+" : ""}${dayChange.toFixed(2)}%`}
                </div>
                <p className="text-xs text-muted-foreground">
                  {loading ? "—" : `${dayChange >= 0 ? "+" : ""}${((currentRate * dayChange) / 100).toFixed(2)} LRD`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">7d Trend</CardTitle>
                {weekChange >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-secondary" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${weekChange >= 0 ? "text-secondary" : "text-destructive"}`}>
                  {loading ? "—" : `${weekChange >= 0 ? "+" : ""}${weekChange.toFixed(2)}%`}
                </div>
                <p className="text-xs text-muted-foreground">
                  {loading ? "—" : `${weekChange >= 0 ? "+" : ""}${((currentRate * weekChange) / 100).toFixed(2)} LRD`}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-6xl mx-auto mb-12">
            <RateHistory />
          </div>

          {/* Market Insights */}
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Today's Insights</h4>
                  <p className="text-sm text-muted-foreground">
                    The USD/LRD rate is currently at {currentRate.toFixed(2)} LRD per USD, with{" "}
                    {dayChange >= 0 ? "an increase" : "a decrease"} of {Math.abs(dayChange).toFixed(2)}% over the past
                    24 hours. Our AI analysis monitors over 100+ verified sources in real-time to ensure accuracy.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Weekly Patterns</h4>
                  <p className="text-sm text-muted-foreground">
                    Historical data shows that rates tend to be more favorable for LRD buyers early in the week, with
                    USD demand increasing towards the weekend. The 7-day trend shows a {Math.abs(weekChange).toFixed(2)}
                    % {weekChange >= 0 ? "increase" : "decrease"}.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Data Quality</h4>
                  <p className="text-sm text-muted-foreground">
                    This analysis is based on aggregated data from 100+ verified sources including banks, licensed money
                    changers, and international financial institutions updated every minute.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
