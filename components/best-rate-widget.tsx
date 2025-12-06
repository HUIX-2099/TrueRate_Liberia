"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { TrendingUp, MapPin, Bell, Share2, Volume2, Navigation } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

interface BestRateData {
  rate: number
  changerName: string
  location: string
  distance: number
  lastUpdated: string
  trend: 'up' | 'down' | 'stable'
  changePercent: number
}

export function BestRateWidget() {
  const { t, isMarketWomanMode } = useLanguage()
  const [bestRate, setBestRate] = useState<BestRateData | null>(null)
  const [loading, setLoading] = useState(true)
  const [phone, setPhone] = useState('')
  const [alertsEnabled, setAlertsEnabled] = useState({ morning: false, afternoon: false })
  const [showAlertForm, setShowAlertForm] = useState(false)

  useEffect(() => {
    async function fetchBestRate() {
      try {
        const res = await fetch('/api/rates/live')
        const data = await res.json()
        
        // Simulate best rate data with changer info
        setBestRate({
          rate: data.rate || 198.50,
          changerName: "Duala Money Exchange",
          location: "Duala Market, Paynesville",
          distance: 5,
          lastUpdated: new Date().toISOString(),
          trend: 'up',
          changePercent: 0.8
        })
      } catch (error) {
        console.error('Error fetching best rate:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBestRate()
    const interval = setInterval(fetchBestRate, 60000)
    return () => clearInterval(interval)
  }, [])

  const speakRate = () => {
    if (!bestRate || typeof window === 'undefined' || !window.speechSynthesis) return
    
    const text = isMarketWomanMode
      ? `Dollar rate now: ${bestRate.rate.toFixed(0)} LD. ${bestRate.changerName}, ${bestRate.distance} minute from you.`
      : `Today's best USD buy rate is ${bestRate.rate.toFixed(2)} Liberian Dollars at ${bestRate.changerName}, approximately ${bestRate.distance} minutes from your location.`
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = isMarketWomanMode ? 0.8 : 1
    utterance.pitch = 1
    window.speechSynthesis.speak(utterance)
  }

  const shareToWhatsApp = () => {
    if (!bestRate) return
    const text = `💵 TrueRate Alert!\n\nBest USD Rate: ${bestRate.rate.toFixed(2)} LRD\n📍 ${bestRate.changerName}\n📍 ${bestRate.location}\n\nGet rates: https://truerate-liberia.com`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const handleEnableAlerts = async () => {
    if (!phone) return
    // In production, this would call an SMS API
    setAlertsEnabled({ morning: true, afternoon: true })
    setShowAlertForm(false)
    alert(`SMS alerts enabled for ${phone}! You'll receive rates at 8 AM and 4 PM daily.`)
  }

  if (loading) {
    return (
      <Card className="border-2 border-secondary animate-pulse">
        <CardContent className="p-6">
          <div className="h-32 bg-muted rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  if (!bestRate) return null

  return (
    <Card className={`border-2 border-secondary overflow-hidden ${isMarketWomanMode ? 'bg-secondary/5' : ''}`}>
      <div className="bg-secondary px-4 py-2 flex items-center justify-between">
        <span className="text-secondary-foreground font-semibold flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          {t('widget.bestRate')}
        </span>
        <Badge variant="outline" className="bg-secondary-foreground/10 text-secondary-foreground border-secondary-foreground/20">
          Live
        </Badge>
      </div>
      
      <CardContent className={`p-6 ${isMarketWomanMode ? 'p-8' : ''}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Main Rate Display */}
          <div className="flex-1">
            <div className={`${isMarketWomanMode ? 'text-7xl' : 'text-5xl'} font-bold text-secondary mb-2`}>
              {bestRate.rate.toFixed(isMarketWomanMode ? 0 : 2)} <span className="text-2xl text-muted-foreground">LRD</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              per 1 USD • 
              <span className={bestRate.trend === 'up' ? 'text-destructive' : 'text-secondary'}>
                {' '}{bestRate.trend === 'up' ? '+' : ''}{bestRate.changePercent}% today
              </span>
            </p>
            
            {/* Changer Info */}
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <div className="font-semibold">{bestRate.changerName}</div>
                <div className="text-sm text-muted-foreground">{bestRate.location}</div>
                <div className="text-sm text-secondary font-medium mt-1">
                  {bestRate.distance} {t('widget.distance')}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <Button 
              size={isMarketWomanMode ? 'lg' : 'default'}
              variant="outline" 
              className="gap-2"
              onClick={speakRate}
            >
              <Volume2 className="h-4 w-4" />
              {isMarketWomanMode ? 'Hear It' : 'Voice'}
            </Button>
            
            <Button 
              size={isMarketWomanMode ? 'lg' : 'default'}
              variant="outline" 
              className="gap-2"
              onClick={shareToWhatsApp}
            >
              <Share2 className="h-4 w-4" />
              WhatsApp
            </Button>
            
            <Button 
              size={isMarketWomanMode ? 'lg' : 'default'}
              variant="outline" 
              className="gap-2"
              onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(bestRate.location)}`, '_blank')}
            >
              <Navigation className="h-4 w-4" />
              Directions
            </Button>
            
            <Button 
              size={isMarketWomanMode ? 'lg' : 'default'}
              className="gap-2"
              onClick={() => setShowAlertForm(!showAlertForm)}
            >
              <Bell className="h-4 w-4" />
              {t('widget.smsAlert')}
            </Button>
          </div>
        </div>

        {/* SMS Alert Form */}
        {showAlertForm && (
          <div className="mt-6 p-4 border rounded-lg bg-muted/30">
            <h4 className="font-semibold mb-3">Get Daily Rate Alerts</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Receive the best rate via SMS at 8 AM and 4 PM daily
            </p>
            <div className="flex gap-2">
              <Input 
                type="tel"
                placeholder="Enter phone number (e.g. +231...)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleEnableAlerts}>
                Enable
              </Button>
            </div>
            <div className="flex gap-4 mt-3">
              <label className="flex items-center gap-2 text-sm">
                <input 
                  type="checkbox" 
                  checked={alertsEnabled.morning}
                  onChange={(e) => setAlertsEnabled(prev => ({ ...prev, morning: e.target.checked }))}
                  className="rounded"
                />
                {t('widget.morningAlert')}
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input 
                  type="checkbox" 
                  checked={alertsEnabled.afternoon}
                  onChange={(e) => setAlertsEnabled(prev => ({ ...prev, afternoon: e.target.checked }))}
                  className="rounded"
                />
                {t('widget.afternoonAlert')}
              </label>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}



