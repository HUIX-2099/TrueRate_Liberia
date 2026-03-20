"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Calculator, DollarSign, PiggyBank, TrendingUp, ArrowRight,
  Smartphone, GraduationCap, Send, ShoppingBasket, Fuel, Bus,
  Home, Heart, Zap, Clock, Shield, ArrowUpDown, ChevronRight,
  TrendingDown, Users, Star, Lightbulb, Bell, Banknote,
  Building2, Globe, AlertCircle, Phone, Stethoscope, BookOpen,
} from "lucide-react"
import { SMSAlertSignup } from "@/components/liberia-features"
import { PushNotifications } from "@/components/push-notifications"
import { PlanInLRD } from "@/components/plan-in-lrd"
import { PageHero } from "@/components/layout/page-hero"
import { useLiveRate } from "@/lib/live-rate-context"

const DAILY_COSTS = [
  { label: "Taxi ride", lrd: 150, icon: <Bus className="h-4 w-4 text-blue-600 dark:text-blue-400" />, color: "text-blue-600 dark:text-blue-400" },
  { label: "Kekeh ride", lrd: 75, icon: <Bus className="h-4 w-4 text-blue-600 dark:text-blue-400" />, color: "text-purple-600 dark:text-purple-400" },
  { label: "Rice (25kg)", lrd: 4500, icon: <ShoppingBasket className="h-4 w-4 text-primary" />, color: "text-green-600 dark:text-green-400" },
  { label: "Gallon of fuel", lrd: 900, icon: <Fuel className="h-4 w-4 text-primary" />, color: "text-orange-600 dark:text-orange-400" },
  { label: "Phone credit", lrd: 250, icon: <Phone className="h-4 w-4 text-primary" />, color: "text-indigo-600 dark:text-indigo-400" },
  { label: "Meal for one", lrd: 300, icon: <ShoppingBasket className="h-4 w-4 text-primary" />, color: "text-red-600 dark:text-red-400" },
  { label: "Monthly rent (basic)", lrd: 35000, icon: <Home className="h-4 w-4 text-primary" />, color: "text-teal-600 dark:text-teal-400" },
  { label: "Doctor visit", lrd: 3000, icon: <Stethoscope className="h-4 w-4 text-primary" />, color: "text-rose-600 dark:text-rose-400" },
]

const TOOL_CATEGORIES = [
  {
    id: "daily",
    label: "Everyday Money",
    icon: <Banknote className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />,
    tools: [
      {
        href: "/converter",
        icon: ArrowUpDown,
        title: "Currency Converter",
        description: "Convert USD to LRD with live rates so you can check fair value before paying.",
        badge: "Most Used",
        accent: "primary" as const,
      },
      {
        href: "/tools/remittance",
        icon: Send,
        title: "Remittance Calculator",
        description: "Compare fees & rates across Western Union, MoneyGram, Mobile Money and more.",
        badge: "Popular",
        accent: "secondary" as const,
      },
      {
        href: "/tools/budget",
        icon: PiggyBank,
        title: "Budget Planner",
        description: "Track income & expenses in USD and LRD. See how rate changes affect your budget.",
        accent: "green" as const,
      },
    ],
  },
  {
    id: "plan",
    label: "Plan & Save",
    icon: <PiggyBank className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />,
    tools: [
      {
        href: "/tools/inflation",
        icon: TrendingUp,
        title: "Inflation Tracker",
        description: "Track how purchasing power changes over time with CPI data from LISGIS.",
        badge: "New",
        accent: "amber" as const,
      },
      {
        href: "/tools/student-budget",
        icon: GraduationCap,
        title: "Student Budget Tool",
        description: "Semester cost estimator for UL, Cuttington, Stella Maris — tuition, transport, living.",
        accent: "violet" as const,
      },
      {
        href: "/tools/impact",
        icon: Zap,
        title: "Personal Impact Calculator",
        description: "See how fuel price hikes and rate changes affect your daily commute, food, and utilities.",
        accent: "orange" as const,
      },
    ],
  },
  {
    id: "send",
    label: "Send & Support",
    icon: <Heart className="h-3.5 w-3.5 text-primary" />,
    tools: [
      {
        href: "/diaspora/marketplace",
        icon: ShoppingBasket,
        title: "Diaspora Marketplace",
        description: "Buy & deliver rice, fuel, school supplies directly to loved ones in Liberia.",
        accent: "primary" as const,
      },
      {
        href: "/invest",
        icon: Building2,
        title: "Invest Back Home",
        description: "Real estate, treasury bonds, and small business investment opportunities.",
        accent: "secondary" as const,
      },
      {
        href: "/tools/remittance",
        icon: Globe,
        title: "Send Money with Clarity",
        description: "Find the cheapest way to support family — compare providers, see what your money buys.",
        badge: "Diaspora",
        accent: "green" as const,
      },
    ],
  },
]

