"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { MessageSquare, Smartphone, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SMSAlerts() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [frequency, setFrequency] = useState("daily")
  const [alerts, setAlerts] = useState({
    rateChanges: true,
    weeklyReport: false,
    marketNews: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "SMS Alerts Activated!",
      description: `You'll receive rate updates at ${phoneNumber}`,
    })

    setIsSubmitting(false)
    setPhoneNumber("")
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20">
              <MessageSquare className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <CardTitle>SMS Rate Alerts</CardTitle>
              <CardDescription>Get updates on your feature phone</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">+231</span>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="77-123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="pl-14"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">We'll send you a confirmation SMS</p>
            </div>

            <div className="space-y-3">
              <Label>Alert Frequency</Label>
              <RadioGroup value={frequency} onValueChange={setFrequency}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="daily" />
                  <Label htmlFor="daily" className="font-normal cursor-pointer">
                    Daily (8:00 AM)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly" className="font-normal cursor-pointer">
                    Weekly (Monday mornings)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="major" id="major" />
                  <Label htmlFor="major" className="font-normal cursor-pointer">
                    Major changes only (±5% change)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Alert Types</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rate-changes"
                    checked={alerts.rateChanges}
                    onCheckedChange={(checked) => setAlerts({ ...alerts, rateChanges: checked as boolean })}
                  />
                  <Label htmlFor="rate-changes" className="font-normal cursor-pointer">
                    Current exchange rates
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="weekly-report"
                    checked={alerts.weeklyReport}
                    onCheckedChange={(checked) => setAlerts({ ...alerts, weeklyReport: checked as boolean })}
                  />
                  <Label htmlFor="weekly-report" className="font-normal cursor-pointer">
                    Weekly rate summary
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="market-news"
                    checked={alerts.marketNews}
                    onCheckedChange={(checked) => setAlerts({ ...alerts, marketNews: checked as boolean })}
                  />
                  <Label htmlFor="market-news" className="font-normal cursor-pointer">
                    Important market news
                  </Label>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Activating..." : "Activate SMS Alerts"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="bg-secondary/10 border-secondary/20">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Smartphone className="h-5 w-5 text-secondary flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Quick Subscribe via USSD</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Text <span className="font-mono font-semibold">RATE</span> to{" "}
                  <span className="font-mono font-semibold">1234</span> from any phone to subscribe. You'll receive a
                  confirmation message immediately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sample SMS Message</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted p-4 space-y-3">
              <div className="flex items-start gap-3">
                <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium text-foreground">RateWatch Alert</p>
                  <p className="text-sm text-foreground font-mono leading-relaxed">
                    USD/LRD: 185.50
                    <br />
                    Buy: 184.00 | Sell: 187.00
                    <br />
                    Change: +2.3%
                    <br />
                    Updated: 8:00 AM
                  </p>
                  <p className="text-xs text-muted-foreground">Reply STOP to unsubscribe</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Free for the first 3 months</p>
                  <p className="text-xs text-muted-foreground">Then 50 LRD per month</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Works on any phone</p>
                  <p className="text-xs text-muted-foreground">No smartphone required</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Cancel anytime</p>
                  <p className="text-xs text-muted-foreground">Text STOP to unsubscribe</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
