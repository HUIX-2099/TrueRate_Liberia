"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageHero } from "@/components/layout/page-hero"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CrisisSeverityMeter } from "@/components/crisis/CrisisSeverityMeter"
import { CascadeImpactChain } from "@/components/crisis/CascadeImpactChain"
import { EarlyWarningPanel } from "@/components/crisis/EarlyWarningPanel"
import { SEVERITY_COLORS, type SeverityLevel } from "@/lib/crisis/severity-engine"
import type { CascadeResult } from "@/lib/crisis/cascade-model"
import type { EarlyWarningResult } from "@/lib/crisis/early-warning"
import { AlertTriangle, ArrowRight, CheckCircle2, Fuel, TrendingUp, Clock, Users, Bell, Shield } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface SeverityData {
  level: SeverityLevel
  score: number
  headline: string
  description: string
  recommendations: string[]
  signals: Array<{
    id: string
    name: string
    category: string
    score: number
    direction: "up" | "down" | "stable"
    description: string
  }>
}

export default function CrisisDashboardPage() {
  const [severity, setSeverity] = useState<SeverityData | null>(null)
  const [cascade, setCascade] = useState<CascadeResult | null>(null)
  const [warnings, setWarnings] = useState<EarlyWarningResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      fetch("/api/crisis/severity").then((r) => r.json()),
      fetch("/api/crisis/cascade?fuelChange=22&rate=190").then((r) => r.json()),
      fetch("/api/crisis/warnings").then((r) => r.json()),
    ]).then(([sevRes, casRes, warnRes]) => {
      if (sevRes.status === "fulfilled") setSeverity(sevRes.value)
      if (casRes.status === "fulfilled") setCascade(casRes.value)
      if (warnRes.status === "fulfilled") setWarnings(warnRes.value)
      setLoading(false)
    })
  }, [])

  const severityColors = severity ? SEVERITY_COLORS[severity.level] : SEVERITY_COLORS.yellow

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
        <PageHero
          ariaLabel="Crisis monitor"
          label="Live Crisis Monitor"
          title="Crisis Monitor"
          description="Real-time monitoring of economic shocks in Liberia. Track how price hikes ripple through the economy and get actionable advice to protect your finances."
          variant="centered"
          badges={
            <Badge variant="destructive" className="gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              Live Crisis Monitor
            </Badge>
          }
          contentMaxWidth="max-w-4xl"
        />

        {/* Severity Meter */}
        <section className="py-6 sm:py-8 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {loading ? (
                <div className="h-40 rounded-2xl bg-muted/50 animate-pulse" />
              ) : severity ? (
                <CrisisSeverityMeter
                  level={severity.level}
                  score={severity.score}
                  headline={severity.headline}
                  description={severity.description}
                />
              ) : null}
            </div>
          </div>
        </section>

        {/* Main Content Tabs */}
        <section className="py-6 sm:py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Tabs defaultValue="cascade" className="space-y-6">
                <TabsList className="grid w-full grid-cols-1 gap-1.5 rounded-xl border border-border/50 bg-muted/40 p-1.5 h-auto sm:grid-cols-3">
                  <TabsTrigger value="cascade" className="w-full gap-1.5 text-xs sm:text-sm py-2.5 min-h-[44px]">
                    <Fuel className="h-4 w-4 text-primary" />
                    <span className="hidden sm:inline">Price</span> Cascade
                  </TabsTrigger>
                  <TabsTrigger value="warnings" className="w-full gap-1.5 text-xs sm:text-sm py-2.5 min-h-[44px]">
                    <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Early <span className="hidden sm:inline">Warning</span>
                  </TabsTrigger>
                  <TabsTrigger value="actions" className="w-full gap-1.5 text-xs sm:text-sm py-2.5 min-h-[44px]">
                    <Shield className="h-4 w-4 text-primary" />
                    Actions
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="cascade">
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 rounded-xl bg-muted/50 animate-pulse" />
                      ))}
                    </div>
                  ) : cascade ? (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        Showing impact of {cascade.fuelChangePercent}% fuel price increase
                      </div>
                      <CascadeImpactChain
                        fuelChangePercent={cascade.fuelChangePercent}
                        sectors={cascade.sectors}
                        overallCOLChangePercent={cascade.overallCOLChangePercent}
                      />
                      <Card className="border-destructive/20 bg-destructive/5 rounded-2xl">
                        <CardContent className="p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                            <span className="font-bold text-lg">Total Monthly Impact</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-2xl font-bold text-destructive">
                                +{cascade.totalMonthlyImpactLRD.toLocaleString()} LRD
                              </div>
                              <p className="text-xs text-muted-foreground">Extra cost per month</p>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-destructive">
                                +${cascade.totalMonthlyImpactUSD} USD
                              </div>
                              <p className="text-xs text-muted-foreground">At current exchange rate</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : null}
                </TabsContent>

                <TabsContent value="warnings">
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 rounded-xl bg-muted/50 animate-pulse" />
                      ))}
                    </div>
                  ) : warnings ? (
                    <EarlyWarningPanel
                      signals={warnings.signals}
                      predictions={warnings.predictions}
                      overallRisk={warnings.overallRisk}
                      riskScore={warnings.riskScore}
                    />
                  ) : null}
                </TabsContent>

                <TabsContent value="actions">
                  <div className="space-y-6">
                    {severity?.recommendations && (
                      <Card className="border-border/40 rounded-2xl">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                            Recommended Actions
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {severity.recommendations.map((rec, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted/40 border border-border/40 text-primary text-xs font-bold shrink-0">
                                {i + 1}
                              </span>
                              <span className="text-sm">{rec}</span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      <Link href="/tools/impact">
                        <Card className="border-border/40 rounded-2xl hover:shadow-md transition-shadow cursor-pointer h-full">
                          <CardContent className="p-5 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-muted/40 border border-border/40 flex items-center justify-center shrink-0">
                              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold mb-0.5">Personal Impact Calculator</h3>
                              <p className="text-xs text-muted-foreground">See how much more YOU will spend per month</p>
                            </div>
                            <ArrowRight className="h-5 w-5 ml-auto shrink-0 text-muted-foreground" />
                          </CardContent>
                        </Card>
                      </Link>

                      <Link href="/community/report-gouging">
                        <Card className="border-border/40 rounded-2xl hover:shadow-md transition-shadow cursor-pointer h-full">
                          <CardContent className="p-5 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-muted/40 border border-border/40 flex items-center justify-center shrink-0">
                              <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold mb-0.5">Report Price Gouging</h3>
                              <p className="text-xs text-muted-foreground">Flag businesses charging unfair prices</p>
                            </div>
                            <ArrowRight className="h-5 w-5 ml-auto shrink-0 text-muted-foreground" />
                          </CardContent>
                        </Card>
                      </Link>

                      <Link href="/community/availability">
                        <Card className="border-border/40 rounded-2xl hover:shadow-md transition-shadow cursor-pointer h-full">
                          <CardContent className="p-5 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-muted/40 border border-border/40 flex items-center justify-center shrink-0">
                              <Users className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold mb-0.5">Availability Tracker</h3>
                              <p className="text-xs text-muted-foreground">Find where fuel and essentials are in stock</p>
                            </div>
                            <ArrowRight className="h-5 w-5 ml-auto shrink-0 text-muted-foreground" />
                          </CardContent>
                        </Card>
                      </Link>

                      <Link href="/crisis/history">
                        <Card className="border-border/40 rounded-2xl hover:shadow-md transition-shadow cursor-pointer h-full">
                          <CardContent className="p-5 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-muted/40 border border-border/40 flex items-center justify-center shrink-0">
                              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold mb-0.5">Crisis History</h3>
                              <p className="text-xs text-muted-foreground">Learn from past economic shocks</p>
                            </div>
                            <ArrowRight className="h-5 w-5 ml-auto shrink-0 text-muted-foreground" />
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-8 sm:py-10 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-bold mb-4">Quick Tools</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Link href="/tools/budget">
                  <Card className="border-border/40 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-1">💰</div>
                      <div className="text-xs font-semibold">Survival Budget</div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/community/group-buy">
                  <Card className="border-border/40 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-1">🤝</div>
                      <div className="text-xs font-semibold">Group Buy</div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/tools/remittance">
                  <Card className="border-border/40 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-1">📲</div>
                      <div className="text-xs font-semibold">Emergency Send</div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/price-index">
                  <Card className="border-border/40 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-1">🔍</div>
                      <div className="text-xs font-semibold">Price Check</div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
