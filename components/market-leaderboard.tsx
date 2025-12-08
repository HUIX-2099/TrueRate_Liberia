"use client"

import { useState, useEffect } from "react"
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

export function MarketLeaderboard() {
  const { t, isMarketWomanMode } = useLanguage()
  const [leaderboard, setLeaderboard] = useState<LeaderboardChanger[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    // Simulate fetching leaderboard data
    const fetchLeaderboard = () => {
      setLeaderboard([
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
      ])
      setLoading(false)
      setLastUpdate(new Date())
    }

    fetchLeaderboard()
    const interval = setInterval(fetchLeaderboard, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

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
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-96 bg-muted rounded-lg" />
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
              <Crown className="h-5 w-5 text-yellow-500" />
              {t('leaderboard.title')} - Best Rates in Monrovia
            </CardTitle>
            <CardDescription>
              Updated every 15 minutes • {leaderboard.length} verified changers
            </CardDescription>
          </div>
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            {lastUpdate.toLocaleTimeString()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="rate" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rate">Best Rates</TabsTrigger>
            <TabsTrigger value="volume">Highest Volume</TabsTrigger>
            <TabsTrigger value="rating">Top Rated</TabsTrigger>
          </TabsList>

          <TabsContent value="rate" className="space-y-2">
            {leaderboard.map((changer) => (
              <div 
                key={changer.id}
                className={`p-4 border rounded-lg transition-all hover:shadow-md cursor-pointer ${getRankBg(changer.rank)}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center">
                    {getRankIcon(changer.rank)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold truncate">{changer.name}</h4>
                      {changer.verified && (
                        <Badge variant="secondary" className="text-xs shrink-0">✓</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {changer.location}
                      <span className="mx-1">•</span>
                      <Star className="h-3 w-3 fill-secondary text-secondary" />
                      {changer.rating}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`${isMarketWomanMode ? 'text-2xl' : 'text-xl'} font-bold ${changer.rank <= 3 ? 'text-secondary' : ''}`}>
                      {changer.rate.toFixed(2)}
                    </div>
                    <div className={`text-xs flex items-center justify-end gap-1 ${
                      changer.rateChange > 0 ? 'text-secondary' : 
                      changer.rateChange < 0 ? 'text-destructive' : 'text-muted-foreground'
                    }`}>
                      {changer.rateChange > 0 ? <TrendingUp className="h-3 w-3" /> : 
                       changer.rateChange < 0 ? <TrendingDown className="h-3 w-3" /> : null}
                      {changer.rateChange !== 0 && (changer.rateChange > 0 ? '+' : '')}{changer.rateChange.toFixed(2)}
                    </div>
                  </div>
                  
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="volume" className="space-y-2">
            {[...leaderboard].sort((a, b) => b.volume24h - a.volume24h).map((changer, idx) => (
              <div 
                key={changer.id}
                className="p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <span className="text-lg font-bold text-muted-foreground">{idx + 1}</span>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold">{changer.name}</h4>
                    <div className="text-sm text-muted-foreground">{changer.location}</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      ${changer.volume24h.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">24h volume</div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="rating" className="space-y-2">
            {[...leaderboard].sort((a, b) => b.rating - a.rating).map((changer, idx) => (
              <div 
                key={changer.id}
                className="p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <span className="text-lg font-bold text-muted-foreground">{idx + 1}</span>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold">{changer.name}</h4>
                    <div className="text-sm text-muted-foreground">{changer.location}</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-lg font-bold">
                      <Star className="h-5 w-5 fill-secondary text-secondary" />
                      {changer.rating}
                    </div>
                    <div className="text-xs text-muted-foreground">{changer.rate.toFixed(2)} LRD</div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        {/* Refresh Button */}
        <div className="flex justify-center pt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => setLastUpdate(new Date())}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Leaderboard
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}






