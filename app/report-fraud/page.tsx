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
import { PageHero } from "@/components/layout/page-hero"
import { AlertTriangle, Shield, CheckCircle2, Upload } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function ReportFraudPage() {
  const { toast } = useToast()
  const [submitted, setSubmitted] = useState(false)
  const [referenceId, setReferenceId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
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
    setSubmitting(true)
    try {
      const res = await fetch("/api/community/fraud-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) {
        toast({
          title: "Could not submit",
          description: data?.error ?? "Please try again.",
          variant: "destructive",
        })
        return
      }
      setReferenceId(data.reference ?? data.id ?? null)
      setSubmitted(true)
      toast({
        title: "Report submitted",
        description: "Thank you. Your report helps others avoid getting cheated. We'll investigate.",
      })
    } catch {
      toast({
        title: "We couldn't submit your report",
        description: "Please try again in a moment.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="py-10 sm:py-14 md:py-16 flex-1 flex items-center justify-center pb-20 md:pb-0 overflow-x-hidden px-4">
          <div className="container mx-auto w-full max-w-[100vw] xl:max-w-none">
            <Card className="max-w-2xl mx-auto text-center border-border/40 rounded-2xl shadow-sm">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Report received</CardTitle>
                <CardDescription className="text-base">
                  Reference: <span className="font-mono font-bold">{referenceId ?? "—"}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Thank you for reporting this incident. Our fraud investigation team will review your report within
                  24-48 hours. If we need additional information, we&apos;ll contact you using the phone number you provided.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Your report helps protect others from getting cheated. We take every report seriously and work with local
                    authorities when necessary. When people trust that bad actors can be reported, they trust the system—and the LRD—more.
                  </p>
                </div>
                <Button onClick={() => setSubmitted(false)} variant="outline" className="w-full rounded-xl min-h-[44px]">
                  Report another incident
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
      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
        <PageHero
          ariaLabel="Report fraudulent activity"
          label="Safety First"
          title="Report Fraudulent Activity"
          description="Report bad rates and fraud so others don't get cheated. When more people trust that the rate they see is fair and that bad actors can be reported, they trust the system around the LRD—so the Liberian dollar is worth taking seriously and using."
          variant="centered"
          badges={
            <>
              <Badge variant="outline">Safety First</Badge>
              <Badge className="bg-muted/40 border border-border/40 text-destructive">Community Protection</Badge>
            </>
          }
          contentMaxWidth="max-w-4xl"
        />

        {/* Alert Banner */}
        <section className="py-8 sm:py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-l-4 border-l-destructive border-border/40 rounded-2xl shadow-sm">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-xl bg-destructive/20 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">Your Safety is Our Priority</h3>
                        <Badge className="bg-muted/40 border border-border/40 text-destructive">Protected</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        All reports are confidential and reviewed by our fraud investigation team. If you&apos;re in
                        immediate danger, please contact the Liberia National Police at 911.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="gap-1">
                          <Shield className="h-3 w-3 text-primary" />
                          Anonymous
                        </Badge>
                        <Badge variant="secondary" className="gap-1">
                          <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                          24h Review
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-12 sm:py-14 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card className="border-border/40 rounded-2xl shadow-sm">
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
                        <Upload className="h-8 w-8 mx-auto mb-2 text-primary" />
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

                    <Button type="submit" className="w-full rounded-xl min-h-[44px]" size="lg" disabled={submitting}>
                      {submitting ? "Sending report…" : "Send fraud report"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Recent Alerts */}
        <section className="py-12 sm:py-14 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8 space-y-3">
                <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                  <Badge variant="outline">Recent Alerts</Badge>
                  <Badge className="bg-muted/40 border border-border/40 text-destructive">Community Warnings</Badge>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-balance text-foreground">
                  Recent Fraud Alerts
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Stay informed about active fraud threats in your area
                </p>
              </div>
              <div className="space-y-4">
                <Card className="border-destructive/20 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center gap-2">
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                          Active Alert
                        </Badge>
                        <div className="text-xs text-muted-foreground">High Priority</div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">Counterfeit $100 Bills - Red Light Market</h3>
                          <Badge className="bg-muted/40 border border-border/40 text-destructive">Counterfeit</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Multiple reports of counterfeit $100 bills circulating near Red Light Market. Check serial
                          numbers carefully.
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                            12 reports
                          </span>
                          <span>Posted 2 days ago</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-500/20 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center gap-2">
                        <Badge variant="secondary" className="gap-1 bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
                          <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                          Resolved
                        </Badge>
                        <div className="text-xs text-muted-foreground">Case Closed</div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">Unauthorized Changer - Broad Street</h3>
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">Impersonation</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Individual impersonating licensed changer. Authorities have been notified and the individual
                          identified.
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Shield className="h-3 w-3 text-primary" />
                            Police notified
                          </span>
                          <span>Posted 1 week ago</span>
                        </div>
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