const ACCENT_ICON_STYLES: Record<string, string> = {
  primary: "bg-muted/40 text-foreground border border-border/40",
  secondary: "bg-muted/40 text-foreground border border-border/40",
  amber: "bg-muted/40 text-foreground border border-border/40",
  green: "bg-muted/40 text-foreground border border-border/40",
  violet: "bg-muted/40 text-foreground border border-border/40",
  orange: "bg-muted/40 text-foreground border border-border/40",
}

const ACCENT_BORDER_STYLES: Record<string, string> = {
  primary: "hover:border-border/60",
  secondary: "hover:border-border/60",
  amber: "hover:border-border/60",
  green: "hover:border-border/60",
  violet: "hover:border-border/60",
  orange: "hover:border-border/60",
}

export default function ToolsPage() {
  const { effectiveRate: liveRate } = useLiveRate()
  const [quickUSD, setQuickUSD] = useState("")
  const rate = typeof liveRate === "number" ? liveRate : 185
  const [lastUpdate] = useState("Just now")

  const quickLRD = useMemo(() => {
    const usd = parseFloat(quickUSD)
    if (!usd || usd <= 0) return null
    return usd * rate
  }, [quickUSD, rate])

  const alertLow = typeof liveRate === "number" ? (liveRate - 2).toFixed(2) : "—"
  const alertHigh = typeof liveRate === "number" ? (liveRate + 2).toFixed(2) : "—"

  const heroStats = [
    { value: rate.toFixed(2), caption: "LRD per USD", icon: <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> },
    { value: "100%", caption: "Free forever", icon: <Shield className="h-4 w-4 text-primary" />, iconClassName: "bg-secondary/15 text-secondary" },
    { value: "Live", caption: "Every minute", icon: <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />, iconClassName: "bg-green-500/15 text-green-600 dark:text-green-400" },
  ]

  const quickConvertCard = (
    <div className="rounded-xl sm:rounded-2xl border border-border/50 bg-card p-4 sm:p-5 md:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden>
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-70" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">Quick Convert</span>
      </div>
      <p className="text-sm text-muted-foreground mb-4">How much is that in Liberian dollars?</p>
      <div className="relative mb-4">
        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        <Input
          type="number"
          placeholder="Enter USD amount..."
          value={quickUSD}
          onChange={(e) => setQuickUSD(e.target.value)}
          className="pl-10 h-12 sm:h-14 text-lg sm:text-xl font-semibold rounded-xl"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">USD</span>
      </div>
      <div className={`rounded-xl border p-4 text-center ${quickLRD ? "border-border/60 bg-muted/20" : "border-border/30 bg-muted/10"}`}>
        {quickLRD ? (
          <>
            <div className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
              {quickLRD.toLocaleString(undefined, { maximumFractionDigits: 0 })} LRD
            </div>
            <div className="text-xs text-muted-foreground mt-1">at {rate.toFixed(2)} LRD/USD</div>
          </>
        ) : (
          <div className="text-muted-foreground text-sm py-1">Type an amount above to see it in LRD</div>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {[5, 10, 20, 50, 100, 500].map((preset) => (
          <button
            key={preset}
            onClick={() => setQuickUSD(preset.toString())}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${ quickUSD === preset.toString() ? "border-border/60 bg-muted/30 text-foreground" : "border-border/40 text-muted-foreground hover:border-border/60 hover:text-foreground" }`}
          >
            ${preset}
          </button>
        ))}
      </div>
      <Button asChild className="w-full rounded-xl h-11 gap-2 mt-4 font-semibold">
        <Link href="/converter">
          Full Converter with History <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
        <PageHero
          ariaLabel="Tools hero: Financial tools for Liberia"
          label="Your Everyday Money Toolkit"
          title="Convert, plan & save — powered by real rates"
          description="Free tools built for how Liberians actually use money every day. Remittance, budget, inflation, and more."
          variant="left"
          pill={{ text: "Live · Financial Tools", live: true }}
          stats={heroStats}
        >
          {quickConvertCard}
        </PageHero>

        {/* Daily Costs Reference */}
        <section className="py-8 sm:py-10 bg-muted/10 border-b border-border/20">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-foreground">What Things Cost Today</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Common prices in Monrovia at today&apos;s rate</p>
              </div>
              <Badge variant="outline" className="gap-1 text-xs shrink-0">
                <Clock className="h-3 w-3 text-blue-600 dark:text-blue-400" /> Live
              </Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {DAILY_COSTS.map((item) => {
                const usd = item.lrd / rate
                return (
                  <div
                    key={item.label}
                    className="p-3.5 rounded-xl border border-border/30 bg-card hover:border-border/60 transition-colors text-center"
                  >
                    <div className={`mx-auto mb-2 opacity-80 ${item.color}`}>
                      {item.icon}
                    </div>
                    <div className="text-lg font-bold tabular-nums text-foreground">
                      {item.lrd >= 10000 ? `${(item.lrd / 1000).toFixed(0)}k` : item.lrd.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-medium">LRD</div>
                    <div className="text-[10px] text-muted-foreground font-semibold mt-1">
                      ${usd < 1 ? usd.toFixed(2) : usd.toFixed(usd < 10 ? 2 : 0)}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{item.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Tools by Category */}
        <section className="py-10 sm:py-12 md:py-14" aria-label="Financial tools">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Pick Your Tool</h2>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                Everything uses live USD/LRD rates. Choose what you need — whether you&apos;re budgeting daily or sending money from abroad.
              </p>
            </div>

            <Tabs defaultValue="daily" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 gap-1.5 rounded-xl border border-border/50 bg-muted/40 p-1.5 h-auto sm:grid-cols-3 lg:w-auto lg:inline-flex">
                {TOOL_CATEGORIES.map((cat) => (
                  <TabsTrigger key={cat.id} value={cat.id} className="w-full gap-1.5 px-3 py-2.5 text-xs sm:text-sm min-h-[44px]">
                    {cat.icon} {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {TOOL_CATEGORIES.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {category.tools.map((tool) => {
                      const Icon = tool.icon
                      return (
                        <Link key={tool.href + tool.title} href={tool.href} className="group block">
                          <Card className={`h-full rounded-2xl border border-border/30 bg-card shadow-sm transition-colors duration-200 ${ACCENT_BORDER_STYLES[tool.accent]}`}>
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between gap-3">
                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${ACCENT_ICON_STYLES[tool.accent]}`}>
                                  <Icon className="h-6 w-6 text-primary" />
                                </div>
                                {tool.badge && (
                                  <Badge variant="secondary" className="text-[10px] font-medium rounded-full shrink-0">
                                    {tool.badge}
                                  </Badge>
                                )}
                              </div>
                              <CardTitle className="text-lg font-semibold mt-3 text-foreground">
                                {tool.title}
                              </CardTitle>
                              <CardDescription className="text-sm leading-snug">
                                {tool.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                                Open tool <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      )
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {/* All tools quick grid below tabs */}
            <div className="mt-10 pt-8 border-t border-border/20">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">All Tools at a Glance</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { href: "/converter", label: "Converter" },
                  { href: "/tools/remittance", label: "Remittance" },
                  { href: "/tools/budget", label: "Budget" },
                  { href: "/tools/inflation", label: "Inflation" },
                  { href: "/tools/student-budget", label: "Student" },
                  { href: "/tools/impact", label: "Impact" },
                ].map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border/30 bg-card hover:border-border/60 transition-colors"
                  >
                    <span className="text-sm font-medium text-foreground">{t.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Plan in LRD Feature */}
        <section className="py-10 sm:py-12 bg-muted/10 border-t border-border/20">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Plan in Liberian Dollars</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Need a specific amount in LRD? Enter your target and we&apos;ll calculate how much USD to send today.
                  Set a rate alert so you can send at the best time.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center shrink-0 mt-0.5">
                      <Calculator className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">Set your LRD target</div>
                      <div className="text-xs text-muted-foreground">How much do you need in Liberian dollars?</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center shrink-0 mt-0.5">
                      <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">Get rate alerts</div>
                      <div className="text-xs text-muted-foreground">We notify you when the rate is in your favor</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center shrink-0 mt-0.5">
                      <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">Send at the best time</div>
                      <div className="text-xs text-muted-foreground">Maximize the LRD your family receives</div>
                    </div>
                  </div>
                </div>
              </div>
              <PlanInLRD rate={typeof liveRate === "number" ? liveRate : undefined} />
            </div>
          </div>
        </section>

        {/* Why Use Our Tools */}
        <section className="py-10 sm:py-12 bg-background border-t border-border/20">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Why Liberians Trust These Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="h-14 w-14 rounded-2xl bg-muted/40 border border-border/40 flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">No Hidden Fees</h3>
                <p className="text-sm text-muted-foreground">Every tool is 100% free. No premium tiers, no paywalls, no surprise charges.</p>
              </div>
              <div className="text-center">
                <div className="h-14 w-14 rounded-2xl bg-muted/40 border border-border/40 flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Real-Time Data</h3>
                <p className="text-sm text-muted-foreground">Rates update every minute from verified sources. No stale numbers.</p>
              </div>
              <div className="text-center">
                <div className="h-14 w-14 rounded-2xl bg-muted/40 border border-border/40 flex items-center justify-center mx-auto mb-3">
                  <Smartphone className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Mobile-First</h3>
                <p className="text-sm text-muted-foreground">Designed for phone use — fast loading, works on any connection.</p>
              </div>
              <div className="text-center">
                <div className="h-14 w-14 rounded-2xl bg-muted/40 border border-border/40 flex items-center justify-center mx-auto mb-3">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Built for Liberia</h3>
                <p className="text-sm text-muted-foreground">Local prices, local providers, local context — not a generic finance app.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Everyday Scenarios */}
        <section className="py-10 sm:py-12 bg-muted/10 border-t border-border/20">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Where These Tools Help Most</h2>
              <p className="text-sm text-muted-foreground">Common situations people face every week</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <Card className="rounded-2xl border-border/30">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center">
                      <Bus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">Morning Commuter</h3>
                      <p className="text-[11px] text-muted-foreground">Monrovia, daily taxi</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Check the converter before paying in USD so you know the fair LRD amount and can avoid bad change.
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                    Uses: Currency Converter <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border/30">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">Diaspora Sender</h3>
                      <p className="text-[11px] text-muted-foreground">Atlanta, supports family monthly</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Compare providers before sending so family receives more and fees are clear upfront.
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                    Uses: Remittance Calculator <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border/30">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">UL Student</h3>
                      <p className="text-[11px] text-muted-foreground">Capitol Hill campus</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Use the student budget tool to plan tuition, transport, and food before the semester starts.
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                    Uses: Student Budget Tool <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* SMS & Alerts */}
        <section className="py-10 sm:py-12 bg-background border-t border-border/20" aria-label="SMS and notifications">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Never Miss a Good Rate</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Set up SMS or push alerts so you know the moment the rate moves in your favor.
                  Perfect for planning remittances or large purchases.
                </p>
                <div className="grid sm:grid-cols-3 gap-4">
                  <Card className="rounded-2xl border-border/30">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold tabular-nums text-primary">
                        {typeof liveRate === "number" ? liveRate.toFixed(2) : "—"}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-1">Current Rate</div>
                    </CardContent>
                  </Card>
                  <Card className="rounded-2xl border-border/30">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold tabular-nums text-secondary">
                        {alertLow} – {alertHigh}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-1">Alert Band (±2)</div>
                    </CardContent>
                  </Card>
                  <Card className="rounded-2xl border-border/30">
                    <CardContent className="p-4 text-center">
                      <div className="text-sm text-foreground font-medium leading-snug">
                        Set a target slightly above or below your typical rate.
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-1">Pro Tip</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="space-y-4">
                <SMSAlertSignup />
                <PushNotifications />
              </div>
            </div>
          </div>
        </section>

        {/* No Smartphone */}
        <section className="py-8 sm:py-10 bg-muted/10 border-t border-border/20">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
            <Card className="rounded-2xl border-border/30">
              <CardContent className="p-6 sm:p-8 pb-6 sm:pb-8">
                <div className="flex flex-col sm:flex-row items-start gap-5">
                  <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center shrink-0">
                    <Smartphone className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">No Smartphone? No Problem.</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      USSD access is coming soon — dial *XXX# from any phone to get the current rate.
                      In the meantime, share rates via SMS or ask someone to check for you.
                    </p>
                    <Button asChild variant="outline" className="rounded-xl gap-2">
                      <Link href="/docs#ussd">
                        Learn how USSD will work <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
