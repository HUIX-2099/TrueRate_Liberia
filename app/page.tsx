"use client"

import dynamic from "next/dynamic"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  TrendingUp,
  Globe,
  Calculator,
  Shield,
  Send,
  Users,
  Gift,
  Brain,
  Bell,
  BarChart3,
  ShoppingCart,
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageSection } from "@/components/layout/page-section"
import { SectionHeader } from "@/components/layout/section-header"
import { PageContainer } from "@/components/layout/page-container"
import { StickyMobileRateBar } from "@/components/sticky-mobile-rate-bar"
import { GovernmentSourceBadge } from "@/components/government-source-badge"
import { DollarizationRiskIndicator } from "@/components/dollarization-risk-indicator"

import { useLiveRate } from "@/lib/live-rate-context"
import { ListSkeleton, CardSkeleton, SectionHeaderSkeleton } from "@/components/ui/skeleton-presets"

/* Lazy-load below-the-fold components for Core Web Vitals (LCP, TTI) */
const RegionalBreakdownWidget = dynamic(
  () => import("@/components/regional-breakdown-widget").then((m) => ({ default: m.RegionalBreakdownWidget })),
  { loading: () => <ListSkeleton rows={4} className="min-h-[200px]" />, ssr: true }
)
const Features = dynamic(
  () => import("@/components/features").then((m) => ({ default: m.Features })),
  { loading: () => <SectionHeaderSkeleton />, ssr: true }
)
const TrustSignals = dynamic(
  () => import("@/components/trust-signals").then((m) => ({ default: m.TrustSignals })),
  { loading: () => <CardSkeleton lines={3} className="min-h-[180px]" />, ssr: true }
)
import { PriceIndex, MarketNews, InflationTracker } from "@/components/liberia-features"

