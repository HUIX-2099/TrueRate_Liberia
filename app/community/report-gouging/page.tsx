"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageHero } from "@/components/layout/page-hero"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, MapPin, ThumbsUp, ThumbsDown, CheckCircle2, Send } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

/** API list row (Supabase) or legacy mock shape */
interface GougingReport {
  id: string
  itemName: string
  reportedPrice: number
  fairPrice: number
  overchargePercent: number
  location: string
  county: string
  description: string
  upvotes: number
  downvotes: number
  verified: boolean
  createdAt: string
  status?: string
}

function buildDescriptionFromForm(form: {
  itemName: string
  reportedPrice: string
  fairPrice: string
  county: string
  description: string
}): string {
  const lines: string[] = []
  if (form.itemName) lines.push(`Item: ${form.itemName}`)
  if (form.reportedPrice.trim()) lines.push(`Price charged: ${form.reportedPrice.trim()} LRD`)
  if (form.fairPrice.trim()) lines.push(`Reference / fair price: ${form.fairPrice.trim()} LRD`)
  if (form.county) lines.push(`County: ${form.county}`)
  if (form.description.trim()) lines.push(form.description.trim())
  return lines.join("\n")
}

function normalizeListReport(r: Record<string, unknown>): GougingReport {
  const created =
    typeof r.created_at === "string"
      ? r.created_at
      : typeof r.createdAt === "string"
        ? r.createdAt
        : new Date().toISOString()
  const status = typeof r.status === "string" ? r.status : undefined
  if ("itemName" in r && typeof r.itemName === "string") {
    return {
      id: String(r.id),
      itemName: r.itemName,
      reportedPrice: Number(r.reportedPrice) || 0,
      fairPrice: Number(r.fairPrice) || 0,
      overchargePercent: Number(r.overchargePercent) || 0,
      location: String(r.location ?? ""),
      county: String(r.county ?? ""),
      description: String(r.description ?? ""),
      upvotes: Number(r.upvotes) || 0,
      downvotes: Number(r.downvotes) || 0,
      verified: Boolean(r.verified),
      createdAt: created,
      status,
    }
  }
  return {
    id: String(r.id),
    itemName: "Price gouging report",
    reportedPrice: 0,
    fairPrice: 0,
    overchargePercent: 0,
    location: String(r.location ?? ""),
    county: "",
    description: "",
    upvotes: 0,
    downvotes: 0,
    verified: status === "verified",
    createdAt: created,
    status,
  }
}

