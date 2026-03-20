"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageHero } from "@/components/layout/page-hero"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { TrendingUp, Fuel, Bus, ShoppingBasket, Zap, Calculator, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { CASCADE_SECTORS, computeCascadeImpact } from "@/lib/crisis/cascade-model"
import { SUBSTITUTIONS } from "@/lib/crisis/substitutions"
import Link from "next/link"

interface UserProfile {
  fuelGallonsPerMonth: number
  commuteType: "taxi" | "kekeh" | "motorcycle" | "bus" | "walking" | "personal_car"
  commuteTripsPerDay: number
  familySize: number
  hasGenerator: boolean
  generatorHoursPerDay: number
  riceConsumption: "low" | "medium" | "high"
}

const DEFAULT_PROFILE: UserProfile = {
  fuelGallonsPerMonth: 8,
  commuteType: "taxi",
  commuteTripsPerDay: 2,
  familySize: 4,
  hasGenerator: false,
  generatorHoursPerDay: 0,
  riceConsumption: "medium",
}

const COMMUTE_BASE_COSTS: Record<string, number> = {
  taxi: 150,
  kekeh: 75,
  motorcycle: 100,
  bus: 500,
  walking: 0,
  personal_car: 400,
}

export default function PersonalImpactPage() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE)
  const [fuelHikePercent, setFuelHikePercent] = useState(22)
  const [exchangeRate, setExchangeRate] = useState(190)
  const [calculated, setCalculated] = useState(false)

  useEffect(() => {
    fetch("/api/rates/live")
      .then((r) => r.json())
      .then((data) => { if (data.rate) setExchangeRate(data.rate) })
      .catch(() => {})
  }, [])

  const impact = useMemo(() => {
    if (!calculated) return null

    const cascadeResult = computeCascadeImpact(fuelHikePercent, exchangeRate)
    const transportMultiplier = 0.70
    const foodMultiplier = 0.35
    const electricityMultiplier = 0.85

    const commuteBaseCost = COMMUTE_BASE_COSTS[profile.commuteType] ?? 150
    const commuteIncrease = commuteBaseCost * (fuelHikePercent / 100) * transportMultiplier
    const monthlyCommuteExtra = commuteIncrease * profile.commuteTripsPerDay * 25

    const directFuelExtra = profile.fuelGallonsPerMonth * 800 * (fuelHikePercent / 100)

    const riceMultiplier = profile.riceConsumption === "high" ? 2 : profile.riceConsumption === "medium" ? 1.5 : 1
    const monthlyRiceBags = (profile.familySize / 4) * riceMultiplier
    const riceExtra = monthlyRiceBags * 4200 * (fuelHikePercent / 100) * foodMultiplier

    const oilExtra = (profile.familySize / 4) * 1800 * (fuelHikePercent / 100) * foodMultiplier * 2
    const otherFoodExtra = profile.familySize * 500 * (fuelHikePercent / 100) * foodMultiplier

    let generatorExtra = 0
    if (profile.hasGenerator && profile.generatorHoursPerDay > 0) {
      const dailyFuelCost = profile.generatorHoursPerDay * 200
      generatorExtra = dailyFuelCost * (fuelHikePercent / 100) * electricityMultiplier * 30
    }

    const totalExtraLRD = Math.round(
      monthlyCommuteExtra + directFuelExtra + riceExtra + oilExtra + otherFoodExtra + generatorExtra
    )
    const totalExtraUSD = Number((totalExtraLRD / exchangeRate).toFixed(2))

    return {
      breakdown: [
        { name: "Transportation", icon: "Bus", extra: Math.round(monthlyCommuteExtra), detail: `${profile.commuteTripsPerDay} ${profile.commuteType} trips/day` },
        { name: "Direct fuel cost", icon: "Fuel", extra: Math.round(directFuelExtra), detail: `${profile.fuelGallonsPerMonth} gallons/month` },
        { name: "Rice", icon: "ShoppingBasket", extra: Math.round(riceExtra), detail: `${monthlyRiceBags.toFixed(1)} bags for family of ${profile.familySize}` },
        { name: "Cooking oil & food", icon: "ShoppingBasket", extra: Math.round(oilExtra + otherFoodExtra), detail: "Palm oil, imported goods, other food" },
        { name: "Generator", icon: "Zap", extra: Math.round(generatorExtra), detail: profile.hasGenerator ? `${profile.generatorHoursPerDay}h/day` : "No generator" },
      ],
      totalExtraLRD,
      totalExtraUSD,
      cascadeResult,
    }
  }, [calculated, fuelHikePercent, exchangeRate, profile])

  const ICON_MAP: Record<string, React.ElementType> = { Bus, Fuel, ShoppingBasket, Zap }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
        <PageHero
          ariaLabel="Personal impact calculator"
          label="Impact Calculator"
          title="Personal Impact Calculator"
          description="Enter your household profile to see exactly how much more you'll spend each month from the fuel price hike."
          variant="centered"
          contentMaxWidth="max-w-3xl"
        />

        <section className="py-6 sm:py-8 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Fuel hike slider */}
              <Card className="border-border/40 rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Fuel className="h-5 w-5 text-primary" />
                    Fuel Price Increase
                  </CardTitle>
                  <CardDescription>How much has fuel gone up? Adjust the slider.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[fuelHikePercent]}
                      onValueChange={(v) => setFuelHikePercent(v[0])}
                      min={5}
                      max={60}
                      step={1}
                      className="flex-1"
                    />
                    <Badge variant="destructive" className="text-lg px-3 py-1 shrink-0">
                      +{fuelHikePercent}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Profile inputs */}
              <Card className="border-border/40 rounded-2xl">
                <CardHeader>
                  <CardTitle>Your Household Profile</CardTitle>
                  <CardDescription>Tell us about your spending so we can personalize the impact.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>How do you commute?</Label>
                      <Select value={profile.commuteType} onValueChange={(v) => setProfile({ ...profile, commuteType: v as UserProfile["commuteType"] })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="taxi">Taxi</SelectItem>
                          <SelectItem value="kekeh">Kekeh / Tricycle</SelectItem>
                          <SelectItem value="motorcycle">Motorcycle (Okada)</SelectItem>
                          <SelectItem value="bus">Bus</SelectItem>
                          <SelectItem value="personal_car">Personal Car</SelectItem>
                          <SelectItem value="walking">Walking</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Trips per day</Label>
                      <Input
                        type="number"
                        min={0}
                        max={10}
                        value={profile.commuteTripsPerDay}
                        onChange={(e) => setProfile({ ...profile, commuteTripsPerDay: Number(e.target.value) || 0 })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Family size</Label>
                      <Input
                        type="number"
                        min={1}
                        max={20}
                        value={profile.familySize}
                        onChange={(e) => setProfile({ ...profile, familySize: Number(e.target.value) || 1 })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Fuel gallons/month (personal use)</Label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={profile.fuelGallonsPerMonth}
                        onChange={(e) => setProfile({ ...profile, fuelGallonsPerMonth: Number(e.target.value) || 0 })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Rice consumption</Label>
                      <Select value={profile.riceConsumption} onValueChange={(v) => setProfile({ ...profile, riceConsumption: v as UserProfile["riceConsumption"] })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low (1-2 meals/day)</SelectItem>
                          <SelectItem value="medium">Medium (2 meals/day)</SelectItem>
                          <SelectItem value="high">High (3 meals/day)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Generator hours/day</Label>
                      <Input
                        type="number"
                        min={0}
                        max={24}
                        value={profile.generatorHoursPerDay}
                        onChange={(e) => {
                          const hours = Number(e.target.value) || 0
                          setProfile({ ...profile, generatorHoursPerDay: hours, hasGenerator: hours > 0 })
                        }}
                        placeholder="0 if no generator"
                      />
                    </div>
                  </div>

                  <Button
                    className="w-full mt-6 rounded-xl min-h-[48px] text-base"
                    size="lg"
                    onClick={() => setCalculated(true)}
                  >
                    <Calculator className="h-5 w-5 mr-2 text-primary" />
                    Calculate My Impact
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              {impact && (
                <div className="space-y-6">
                  <Card className="border-destructive/30 bg-destructive/5 rounded-2xl">
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <p className="text-sm text-muted-foreground mb-2">This fuel hike will cost your household</p>
                        <div className="text-4xl sm:text-5xl font-bold text-destructive">
                          +{impact.totalExtraLRD.toLocaleString()} LRD
                        </div>
                        <div className="text-lg text-muted-foreground mt-1">
                          ≈ ${impact.totalExtraUSD} USD per month
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border/40 rounded-2xl">
                    <CardHeader>
                      <CardTitle>Cost Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {impact.breakdown.map((item) => {
                        const Icon = ICON_MAP[item.icon] ?? TrendingUp
                        return (
                          <div key={item.name} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                            <Icon className="h-5 w-5 shrink-0 text-primary" />
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm">{item.name}</div>
                              <div className="text-xs text-muted-foreground">{item.detail}</div>
                            </div>
                            <div className="font-bold text-destructive shrink-0">
                              +{item.extra.toLocaleString()} LRD
                            </div>
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>

                  {/* Savings tips */}
                  <Card className="border-green-500/20 bg-green-500/5 rounded-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                        Ways to Reduce Your Impact
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {SUBSTITUTIONS.slice(0, 4).map((sub) => (
                        <div key={sub.id} className="flex items-start gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                          <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                          <div>
                            <span className="text-sm font-semibold">
                              Switch from {sub.primary.name} to {sub.alternatives[0]?.name}
                            </span>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              Save ~{sub.alternatives[0]?.savingsPercent}% — {sub.alternatives[0]?.tradeoff}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="pt-2">
                        <Link href="/crisis">
                          <Button variant="outline" className="rounded-xl w-full">
                            View full crisis dashboard
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
