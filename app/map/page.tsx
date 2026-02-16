"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useMemo, useRef, useState } from "react"
import { MapPin, TrendingUp, TrendingDown, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { GoogleMap } from "@/components/google-map"
import { MarketLeaderboard } from "@/components/market-leaderboard"
import { RateFeedbackButtons } from "@/components/rate-feedback-buttons"
import { ErrorBoundary } from "@/components/error-boundary"
import { RegionalBreakdownWidget } from "@/components/regional-breakdown-widget"

interface LocationRate {
  id: string
  name: string
  county: string
  position: [number, number, number]
  lat: number
  lng: number
  rate: number
  trend: string
  verified: boolean
  openingHours?: string
  phone?: string
}

interface NearbyChanger {
  id: string
  name: string
  address: string
  rating?: number
  openNow?: boolean
  lat: number
  lng: number
  distanceKm?: number
  durationMinutes?: number
  openingHours?: string
  phone?: string
}

interface CommunityReport {
  id: string
  lat: number
  lng: number
  rate: number
  message?: string
  photoUrl?: string
  createdAt: string
}

export default function MapPage() {
  const [locations, setLocations] = useState<LocationRate[]>([])
  const [loading, setLoading] = useState(true)
  const [nearbyChangers, setNearbyChangers] = useState<NearbyChanger[]>([])
  const [nearbyStatus, setNearbyStatus] = useState<"idle" | "loading" | "ready" | "error">("idle")
  const [nearbyError, setNearbyError] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [communityReports, setCommunityReports] = useState<CommunityReport[]>([])
  const [reportRate, setReportRate] = useState("")
  const [reportMessage, setReportMessage] = useState("")
  const [reportSubmitting, setReportSubmitting] = useState(false)
  const lastSearchRef = useRef<string | null>(null)
  const { toast } = useToast()
  const mapMarkers = useMemo(
    () => [
      ...locations.map((location) => ({
        id: location.id,
        name: location.name,
        lat: location.lat,
        lng: location.lng,
        label: `${location.rate.toFixed(2)} LRD`,
      })),
      ...nearbyChangers.map((changer) => ({
        id: `nearby-${changer.id}`,
        name: changer.name,
        lat: changer.lat,
        lng: changer.lng,
        label: "Nearby",
      })),
      ...communityReports.map((r) => ({
        id: `report-${r.id}`,
        name: `Community: ${r.rate.toFixed(2)} LRD`,
        lat: r.lat,
        lng: r.lng,
        label: `${r.rate.toFixed(2)}`,
      })),
    ],
    [locations, nearbyChangers, communityReports],
  )
  const averageRate = locations.length
    ? locations.reduce((sum, location) => sum + location.rate, 0) / locations.length
    : 0
  const highestRate = locations.length
    ? locations.reduce((best, location) => (location.rate > best.rate ? location : best), locations[0])
    : null
  const lowestRate = locations.length
    ? locations.reduce((best, location) => (location.rate < best.rate ? location : best), locations[0])
    : null
  const verifiedCount = locations.filter((location) => location.verified).length

  useEffect(() => {
    async function fetchLocations() {
      try {
        const response = await fetch("/api/rates/live")
        const data = await response.json()

        const avg = data.rate ?? data.averageRate ?? 180
        const ch = data.changers || []
        const mappedLocations: LocationRate[] = [
          {
            id: "1",
            name: ch[0]?.name || "Monrovia Central",
            county: "Montserrado",
            position: [0, 0, 0],
            lat: 6.3156,
            lng: -10.8074,
            rate: ch[0]?.buyRate ?? avg,
            trend: ch[0]?.trend || "up",
            verified: ch[0]?.verified !== false,
            openingHours: ch[0]?.openingHours,
            phone: ch[0]?.phone,
          },
          {
            id: "2",
            name: ch[1]?.name || "Sinkor",
            county: "Montserrado",
            position: [1.5, 0, -0.5],
            lat: 6.2907,
            lng: -10.7716,
            rate: ch[1]?.buyRate ?? avg,
            trend: ch[1]?.trend || "up",
            verified: ch[1]?.verified !== false,
            openingHours: ch[1]?.openingHours,
            phone: ch[1]?.phone,
          },
          {
            id: "3",
            name: ch[2]?.name || "Paynesville",
            county: "Montserrado",
            position: [2, 0, 0.5],
            lat: 6.2901,
            lng: -10.7436,
            rate: ch[2]?.buyRate ?? avg,
            trend: ch[2]?.trend || "down",
            verified: ch[2]?.verified !== false,
            openingHours: ch[2]?.openingHours,
            phone: ch[2]?.phone,
          },
          {
            id: "4",
            name: "Buchanan",
            county: "Grand Bassa",
            position: [-2, 0, -1.5],
            lat: 5.8769,
            lng: -10.0499,
            rate: avg - 1,
            trend: "up",
            verified: true,
          },
          {
            id: "5",
            name: "Gbarnga",
            county: "Bong",
            position: [-1, 0, 2],
            lat: 6.9970,
            lng: -9.4718,
            rate: avg - 2.5,
            trend: "down",
            verified: true,
          },
          {
            id: "6",
            name: "Harper",
            county: "Maryland",
            position: [-3.5, 0, -2],
            lat: 4.3784,
            lng: -7.7113,
            rate: avg - 3.5,
            trend: "up",
            verified: true,
          },
          {
            id: "7",
            name: "Sanniquellie",
            county: "Nimba",
            position: [0.5, 0, 2.5],
            lat: 7.3611,
            lng: -8.6964,
            rate: avg - 2,
            trend: "stable",
            verified: true,
          },
          {
            id: "8",
            name: "Voinjama",
            county: "Lofa",
            position: [-0.5, 0, 3],
            lat: 8.4219,
            lng: -9.7478,
            rate: avg - 3,
            trend: "up",
            verified: true,
          },
          {
            id: "9",
            name: "Kakata",
            county: "Margibi",
            position: [1, 0, 0.2],
            lat: 6.5291,
            lng: -10.3517,
            rate: avg - 1.5,
            trend: "down",
            verified: true,
          },
          {
            id: "10",
            name: "Tubmanburg",
            county: "Bomi",
            position: [-1.5, 0, -0.5],
            lat: 6.8708,
            lng: -10.8211,
            rate: avg - 2.2,
            trend: "stable",
            verified: true,
          },
          {
            id: "11",
            name: "Robertsport",
            county: "Grand Cape Mount",
            position: [-2.5, 0, -1],
            lat: 6.7533,
            lng: -11.3686,
            rate: avg - 2.8,
            trend: "up",
            verified: true,
          },
        ]

        setLocations(mappedLocations)
      } catch (error) {
        console.error("[v0] Error fetching map data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLocations()
  }, [])

  useEffect(() => {
    fetch("/api/community/rate-reports")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.reports)) setCommunityReports(data.reports)
      })
      .catch(() => {})
  }, [])

  const submitReport = async (e: React.FormEvent) => {
    e.preventDefault()
    const rateNum = parseFloat(reportRate)
    if (!Number.isFinite(rateNum) || rateNum < 100 || rateNum > 300) {
      toast({ title: "Invalid rate", description: "Enter a rate between 100 and 300 LRD.", variant: "destructive" })
      return
    }
    const loc = userLocation ?? { lat: 6.3156, lng: -10.8074 }
    setReportSubmitting(true)
    try {
      const res = await fetch("/api/community/rate-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat: loc.lat, lng: loc.lng, rate: rateNum, message: reportMessage.trim() || undefined }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: "Could not submit", description: data?.error ?? "Try again.", variant: "destructive" })
        return
      }
      toast({ title: "Thanks!", description: "Your rate report was added to the map." })
      setReportRate("")
      setReportMessage("")
      if (data.report) setCommunityReports((prev) => [data.report, ...prev])
    } catch {
      toast({ title: "Error", description: "Could not submit report.", variant: "destructive" })
    } finally {
      setReportSubmitting(false)
    }
  }

  const handleMapReady = (map: google.maps.Map, location: { lat: number; lng: number } | null) => {
    if (!location) return
    setUserLocation(location)

    const key = `${location.lat.toFixed(4)},${location.lng.toFixed(4)}`
    if (lastSearchRef.current === key || nearbyStatus === "loading") return
    lastSearchRef.current = key

    setNearbyStatus("loading")
    setNearbyError(null)

    const service = new google.maps.places.PlacesService(map)
    service.nearbySearch(
      {
        location,
        radius: 5000,
        keyword: "money changer",
        type: "currency_exchange",
      },
      (results, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !results) {
          setNearbyStatus("error")
          setNearbyError("Unable to load nearby changers.")
          return
        }
        const mapped = results
          .filter((place) => place.geometry?.location)
          .slice(0, 8)
          .map((place) => ({
            id: place.place_id ?? place.name ?? "place",
            name: place.name ?? "Money Changer",
            address: place.vicinity ?? "",
            rating: place.rating,
            openNow: place.opening_hours?.isOpen?.(),
            lat: place.geometry!.location!.lat(),
            lng: place.geometry!.location!.lng(),
          }))
        const enriched = mapped.map((changer) => {
          if (!userLocation || !google.maps.geometry?.spherical) return changer
          const distanceMeters = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(userLocation.lat, userLocation.lng),
            new google.maps.LatLng(changer.lat, changer.lng),
          )
          const distanceKm = distanceMeters / 1000
          const durationMinutes = Math.max(1, Math.round((distanceKm / 30) * 60))
          return { ...changer, distanceKm, durationMinutes }
        })
        setNearbyChangers(enriched)
        setNearbyStatus("ready")
      },
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ErrorBoundary>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 sm:py-14 md:py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                <Badge className="mb-2">Interactive Map</Badge>
                <Badge className="bg-primary/10 text-primary">Live Rates</Badge>
                <Badge variant="secondary">All Counties</Badge>
                <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400">Location-Based</Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Exchange Rates Across Liberia
                </span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Explore live exchange rates from different counties and cities. Hover over locations to see details and find the best rates near you.
              </p>
            </div>
          </div>
        </section>

        {/* Google Map */}
        <section className="py-6 sm:py-8 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <Card className="overflow-hidden border-border/60 shadow-sm">
                <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-xl sm:text-2xl">Live Rate Map</CardTitle>
                    <CardDescription>Interactive map with live rates across Liberia</CardDescription>
                  </div>
                  <Badge variant="secondary">Coming soon</Badge>
                </CardHeader>
                <CardContent className="p-0 block overflow-hidden">
                  <div className="h-[360px] sm:h-[520px] lg:h-[600px] w-full flex flex-col items-center justify-center gap-4 bg-muted/30 border-t border-border/60">
                    <MapPin className="h-16 w-16 text-muted-foreground/60" />
                    <p className="text-lg font-medium text-muted-foreground">Coming soon</p>
                    <p className="text-sm text-muted-foreground text-center max-w-md px-4">
                      We’re building an interactive map with live rates across Liberia. Check back soon.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="mt-4 border-border/60">
                <CardHeader>
                  <CardTitle className="text-lg">Rate at this spot</CardTitle>
                  <CardDescription>
                    See a rate here? Report it so others can see. Your location is used when available.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={submitReport} className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="report-rate">Rate (LRD per 1 USD)</Label>
                      <Input
                        id="report-rate"
                        type="number"
                        inputMode="decimal"
                        min={100}
                        max={300}
                        step={0.01}
                        placeholder="e.g. 192.50"
                        value={reportRate}
                        onChange={(e) => setReportRate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="report-message">Note (optional)</Label>
                      <Input
                        id="report-message"
                        type="text"
                        placeholder="e.g. Waterside market"
                        value={reportMessage}
                        onChange={(e) => setReportMessage(e.target.value)}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button type="submit" disabled={reportSubmitting} className="gap-2">
                        <Send className="h-4 w-4" />
                        {reportSubmitting ? "Submitting…" : "Submit"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Live Leaderboard */}
        <section className="py-10 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-6 space-y-2">
                <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                  <Badge variant="outline">Live Leaderboard</Badge>
                  <Badge className="bg-primary/10 text-primary">Real-time</Badge>
                  <Badge variant="secondary">Every 15 min</Badge>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-balance">
                  <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                    Top Best Rates in Monrovia
                  </span>
                </h2>
                <p className="text-sm text-muted-foreground">
                  Live rankings updated every 15 minutes
                </p>
              </div>
              <MarketLeaderboard />
            </div>
          </div>
        </section>

        <section className="py-10 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8 space-y-3">
                <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                  <Badge variant="outline">Nearby</Badge>
                  <Badge className="bg-primary/10 text-primary">Location-Based</Badge>
                  <Badge variant="secondary">Google Places</Badge>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-balance">
                  <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                    Nearby Money Changers
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                  Real-time results based on your current location using Google Places API.
                </p>
              </div>
              {nearbyStatus === "loading" && (
                <Card>
                  <CardContent className="p-6 text-sm text-muted-foreground">
                    Finding money changers near you…
                  </CardContent>
                </Card>
              )}
              {nearbyStatus === "error" && (
                <Card>
                  <CardContent className="p-6 text-sm text-muted-foreground">
                    {nearbyError ?? "Unable to load nearby changers."}
                  </CardContent>
                </Card>
              )}
              {nearbyStatus === "ready" && nearbyChangers.length === 0 && (
                <Card>
                  <CardContent className="p-6 text-sm text-muted-foreground">
                    No nearby changers found within 5 km.
                  </CardContent>
                </Card>
              )}
              {nearbyChangers.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {nearbyChangers.map((changer) => (
                    <Card key={changer.id} className="border-border/60 shadow-sm transition-shadow hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{changer.name}</CardTitle>
                        <CardDescription>{changer.address || "Address unavailable"}</CardDescription>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground space-y-1">
                        {typeof changer.distanceKm === "number" && typeof changer.durationMinutes === "number" && (
                          <div>
                            {changer.distanceKm.toFixed(1)} km • ~{changer.durationMinutes} min
                          </div>
                        )}
                        {typeof changer.rating === "number" && (
                          <div>Rating: {changer.rating.toFixed(1)}</div>
                        )}
                        {typeof changer.openNow === "boolean" && (
                          <div>{changer.openNow ? "Open now" : "Closed now"}</div>
                        )}
                        {changer.openingHours && <div>{changer.openingHours}</div>}
                        {changer.phone && (
                          <a href={`tel:${changer.phone.replace(/\s/g, "")}`} className="text-primary hover:underline text-sm">
                            {changer.phone}
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              {nearbyStatus === "idle" && (
                <Card>
                  <CardContent className="p-6 text-sm text-muted-foreground">
                    Coming soon — nearby money changers will appear here.
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* Regional breakdown */}
        <section className="py-12 sm:py-14 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8 space-y-3">
                <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                  <Badge variant="outline">Regional breakdown</Badge>
                  <Badge className="bg-primary/10 text-primary">Live</Badge>
                  <Badge variant="secondary">By county</Badge>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-balance">
                  <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                    Rates by Region
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Average USD/LRD rates across Monrovia and upcountry counties.
                </p>
              </div>
              <RegionalBreakdownWidget />
            </div>
          </div>
        </section>

        {/* Map Legend */}
        <section className="py-12 sm:py-14 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                  <Badge variant="outline">Map Guide</Badge>
                  <Badge className="bg-primary/10 text-primary">Interactive</Badge>
                  <Badge variant="secondary">Easy Navigation</Badge>
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                    How to Use the Map
                  </span>
                </h2>
                <p className="text-sm text-muted-foreground">Navigate and explore exchange rates across Liberia</p>
              </div>
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-card/80 to-secondary/5 shadow-sm">
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Navigation</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Drag to rotate the map</li>
                        <li>• Scroll to zoom in/out</li>
                        <li>• Hover over markers for rate details</li>
                        <li>• Click and drag to pan</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Markers</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Green markers = Verified changers</li>
                        <li>• Orange markers = Community reported</li>
                        <li>• Larger markers = Major cities</li>
                        <li>• Height indicates rate volume</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Rate Summary */}
        <section className="py-12 sm:py-14 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-8 space-y-3">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                <Badge variant="outline">Rate Summary</Badge>
                <Badge className="bg-primary/10 text-primary">Market Overview</Badge>
                <Badge variant="secondary">Verified Data</Badge>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-balance">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Market Rate Summary
                </span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Comprehensive snapshot across verified locations to help you compare and make informed decisions.
              </p>
            </div>
            <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-3">
              <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <CardTitle className="text-base text-green-700 dark:text-green-400">Highest Rate</CardTitle>
                  </div>
                  <CardDescription className="text-green-600/70">{highestRate?.name || "Loading..."}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-green-600">
                    {highestRate ? highestRate.rate.toFixed(2) : "--"}
                  </div>
                  <div className="text-xs text-green-600/70 mt-1">LRD per USD</div>
                </CardContent>
              </Card>
              <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <CardTitle className="text-base text-red-700 dark:text-red-400">Lowest Rate</CardTitle>
                  </div>
                  <CardDescription className="text-red-600/70">{lowestRate?.name || "Loading..."}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-red-600">
                    {lowestRate ? lowestRate.rate.toFixed(2) : "--"}
                  </div>
                  <div className="text-xs text-red-600/70 mt-1">LRD per USD</div>
                </CardContent>
              </Card>
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-card shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </div>
                    <CardTitle className="text-base text-primary">Average Rate</CardTitle>
                  </div>
                  <CardDescription className="text-primary/70">{verifiedCount} verified locations</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-primary">
                    {averageRate ? averageRate.toFixed(2) : "--"}
                  </div>
                  <div className="text-xs text-primary/70 mt-1">Market average</div>
                  {averageRate != null && (
                    <RateFeedbackButtons
                      rate={averageRate}
                      location="Map (average)"
                      compact
                      className="mt-2"
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      </ErrorBoundary>
      <Footer />
    </div>
  )
}
