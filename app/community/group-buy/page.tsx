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
import { Progress } from "@/components/ui/progress"
import { Users, ShoppingBasket, MapPin, Clock, Plus, TrendingDown, CheckCircle2, UserPlus } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface GroupBuyListing {
  id: string
  item: string
  unit: string
  targetQuantity: number
  currentQuantity: number
  pricePerUnit: number
  bulkPricePerUnit: number
  savingsPercent: number
  organizer: string
  neighborhood: string
  county: string
  deadline: string
  participants: number
  maxParticipants: number
  status: "open" | "filling" | "full" | "completed"
  description: string
  createdAt: string
}

const MOCK_LISTINGS: GroupBuyListing[] = [
  {
    id: "gb1",
    item: "Rice (25kg bags)",
    unit: "bags",
    targetQuantity: 20,
    currentQuantity: 14,
    pricePerUnit: 4500,
    bulkPricePerUnit: 3800,
    savingsPercent: 15.6,
    organizer: "Sarah D.",
    neighborhood: "Sinkor",
    county: "Montserrado",
    deadline: new Date(Date.now() + 3 * 86400_000).toISOString(),
    participants: 7,
    maxParticipants: 10,
    status: "filling",
    description: "Buying directly from importer in Freeport. Need at least 20 bags for bulk price. Pick up at Sinkor junction.",
    createdAt: new Date(Date.now() - 2 * 86400_000).toISOString(),
  },
  {
    id: "gb2",
    item: "Cooking Gas (14kg cylinders)",
    unit: "cylinders",
    targetQuantity: 10,
    currentQuantity: 10,
    pricePerUnit: 6200,
    bulkPricePerUnit: 5200,
    savingsPercent: 16.1,
    organizer: "David W.",
    neighborhood: "Paynesville",
    county: "Montserrado",
    deadline: new Date(Date.now() + 1 * 86400_000).toISOString(),
    participants: 10,
    maxParticipants: 10,
    status: "full",
    description: "Got a bulk deal from gas depot. Delivery arranged. All spots filled!",
    createdAt: new Date(Date.now() - 5 * 86400_000).toISOString(),
  },
  {
    id: "gb3",
    item: "Charcoal bags",
    unit: "bags",
    targetQuantity: 30,
    currentQuantity: 12,
    pricePerUnit: 1600,
    bulkPricePerUnit: 1200,
    savingsPercent: 25,
    organizer: "Grace N.",
    neighborhood: "Congo Town",
    county: "Montserrado",
    deadline: new Date(Date.now() + 5 * 86400_000).toISOString(),
    participants: 8,
    maxParticipants: 15,
    status: "open",
    description: "Charcoal from Bong County direct. Way cheaper than market price. More people = better deal!",
    createdAt: new Date(Date.now() - 1 * 86400_000).toISOString(),
  },
  {
    id: "gb4",
    item: "Palm Oil (gallons)",
    unit: "gallons",
    targetQuantity: 25,
    currentQuantity: 18,
    pricePerUnit: 1900,
    bulkPricePerUnit: 1500,
    savingsPercent: 21.1,
    organizer: "Moses K.",
    neighborhood: "Red Light area",
    county: "Montserrado",
    deadline: new Date(Date.now() + 2 * 86400_000).toISOString(),
    participants: 12,
    maxParticipants: 15,
    status: "filling",
    description: "Local palm oil straight from Lofa. Fresh and cheaper than market. Come to Red Light to collect.",
    createdAt: new Date(Date.now() - 3 * 86400_000).toISOString(),
  },
]

const STATUS_STYLES = {
  open: { bg: "bg-muted/40 border border-border/40", text: "text-green-600", label: "Open" },
  filling: { bg: "bg-muted/40 border border-border/40", text: "text-blue-600", label: "Filling Up" },
  full: { bg: "bg-muted/40 border border-border/40", text: "text-orange-600", label: "Full" },
  completed: { bg: "bg-muted", text: "text-muted-foreground", label: "Completed" },
}

