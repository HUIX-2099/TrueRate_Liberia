"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Bell, BellOff, Smartphone, Mail, MessageSquare,
  TrendingUp, AlertTriangle, DollarSign, Clock, Check
} from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"

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
  const [pushSupported, setPushSupported] = useState(false)
  const [pushEnabled, setPushEnabled] = useState(false)
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [saved, setSaved] = useState(false)
  
  const [alerts, setAlerts] = useState<AlertPreference[]>([
    {
      id: 'best-rate',
      name: "Best Rate Alerts",
      description: "Daily at 8 AM and 4 PM with the best rates in your area",
      icon: <TrendingUp className="h-5 w-5 text-secondary" />,
      enabled: true,
      channels: ['push', 'sms']
    },
    {
      id: 'fraud',
      name: "Fraud Alerts",
      description: "Instant alerts when fraud is reported near you",
      icon: <AlertTriangle className="h-5 w-5 text-destructive" />,
      enabled: true,
      channels: ['push', 'sms']
    },
    {
      id: 'rate-threshold',
      name: "Rate Threshold Alerts",
      description: "Get notified when rate crosses your target",
      icon: <DollarSign className="h-5 w-5 text-primary" />,
      enabled: false,
      channels: ['push']
    },
    {
      id: 'predictions',
      name: "Weekly Predictions",
      description: "AI prediction summary every Sunday evening",
      icon: <Clock className="h-5 w-5 text-accent" />,
      enabled: true,
      channels: ['push', 'email']
    }
  ])

  useEffect(() => {
    // Check if push notifications are supported
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setPushSupported(true)
      setPushEnabled(Notification.permission === 'granted')
    }
  }, [])

  const requestPushPermission = async () => {
    if (!pushSupported) return
    
    try {
      const permission = await Notification.requestPermission()
      setPushEnabled(permission === 'granted')
      
      if (permission === 'granted') {
        // In production, register with push service
        new Notification('TrueRate Liberia', {
          body: 'Push notifications enabled! You\'ll receive rate alerts.',
          icon: '/icon.svg'
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

  const savePreferences = () => {
    // In production, save to backend
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
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
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                pushEnabled ? 'bg-secondary/20' : 'bg-muted'
              }`}>
                {pushEnabled ? (
                  <Bell className="h-5 w-5 text-secondary" />
                ) : (
                  <BellOff className="h-5 w-5 text-muted-foreground" />
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
                <Check className="h-3 w-3" />
                Active
              </Badge>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
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
              <Mail className="h-4 w-4" />
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
              className={`p-4 border rounded-lg transition-colors ${
                alert.enabled ? 'border-primary/30 bg-primary/5' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  alert.enabled ? 'bg-background' : 'bg-muted'
                }`}>
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
                        <Bell className="h-3 w-3" />
                        Push
                      </Button>
                      <Button
                        size="sm"
                        variant={alert.channels.includes('sms') ? 'default' : 'outline'}
                        className="gap-1 text-xs"
                        onClick={() => toggleChannel(alert.id, 'sms')}
                        disabled={!phone}
                      >
                        <MessageSquare className="h-3 w-3" />
                        SMS
                      </Button>
                      <Button
                        size="sm"
                        variant={alert.channels.includes('email') ? 'default' : 'outline'}
                        className="gap-1 text-xs"
                        onClick={() => toggleChannel(alert.id, 'email')}
                        disabled={!email}
                      >
                        <Mail className="h-3 w-3" />
                        Email
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rate Threshold Settings */}
        {alerts.find(a => a.id === 'rate-threshold')?.enabled && (
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-3">Rate Threshold Settings</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Alert when rate goes above
                </label>
                <div className="flex gap-2">
                  <Input type="number" placeholder="200.00" />
                  <span className="flex items-center text-sm text-muted-foreground">LRD</span>
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Alert when rate goes below
                </label>
                <div className="flex gap-2">
                  <Input type="number" placeholder="195.00" />
                  <span className="flex items-center text-sm text-muted-foreground">LRD</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <Button 
          className="w-full gap-2" 
          onClick={savePreferences}
          disabled={saved}
        >
          {saved ? (
            <>
              <Check className="h-4 w-4" />
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


