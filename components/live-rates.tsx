"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, MapPin, Star } from "lucide-react"
import { useEffect, useState } from "react"

interface ChangerRate {
  id: string
  name: string
  location: string
  buyRate: number
  sellRate: number
  rating: number
  verified: boolean
  reviews: number
  lastUpdate: string
  trend: string
}

export function LiveRates() {
  const [rates, setRates] = useState<ChangerRate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRates() {
      try {
        const response = await fetch("/api/rates/live")
        const data = await response.json()
        setRates(data.changers)
      } catch (error) {
        console.error("[v0] Error fetching rates:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRates()
    const interval = setInterval(fetchRates, 300000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <section id="rates" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-lg text-muted-foreground">Loading live rates...</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="rates" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Live Exchange Rates</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Compare rates from verified money changers in real-time. Updated every 5 minutes.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
          {rates.map((rate) => (
            <Card key={rate.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{rate.name}</CardTitle>
                      {rate.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3" />
                      {rate.location}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-secondary text-secondary" />
                    <span className="text-sm font-medium">{rate.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Buy Rate</div>
                    <div className="text-2xl font-bold text-foreground">{rate.buyRate.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">LRD per USD</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Sell Rate</div>
                    <div className="text-2xl font-bold text-foreground">{rate.sellRate.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">LRD per USD</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                  <div
                    className={`inline-flex items-center gap-1 text-sm font-medium ${
                      rate.trend === "up"
                        ? "text-secondary"
                        : rate.trend === "down"
                          ? "text-destructive"
                          : "text-muted-foreground"
                    }`}
                  >
                    {rate.trend === "up" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : rate.trend === "down" ? (
                      <TrendingDown className="h-4 w-4" />
                    ) : null}
                    {rate.trend === "stable" ? "Stable" : rate.trend === "up" ? "Rising" : "Falling"}
                  </div>
                  <span className="text-xs text-muted-foreground">• {rate.reviews} reviews</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
