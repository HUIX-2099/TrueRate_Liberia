"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, Download, Bell, TrendingUp, FileText, Calculator, Lock, CheckCircle2, Zap } from "lucide-react"
import { useState, useEffect } from "react"

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
                Professional tools for importers, exporters, and financial institutions
              </p>
              <div className="flex justify-center gap-3 mt-6">
                <Badge variant="secondary" className="text-sm">
                  <Zap className="h-3 w-3 mr-1" />
                  Premium Tier
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  API Access
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  Priority Support
                </Badge>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <Tabs defaultValue="bulk" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="bulk">Bulk Conversion</TabsTrigger>
                  <TabsTrigger value="alerts">Rate Alerts</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                  <TabsTrigger value="api">API Access</TabsTrigger>
                </TabsList>

                <TabsContent value="bulk" className="space-y-6">
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
                          {[1, 2, 3].map((i) => (
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
                          <Button>Calculate All</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="alerts" className="space-y-6">
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
                              <option>Email + SMS</option>
                              <option>Email only</option>
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
                              { rate: 175, type: "Below", active: true },
                              { rate: 190, type: "Above", active: true },
                            ].map((alert, i) => (
                              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                  <div className="font-medium">
                                    Alert when rate is {alert.type.toLowerCase()} {alert.rate} LRD
                                  </div>
                                  <div className="text-sm text-muted-foreground">Email + SMS notification</div>
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
                </TabsContent>

                <TabsContent value="reports" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Export Reports</CardTitle>
                      <CardDescription>Generate PDF and CSV reports for accounting and analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
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
                              <h3 className="font-semibold mb-2">Custom Analysis</h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                Build custom reports with date ranges and filters
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
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

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
                              "Historical data (7 years)",
                              "Multiple currency pairs",
                              "99.9% uptime SLA",
                              "Unlimited requests",
                              "Webhook notifications",
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
                              <div className="text-sm font-medium mb-1">Get Historical Data</div>
                              <code className="block text-xs bg-muted p-3 rounded-lg overflow-x-auto">
                                curl -H "Authorization: Bearer YOUR_API_KEY" <br />
                                https://api.truerate-liberia.com/v1/rates/historical?from=2024-01-01
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

              {/* Pricing */}
              <Card className="mt-8 border-primary">
                <CardHeader>
                  <CardTitle>Premium Business Plan</CardTitle>
                  <CardDescription>Professional tools for serious businesses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-4xl font-bold">
                        $99<span className="text-lg text-muted-foreground">/month</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Billed annually at $999 (Save $189)</p>
                    </div>
                    <Button size="lg">Upgrade to Premium</Button>
                  </div>
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
