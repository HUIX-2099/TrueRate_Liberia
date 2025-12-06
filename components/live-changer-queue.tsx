"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  RefreshCw, MapPin, Clock, DollarSign, Phone, 
  CheckCircle2, TrendingUp, TrendingDown, Users 
} from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

interface LiveChanger {
  id: string
  name: string
  location: string
  rate: number
  previousRate: number
  cashAvailable: number
  lastUpdate: string
  waitingCustomers: number
  isOpen: boolean
  phone: string
}

export function LiveChangerQueue() {
  const { t, isMarketWomanMode } = useLanguage()
  const [changers, setChangers] = useState<LiveChanger[]>([])
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  useEffect(() => {
    // Simulate fetching live data
    const fetchChangers = () => {
      // Mock live data - in production this would be real-time from changers
      setChangers([
        {
          id: '1',
          name: 'Duala Money Exchange',
          location: 'Duala Market',
          rate: 198.50 + (Math.random() - 0.5) * 2,
          previousRate: 198.50,
          cashAvailable: 15000 + Math.floor(Math.random() * 5000),
          lastUpdate: new Date().toISOString(),
          waitingCustomers: Math.floor(Math.random() * 5),
          isOpen: true,
          phone: '+231-555-0101'
        },
        {
          id: '2',
          name: 'Red Light Quick Cash',
          location: 'Red Light Market',
          rate: 198.20 + (Math.random() - 0.5) * 2,
          previousRate: 198.20,
          cashAvailable: 25000 + Math.floor(Math.random() * 10000),
          lastUpdate: new Date().toISOString(),
          waitingCustomers: Math.floor(Math.random() * 8),
          isOpen: true,
          phone: '+231-555-0102'
        },
        {
          id: '3',
          name: 'Waterside Bureau',
          location: 'Waterside Market',
          rate: 197.80 + (Math.random() - 0.5) * 2,
          previousRate: 197.80,
          cashAvailable: 8000 + Math.floor(Math.random() * 3000),
          lastUpdate: new Date().toISOString(),
          waitingCustomers: Math.floor(Math.random() * 3),
          isOpen: true,
          phone: '+231-555-0103'
        },
        {
          id: '4',
          name: 'Sinkor Exchange',
          location: 'Sinkor, Tubman Blvd',
          rate: 199.00 + (Math.random() - 0.5) * 2,
          previousRate: 199.00,
          cashAvailable: 50000 + Math.floor(Math.random() * 20000),
          lastUpdate: new Date().toISOString(),
          waitingCustomers: Math.floor(Math.random() * 2),
          isOpen: true,
          phone: '+231-555-0104'
        },
        {
          id: '5',
          name: 'Broad Street Center',
          location: 'Broad Street, Central',
          rate: 198.75 + (Math.random() - 0.5) * 2,
          previousRate: 198.75,
          cashAvailable: 35000 + Math.floor(Math.random() * 15000),
          lastUpdate: new Date().toISOString(),
          waitingCustomers: Math.floor(Math.random() * 6),
          isOpen: true,
          phone: '+231-555-0105'
        }
      ])
      setLoading(false)
      setLastRefresh(new Date())
    }

    fetchChangers()
    const interval = setInterval(fetchChangers, 15000) // Update every 15 seconds
    return () => clearInterval(interval)
  }, [])

  const sortedChangers = [...changers].sort((a, b) => b.rate - a.rate)
  const bestRate = sortedChangers[0]?.rate || 0

  const getTimeSinceUpdate = (lastUpdate: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(lastUpdate).getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    return `${Math.floor(seconds / 60)}m ago`
  }

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-64 bg-muted rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {t('queue.title')}
            </CardTitle>
            <CardDescription>
              Real-time availability from verified changers
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              Live • Updates every 15s
            </Badge>
            <Button 
              size="icon" 
              variant="ghost"
              onClick={() => setLastRefresh(new Date())}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Best Rate Highlight */}
        <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-lg mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Best Rate Right Now</div>
              <div className={`${isMarketWomanMode ? 'text-4xl' : 'text-3xl'} font-bold text-secondary`}>
                {bestRate.toFixed(2)} LRD
              </div>
            </div>
            <Badge variant="secondary" className="text-lg py-1.5">
              #1
            </Badge>
          </div>
        </div>

        {/* Live Queue List */}
        <div className="space-y-2">
          {sortedChangers.map((changer, index) => {
            const rateChange = changer.rate - changer.previousRate
            const isTopRate = index === 0

            return (
              <div 
                key={changer.id}
                className={`p-4 border rounded-lg transition-all ${
                  isTopRate ? 'border-secondary bg-secondary/5' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={isTopRate ? 'secondary' : 'outline'} className="text-xs">
                      #{index + 1}
                    </Badge>
                    <div>
                      <div className="font-semibold">{changer.name}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {changer.location}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`${isMarketWomanMode ? 'text-2xl' : 'text-xl'} font-bold ${isTopRate ? 'text-secondary' : ''}`}>
                      {changer.rate.toFixed(2)}
                    </div>
                    <div className={`text-xs flex items-center justify-end gap-1 ${
                      rateChange > 0 ? 'text-destructive' : rateChange < 0 ? 'text-secondary' : 'text-muted-foreground'
                    }`}>
                      {rateChange > 0 ? <TrendingUp className="h-3 w-3" /> : 
                       rateChange < 0 ? <TrendingDown className="h-3 w-3" /> : null}
                      {rateChange !== 0 && (rateChange > 0 ? '+' : '')}{rateChange.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-secondary">
                      <DollarSign className="h-4 w-4" />
                      ${changer.cashAvailable.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {changer.waitingCustomers} waiting
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {getTimeSinceUpdate(changer.lastUpdate)}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => window.open(`tel:${changer.phone}`, '_self')}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant={isTopRate ? 'default' : 'outline'}>
                      Reserve
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between pt-4 border-t text-xs text-muted-foreground">
          <span>Last refresh: {lastRefresh.toLocaleTimeString()}</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-secondary" />
            {changers.length} verified changers online
          </span>
        </div>
      </CardContent>
    </Card>
  )
}


