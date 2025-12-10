"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export function MarketWomanMode() {
  const { t, language, setLanguage } = useLanguage()
  const [rate, setRate] = useState<number | null>(null)
  const [previousRate, setPreviousRate] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [autoSpeak, setAutoSpeak] = useState(false)

  const fetchRate = useCallback(async () => {
    try {
      const res = await fetch('/api/rates/live')
      const data = await res.json()
      
      if (rate !== null) {
        setPreviousRate(rate)
      }
      setRate(data.rate || 198.5)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }, [rate])

  useEffect(() => {
    fetchRate()
    const interval = setInterval(fetchRate, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [fetchRate])

  const trend = previousRate && rate 
    ? rate > previousRate ? 'up' : rate < previousRate ? 'down' : 'stable'
    : 'stable'

  const speakRate = useCallback(() => {
    if (!rate || typeof window === 'undefined' || !window.speechSynthesis) return
    
    setIsSpeaking(true)
    window.speechSynthesis.cancel()

    let text: string
    if (language === 'lr-en') {
      text = `Dollar now: ${rate.toFixed(0)} LD.`
      if (trend === 'up') text += ' Dollar going up-o!'
      else if (trend === 'down') text += ' Dollar going down!'
      else text += ' Dollar same-same.'
    } else {
      text = `The current USD to Liberian Dollar rate is ${rate.toFixed(2)}.`
      if (trend === 'up') text += ' The rate is going up.'
      else if (trend === 'down') text += ' The rate is going down.'
    }
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.85
    utterance.pitch = 1
    utterance.lang = 'en-US'
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    
    window.speechSynthesis.speak(utterance)
  }, [rate, trend, language])

  useEffect(() => {
    if (autoSpeak && rate && !loading) {
      speakRate()
    }
  }, [rate, autoSpeak, loading, speakRate])

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-16 w-16 text-destructive" />
      case 'down': return <TrendingDown className="h-16 w-16 text-secondary" />
      default: return <Minus className="h-16 w-16 text-muted-foreground" />
    }
  }

  const getTrendText = () => {
    switch (trend) {
      case 'up': return t('simple.goingUp')
      case 'down': return t('simple.goingDown')
      default: return t('simple.stayingSame')
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-destructive'
      case 'down': return 'text-secondary'
      default: return 'text-muted-foreground'
    }
  }

  if (loading) {
    return (
      <Card className="animate-pulse bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardContent className="p-12">
          <div className="h-64 flex items-center justify-center">
            <RefreshCw className="h-12 w-12 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <CardContent className="p-0">
        {/* Language Toggle for Market Woman Mode */}
        <div className="flex justify-center gap-2 p-4 bg-muted/50">
          <Button
            variant={language === 'en' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLanguage('en')}
          >
            English
          </Button>
          <Button
            variant={language === 'lr-en' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLanguage('lr-en')}
          >
            Liberian
          </Button>
        </div>

        {/* Main Rate Display - Extra Large */}
        <div 
          className="p-8 md:p-12 text-center cursor-pointer active:bg-primary/5 transition-colors"
          onClick={speakRate}
        >
          <div className="text-lg text-muted-foreground mb-4">
            {t('simple.currentRate')}
          </div>
          
          <div className="text-8xl md:text-9xl font-bold text-foreground mb-4 tracking-tight">
            {rate?.toFixed(0)}
          </div>
          
          <div className="text-3xl text-muted-foreground mb-8">
            LD / $1
          </div>

          {/* Trend Indicator */}
          <div className="flex flex-col items-center gap-4 mb-8">
            {getTrendIcon()}
            <span className={`text-2xl font-bold ${getTrendColor()}`}>
              {getTrendText()}
            </span>
          </div>

          <p className="text-muted-foreground text-lg">
            {t('simple.tapForVoice')} 👆
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 p-6 bg-muted/30">
          <Button
            size="lg"
            variant={autoSpeak ? 'default' : 'outline'}
            className="h-16 text-lg gap-3"
            onClick={() => setAutoSpeak(!autoSpeak)}
          >
            {autoSpeak ? (
              <>
                <Volume2 className="h-6 w-6" />
                Auto Voice ON
              </>
            ) : (
              <>
                <VolumeX className="h-6 w-6" />
                Auto Voice OFF
              </>
            )}
          </Button>
          
          <Button
            size="lg"
            className="h-16 text-lg gap-3"
            onClick={speakRate}
            disabled={isSpeaking}
          >
            <Volume2 className={`h-6 w-6 ${isSpeaking ? 'animate-pulse' : ''}`} />
            {isSpeaking ? 'Speaking...' : 'Speak Now'}
          </Button>
        </div>

        {/* Quick Actions for Market Women */}
        <div className="grid grid-cols-3 gap-2 p-4">
          <Button 
            variant="ghost" 
            className="h-20 flex-col gap-2"
            onClick={() => {
              const text = `Dollar rate now: ${rate?.toFixed(0)} LD`
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
            }}
          >
            <span className="text-2xl">📱</span>
            <span className="text-xs">WhatsApp</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="h-20 flex-col gap-2"
            onClick={fetchRate}
          >
            <RefreshCw className="h-6 w-6" />
            <span className="text-xs">Refresh</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="h-20 flex-col gap-2"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'TrueRate',
                  text: `Dollar rate: ${rate?.toFixed(0)} LD`,
                  url: 'https://truerate-liberia.com'
                })
              }
            }}
          >
            <span className="text-2xl">📤</span>
            <span className="text-xs">Share</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}