export default function HomePage() {
  const { rate: liveRate } = useLiveRate()

  return (
    <div className="min-h-screen flex flex-col w-full min-w-0">
      <Header />
      <StickyMobileRateBar />
      <main id="main-content" className="flex-1 w-full min-w-0 overflow-x-hidden" role="main">
        <Hero />

        {/* Quick Access Cards */}
        <PageSection variant="muted" ariaLabelledBy="tools-heading">
          <PageContainer className="min-w-0">
            <SectionHeader
              id="tools-heading"
              badge={
                <>
                  <Badge variant="outline" className="text-[11px] sm:text-xs">Tools</Badge>
                  <Badge variant="outline" className="text-[11px] sm:text-xs">100% Free</Badge>
                  <Badge variant="secondary" className="text-[11px] sm:text-xs">Built for everyday decisions</Badge>
                </>
              }
              title="Make safer money decisions every day"
              description="Check rates, compare prices, and plan your spending with clear tools grounded in Liberia's real market."
            />
            <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto w-full min-w-0 [&>*]:min-w-0">

              {/* 1. Currency Converter — most used daily */}
              <Link
                href="/converter"
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl sm:rounded-2xl block min-w-0"
              >
                <Card className="group h-full hover:border-border/60 min-w-0">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/40 border border-border/40">
                        <Calculator className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">Currency Converter</h3>
                        <p className="text-sm text-muted-foreground">Convert USD and LRD using live market rates you can verify.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* 2. Diaspora Mode — for Liberians abroad */}
              <Link
                href="/diaspora"
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl sm:rounded-2xl block min-w-0"
              >
                <Card className="group relative h-full min-w-0 overflow-hidden border-primary/20 bg-gradient-to-br from-cyan-500/10 via-background to-indigo-500/10 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                  <div className="pointer-events-none absolute -top-12 -right-12 h-28 w-28 rounded-full bg-cyan-400/20 blur-2xl" aria-hidden />
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/15 border border-cyan-300/35">
                        <Globe className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">Diaspora Mode</h3>
                          <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/35 bg-cyan-500/15 px-2 py-0.5 text-[10px] font-semibold text-cyan-800 dark:text-cyan-200">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400/80 opacity-60" />
                              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-300" />
                            </span>
                            Active
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">Stay connected to home with live rates, remittance tools, and marketplace access.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* 3. Check a Price — is this fair? */}
              <Link
                href="/price-index"
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl sm:rounded-2xl block min-w-0"
              >
                <Card className="group h-full hover:border-border/60 min-w-0">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/40 border border-border/40">
                        <ShoppingCart className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">Check a Price</h3>
                          <Badge
                            variant="secondary"
                            className="text-xs font-semibold border border-amber-300/40 bg-gradient-to-r from-amber-500/20 to-yellow-500/10 text-amber-700 dark:text-amber-200"
                          >
                            Fair price?
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Unsure about a price? Compare it against current market data before you buy.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* 4. Report Fraud — community safety */}
              <Link
                href="/report-fraud"
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl sm:rounded-2xl block min-w-0"
              >
                <Card className="group relative h-full min-w-0 overflow-hidden border-rose-300/25 bg-gradient-to-br from-rose-500/10 via-background to-red-500/10 hover:border-rose-300/50 hover:shadow-lg hover:shadow-rose-500/10 transition-all duration-300">
                  <div className="pointer-events-none absolute -top-12 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full bg-rose-400/20 blur-2xl" aria-hidden />
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/15 border border-rose-300/35">
                        <Shield className="h-6 w-6 text-rose-700 dark:text-rose-300" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">Report Fraud</h3>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-200">
                            Community safety
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">Report bad rates or scams to protect others and strengthen trust in the community.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* 5. Remittance tools */}
              <Link
                href="/tools/remittance"
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl sm:rounded-2xl block min-w-0"
              >
                <Card className="group h-full hover:border-border/60 min-w-0">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/40 border border-border/40">
                        <Send className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">Remittance Tools</h3>
                          <Badge
                            variant="secondary"
                            className="text-xs font-semibold border border-violet-300/40 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/10 text-violet-700 dark:text-violet-200"
                          >
                            Popular
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Compare transfer costs, plan amounts, and choose better timing for family support.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* 6. Community — report rates, earn points */}
              <Link
                href="/community"
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl sm:rounded-2xl block min-w-0"
              >
                <Card className="group h-full hover:border-border/60 min-w-0">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/40 border border-border/40">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">Community</h3>
                        <p className="text-sm text-muted-foreground">Share local prices and rate updates so everyone can make better choices.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* 7. Practical tools */}
              <Link
                href="/tools"
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl sm:rounded-2xl block min-w-0"
              >
                <Card className="group h-full hover:border-border/60 min-w-0">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/40 border border-border/40">
                        <Bell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">Practical Tools</h3>
                          <Badge
                            variant="secondary"
                            className="text-xs font-semibold border border-emerald-300/40 bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-700 dark:text-emerald-200"
                          >
                            Free
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Use budgeting, inflation, and student planning tools built for everyday USD/LRD decisions.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* 8. Today's Market (/market) */}
              <Link
                href="/market"
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl sm:rounded-2xl block min-w-0"
              >
                <Card className="group h-full hover:border-border/60 min-w-0">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/40 border border-border/40">
                        <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">Today&apos;s Market</h3>
                          <Badge
                            variant="secondary"
                            className="text-xs font-semibold border border-cyan-300/40 bg-gradient-to-r from-cyan-500/20 to-sky-500/10 text-cyan-700 dark:text-cyan-200"
                          >
                            Live
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">See live USD/LRD rates, CBL vs market context, and daily price movement in one place.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* 9. Rate outlook */}
              <Link
                href="/predictions"
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl sm:rounded-2xl block min-w-0"
              >
                <Card className="group h-full hover:border-border/60 min-w-0">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/40 border border-border/40">
                        <Brain className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">Rate Outlook</h3>
                          <Badge
                            variant="secondary"
                            className="text-xs font-semibold border border-indigo-300/40 bg-gradient-to-r from-indigo-500/20 to-blue-500/10 text-indigo-700 dark:text-indigo-200"
                          >
                            Planning
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Use short-term outlooks to plan exchange timing, budgeting, and remittance decisions.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

            </div>
          </PageContainer>
        </PageSection>

        {/* Regional breakdown + Quick Tools */}
        <PageSection ariaLabelledBy="rates-by-region-heading">
          <PageContainer maxWidth="4xl" className="space-y-6 min-w-0">
            <SectionHeader
              id="rates-by-region-heading"
              badge={
                <>
                  <Badge variant="outline" className="font-medium text-[11px] sm:text-xs">Economic growth</Badge>
                  <Badge variant="outline" className="text-[11px] sm:text-xs">Live</Badge>
                </>
              }
              title="Economic Growth: Monrovia vs Upcountry"
              description={`Monrovia typically grows faster than upcountry. Expand "See county breakdown" to view county-level detail.`}
              actions={
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-stretch justify-center gap-2 w-full sm:w-auto max-w-sm sm:max-w-none mx-auto">
                  <Button variant="outline" size="sm" className="gap-2 rounded-lg min-h-[44px] px-4 font-medium" asChild>
                    <Link href="/converter">
                      <Calculator className="h-4 w-4 shrink-0 text-primary" />
                      Converter
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 rounded-lg min-h-[44px] px-4 font-medium" asChild>
                    <Link href="/tools">
                      <Bell className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                      Alerts
                    </Link>
                  </Button>
                </div>
              }
            />
            <RegionalBreakdownWidget />
          </PageContainer>
        </PageSection>

        {/* LRD Health Section */}
        <PageSection ariaLabelledBy="dollarization-risk-heading">
          <PageContainer maxWidth="4xl" className="min-w-0">
            <SectionHeader
              id="dollarization-risk-heading"
              badge={
                <>
                  <Badge variant="outline" className="text-[11px] sm:text-xs">LRD health</Badge>
                  <Badge variant="outline" className="text-[11px] sm:text-xs">Live</Badge>
                  <Badge variant="secondary" className="text-[11px] sm:text-xs">CBL data</Badge>
                </>
              }
              title="LRD Health"
              description="A simple snapshot of LRD stability today—based on USD demand, the LRD trend, and liquidity stress."
            />
            <DollarizationRiskIndicator />
          </PageContainer>
        </PageSection>

        {/* Liberia Price Index & Market Insights */}
        <PageSection
          variant="muted"
          ariaLabelledBy="price-index-heading"
          className="relative pb-12 sm:pb-16 md:pb-20"
        >
          <div className="absolute inset-0 pointer-events-none overflow-x-hidden rounded-none" aria-hidden />
          <PageContainer className="min-w-0 relative">
            <SectionHeader
              id="price-index-heading"
              badge={
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Badge variant="outline" className="text-[11px] sm:text-xs font-medium">
                    Essential goods
                  </Badge>
                  <Badge variant="outline" className="text-[11px] sm:text-xs">
                    Live prices
                  </Badge>
                  <GovernmentSourceBadge
                    source="lisgis"
                    href="https://lisgis.gov.lr/pricestats.php"
                  />
                </div>
              }
              title="Liberia Price Index & Market Insights"
              description="Real-time essential goods prices, inflation trends, and local market news — one place for cost of living and market intelligence."
              actions={
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                  <Button size="sm" className="gap-2 rounded-lg min-h-[44px] px-4 font-medium shadow-sm" asChild>
                    <Link href="/price-index">
                      <BarChart3 className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                      View full Price Index
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2 rounded-lg min-h-[44px] px-4 font-medium" asChild>
                    <Link href="/market-intelligence">
                      <TrendingUp className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" aria-hidden />
                      Market Intelligence
                    </Link>
                  </Button>
                </div>
              }
            />
            <div className="rounded-xl sm:rounded-2xl border border-border/50 bg-card shadow-sm min-w-0 max-w-6xl mx-auto">
              <div className="grid gap-0 grid-cols-1 lg:grid-cols-3 max-w-6xl w-full min-w-0">
                <div className="min-w-0 lg:col-span-2 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-border/40">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/40 border border-border/40">
                        <ShoppingCart className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                        Price Index
                      </h3>
                    </div>
                    <Badge variant="outline" className="text-[10px]">Essential basket</Badge>
                  </div>
                  <PriceIndex rate={liveRate} variant="full" showSearch showCategoryTabs essentialOnly />
                </div>
                <div className="min-w-0 p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/40 border border-border/40">
                      <TrendingUp className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                      Inflation & context
                    </h3>
                  </div>
                  <InflationTracker />
                </div>
              </div>
            </div>
            <div className="w-full max-w-6xl mx-auto mt-6 sm:mt-8 pt-2 min-w-0 pb-8 sm:pb-10 overflow-visible">
              <div className="flex items-center gap-2 mb-4 scroll-mt-24">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/40 border border-border/40">
                  <Bell className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                  Market news
                </h3>
              </div>
              <MarketNews />
            </div>
          </PageContainer>
        </PageSection>

        <Features />
        <TrustSignals />

        {/* Referral CTA */}
        <PageSection className="bg-muted/10">
          <PageContainer maxWidth="5xl" className="min-w-0">
            <div className="rounded-xl sm:rounded-2xl border border-border/50 bg-card px-4 py-6 sm:px-8 sm:py-10 md:px-10 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left shadow-sm min-w-0">
              <div className="flex flex-col md:flex-row items-center gap-4 w-full min-w-0">
                <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-muted/40 border border-border/40 flex items-center justify-center shadow-sm shrink-0">
                  <Gift className="h-7 w-7 sm:h-8 sm:w-8 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="space-y-2 min-w-0">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2 mb-2">
                    <Badge variant="outline" className="text-[11px] sm:text-xs">Referral Program</Badge>
                    <Badge variant="outline" className="text-[11px] sm:text-xs">Free Premium</Badge>
                  </div>
                  <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-foreground">Invite friends, get rewards</h3>
                  <p className="text-xs sm:text-base text-muted-foreground max-w-md">
                    Both you and your friend get 1 month of premium SMS alerts — completely free.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <Button size="lg" className="gap-2 w-full md:w-auto shadow-sm min-h-[44px]" asChild>
                  <Link href="/community#referral">
                    Start Sharing
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full md:w-auto min-h-[44px]" asChild>
                  <Link href="/community">See how it works</Link>
                </Button>
              </div>
            </div>
          </PageContainer>
        </PageSection>

        {/* CTA Section */}
        <PageSection className="relative pb-24 md:pb-0 bg-muted/10 border-t border-border/20">
          <PageContainer className="relative text-center min-w-0">
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-4">
              <Badge
                variant="secondary"
                className="text-foreground bg-muted/20 border border-border/50 font-semibold text-[11px] sm:text-xs"
              >
                Ready when you are
              </Badge>
              <Badge
                variant="secondary"
                className="text-foreground bg-muted/20 border border-border/50 font-semibold text-[11px] sm:text-xs"
              >
                Used by families and businesses
              </Badge>
            </div>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mt-4 mb-4 text-balance text-foreground">
              Start with what you need today
            </h2>
            <p className="text-sm sm:text-lg mb-6 sm:mb-10 max-w-2xl mx-auto opacity-90 text-pretty">
              People use TrueRate to check rates, protect their spending, and make everyday money decisions with more confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button size="lg" className="gap-2 min-h-[44px] sm:min-h-[48px] w-full sm:w-auto shadow-sm" asChild>
                <Link href="/converter">
                  Open Converter
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="min-h-[44px] sm:min-h-[48px] w-full sm:w-auto"
                asChild
              >
                <Link href="/predictions">View Rate Outlook</Link>
              </Button>
            </div>
          </PageContainer>
        </PageSection>
      </main>
      <Footer />
    </div>
  )
}
