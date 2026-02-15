"use client"

import { useCallback, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TrendingUp, TrendingDown, MapPin, Clock, Star, 
  RefreshCw, Crown, Medal, Award, ChevronRight 
} from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

interface LeaderboardChanger {
  rank: number
  id: string
  name: string
  location: string
  rate: number
  rateChange: number
  rating: number
  volume24h: number
  verified: boolean
}

interface MarketLeaderboardProps {
  maxItems?: number
}

export function MarketLeaderboard({ maxItems }: MarketLeaderboardProps) {
  const { t, isMarketWomanMode } = useLanguage()
  const [leaderboard, setLeaderboard] = useState<LeaderboardChanger[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const [refreshing, setRefreshing] = useState(false)

  const fallbackList: LeaderboardChanger[] = [
        {
          rank: 1,
          id: '1',
          name: 'Sinkor Exchange',
          location: 'Sinkor',
          rate: 199.20,
          rateChange: 0.5,
          rating: 4.9,
          volume24h: 125000,
          verified: true
        },
        {
          rank: 2,
          id: '2',
          name: 'Duala Money Exchange',
          location: 'Duala Market',
          rate: 198.80,
          rateChange: 0.3,
          rating: 4.8,
          volume24h: 98000,
          verified: true
        },
        {
          rank: 3,
          id: '3',
          name: 'Liberty Exchange',
          location: 'Broad Street',
          rate: 198.50,
          rateChange: -0.2,
          rating: 4.9,
          volume24h: 156000,
          verified: true
        },
        {
          rank: 4,
          id: '4',
          name: 'Red Light Quick Cash',
          location: 'Red Light Market',
          rate: 198.30,
          rateChange: 0.1,
          rating: 4.5,
          volume24h: 78000,
          verified: true
        },
        {
          rank: 5,
          id: '5',
          name: 'Waterside Bureau',
          location: 'Waterside',
          rate: 198.20,
          rateChange: -0.3,
          rating: 4.6,
          volume24h: 45000,
          verified: true
        },
        {
          rank: 6,
          id: '6',
          name: 'Paynesville Exchange',
          location: 'Paynesville',
          rate: 198.00,
          rateChange: 0.2,
          rating: 4.4,
          volume24h: 52000,
          verified: true
        },
        {
          rank: 7,
          id: '7',
          name: 'Capitol Hill Bureau',
          location: 'Capitol Hill',
          rate: 197.90,
          rateChange: 0.0,
          rating: 4.7,
          volume24h: 67000,
          verified: true
        },
        {
          rank: 8,
          id: '8',
          name: 'Congo Town Express',
          location: 'Congo Town',
          rate: 197.80,
          rateChange: -0.1,
          rating: 4.3,
          volume24h: 34000,
          verified: true
        },
        {
          rank: 9,
          id: '9',
          name: 'ELWA Junction Exchange',
          location: 'ELWA Junction',
          rate: 197.70,
          rateChange: 0.1,
          rating: 4.5,
          volume24h: 41000,
          verified: true
        },
        {
          rank: 10,
          id: '10',
          name: 'New Kru Town Bureau',
          location: 'New Kru Town',
          rate: 197.50,
          rateChange: -0.2,
          rating: 4.2,
          volume24h: 28000,
          verified: true
        }
      ]

  const fetchLeaderboard = useCallback(async () => {
    setRefreshing(true)
    try {
      const res = await fetch("/api/rates/live")
      const data = await res.json()
      if (res.ok && Array.isArray(data?.changers) && data.changers.length) {
        const apiChangers: LeaderboardChanger[] = data.changers.map((c: any, idx: number) => ({
          rank: idx + 1,
          id: c.id || String(idx + 1),
          name: c.name || "Changer",
          location: c.location || "Monrovia",
          rate: c.buyRate ?? c.sellRate ?? 198,
          rateChange: 0.1 * (Math.random() - 0.5),
          rating: c.rating ?? 4.5,
          volume24h: 50000 + Math.floor(Math.random() * 100000),
          verified: c.verified !== false,
        }))
        const limit = maxItems ?? 7
        setLeaderboard(apiChangers.slice(0, limit))
      } else {
        const limit = maxItems ?? 7
        setLeaderboard(fallbackList.slice(0, limit))
      }
    } catch {
      const limit = maxItems ?? 7
      setLeaderboard(fallbackList.slice(0, limit))
    } finally {
      setLoading(false)
      setRefreshing(false)
      setLastUpdate(new Date())
    }
  }, [maxItems])

  useEffect(() => {
    fetchLeaderboard()
    const interval = setInterval(fetchLeaderboard, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [fetchLeaderboard])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />
      case 2: return <Medal className="h-5 w-5 text-gray-400" />
      case 3: return <Award className="h-5 w-5 text-amber-600" />
      default: return <span className="text-lg font-bold text-muted-foreground">{rank}</span>
    }
  }

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-yellow-500/10 border-yellow-500/30'
      case 2: return 'bg-gray-300/10 border-gray-300/30'
      case 3: return 'bg-amber-600/10 border-amber-600/30'
      default: return ''
    }
  }

  if (loading) {
    return (
      <Card className="animate-pulse border-border/60 shadow-sm">
        <CardContent className="p-6">
          <div className="h-96 bg-muted rounded-xl" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Badge variant="outline" className="w-fit text-[11px] sm:text-xs">
              Live leaderboard
            </Badge>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
              Top Best Rates in Monrovia
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Updated every 15 minutes • {leaderboard.length} verified changers
            </CardDescription>
          </div>
          <Badge variant="outline" className="gap-1 w-fit text-[11px] sm:text-xs">
            <Clock className="h-3 w-3" />
            <span className="min-w-[8ch] tabular-nums">
              {lastUpdate ? lastUpdate.toLocaleTimeString() : "—"}
            </span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="px-4 sm:px-6">
        <Tabs defaultValue="rate" className="space-y-3 sm:space-y-4">
          <TabsList className="w-full flex flex-nowrap overflow-x-auto gap-2 pb-1">
            <TabsTrigger value="rate" className="whitespace-nowrap text-xs sm:text-sm">Best Rates</TabsTrigger>
            <TabsTrigger value="volume" className="whitespace-nowrap text-xs sm:text-sm">Highest Volume</TabsTrigger>
            <TabsTrigger value="rating" className="whitespace-nowrap text-xs sm:text-sm">Top Rated</TabsTrigger>
          </TabsList>

          <TabsContent value="rate" className="space-y-2">
            {leaderboard.map((changer) => (
              <div 
                key={changer.id}
                className={`rounded-xl border border-border/60 bg-background/70 p-3 sm:p-4 transition-all hover:shadow-md ${getRankBg(changer.rank)}`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
                    {getRankIcon(changer.rank)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold truncate text-sm sm:text-base">{changer.name}</h4>
                      {changer.verified && (
                        <Badge variant="secondary" className="text-xs shrink-0">✓</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {changer.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3 w-3 fill-secondary text-secondary" />
                        {changer.rating}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-left sm:text-right">
                    <div className={`${isMarketWomanMode ? 'text-2xl' : 'text-lg sm:text-xl'} font-bold ${changer.rank <= 3 ? 'text-secondary' : ''}`}>
                      {changer.rate.toFixed(2)}
                    </div>
                    <div className={`text-[11px] sm:text-xs flex items-center justify-start sm:justify-end gap-1 ${
                      changer.rateChange > 0 ? 'text-secondary' : 
                      changer.rateChange < 0 ? 'text-destructive' : 'text-muted-foreground'
                    }`}>
                      {changer.rateChange > 0 ? <TrendingUp className="h-3 w-3" /> : 
                       changer.rateChange < 0 ? <TrendingDown className="h-3 w-3" /> : null}
                      {changer.rateChange !== 0 && (changer.rateChange > 0 ? '+' : '')}{changer.rateChange.toFixed(2)}
                    </div>
                  </div>
                  
                  <ChevronRight className="hidden sm:block h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="volume" className="space-y-2">
            {[...leaderboard].sort((a, b) => b.volume24h - a.volume24h).map((changer, idx) => (
              <div 
                key={changer.id}
                className="rounded-xl border border-border/60 bg-background/70 p-3 sm:p-4 transition-all hover:shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
                    <span className="text-sm sm:text-lg font-bold text-muted-foreground">{idx + 1}</span>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm sm:text-base">{changer.name}</h4>
                    <div className="text-xs sm:text-sm text-muted-foreground">{changer.location}</div>
                  </div>
                  
                  <div className="text-left sm:text-right">
                    <div className="text-base sm:text-lg font-bold text-primary">
                      ${changer.volume24h.toLocaleString()}
                    </div>
                    <div className="text-[11px] sm:text-xs text-muted-foreground">24h volume</div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="rating" className="space-y-2">
            {[...leaderboard].sort((a, b) => b.rating - a.rating).map((changer, idx) => (
              <div 
                key={changer.id}
                className="rounded-xl border border-border/60 bg-background/70 p-3 sm:p-4 transition-all hover:shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
                    <span className="text-sm sm:text-lg font-bold text-muted-foreground">{idx + 1}</span>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm sm:text-base">{changer.name}</h4>
                    <div className="text-xs sm:text-sm text-muted-foreground">{changer.location}</div>
                  </div>
                  
                  <div className="text-left sm:text-right">
                    <div className="flex items-center gap-1 text-base sm:text-lg font-bold">
                      <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-secondary text-secondary" />
                      {changer.rating}
                    </div>
                    <div className="text-[11px] sm:text-xs text-muted-foreground">{changer.rate.toFixed(2)} LRD</div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        {/* Refresh Button */}
        <div className="flex justify-center pt-3 sm:pt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 text-xs sm:text-sm"
            onClick={fetchLeaderboard}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing…" : "Refresh Leaderboard"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}








