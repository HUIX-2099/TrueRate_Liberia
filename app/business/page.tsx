"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Star,
  Users,
  Crown,
  DollarSign,
  Calendar,
} from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { InvoiceProtector } from "@/components/invoice-protector"
import { BulkConverter } from "@/components/bulk-converter"
import { CashflowForecast } from "@/components/cashflow-forecast"
import { ImportPriceAlert } from "@/components/import-price-alert"
import { ChangerBooking } from "@/components/changer-booking"
import { LiveChangerQueue } from "@/components/live-changer-queue"
import { PushNotifications } from "@/components/push-notifications"
import { SentimentAnalysis } from "@/components/sentiment-analysis"

export default function BusinessDashboardPage() {
  const [currentRate, setCurrentRate] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [apiKeyLoading, setApiKeyLoading] = useState(false)

  useEffect(() => {
    fetch("/api/rates/live")
      .then((res) => res.json())
      .then((data) => {
        if (data?.rate && typeof data.rate === "number") {
          setCurrentRate(data.rate)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error("[v0] Error fetching rate:", err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
        {/* Hero Section */}
        <section className="py-12 sm:py-14 md:py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                <Badge variant="outline">For Businesses</Badge>
                <Badge className="bg-primary/10 text-primary">Premium Tools</Badge>
                <Badge variant="secondary">Save Money</Badge>
                <Badge className="bg-secondary/10 text-secondary">Increase Profits</Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Business Dashboard
                </span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground text-pretty max-w-3xl mx-auto">
                Professional tools for importers, exporters, and business owners to maximize profits and minimize risk
              </p>
              <div className="flex justify-center gap-3 mt-6 flex-wrap">
                <Badge variant="secondary" className="text-sm gap-1">
                  <Zap className="h-3 w-3" />
                  Premium Tier
                </Badge>
                <Badge variant="secondary" className="text-sm gap-1">
                  <TrendingUp className="h-3 w-3" />
                  30-Day Forecasts
                </Badge>
                <Badge variant="secondary" className="text-sm gap-1">
                  <Calendar className="h-3 w-3" />
                  Changer Booking
                </Badge>
                <Badge variant="secondary" className="text-sm gap-1">
                  <DollarSign className="h-3 w-3" />
                  API Access
                </Badge>
              </div>
          </div>
        </div>
        </section>

        <section className="py-6 sm:py-8 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8 space-y-3">
                <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                  <Badge variant="outline">Business Tools</Badge>
                  <Badge className="bg-primary/10 text-primary">AI-Powered</Badge>
                  <Badge variant="secondary">Professional Grade</Badge>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-balance">
                  <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                    Everything Your Business Needs
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Advanced tools designed specifically for Liberian businesses and entrepreneurs
                </p>
              </div>
              <Tabs defaultValue="tools" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="tools">Smart Tools</TabsTrigger>
                  <TabsTrigger value="booking">Book Changer</TabsTrigger>
                  <TabsTrigger value="alerts">Alerts</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                  <TabsTrigger value="api">API Access</TabsTrigger>
                </TabsList>

                {/* Smart Tools Tab - Phase 1 Features */}
                <TabsContent value="tools" className="space-y-6">
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Invoice USD Protector */}
                    <InvoiceProtector />
                    
                    {/* Cashflow Forecast */}
                    <CashflowForecast />
                  </div>
                  
                  {/* Import Price Alert */}
                  <ImportPriceAlert />

                  {/* Bulk conversion */}
                  <BulkConverter />
                  
                  {/* AI Sentiment Analysis */}
                  <SentimentAnalysis />
                </TabsContent>

                {/* Changer Booking Tab */}
                <TabsContent value="booking" className="space-y-6">
                  <div className="grid lg:grid-cols-2 gap-6">
                    <ChangerBooking />
                    <LiveChangerQueue />
                  </div>
                </TabsContent>

                {/* Alerts Tab */}
                <TabsContent value="alerts" className="space-y-6">
                  <div className="grid lg:grid-cols-2 gap-6">
                    <PushNotifications />
                    
                    {/* Rate Lock Alerts */}
                    <Card className="border-border/60 shadow-sm">
                      <CardHeader>
                        <CardTitle>Rate Lock Alerts</CardTitle>
                        <CardDescription>Set target rates and get instant notifications</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <label className="text-sm font-medium">Target Rate</label>
                              <Input type="number" placeholder="180.00" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Alert Type</label>
                              <select className="w-full p-2 border rounded-lg h-10 bg-background">
                                <option>Above target</option>
                                <option>Below target</option>
                                <option>Exact match</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Notification</label>
                              <select className="w-full p-2 border rounded-lg h-10 bg-background">
                                <option>Push + SMS</option>
                                <option>Push only</option>
                                <option>SMS only</option>
                              </select>
                            </div>
                          </div>
                          <Button>
                            <Bell className="h-4 w-4 mr-2" />
                            Create Alert
                          </Button>

                          <div className="border-t pt-4 mt-6">
                            <h3 className="font-semibold mb-4">Active Alerts</h3>
                            <div className="space-y-3">
                              {[
                                { rate: 195, type: "Below", active: true },
                                { rate: 205, type: "Above", active: true },
                              ].map((alert, i) => (
                                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div>
                                    <div className="font-medium">
                                      Alert when rate is {alert.type.toLowerCase()} {alert.rate} LRD
                                    </div>
                                    <div className="text-sm text-muted-foreground">Push + SMS notification</div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={alert.active ? "secondary" : "outline"}>
                                      {alert.active ? "Active" : "Paused"}
                                    </Badge>
                                    <Button variant="ghost" size="sm">
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Reports Tab */}
                <TabsContent value="reports" className="space-y-6">
                  <Card className="border-border/60 shadow-sm">
                    <CardHeader>
                      <CardTitle>Bulk Currency Conversion</CardTitle>
                      <CardDescription>Convert multiple amounts at once for invoicing and accounting</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                          <div>
                            <div className="text-sm text-muted-foreground">Current Rate</div>
                            <div className="text-2xl font-bold">
                              {loading || !currentRate ? "Loading..." : `1 USD = ${currentRate.toFixed(2)} LRD`}
                            </div>
                          </div>
                          <Badge variant="secondary">Live</Badge>
                        </div>

                        <div className="border rounded-lg p-4">
                          <div className="grid grid-cols-3 gap-4 mb-2 font-semibold text-sm">
                            <div>Amount (USD)</div>
                            <div>Amount (LRD)</div>
                            <div>Description</div>
                          </div>
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="grid grid-cols-3 gap-4 mb-3">
                              <Input type="number" placeholder="0.00" />
                              <Input type="number" placeholder="0.00" disabled />
                              <Input placeholder="Invoice #, Item, etc." />
                            </div>
                          ))}
                          <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                            + Add Row
                          </Button>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                          </Button>
                          <Button variant="outline">
                            <FileText className="h-4 w-4 mr-2" />
                            Export PDF
                          </Button>
                          <Button>Calculate All</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border/60 shadow-sm">
                    <CardHeader>
                      <CardTitle>Export Reports</CardTitle>
                      <CardDescription>Generate PDF and CSV reports for accounting and analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Card className="border-dashed border-border/60">
                          <CardContent className="pt-6 text-center">
                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                            <h3 className="font-semibold mb-2">Monthly Rate Report</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Daily average rates, volatility analysis, and trends
                            </p>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="border-dashed border-border/60">
                          <CardContent className="pt-6 text-center">
                            <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                            <h3 className="font-semibold mb-2">Transaction History</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Export all your conversions and calculations
                            </p>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Export CSV
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="border-dashed border-border/60">
                          <CardContent className="pt-6 text-center">
                            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                            <h3 className="font-semibold mb-2">Historical Rate Reports</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Tax & audit ready with CBL official rates
                            </p>
                            <Button variant="outline" size="sm">
                              Create Report
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="border-dashed border-border/60">
                          <CardContent className="pt-6 text-center">
                            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                            <h3 className="font-semibold mb-2">Quarterly Summary</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Comprehensive quarterly business insights
                            </p>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* API Tab */}
                <TabsContent value="api" className="space-y-6">
                  <Card className="border-border/60 shadow-sm">
                    <CardHeader>
                      <CardTitle>API Access for Banks & Fintechs</CardTitle>
                      <CardDescription>Integrate real-time exchange rate data into your systems</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg">
                          <Lock className="h-5 w-5 text-primary mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold mb-1">Your API Key</h3>
                            {apiKey ? (
                              <code className="text-sm bg-background px-3 py-1 rounded border break-all block">
                                {apiKey}
                              </code>
                            ) : (
                              <p className="text-sm text-muted-foreground">Create a key to access the live and historical rate API.</p>
                            )}
                            <p className="text-sm text-muted-foreground mt-2">
                              Keep this key secure. Use it in the Authorization header (Bearer) or as the api_key query parameter.
                            </p>
                            {!apiKey && (
                              <Button
                                className="mt-2"
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
                          <h3 className="font-semibold mb-3">API Features</h3>
                          <div className="grid md:grid-cols-2 gap-3">
                            {[
                              "Real-time exchange rates (1-minute updates)",
                              "30-day AI predictions",
                              "Historical data (7 years)",
                              "Multiple currency pairs",
                              "99.9% uptime SLA",
                              "Unlimited requests",
                              "Webhook notifications",
                              "Sentiment analysis data",
                            ].map((feature, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-secondary" />
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-3">Quick Start</h3>
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

                        <div className="flex gap-2">
                          <Button asChild>
                            <Link href="/docs#api">
                              <FileText className="h-4 w-4 mr-2" />
                              API documentation
                            </Link>
                          </Button>
                          <Button variant="outline" asChild>
                            <Link href="/contact">Contact Sales</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Pricing Section */}
              <div className="mt-16">
                <div className="text-center mb-8 space-y-3">
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                    <Badge variant="outline">Pricing Plans</Badge>
                    <Badge className="bg-primary/10 text-primary">Flexible</Badge>
                    <Badge variant="secondary">Local Payment</Badge>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-balance">
                    <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                      Choose Your Plan
                    </span>
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Start free, upgrade when you need more power
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                {/* Free Tier */}
                <Card className="border-border/60 shadow-sm bg-gradient-to-br from-card to-muted/20">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-primary">Free</CardTitle>
                    <CardDescription>For individual users and small businesses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold mb-4">
                      $0<span className="text-base sm:text-lg text-muted-foreground">/month</span>
                    </div>
                    <div className="space-y-2 mb-6">
                      {[
                        "Real-time rates",
                        "7-day predictions",
                        "Basic converter",
                        "Community forums",
                        "Rate alerts (limited)",
                      ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-secondary" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full">Current Plan</Button>
                  </CardContent>
                </Card>

                {/* Business Tier */}
                <Card className="border-secondary/60 shadow-sm bg-gradient-to-br from-secondary/5 to-card relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-secondary/10 rounded-bl-full"></div>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-secondary">
                          <Crown className="h-5 w-5 text-secondary" />
                          TrueRate Business
                        </CardTitle>
                        <CardDescription>For serious businesses and enterprises</CardDescription>
                      </div>
                      <Badge variant="secondary" className="bg-secondary/20 text-secondary">Most Popular</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold mb-4">
                      $5<span className="text-base sm:text-lg text-muted-foreground">/month</span>
                    </div>
                    <div className="space-y-2 mb-6">
                      {[
                        "Everything in Free",
                        "30-day AI predictions",
                        "Invoice USD Protector",
                        "Cashflow Forecast Tool",
                        "Changer Booking & Reservation",
                        "Bulk converter with PDF export",
                        "Unlimited rate alerts",
                        "Team accounts (5 users)",
                        "Historical reports for tax/audit",
                        "Priority support",
                      ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-secondary" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Button className="w-full">Upgrade to Business</Button>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Pay via Orange Money or Lonestar Momo
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Business Tagline */}
              <Card className="mt-12 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-0 shadow-sm">
                <CardContent className="p-8 sm:p-10 text-center">
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                    <Badge variant="outline">Success Stories</Badge>
                    <Badge className="bg-primary/10 text-primary">Real Results</Badge>
                    <Badge variant="secondary">Proven Track Record</Badge>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 text-balance">
                    <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                      "TrueRate doesn't just show the rate — it tells you the exact day to change your dollars
                      so you keep an extra L$50,000–200,000 every month."
                    </span>
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Join 25,000+ business users who trust TrueRate for smarter forex decisions
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
