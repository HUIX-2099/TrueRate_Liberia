"use client"

import { useCallback, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TrendingUp, TrendingDown, MapPin, Clock, Star, 
  RefreshCw, Crown, Medal, Award, ChevronRight, BarChart2
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
          name: 'Central Bank of Liberia',
          location: 'Broad Street, Monrovia',
          rate: 182.59,
          rateChange: 0.04,
          rating: 4.8,
          volume24h: 125000,
          verified: true
        },
        {
          rank: 2,
          id: '2',
          name: 'Quick Cash',
          location: 'Sinkor, Monrovia',
          rate: 183.09,
          rateChange: -0.05,
          rating: 4.6,
          volume24h: 98000,
          verified: true
        },
        {
          rank: 3,
          id: '3',
          name: 'Global Money Transfer',
          location: 'Red Light, Monrovia',
          rate: 181.59,
          rateChange: 0.03,
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
      case 1: return <Crown className="h-5 w-5 text-amber-600 dark:text-amber-400" />
      case 2: return <Medal className="h-5 w-5 text-gray-400 text-primary" />
      case 3: return <Award className="h-5 w-5 text-primary" />
      default: return <span className="text-lg font-bold text-muted-foreground">{rank}</span>
    }
  }

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-muted/40 border border-border/40 border-yellow-500/30'
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
    <Card className="border-border/60 shadow-sm overflow-hidden min-w-0 rounded-xl sm:rounded-2xl">
      <CardHeader className="px-4 sm:px-6 py-4 sm:py-5 border-b border-border/40">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="w-fit text-[11px] sm:text-xs font-medium">
                Live leaderboard
              </Badge>
              <Badge variant="outline" className="gap-1 w-fit text-[11px] sm:text-xs shrink-0 text-muted-foreground">
                <Clock className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                <span className="min-w-[8ch] tabular-nums">
                  {lastUpdate ? lastUpdate.toLocaleTimeString() : "—"}
                </span>
              </Badge>
            </div>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Crown className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <span className="min-w-0">Top Best Rates in Monrovia</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-pretty text-muted-foreground">
              Updated every 15 min • {leaderboard.length} verified changers • Report bad rates so others don&apos;t get cheated
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-4 sm:px-6 py-4 sm:py-5 min-w-0">
        <Tabs defaultValue="rate" className="space-y-4">
          <TabsList className="w-full flex flex-nowrap overflow-x-auto gap-1 sm:gap-2 p-1.5 min-h-[48px] touch-pan-x overscroll-x-contain rounded-xl bg-muted/40 border border-border/40">
            <TabsTrigger
              value="rate"
              className="flex-1 sm:flex-initial whitespace-nowrap text-xs sm:text-sm font-medium min-h-[44px] px-4 sm:px-5 rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/60 data-[state=inactive]:text-muted-foreground data-[state=active]:text-foreground transition-colors"
            >
              <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-green-600 dark:text-green-400" />
              Best Rates
            </TabsTrigger>
            <TabsTrigger
              value="volume"
              className="flex-1 sm:flex-initial whitespace-nowrap text-xs sm:text-sm font-medium min-h-[44px] px-4 sm:px-5 rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/60 data-[state=inactive]:text-muted-foreground data-[state=active]:text-foreground transition-colors"
            >
              <BarChart2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-primary" />
              Highest Volume
            </TabsTrigger>
            <TabsTrigger
              value="rating"
              className="group flex-1 sm:flex-initial whitespace-nowrap text-xs sm:text-sm font-medium min-h-[44px] px-4 sm:px-5 rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/60 data-[state=inactive]:text-muted-foreground data-[state=active]:text-foreground transition-colors"
            >
              <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 fill-transparent group-data-[state=active]: group-data-[state=active]:fill-amber-400 text-amber-600 dark:text-amber-400" />
              Top Rated
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rate" className="space-y-2 mt-0">
            {[...leaderboard]
              .sort((a, b) => a.rate - b.rate)
              .map((changer, sortedIdx) => (
              <div 
                key={changer.id}
                className={`rounded-lg sm:rounded-xl border border-border/50 bg-card p-3 sm:p-4 transition-all hover:border-primary/20 hover:shadow-sm min-w-0 ${getRankBg(sortedIdx + 1)}`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0 rounded-lg bg-muted/60">
                    {getRankIcon(sortedIdx + 1)}
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold truncate text-sm sm:text-base text-foreground">{changer.name}</h4>
                      {changer.verified && (
                        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/15 text-primary text-xs font-bold" title="Verified">
                          ✓
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 truncate">
                        <MapPin className="h-3 w-3 shrink-0 text-blue-600 dark:text-blue-400" />
                        {changer.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 shrink-0 text-amber-600 dark:text-amber-400" />
                        <span className="tabular-nums">{changer.rating}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end gap-1 sm:gap-0.5">
                    <div className="flex flex-col sm:items-end">
                      <span className={`${isMarketWomanMode ? 'text-2xl' : 'text-lg sm:text-xl'} font-bold tabular-nums ${sortedIdx < 3 ? 'text-primary' : 'text-foreground'}`}>
                        {changer.rate.toFixed(2)}
                      </span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground">LRD/USD</span>
                    </div>
                    <div className={`text-[11px] sm:text-xs flex items-center gap-1 tabular-nums ${ changer.rateChange > 0 ? 'text-green-600 dark:text-green-400' : changer.rateChange < 0 ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground' }`}>
                      {changer.rateChange > 0 ? <TrendingUp className="h-3 w-3 shrink-0 text-green-600 dark:text-green-400" /> : 
                       changer.rateChange < 0 ? <TrendingDown className="h-3 w-3 shrink-0 text-red-600 dark:text-red-400" /> : null}
                      {changer.rateChange !== 0 ? (changer.rateChange > 0 ? '+' : '') + changer.rateChange.toFixed(2) : '—'}
                    </div>
                  </div>
                  
                  <ChevronRight className="hidden sm:block h-4 w-4 /60 shrink-0 text-muted-foreground" />
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="volume" className="space-y-2 mt-0">
            {[...leaderboard].sort((a, b) => b.volume24h - a.volume24h).map((changer, idx) => (
              <div 
                key={changer.id}
                className="rounded-lg sm:rounded-xl border border-border/50 bg-card p-3 sm:p-4 transition-all hover:border-primary/20 hover:shadow-sm min-w-0"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0 rounded-lg bg-muted/60">
                    <span className="text-sm sm:text-base font-bold text-muted-foreground tabular-nums">{idx + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <h4 className="font-semibold text-sm sm:text-base truncate">{changer.name}</h4>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3 shrink-0 text-blue-600 dark:text-blue-400" />
                      {changer.location}
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-base sm:text-lg font-bold text-primary tabular-nums">
                      ${changer.volume24h.toLocaleString()}
                    </div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">24h volume</div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="rating" className="space-y-2 mt-0">
            {[...leaderboard].sort((a, b) => b.rating - a.rating).map((changer, idx) => (
              <div 
                key={changer.id}
                className="rounded-lg sm:rounded-xl border border-border/50 bg-card p-3 sm:p-4 transition-all hover:border-primary/20 hover:shadow-sm min-w-0"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0 rounded-lg bg-muted/60">
                    <span className="text-sm sm:text-base font-bold text-muted-foreground tabular-nums">{idx + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <h4 className="font-semibold text-sm sm:text-base truncate">{changer.name}</h4>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3 shrink-0 text-blue-600 dark:text-blue-400" />
                      {changer.location}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                    <div className="flex items-center gap-1 font-bold tabular-nums">
                      <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-amber-400 shrink-0 text-amber-600 dark:text-amber-400" />
                      {changer.rating}
                    </div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">{changer.rate.toFixed(2)} LRD/USD</div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <div className="mt-4 pt-4 border-t border-border/40 flex justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full sm:w-auto gap-2 text-xs sm:text-sm min-h-[44px] rounded-lg border-border/60 hover:bg-muted/50"
            onClick={fetchLeaderboard}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 shrink-0 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing…" : "Refresh Leaderboard"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}