export default function GroupBuyPage() {
  const [listings] = useState(MOCK_LISTINGS)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ item: "", quantity: "", price: "", bulkPrice: "", neighborhood: "", description: "" })
  const { toast } = useToast()

  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(id)
  }, [])

  const daysUntil = (date: string) => {
    const days = Math.ceil((new Date(date).getTime() - now) / 86400_000)
    if (days <= 0) return "Ending today"
    if (days === 1) return "1 day left"
    return `${days} days left`
  }

  const totalSaved = listings.reduce((s, l) => {
    return s + (l.pricePerUnit - l.bulkPricePerUnit) * l.currentQuantity
  }, 0)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
        <PageHero
          ariaLabel="Group buy coordinator"
          label="Community"
          title="Group Buy Coordinator"
          description="Save money by buying essentials together with your neighbors. Bulk buying = lower prices for everyone."
          variant="centered"
          contentMaxWidth="max-w-3xl"
        />

        {/* Stats */}
        <section className="py-4 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid grid-cols-3 gap-3">
              <Card className="border-green-500/20 rounded-xl">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{listings.filter((l) => l.status === "open" || l.status === "filling").length}</div>
                  <div className="text-xs text-muted-foreground">Active Groups</div>
                </CardContent>
              </Card>
              <Card className="border-border/40 rounded-xl">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{listings.reduce((s, l) => s + l.participants, 0)}</div>
                  <div className="text-xs text-muted-foreground">Participants</div>
                </CardContent>
              </Card>
              <Card className="border-green-500/20 rounded-xl">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{totalSaved.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">LRD Saved</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Create + Listings */}
        <section className="py-6 sm:py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Active Group Buys</h2>
                <Button size="sm" className="rounded-xl" onClick={() => setShowCreate(!showCreate)}>
                  <Plus className="h-4 w-4 mr-1 text-primary" /> Start a Group
                </Button>
              </div>

              {showCreate && (
                <Card className="border-primary/20 rounded-2xl mb-6">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Start a New Group Buy</CardTitle>
                    <CardDescription>Organize a bulk purchase for your neighborhood.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Item</Label>
                        <Select value={form.item} onValueChange={(v) => setForm({ ...form, item: v })}>
                          <SelectTrigger><SelectValue placeholder="What to buy" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Rice (25kg bags)">Rice (25kg bags)</SelectItem>
                            <SelectItem value="Cooking Gas (LPG)">Cooking Gas (LPG)</SelectItem>
                            <SelectItem value="Charcoal bags">Charcoal bags</SelectItem>
                            <SelectItem value="Palm Oil (gallons)">Palm Oil (gallons)</SelectItem>
                            <SelectItem value="Sugar (kg)">Sugar</SelectItem>
                            <SelectItem value="Cement (50kg bags)">Cement</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Target quantity</Label>
                        <Input type="number" placeholder="e.g. 20" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Regular price (LRD/unit)</Label>
                        <Input type="number" placeholder="e.g. 4500" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Bulk price (LRD/unit)</Label>
                        <Input type="number" placeholder="e.g. 3800" value={form.bulkPrice} onChange={(e) => setForm({ ...form, bulkPrice: e.target.value })} />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label className="text-xs">Neighborhood / pickup location</Label>
                        <Input placeholder="e.g. Sinkor junction" value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label className="text-xs">Description</Label>
                        <Textarea placeholder="Details about the deal, pickup, etc." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
                      </div>
                    </div>
                    <Button
                      className="w-full mt-3 rounded-xl"
                      onClick={() => {
                        toast({ title: "Group buy created!", description: "Others can now join your group buy." })
                        setShowCreate(false)
                      }}
                    >
                      Create Group Buy
                    </Button>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                {listings.map((listing) => {
                  const status = STATUS_STYLES[listing.status]
                  const progress = (listing.currentQuantity / listing.targetQuantity) * 100
                  const savings = listing.pricePerUnit - listing.bulkPricePerUnit
                  return (
                    <Card key={listing.id} className="border-border/40 rounded-2xl">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <ShoppingBasket className="h-4 w-4 text-primary" />
                              <h3 className="font-bold">{listing.item}</h3>
                              <Badge variant="outline" className={`text-xs ${status.text}`}>{status.label}</Badge>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-blue-600 dark:text-blue-400" /> {listing.neighborhood}, {listing.county}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-blue-600 dark:text-blue-400" /> {daysUntil(listing.deadline)}
                              </span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="flex items-center gap-1 text-green-600 font-bold">
                              <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                              Save {listing.savingsPercent.toFixed(0)}%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {savings.toLocaleString()} LRD/unit
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">{listing.description}</p>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="p-2.5 rounded-lg bg-muted/50">
                            <div className="text-xs text-muted-foreground">Regular price</div>
                            <div className="font-semibold line-through text-muted-foreground">
                              {listing.pricePerUnit.toLocaleString()} LRD
                            </div>
                          </div>
                          <div className="p-2.5 rounded-lg bg-green-500/5 border border-green-500/10">
                            <div className="text-xs text-green-600">Group buy price</div>
                            <div className="font-bold text-green-700 dark:text-green-400">
                              {listing.bulkPricePerUnit.toLocaleString()} LRD
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              {listing.currentQuantity}/{listing.targetQuantity} {listing.unit}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-primary" />
                              {listing.participants}/{listing.maxParticipants} people
                            </span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>

                        {listing.status !== "full" && listing.status !== "completed" && (
                          <Button
                            className="w-full mt-3 rounded-xl"
                            variant="outline"
                            onClick={() => toast({ title: "Joined!", description: `You joined the ${listing.item} group buy.` })}
                          >
                            <UserPlus className="h-4 w-4 mr-2 text-primary" /> Join This Group Buy
                          </Button>
                        )}
                        {listing.status === "full" && (
                          <div className="mt-3 p-2.5 rounded-xl bg-muted/40 border border-border/40 text-center text-sm text-orange-600 font-semibold">
                            <CheckCircle2 className="h-4 w-4 inline mr-1 text-green-600 dark:text-green-400" />
                            Group is full — check back for new groups
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-8 sm:py-10 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-bold mb-4 text-center">How Group Buying Works</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <Card className="border-border/40 rounded-xl">
                  <CardContent className="p-5 text-center">
                    <div className="text-3xl mb-2">1</div>
                    <h3 className="font-semibold mb-1">Someone Starts a Group</h3>
                    <p className="text-xs text-muted-foreground">An organizer finds a bulk deal and creates a group buy listing.</p>
                  </CardContent>
                </Card>
                <Card className="border-border/40 rounded-xl">
                  <CardContent className="p-5 text-center">
                    <div className="text-3xl mb-2">2</div>
                    <h3 className="font-semibold mb-1">Neighbors Join</h3>
                    <p className="text-xs text-muted-foreground">People in the area join until the target quantity is reached.</p>
                  </CardContent>
                </Card>
                <Card className="border-border/40 rounded-xl">
                  <CardContent className="p-5 text-center">
                    <div className="text-3xl mb-2">3</div>
                    <h3 className="font-semibold mb-1">Everyone Saves</h3>
                    <p className="text-xs text-muted-foreground">Bulk order is placed and everyone gets the lower price.</p>
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
