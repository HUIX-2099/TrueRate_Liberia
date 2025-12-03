"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MapPin, Camera, TrendingUp } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function ReportRatePage() {
  const { toast } = useToast()
  const router = useRouter()
  const [formData, setFormData] = useState({
    changerName: "",
    location: "",
    county: "",
    buyRate: "",
    sellRate: "",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Rate Report Submitted!",
      description: "Thank you for contributing. You've earned 10 points!",
    })

    router.push("/community")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Report Exchange Rate</h1>
              <p className="text-lg text-muted-foreground text-pretty">
                Help the community by sharing rates you've seen at money changers
              </p>
              <div className="flex justify-center gap-4 mt-6">
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  +10 Points
                </Badge>
                <Badge variant="outline" className="text-sm px-4 py-2">
                  Verified Badge
                </Badge>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Rate Details</CardTitle>
                  <CardDescription>Please provide accurate information to help the community</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="changerName">Money Changer Name *</Label>
                      <Input
                        id="changerName"
                        placeholder="e.g., First International Bank"
                        value={formData.changerName}
                        onChange={(e) => setFormData({ ...formData, changerName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">Specific Location *</Label>
                        <Input
                          id="location"
                          placeholder="e.g., Broad Street"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="county">County *</Label>
                        <Select
                          value={formData.county}
                          onValueChange={(value) => setFormData({ ...formData, county: value })}
                        >
                          <SelectTrigger id="county">
                            <SelectValue placeholder="Select county" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="montserrado">Montserrado</SelectItem>
                            <SelectItem value="grand-bassa">Grand Bassa</SelectItem>
                            <SelectItem value="bong">Bong</SelectItem>
                            <SelectItem value="nimba">Nimba</SelectItem>
                            <SelectItem value="margibi">Margibi</SelectItem>
                            <SelectItem value="maryland">Maryland</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="buyRate">Buy Rate (LRD per USD) *</Label>
                        <Input
                          id="buyRate"
                          type="number"
                          step="0.01"
                          placeholder="184.50"
                          value={formData.buyRate}
                          onChange={(e) => setFormData({ ...formData, buyRate: e.target.value })}
                          required
                        />
                        <p className="text-xs text-muted-foreground">Rate they buy USD from you</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sellRate">Sell Rate (LRD per USD) *</Label>
                        <Input
                          id="sellRate"
                          type="number"
                          step="0.01"
                          placeholder="186.50"
                          value={formData.sellRate}
                          onChange={(e) => setFormData({ ...formData, sellRate: e.target.value })}
                          required
                        />
                        <p className="text-xs text-muted-foreground">Rate they sell USD to you</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any additional context about the rate or service..."
                        rows={4}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Photo Evidence (Optional)</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">Upload a photo of the rate board</p>
                        <Button type="button" variant="outline" size="sm">
                          Choose Photo
                        </Button>
                      </div>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex gap-3">
                        <TrendingUp className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold mb-1 text-sm">Earn Rewards</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Each verified rate report earns you 10 points toward your community rank. Accurate reports
                            help you climb the leaderboard!
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      Submit Rate Report
                    </Button>
                  </form>
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
