"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, CheckCircle2, Upload } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function ReportFraudPage() {
  const { toast } = useToast()
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    reportType: "",
    changerName: "",
    location: "",
    amount: "",
    description: "",
    reporterName: "",
    reporterPhone: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSubmitted(true)
    toast({
      title: "Report Submitted",
      description: "Thank you for helping keep our community safe. We'll investigate this report.",
    })
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-secondary" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Report Submitted Successfully</CardTitle>
                <CardDescription className="text-base">
                  Reference Number: <span className="font-mono font-bold">FR-{Date.now().toString().slice(-8)}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Thank you for reporting this incident. Our fraud investigation team will review your report within
                  24-48 hours. If we need additional information, we'll contact you using the phone number you provided.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Your report helps protect the entire community. We take every report seriously and work with local
                    authorities when necessary.
                  </p>
                </div>
                <Button onClick={() => setSubmitted(false)} variant="outline" className="w-full">
                  Submit Another Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-destructive/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-destructive/20 flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Report Fraudulent Activity</h1>
              <p className="text-lg text-muted-foreground text-pretty">
                Help us protect the community by reporting suspicious money changers, unfair rates, counterfeit
                currency, or other fraudulent activities.
              </p>
            </div>
          </div>
        </section>

        {/* Alert Banner */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-l-4 border-l-destructive">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Shield className="h-6 w-6 text-destructive flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-2">Your Safety is Our Priority</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        All reports are confidential and reviewed by our fraud investigation team. If you're in
                        immediate danger, please contact the Liberia National Police at 911.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Fraud Report Form</CardTitle>
                  <CardDescription>
                    Please provide as much detail as possible to help our investigation.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="reportType">Type of Fraud *</Label>
                      <Select
                        value={formData.reportType}
                        onValueChange={(value) => setFormData({ ...formData, reportType: value })}
                      >
                        <SelectTrigger id="reportType">
                          <SelectValue placeholder="Select fraud type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unfair-rate">Unfair Exchange Rate</SelectItem>
                          <SelectItem value="counterfeit">Counterfeit Currency</SelectItem>
                          <SelectItem value="scam">Money Changer Scam</SelectItem>
                          <SelectItem value="theft">Theft/Robbery</SelectItem>
                          <SelectItem value="impersonation">Impersonation</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="changerName">Money Changer Name</Label>
                        <Input
                          id="changerName"
                          placeholder="Business or person name"
                          value={formData.changerName}
                          onChange={(e) => setFormData({ ...formData, changerName: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          placeholder="Street, area, or landmark"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount Involved (USD)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Detailed Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Please describe what happened, including dates, times, and any other relevant details..."
                        rows={6}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="evidence">Evidence (Optional)</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">Upload photos, receipts, or other evidence</p>
                        <Button type="button" variant="outline" size="sm">
                          Choose Files
                        </Button>
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <h3 className="font-semibold mb-4">Your Contact Information (Optional)</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Providing your contact allows us to follow up for more details if needed. All information is
                        kept confidential.
                      </p>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="reporterName">Your Name</Label>
                          <Input
                            id="reporterName"
                            placeholder="Full name"
                            value={formData.reporterName}
                            onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="reporterPhone">Your Phone</Label>
                          <Input
                            id="reporterPhone"
                            type="tel"
                            placeholder="+231 XXX XXX XXX"
                            value={formData.reporterPhone}
                            onChange={(e) => setFormData({ ...formData, reporterPhone: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      Submit Fraud Report
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Recent Alerts */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Recent Fraud Alerts</h2>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Badge variant="destructive">Active Alert</Badge>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">Counterfeit $100 Bills - Red Light Market</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Multiple reports of counterfeit $100 bills circulating near Red Light Market. Check serial
                          numbers carefully.
                        </p>
                        <p className="text-xs text-muted-foreground">Posted 2 days ago • 12 reports</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Badge variant="secondary">Resolved</Badge>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">Unauthorized Changer - Broad Street</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Individual impersonating licensed changer. Authorities have been notified and the individual
                          identified.
                        </p>
                        <p className="text-xs text-muted-foreground">Posted 1 week ago • Resolved</p>
                      </div>
                    </div>
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
