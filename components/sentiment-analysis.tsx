"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Brain, TrendingUp, TrendingDown, AlertTriangle, 
  MessageSquare, Shield, ThumbsUp, ThumbsDown, Minus
} from "lucide-react"

interface SentimentData {
  overall: 'positive' | 'negative' | 'neutral'
  score: number // -100 to 100
  confidence: number
  sources: {
    community: number
    social: number
    news: number
  }
  trending: {
    topic: string
    sentiment: 'positive' | 'negative' | 'neutral'
    mentions: number
  }[]
  alerts: {
    type: 'fraud' | 'rate' | 'news'
    message: string
    severity: 'high' | 'medium' | 'low'
  }[]
}

export function SentimentAnalysis() {
  const [sentiment, setSentiment] = useState<SentimentData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching sentiment data
    const fetchSentiment = () => {
      setSentiment({
        overall: 'positive',
        score: 35,
        confidence: 78,
        sources: {
          community: 42,
          social: 28,
          news: 15
        },
        trending: [
          { topic: 'Rate stability', sentiment: 'positive', mentions: 145 },
          { topic: 'Red Light fraud', sentiment: 'negative', mentions: 89 },
          { topic: 'CBL announcement', sentiment: 'neutral', mentions: 67 },
          { topic: 'Dollar predictions', sentiment: 'positive', mentions: 52 },
        ],
        alerts: [
          { type: 'fraud', message: 'Increased fraud reports in Red Light area', severity: 'high' },
          { type: 'rate', message: 'Rate expected to remain stable this week', severity: 'low' },
        ]
      })
      setLoading(false)
    }

    fetchSentiment()
    const interval = setInterval(fetchSentiment, 300000) // Update every 5 mins
    return () => clearInterval(interval)
  }, [])

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="h-4 w-4 text-secondary" />
      case 'negative': return <ThumbsDown className="h-4 w-4 text-destructive" />
      default: return <Minus className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-secondary'
      case 'negative': return 'text-destructive'
      default: return 'text-muted-foreground'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/30'
      case 'medium': return 'bg-accent/10 text-accent border-accent/30'
      default: return 'bg-secondary/10 text-secondary border-secondary/30'
    }
  }

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-48 bg-muted rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  if (!sentiment) return null

  const normalizedScore = (sentiment.score + 100) / 2 // Convert -100 to 100 → 0 to 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Market Sentiment Analysis
        </CardTitle>
        <CardDescription>
          AI-powered analysis of community, social media, and news sentiment
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Sentiment */}
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Overall Market Sentiment</span>
            <Badge variant={sentiment.overall === 'positive' ? 'secondary' : sentiment.overall === 'negative' ? 'destructive' : 'outline'}>
              {sentiment.overall.charAt(0).toUpperCase() + sentiment.overall.slice(1)}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Negative</span>
              <span>Neutral</span>
              <span>Positive</span>
            </div>
            <div className="relative h-4 bg-gradient-to-r from-destructive via-muted to-secondary rounded-full overflow-hidden">
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-background shadow-lg transition-all"
                style={{ left: `calc(${normalizedScore}% - 8px)` }}
              />
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Score: {sentiment.score > 0 ? '+' : ''}{sentiment.score}</span>
              <span className="text-sm text-muted-foreground">{sentiment.confidence}% confidence</span>
            </div>
          </div>
        </div>

        {/* Source Breakdown */}
        <div>
          <h4 className="font-semibold mb-3">Sentiment by Source</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Community Reports
                </span>
                <span className={getSentimentColor(sentiment.sources.community > 0 ? 'positive' : 'negative')}>
                  {sentiment.sources.community > 0 ? '+' : ''}{sentiment.sources.community}
                </span>
              </div>
              <Progress value={(sentiment.sources.community + 100) / 2} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-secondary" />
                  Social Media
                </span>
                <span className={getSentimentColor(sentiment.sources.social > 0 ? 'positive' : 'negative')}>
                  {sentiment.sources.social > 0 ? '+' : ''}{sentiment.sources.social}
                </span>
              </div>
              <Progress value={(sentiment.sources.social + 100) / 2} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-accent" />
                  News & Official
                </span>
                <span className={getSentimentColor(sentiment.sources.news > 0 ? 'positive' : 'negative')}>
                  {sentiment.sources.news > 0 ? '+' : ''}{sentiment.sources.news}
                </span>
              </div>
              <Progress value={(sentiment.sources.news + 100) / 2} className="h-2" />
            </div>
          </div>
        </div>

        {/* Trending Topics */}
        <div>
          <h4 className="font-semibold mb-3">Trending Topics</h4>
          <div className="space-y-2">
            {sentiment.trending.map((topic, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-2 bg-muted/30 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  {getSentimentIcon(topic.sentiment)}
                  <span className="text-sm font-medium">{topic.topic}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {topic.mentions} mentions
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* AI Alerts */}
        {sentiment.alerts.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-accent" />
              AI-Detected Alerts
            </h4>
            <div className="space-y-2">
              {sentiment.alerts.map((alert, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start gap-2">
                    {alert.type === 'fraud' ? (
                      <AlertTriangle className="h-4 w-4 mt-0.5" />
                    ) : alert.type === 'rate' ? (
                      <TrendingUp className="h-4 w-4 mt-0.5" />
                    ) : (
                      <MessageSquare className="h-4 w-4 mt-0.5" />
                    )}
                    <div>
                      <span className="text-sm font-medium">{alert.message}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {alert.severity}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

