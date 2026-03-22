"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Bell, BellOff, Smartphone, Mail, MessageSquare,
  TrendingUp, AlertTriangle, DollarSign, Clock, Check
} from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { useToast } from "@/hooks/use-toast"

const NOTIFICATION_CLIENT_ID_KEY = "truerate-notification-client-id"

function getOrCreateClientId(): string {
  if (typeof window === "undefined") return "anonymous"
  let id = localStorage.getItem(NOTIFICATION_CLIENT_ID_KEY)
  if (!id) {
    id = "c-" + Math.random().toString(36).slice(2) + "-" + Date.now().toString(36)
    localStorage.setItem(NOTIFICATION_CLIENT_ID_KEY, id)
  }
  return id
}

interface AlertPreference {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  enabled: boolean
  channels: ('push' | 'sms' | 'email')[]
}

export function PushNotifications() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [pushSupported, setPushSupported] = useState(false)
  const [pushEnabled, setPushEnabled] = useState(false)
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [saved, setSaved] = useState(false)
  const [rateAbove, setRateAbove] = useState<string>("")
  const [rateBelow, setRateBelow] = useState<string>("")
  const [moveUpPct, setMoveUpPct] = useState<string>("")
  const [moveDownPct, setMoveDownPct] = useState<string>("")
  const [digest, setDigest] = useState<"none" | "daily" | "weekly">("none")
  const [digestEmail, setDigestEmail] = useState("")
  
  const [alerts, setAlerts] = useState<AlertPreference[]>([
    {
      id: 'best-rate',
      name: "Best Rate Alerts",
      description: "Daily at 8 AM and 4 PM with the best rates in your area",
      icon: <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />,
      enabled: true,
      channels: ['push', 'sms']
    },
    {
      id: 'fraud',
      name: "Fraud Alerts",
      description: "Instant alerts when fraud is reported near you",
      icon: <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
      enabled: true,
      channels: ['push', 'sms']
    },
    {
      id: 'rate-threshold',
      name: "Rate Threshold Alerts",
      description: "Get notified when rate crosses your target",
      icon: <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
      enabled: false,
      channels: ['push']
    },
    {
      id: 'predictions',
      name: "Weekly Predictions",
      description: "Weekly rate outlook summary every Sunday evening",
      icon: <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      enabled: true,
      channels: ['push', 'email']
    }
  ])

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator) {
      setPushSupported(true)
      setPushEnabled(Notification.permission === 'granted')
    }
  }, [])

  const fetchPreferences = useCallback(async () => {
    try {
      const clientId = getOrCreateClientId()
      const res = await fetch("/api/notifications/preferences", {
        headers: { "x-notification-client-id": clientId },
      })
      const data = await res.json()
      const p = data?.prefs as
        | {
            rate_above?: number | null
            rate_below?: number | null
            move_up_pct?: number | null
            move_down_pct?: number | null
            digest?: string
            digest_email?: string | null
          }
        | null
        | undefined
      if (res.ok && p) {
        if (p.rate_above != null) setRateAbove(String(p.rate_above))
        if (p.rate_below != null) setRateBelow(String(p.rate_below))
        if (p.move_up_pct != null) setMoveUpPct(String(p.move_up_pct))
        if (p.move_down_pct != null) setMoveDownPct(String(p.move_down_pct))
        if (p.digest) setDigest(p.digest as "none" | "daily" | "weekly")
        if (p.digest_email) setDigestEmail(p.digest_email)
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    fetchPreferences()
  }, [fetchPreferences])

  const requestPushPermission = async () => {
    if (!pushSupported) return
    
    try {
      const permission = await Notification.requestPermission()
      setPushEnabled(permission === 'granted')
      
      if (permission === 'granted') {
        // In production, register with push service
        new Notification('TrueRate Liberia', {
          body: 'Push notifications enabled! You\'ll receive rate alerts.',
          icon: '/icons/Logo%206.png'
        })
      }
    } catch (error) {
      console.error('Push permission error:', error)
    }
  }

  const toggleAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, enabled: !alert.enabled } : alert
    ))
  }

  const toggleChannel = (alertId: string, channel: 'push' | 'sms' | 'email') => {
    setAlerts(prev => prev.map(alert => {
      if (alert.id !== alertId) return alert
      
      const channels = alert.channels.includes(channel)
        ? alert.channels.filter(c => c !== channel)
        : [...alert.channels, channel]
      
      return { ...alert, channels }
    }))
  }

  const savePreferences = async () => {
    setSaved(true)
    try {
      const clientId = getOrCreateClientId()
      const res = await fetch("/api/notifications/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-notification-client-id": clientId,
        },
        body: JSON.stringify({
          rateAbove: rateAbove.trim() ? parseFloat(rateAbove) : null,
          rateBelow: rateBelow.trim() ? parseFloat(rateBelow) : null,
          moveUpPct: moveUpPct.trim() ? parseFloat(moveUpPct) : null,
          moveDownPct: moveDownPct.trim() ? parseFloat(moveDownPct) : null,
          digest,
          digestEmail: digestEmail.trim() || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: "Could not save", description: data?.error ?? "Try again.", variant: "destructive" })
        return
      }
      toast({ title: "Preferences saved", description: "Your notification rules are updated." })
    } catch {
      toast({ title: "We couldn't save your settings", description: "Please try again in a moment.", variant: "destructive" })
    } finally {
      setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Choose how and when you want to receive alerts
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Push Notification Permission */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${ pushEnabled ? 'bg-secondary/20' : 'bg-muted' }`}>
                {pushEnabled ? (
                  <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                ) : (
                  <BellOff className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <div className="font-semibold">Push Notifications</div>
                <div className="text-sm text-muted-foreground">
                  {pushEnabled ? 'Enabled - you\'ll receive instant alerts' : 'Enable to get real-time alerts'}
                </div>
              </div>
            </div>
            {pushSupported && !pushEnabled && (
              <Button onClick={requestPushPermission}>
                Enable
              </Button>
            )}
            {pushEnabled && (
              <Badge variant="secondary" className="gap-1">
                <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                Active
              </Badge>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-primary" />
              Phone Number (SMS)
            </label>
            <Input
              type="tel"
              placeholder="+231 ..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Email Address
            </label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Alert Preferences */}
        <div className="space-y-4">
          <h4 className="font-semibold">Alert Types</h4>
          
          {alerts.map(alert => (
            <div 
              key={alert.id}
              className={`p-4 border rounded-lg transition-colors ${ alert.enabled ? 'border-primary/30 bg-primary/5' : '' }`}
            >
              <div className="flex items-start gap-4">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${ alert.enabled ? 'bg-background' : 'bg-muted' }`}>
                  {alert.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold">{alert.name}</span>
                    <Switch 
                      checked={alert.enabled}
                      onCheckedChange={() => toggleAlert(alert.id)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {alert.description}
                  </p>
                  
                  {alert.enabled && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={alert.channels.includes('push') ? 'default' : 'outline'}
                        className="gap-1 text-xs"
                        onClick={() => toggleChannel(alert.id, 'push')}
                        disabled={!pushEnabled}
                      >
                        <Bell className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                        Push
                      </Button>
                      <Button
                        size="sm"
                        variant={alert.channels.includes('sms') ? 'default' : 'outline'}
                        className="gap-1 text-xs"
                        onClick={() => toggleChannel(alert.id, 'sms')}
                        disabled={!phone}
                      >
                        <MessageSquare className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                        SMS
                      </Button>
                      <Button
                        size="sm"
                        variant={alert.channels.includes('email') ? 'default' : 'outline'}
                        className="gap-1 text-xs"
                        onClick={() => toggleChannel(alert.id, 'email')}
                        disabled={!email}
                      >
                        <Mail className="h-3 w-3 text-primary" />
                        Email
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Push rules: rate > X, moved by Y% */}
        <div className="p-4 border rounded-lg space-y-4">
          <h4 className="font-semibold">Notify when rate…</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">…goes above (LRD/USD)</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder="e.g. 200"
                  value={rateAbove}
                  onChange={(e) => setRateAbove(e.target.value)}
                />
                <span className="flex items-center text-sm text-muted-foreground">LRD</span>
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">…goes below (LRD/USD)</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder="e.g. 190"
                  value={rateBelow}
                  onChange={(e) => setRateBelow(e.target.value)}
                />
                <span className="flex items-center text-sm text-muted-foreground">LRD</span>
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">…moves up by (%)</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder="e.g. 2"
                  value={moveUpPct}
                  onChange={(e) => setMoveUpPct(e.target.value)}
                />
                <span className="flex items-center text-sm text-muted-foreground">%</span>
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">…moves down by (%)</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder="e.g. 2"
                  value={moveDownPct}
                  onChange={(e) => setMoveDownPct(e.target.value)}
                />
                <span className="flex items-center text-sm text-muted-foreground">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily / weekly digest */}
        <div className="p-4 border rounded-lg space-y-4">
          <h4 className="font-semibold">Daily or weekly digest</h4>
          <p className="text-sm text-muted-foreground">
            Get a summary of the rate and changes by email or push.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={digest === "none" ? "default" : "outline"}
              onClick={() => setDigest("none")}
            >
              None
            </Button>
            <Button
              size="sm"
              variant={digest === "daily" ? "default" : "outline"}
              onClick={() => setDigest("daily")}
            >
              Daily
            </Button>
            <Button
              size="sm"
              variant={digest === "weekly" ? "default" : "outline"}
              onClick={() => setDigest("weekly")}
            >
              Weekly
            </Button>
          </div>
          {(digest === "daily" || digest === "weekly") && (
            <div>
              <Label className="text-sm text-muted-foreground">Email (optional)</Label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={digestEmail}
                onChange={(e) => setDigestEmail(e.target.value)}
                className="mt-1"
              />
            </div>
          )}
        </div>

        {/* Save Button */}
        <Button 
          className="w-full gap-2" 
          onClick={savePreferences}
          disabled={saved}
        >
          {saved ? (
            <>
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              Saved!
            </>
          ) : (
            'Save Preferences'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}






