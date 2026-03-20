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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Fuel, ShoppingBasket, Flame, Droplets, ThumbsUp, Clock, CheckCircle2, XCircle, Send } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

interface AvailabilityReport {
  id: string
  itemType: "fuel" | "rice" | "cooking_gas" | "water" | "other"
  itemName: string
  available: boolean
  price?: number
  currency: string
  location: string
  county: string
  waitTime?: string
  notes: string
  upvotes: number
  reportedAt: string
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  fuel: Fuel,
  rice: ShoppingBasket,
  cooking_gas: Flame,
  water: Droplets,
  other: MapPin,
}

const TYPE_LABELS: Record<string, string> = {
  fuel: "Fuel",
  rice: "Rice",
  cooking_gas: "Cooking Gas",
  water: "Water",
  other: "Other",
}

export default function AvailabilityPage() {
  const [reports, setReports] = useState<AvailabilityReport[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const { toast } = useToast()

  const [form, setForm] = useState({
    itemType: "fuel",
    itemName: "",
    available: "true",
    price: "",
    location: "",
    county: "Montserrado",
    waitTime: "",
    notes: "",
  })

  const fetchReports = useCallback(() => {
    const url = filter === "all" ? "/api/community/availability" : `/api/community/availability?type=${filter}`
    fetch(url)
      .then((r) => r.json())
      .then((data) => setReports(data.reports ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [filter])

  useEffect(() => { fetchReports() }, [fetchReports])

  const handleSubmit = async () => {
    if (!form.location) {
      toast({ title: "Missing location", description: "Please enter where this is.", variant: "destructive" })
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/community/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemType: form.itemType,
          itemName: form.itemName || TYPE_LABELS[form.itemType] || form.itemType,
          available: form.available === "true",
          price: form.price ? Number(form.price) : undefined,
          location: form.location,
          county: form.county,
          waitTime: form.waitTime || undefined,
          notes: form.notes,
        }),
      })
      if (res.ok) {
        toast({ title: "Report received", description: "Thanks for sharing what you found." })
        setForm({ itemType: "fuel", itemName: "", available: "true", price: "", location: "", county: "Montserrado", waitTime: "", notes: "" })
        setShowForm(false)
        fetchReports()
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

  const available = reports.filter((r) => r.available)
  const unavailable = reports.filter((r) => !r.available)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
        <PageHero
          ariaLabel="Availability tracker"
          label="Community"
          title="Availability Tracker"
          description="Community-powered tracker showing where fuel, rice, and essentials are available right now."
          variant="centered"
          contentMaxWidth="max-w-3xl"
        />

        {/* Stats */}
        <section className="py-4 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid grid-cols-3 gap-3">
              <Card className="border-green-500/20 rounded-xl">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{available.length}</div>
                  <div className="text-xs text-muted-foreground">Available</div>
                </CardContent>
              </Card>
              <Card className="border-red-500/20 rounded-xl">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{unavailable.length}</div>
                  <div className="text-xs text-muted-foreground">Out of Stock</div>
                </CardContent>
              </Card>
              <Card className="border-border/40 rounded-xl">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{reports.length}</div>
                  <div className="text-xs text-muted-foreground">Total Reports</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Filter + Submit */}
        <section className="py-4 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 flex-wrap">
                <Tabs value={filter} onValueChange={setFilter} className="flex-1">
                  <TabsList className="h-auto flex-wrap">
                    <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                    <TabsTrigger value="fuel" className="text-xs gap-1"><Fuel className="h-3 w-3 text-primary" /> Fuel</TabsTrigger>
                    <TabsTrigger value="rice" className="text-xs gap-1"><ShoppingBasket className="h-3 w-3 text-primary" /> Rice</TabsTrigger>
                    <TabsTrigger value="cooking_gas" className="text-xs gap-1"><Flame className="h-3 w-3 text-primary" /> Gas</TabsTrigger>
                    <TabsTrigger value="water" className="text-xs gap-1"><Droplets className="h-3 w-3 text-primary" /> Water</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button size="sm" className="rounded-xl" onClick={() => setShowForm(!showForm)}>
                  <Send className="h-4 w-4 mr-1 text-primary" /> Report
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Submit Form */}
        {showForm && (
          <section className="py-4 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <Card className="border-primary/20 rounded-2xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Share availability update</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Item type</Label>
                        <Select value={form.itemType} onValueChange={(v) => setForm({ ...form, itemType: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fuel">Fuel (PMS)</SelectItem>
                            <SelectItem value="rice">Rice</SelectItem>
                            <SelectItem value="cooking_gas">Cooking Gas</SelectItem>
                            <SelectItem value="water">Water</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Available?</Label>
                        <Select value={form.available} onValueChange={(v) => setForm({ ...form, available: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Yes, in stock</SelectItem>
                            <SelectItem value="false">No, out of stock</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Price (LRD, optional)</Label>
                        <Input type="number" placeholder="e.g. 900" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Wait time (optional)</Label>
                        <Input placeholder="e.g. 30 min queue" value={form.waitTime} onChange={(e) => setForm({ ...form, waitTime: e.target.value })} />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label className="text-xs">Location / store name</Label>
                        <Input placeholder="e.g. Total Station, Sinkor" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label className="text-xs">Notes (optional)</Label>
                        <Textarea placeholder="Any details..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
                      </div>
                    </div>
                    <Button onClick={handleSubmit} disabled={submitting} className="w-full mt-3 rounded-xl">
                      {submitting ? "Sending..." : "Send report"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}

        {/* Reports List */}
        <section className="py-6 sm:py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-xl bg-muted/50 animate-pulse" />)}
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map((report) => {
                    const Icon = TYPE_ICONS[report.itemType] ?? MapPin
                    return (
                      <Card key={report.id} className={`rounded-xl ${report.available ? "border-green-500/20" : "border-red-500/20"}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${ report.available ? "bg-muted/40 border border-border/40" : "bg-muted/40 border border-border/40" }`}>
                              {report.available ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <Icon className="h-4 w-4 text-primary" />
                                <span className="font-semibold text-sm">{report.itemName}</span>
                                <Badge variant={report.available ? "secondary" : "destructive"} className="text-xs">
                                  {report.available ? "Available" : "Out of Stock"}
                                </Badge>
                              </div>

                              {report.price && (
                                <div className="text-sm font-semibold text-primary">
                                  {report.price.toLocaleString()} {report.currency}/gallon
                                </div>
                              )}

                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                <MapPin className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                {report.location}, {report.county}
                              </div>

                              {report.waitTime && (
                                <div className="flex items-center gap-1 text-xs text-orange-600 mt-0.5">
                                  <Clock className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                  {report.waitTime}
                                </div>
                              )}

                              {report.notes && (
                                <p className="text-xs text-muted-foreground mt-1">{report.notes}</p>
                              )}

                              <div className="flex items-center gap-3 mt-2">
                                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                                  <ThumbsUp className="h-3.5 w-3.5 text-primary" /> {report.upvotes} confirm
                                </button>
                                <span className="text-xs text-muted-foreground ml-auto">{timeAgo(report.reportedAt)}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}

                  {reports.length === 0 && (
                    <Card className="border-border/40 rounded-xl">
                      <CardContent className="p-8 text-center">
                        <MapPin className="h-10 w-10 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
                        <p className="text-muted-foreground">No reports yet for this category. Be the first to share an update.</p>
                      </CardContent>
                    </Card>
                  )}
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
