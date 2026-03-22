"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Briefcase,
  Download,
  Bell,
  TrendingUp,
  FileText,
  Calculator,
  Lock,
  CheckCircle2,
  Zap,
  DollarSign,
  ArrowRight,
  ShieldCheck,
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useLiveRate } from "@/lib/live-rate-context"
import { InvoiceProtector } from "@/components/invoice-protector"
import { BulkConverter } from "@/components/bulk-converter"
import { CashflowForecast } from "@/components/cashflow-forecast"
import { ImportPriceAlert } from "@/components/import-price-alert"
import { ChangerBooking } from "@/components/changer-booking"
import { LiveChangerQueue } from "@/components/live-changer-queue"
import { PushNotifications } from "@/components/push-notifications"
import { SentimentAnalysis } from "@/components/sentiment-analysis"
import { BusinessTrustBar } from "@/components/business-trust-bar"
import { PageHero } from "@/components/layout/page-hero"

/* Design system (this page):
 * Spacing: 4=16px, 6=24px, 8=32px, 10=40px, 12=48px, 16=64px, 20=80px
 * Type: hero 3xl→5xl, section 2xl→3xl, card title lg→xl, body base, caption sm
 * CTAs: one primary above fold, repeated at pricing + testimonial
 */

export default function BusinessDashboardPage() {
  const { effectiveRate, loading, cblRate, sources, timestamp } = useLiveRate()
  const currentRate = loading ? null : effectiveRate

  const [apiKey, setApiKey] = useState<string | null>(null)
  const [apiKeyLoading, setApiKeyLoading] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main id="main-content" className="flex-1 pb-20 md:pb-0 overflow-x-hidden" role="main">
        <PageHero
          ariaLabel="Business dashboard"
          label="For Businesses"
          title="Business Dashboard"
          description="Practical tools for importers and exporters to reduce forex risk and plan with confidence."
          variant="centered"
          pill={{
            text: loading
              ? "Loading rate…"
              : `L$${effectiveRate.toFixed(2)} · ${sources[0] ?? "Live"}`,
            live: !loading,
          }}
          contentMaxWidth="max-w-3xl"
        >
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mb-6">
            <Button asChild size="lg" className="rounded-xl h-12 px-6 text-base font-semibold shadow-sm min-h-[48px] w-full sm:w-auto focus-visible:ring-[3px]">
              <Link href="#tools">Start using free business tools</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl h-12 px-6 text-base min-h-[48px] w-full sm:w-auto border-2 focus-visible:ring-[3px]">
              <Link href="#tools">
                Browse tools
                <ArrowRight className="ml-2 h-4 w-4 text-muted-foreground" aria-hidden />
              </Link>
            </Button>
          </div>
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground list-none" role="list">
            <li className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" aria-hidden />
              Transparent data
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Zap className="h-4 w-4 /80 shrink-0 text-primary" aria-hidden />
              30-day forecasts
            </li>
            <li className="inline-flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 /80 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
              API access
            </li>
          </ul>
        </PageHero>

        <BusinessTrustBar />

        <section id="tools" className="py-12 sm:py-16 md:py-20 bg-background" aria-labelledby="tools-heading">
          <div className="container mx-auto max-w-6xl">
            <header className="text-center mb-8 sm:mb-10">
              <h2 id="tools-heading" className="text-2xl sm:text-3xl font-bold text-balance tracking-tight font-display mb-2">
                <span className="text-foreground">Tools & Reports</span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
                Built to support your day-to-day decisions with clear market data, risk signals, and tools that help you protect margin and save more.
              </p>
            </header>

            <Tabs defaultValue="tools" className="w-full min-w-0" aria-label="Business tools and reports">
              <TabsList className="grid w-full grid-cols-2 gap-1.5 rounded-xl border border-border/50 bg-muted/40 p-1.5 h-auto sm:grid-cols-3 lg:flex lg:flex-wrap">
                <TabsTrigger value="tools" className="w-full rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-[var(--shadow-card)] px-3 py-2.5 text-xs sm:text-sm font-medium min-h-[44px] text-center whitespace-normal">
                  Tools
                </TabsTrigger>
                <TabsTrigger value="booking" className="w-full rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-[var(--shadow-card)] px-3 py-2.5 text-xs sm:text-sm font-medium min-h-[44px] text-center whitespace-normal">
                  Book Changer
                </TabsTrigger>
                <TabsTrigger value="alerts" className="w-full rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-[var(--shadow-card)] px-3 py-2.5 text-xs sm:text-sm font-medium min-h-[44px] text-center whitespace-normal">
                  Alerts
                </TabsTrigger>
                <TabsTrigger value="reports" className="w-full rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-[var(--shadow-card)] px-3 py-2.5 text-xs sm:text-sm font-medium min-h-[44px] text-center whitespace-normal">
                  Reports
                </TabsTrigger>
                <TabsTrigger value="api" className="w-full rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-[var(--shadow-card)] px-3 py-2.5 text-xs sm:text-sm font-medium min-h-[44px] text-center whitespace-normal">
                  API Access
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tools" className="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
                <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                  <InvoiceProtector rate={effectiveRate} />
                  <CashflowForecast rate={effectiveRate} cblRate={cblRate ?? undefined} />
                </div>
                <ImportPriceAlert />
                <BulkConverter rate={effectiveRate} />
                <SentimentAnalysis />
              </TabsContent>

              <TabsContent value="booking" className="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
                <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                  <ChangerBooking />
                  <LiveChangerQueue />
                </div>
              </TabsContent>

              <TabsContent value="alerts" className="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
                <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                  <PushNotifications />
                  <Card className="border-border/60 shadow-sm rounded-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                        <Bell className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden />
                        Rate Lock Alerts
                      </CardTitle>
                      <CardDescription>Set target rates and get notifications when the market reaches them.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Target Rate (LRD)</label>
                          <Input type="number" placeholder="180.00" className="rounded-lg h-11" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Alert when rate is</label>
                          <Select>
                            <SelectTrigger className="rounded-lg h-11">
                              <SelectValue placeholder="Choose condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="above">Above target</SelectItem>
                              <SelectItem value="below">Below target</SelectItem>
                              <SelectItem value="exact">Exact match</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Notification</label>
                          <Select>
                            <SelectTrigger className="rounded-lg h-11">
                              <SelectValue placeholder="Delivery" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="push-sms">Push + SMS</SelectItem>
                              <SelectItem value="push">Push only</SelectItem>
                              <SelectItem value="sms">SMS only</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button className="rounded-lg min-h-[44px]">
                        <Bell className="h-4 w-4 mr-2 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden />
                        Create Alert
                      </Button>
                      <div className="border-t border-border/60 pt-5 mt-6">
                        <h3 className="font-semibold text-base mb-3">Active Alerts</h3>
                        <div className="space-y-3">
                          {[
                            { rate: 195, type: "Below", active: true },
                            { rate: 205, type: "Above", active: true },
                          ].map((alert, i) => (
                            <div
                              key={i}
                              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-xl border border-border/60 bg-muted/30"
                            >
                              <div className="min-w-0">
                                <div className="font-medium text-sm sm:text-base">
                                  Alert when rate is {alert.type.toLowerCase()} {alert.rate} LRD
                                </div>
                                <div className="text-xs sm:text-sm text-muted-foreground">Push + SMS</div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <Badge variant={alert.active ? "secondary" : "outline"} className="rounded-md">
                                  {alert.active ? "Active" : "Paused"}
                                </Badge>
                                <Button variant="ghost" size="sm" className="text-muted-foreground">
                                  Delete
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="reports" className="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
                <Card className="border-border/60 shadow-sm rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Bulk Currency Conversion</CardTitle>
                    <CardDescription>Convert multiple amounts for invoicing and accounting.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/10">
                      <div>
                        <div className="text-sm text-muted-foreground">Current Rate</div>
                        <div className="text-xl sm:text-2xl font-bold tabular-nums">
                          {loading || !currentRate ? "Loading…" : `1 USD = ${currentRate.toFixed(2)} LRD`}
                        </div>
                      </div>
                      <Badge variant="secondary">Live</Badge>
                    </div>
                    <div className="border rounded-xl p-4 overflow-x-auto">
                      <div className="grid grid-cols-1 min-[500px]:grid-cols-3 gap-3 sm:gap-4 mb-2 font-semibold text-sm">
                        <div className="hidden min-[500px]:block">Amount (USD)</div>
                        <div className="hidden min-[500px]:block">Amount (LRD)</div>
                        <div className="hidden min-[500px]:block">Description</div>
                      </div>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="grid grid-cols-1 min-[500px]:grid-cols-3 gap-3 sm:gap-4 mb-3 p-2 min-[500px]:p-0 min-[500px]:mb-3 rounded-lg min-[500px]:rounded-none bg-muted/30 min-[500px]:bg-transparent"
                        >
                          <div className="min-[500px]:contents">
                            <label className="min-[500px]:hidden text-xs font-medium text-muted-foreground">Amount (USD)</label>
                            <Input type="number" placeholder="0.00" className="min-h-[44px]" />
                          </div>
                          <div className="min-[500px]:contents">
                            <label className="min-[500px]:hidden text-xs font-medium text-muted-foreground">Amount (LRD)</label>
                            <Input type="number" placeholder="0.00" disabled className="min-h-[44px]" />
                          </div>
                          <div className="min-[500px]:contents">
                            <label className="min-[500px]:hidden text-xs font-medium text-muted-foreground">Description</label>
                            <Input placeholder="Invoice #, Item, etc." className="min-h-[44px]" />
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" className="mt-2 w-full sm:w-auto min-h-[40px]">
                        + Add Row
                      </Button>
                    </div>
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
                      <Button variant="outline" className="min-h-[44px]">
                        <Download className="h-4 w-4 mr-2 shrink-0 text-primary" aria-hidden />
                        Export CSV
                      </Button>
                      <Button variant="outline" className="min-h-[44px]">
                        <FileText className="h-4 w-4 mr-2 shrink-0 text-primary" aria-hidden />
                        Export PDF
                      </Button>
                      <Button className="min-h-[44px]">Calculate All</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/60 shadow-sm rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Export Reports</CardTitle>
                    <CardDescription>PDF and CSV for accounting and audit.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      {[
                        { icon: FileText, title: "Monthly Rate Report", desc: "Daily averages, volatility, trends", action: "Download PDF" },
                        { icon: Calculator, title: "Transaction History", desc: "All conversions and calculations", action: "Export CSV" },
                        { icon: TrendingUp, title: "Historical Rate Reports", desc: "Tax & audit ready with CBL rates", action: "Create Report" },
                        { icon: Briefcase, title: "Quarterly Summary", desc: "Quarterly business insights", action: "Download PDF" },
                      ].map((item, i) => (
                        <Card key={i} className="border border-dashed border-border/60 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                          <CardContent className="pt-6 pb-6 text-center">
                            <item.icon className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3" aria-hidden />
                            <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                            <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
                            <Button variant="outline" size="sm" className="min-h-[40px]">
                              <Download className="h-4 w-4 mr-2 shrink-0 text-primary" aria-hidden />
                              {item.action}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="api" className="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
                <Card className="border-border/60 shadow-sm rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <Lock className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                      API Access for Banks & Fintechs
                    </CardTitle>
                    <CardDescription>Real-time exchange rate data for your systems.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
                      <Lock className="h-5 w-5 mt-0.5 shrink-0 text-primary" aria-hidden />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1">Your API Key</h3>
                        {apiKey ? (
                          <code className="text-sm bg-background px-3 py-2 rounded-lg border break-all block">
                            {apiKey}
                          </code>
                        ) : (
                          <p className="text-sm text-muted-foreground">Create a key to access the live and historical rate API.</p>
                        )}
                        <p className="text-sm text-muted-foreground mt-2">
                          Keep this key secure. Use in the Authorization header (Bearer) or as the api_key query parameter.
                        </p>
                        {!apiKey && (
                          <Button
                            className="mt-2 min-h-[44px]"
                            disabled={apiKeyLoading}
                            onClick={async () => {
                              setApiKeyLoading(true)
                              try {
                                const res = await fetch("/api/business/api-keys", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({}),
                                })
                                const data = await res.json()
                                if (data?.api_key) setApiKey(data.api_key)
                              } finally {
                                setApiKeyLoading(false)
                              }
                            }}
                          >
                            {apiKeyLoading ? "Creating…" : "Create API key"}
                          </Button>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-base mb-3">API Features</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          "Real-time rates (1-min updates)",
                          "30-day rate outlook",
                          "Historical data (7 years)",
                          "Multiple currency pairs",
                          "99.9% uptime SLA",
                          "Unlimited requests",
                          "Webhook notifications",
                          "Sentiment analysis data",
                        ].map((feature, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" aria-hidden />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-base mb-3">Quick Start</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-medium mb-1">Get current rate</div>
                          <code className="block text-xs bg-muted p-3 rounded-lg overflow-x-auto">
                            GET /api/v1/rate<br />
                            Authorization: Bearer YOUR_API_KEY
                          </code>
                        </div>
                        <div>
                          <div className="text-sm font-medium mb-1">Get historical rates</div>
                          <code className="block text-xs bg-muted p-3 rounded-lg overflow-x-auto">
                            GET /api/v1/historical?days=90<br />
                            Authorization: Bearer YOUR_API_KEY
                          </code>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button asChild className="w-full sm:w-auto min-h-[44px]">
                        <Link href="/docs#api">
                          <FileText className="h-4 w-4 mr-2 shrink-0 text-primary" aria-hidden />
                          API documentation
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="w-full sm:w-auto min-h-[44px]">
                        <Link href="/contact">Contact Sales</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div id="pricing" className="mt-16 sm:mt-20 scroll-mt-28" aria-labelledby="free-access-heading">
              <header className="text-center mb-8 sm:mb-10">
                <h2 id="free-access-heading" className="text-2xl sm:text-3xl font-bold text-balance tracking-tight font-display mb-2">
                  <span className="text-foreground">Free Access for Every Business</span>
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
                  All business tools are available at no cost. No payment setup required.
                </p>
                <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-green-600 dark:text-green-400" aria-hidden />
                  Transparent data · CBL & market sources
                </p>
              </header>
            </div>

            <aside className="mt-10 sm:mt-12" aria-label="Business context">
              <Card className="rounded-2xl bg-card border border-border/50 shadow-[var(--shadow-card)]">
                <CardContent className="p-6 sm:p-8 md:p-10 text-center">
                  <blockquote className="text-lg sm:text-xl md:text-2xl font-semibold text-balance leading-snug text-foreground mb-4">
                    <p>
                      Your business is looked after here with practical guidance to reduce guesswork, watch rate risk, and time conversions with confidence.
                    </p>
                  </blockquote>
                  <p className="text-muted-foreground text-sm sm:text-base mb-6">
                    Every feature is designed to help you understand what the market is doing and make informed moves that can lower costs over time.
                  </p>
                  <Button asChild size="lg" className="rounded-xl min-h-[48px] px-8 font-semibold shadow-sm focus-visible:ring-[3px]">
                    <Link href="#tools">
                      Explore Business Tools
                      <ArrowRight className="ml-2 h-4 w-4 inline shrink-0 text-muted-foreground" aria-hidden />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