export default function ReportGougingPage() {
  const [reports, setReports] = useState<GougingReport[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const [form, setForm] = useState({
    itemName: "",
    reportedPrice: "",
    fairPrice: "",
    location: "",
    county: "Montserrado",
    description: "",
  })

  const fetchReports = useCallback(() => {
    fetch("/api/community/gouging-reports")
      .then((r) => r.json())
      .then((data) => {
        const raw = (data.reports ?? []) as Record<string, unknown>[]
        setReports(raw.map(normalizeListReport))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchReports() }, [fetchReports])

  const handleSubmit = async () => {
    const location = form.location.trim()
    const description = buildDescriptionFromForm(form)
    if (!location) {
      toast({ title: "Missing location", description: "Please add where this happened.", variant: "destructive" })
      return
    }
    if (!description.trim()) {
      toast({
        title: "Add details",
        description: "Select an item, enter the price charged, or write a short description.",
        variant: "destructive",
      })
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/community/gouging-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location,
          description,
          amount: form.reportedPrice.trim() || undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        toast({ title: "Report received", description: "Thanks for helping protect your community." })
        setForm({ itemName: "", reportedPrice: "", fairPrice: "", location: "", county: "Montserrado", description: "" })
        fetchReports()
      } else {
        toast({
          title: "Could not submit",
          description: typeof data?.error === "string" ? data.error : "Please try again.",
          variant: "destructive",
        })
      }
    } catch {
      toast({ title: "We couldn't send your report", description: "Please try again in a moment.", variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  const timeAgo = (dateStr: string) => {
    const mins = Math.round((Date.now() - new Date(dateStr).getTime()) / 60_000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.round(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.round(hrs / 24)}d ago`
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
        <PageHero
          ariaLabel="Report price gouging"
          label="Community Protection"
          title="Report Price Gouging"
          description="Help protect your community. Report businesses charging unfair prices during the crisis."
          variant="centered"
          contentMaxWidth="max-w-3xl"
        />

        {/* Submit Form */}
        <section className="py-6 sm:py-8 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-border/40 rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-primary" />
                    Share a report
                  </CardTitle>
                  <CardDescription>All reports are anonymous and help the entire community.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>What item is overpriced?</Label>
                      <Select value={form.itemName} onValueChange={(v) => setForm({ ...form, itemName: v })}>
                        <SelectTrigger><SelectValue placeholder="Select item" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Fuel (PMS)">Fuel (PMS)</SelectItem>
                          <SelectItem value="Diesel">Diesel</SelectItem>
                          <SelectItem value="Rice (25kg bag)">Rice (25kg bag)</SelectItem>
                          <SelectItem value="Cooking Gas (LPG)">Cooking Gas (LPG)</SelectItem>
                          <SelectItem value="Palm Oil">Palm Oil</SelectItem>
                          <SelectItem value="Taxi fare">Taxi fare</SelectItem>
                          <SelectItem value="Kekeh fare">Kekeh fare</SelectItem>
                          <SelectItem value="Cement">Cement</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Price they charged (LRD)</Label>
                      <Input
                        type="number"
                        placeholder="e.g. 1050"
                        value={form.reportedPrice}
                        onChange={(e) => setForm({ ...form, reportedPrice: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>What should it cost? (LRD, optional)</Label>
                      <Input
                        type="number"
                        placeholder="e.g. 900"
                        value={form.fairPrice}
                        onChange={(e) => setForm({ ...form, fairPrice: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>County</Label>
                      <Select value={form.county} onValueChange={(v) => setForm({ ...form, county: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["Montserrado", "Margibi", "Bong", "Nimba", "Grand Bassa", "Lofa", "Grand Cape Mount", "Bomi", "Grand Gedeh", "Sinoe", "Maryland", "River Cess", "River Gee", "Grand Kru", "Gbarpolu"].map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label>Location / store name</Label>
                      <Input
                        placeholder="e.g. Total Gas Station, Sinkor"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label>Extra details (optional if you filled item and price above)</Label>
                      <Textarea
                        placeholder="Any extra details about the overcharging..."
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>

                  <Button onClick={handleSubmit} disabled={submitting} className="w-full mt-4 rounded-xl min-h-[48px]">
                    {submitting ? "Sending..." : "Send report"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Reports List */}
        <section className="py-6 sm:py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-bold mb-4">Recent Reports ({reports.length})</h2>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-xl bg-muted/50 animate-pulse" />)}
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map((report) => (
                    <Card key={report.id} className="border-border/40 rounded-xl">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 bg-muted/40 border border-border/40`}
                          >
                            <AlertTriangle
                              className={`h-5 w-5 ${report.overchargePercent > 30 ? "text-red-500" : "text-orange-500"}`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="font-semibold">{report.itemName}</span>
                              {report.overchargePercent > 0 && (
                                <Badge
                                  variant={report.overchargePercent > 30 ? "destructive" : "outline"}
                                  className="text-xs"
                                >
                                  +{report.overchargePercent}% overcharge
                                </Badge>
                              )}
                              {report.status && (
                                <Badge variant="outline" className="text-xs capitalize">
                                  {report.status}
                                </Badge>
                              )}
                              {report.verified && (
                                <Badge variant="secondary" className="text-xs gap-1">
                                  <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" /> Verified
                                </Badge>
                              )}
                            </div>
                            {report.reportedPrice > 0 && (
                              <div className="text-sm">
                                <span className="text-destructive font-bold">{report.reportedPrice.toLocaleString()} LRD</span>
                                {report.fairPrice > 0 && (
                                  <span className="text-muted-foreground">
                                    {" "}
                                    (fair: {report.fairPrice.toLocaleString()} LRD)
                                  </span>
                                )}
                              </div>
                            )}
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                              {report.county ? `${report.location}, ${report.county}` : report.location}
                            </div>
                            {report.description && (
                              <p className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap">{report.description}</p>
                            )}
                            <div className="flex items-center gap-4 mt-2">
                              {report.upvotes + report.downvotes > 0 && (
                                <>
                                  <button
                                    type="button"
                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                                  >
                                    <ThumbsUp className="h-3.5 w-3.5 text-primary" /> {report.upvotes}
                                  </button>
                                  <button
                                    type="button"
                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                                  >
                                    <ThumbsDown className="h-3.5 w-3.5 text-primary" /> {report.downvotes}
                                  </button>
                                </>
                              )}
                              <span className="text-xs text-muted-foreground ml-auto">{timeAgo(report.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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
