"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Briefcase, Download, Bell, TrendingUp, FileText, Calculator, 
  Lock, CheckCircle2, Zap, Star, Users, Crown, DollarSign 
} from "lucide-react"
import { useState, useEffect } from "react"
import { InvoiceProtector } from "@/components/invoice-protector"
import { CashflowForecast } from "@/components/cashflow-forecast"
import { ImportPriceAlert } from "@/components/import-price-alert"
import { ChangerBooking } from "@/components/changer-booking"
import { LiveChangerQueue } from "@/components/live-changer-queue"
import { PushNotifications } from "@/components/push-notifications"
import { SentimentAnalysis } from "@/components/sentiment-analysis"

export default function BusinessDashboardPage() {
  const [currentRate, setCurrentRate] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

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
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Business Dashboard</h1>
              <p className="text-lg text-muted-foreground text-pretty">
                Professional tools for importers, exporters, and business owners
              </p>
              <div className="flex justify-center gap-3 mt-6 flex-wrap">
                <Badge variant="secondary" className="text-sm">
                  <Zap className="h-3 w-3 mr-1" />
                  Premium Tier
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  30-Day Forecasts
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  Changer Booking
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  API Access
                </Badge>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
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
                    <Card>
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
                              <select className="w-full p-2 border rounded-md">
                                <option>Above target</option>
                                <option>Below target</option>
                                <option>Exact match</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Notification</label>
                              <select className="w-full p-2 border rounded-md">
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
                  <Card>
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

                  <Card>
                    <CardHeader>
                      <CardTitle>Export Reports</CardTitle>
                      <CardDescription>Generate PDF and CSV reports for accounting and analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Card className="border-dashed">
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

                        <Card className="border-dashed">
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

                        <Card className="border-dashed">
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

                        <Card className="border-dashed">
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
                  <Card>
                    <CardHeader>
                      <CardTitle>API Access for Banks & Fintechs</CardTitle>
                      <CardDescription>Integrate real-time exchange rate data into your systems</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg">
                          <Lock className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h3 className="font-semibold mb-1">Your API Key</h3>
                            <code className="text-sm bg-background px-3 py-1 rounded border">
                              trl_live_sk_xxxxxxxxxxxxxxxxxxxx
                            </code>
                            <p className="text-sm text-muted-foreground mt-2">
                              Keep this key secure. It provides access to all API endpoints.
                            </p>
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
                              <div className="text-sm font-medium mb-1">Get Current Rate</div>
                              <code className="block text-xs bg-muted p-3 rounded-lg overflow-x-auto">
                                curl -H "Authorization: Bearer YOUR_API_KEY" <br />
                                https://api.truerate-liberia.com/v1/rates/live
                              </code>
                            </div>
                            <div>
                              <div className="text-sm font-medium mb-1">Get 30-Day Predictions</div>
                              <code className="block text-xs bg-muted p-3 rounded-lg overflow-x-auto">
                                curl -H "Authorization: Bearer YOUR_API_KEY" <br />
                                https://api.truerate-liberia.com/v1/rates/predictions?days=30
                              </code>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button>
                            <FileText className="h-4 w-4 mr-2" />
                            View Full Documentation
                          </Button>
                          <Button variant="outline">Contact Sales</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Pricing Section */}
              <div className="mt-12 grid md:grid-cols-2 gap-6">
                {/* Free Tier */}
                <Card>
                  <CardHeader>
                    <CardTitle>Free</CardTitle>
                    <CardDescription>For individual users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold mb-4">
                      $0<span className="text-lg text-muted-foreground">/month</span>
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
                <Card className="border-secondary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Crown className="h-5 w-5 text-secondary" />
                          TrueRate Business
                        </CardTitle>
                        <CardDescription>For serious businesses</CardDescription>
                      </div>
                      <Badge variant="secondary">Popular</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold mb-4">
                      $3-5<span className="text-lg text-muted-foreground">/month</span>
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
                      Pay via Orange Money or Lonestar Cash
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Business Tagline */}
              <Card className="mt-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-0">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">
                    "TrueRate doesn't just show the rate — it tells you the exact day to change your dollars 
                    so you keep an extra L$50,000–200,000 every month."
                  </h3>
                  <p className="text-muted-foreground">
                    Join 25,000+ business users who trust TrueRate for smarter forex decisions
                  </p>
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
