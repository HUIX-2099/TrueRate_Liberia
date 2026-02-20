"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Flame, RefreshCw } from "lucide-react"

const COMMODITY_KEYWORDS = ["gold", "rubber", "palm oil", "iron ore"]
const POLL_INTERVAL_MS = 10 * 60 * 1000 // 10 minutes

export type LiberiaNewsItemClient = {
  id: string
  title: string
  source: string
  time: string
  publishedAt: string
  summary: string
  url: string
  tags: string[]
}

function normalizeText(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim()
}

function buildMarketMovers(items: LiberiaNewsItemClient[]) {
  return COMMODITY_KEYWORDS.map((keyword) => {
    const mentions = items.filter((item) =>
      normalizeText(`${item.title} ${item.summary}`).includes(keyword),
    )
    return { keyword, count: mentions.length }
  }).filter((entry) => entry.count > 0)
}

export function LiberiaMarketNewsAuto({
  initialItems,
}: {
  initialItems: LiberiaNewsItemClient[]
}) {
  const [items, setItems] = useState<LiberiaNewsItemClient[]>(initialItems)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/liberia-market-news")
        const data = await res.json()
        if (Array.isArray(data?.items) && data.items.length > 0) {
          setItems(data.items)
          setLastUpdated(new Date())
        }
      } catch (e) {
        console.warn("[LiberiaMarketNews] Auto-update fetch failed", e)
      }
    }

    const interval = setInterval(fetchNews, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [])

  const movers = buildMarketMovers(items)

  return (
    <div className="space-y-6">
      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
        <RefreshCw className="h-3.5 w-3.5" />
        Auto-updates every 10 min
        {lastUpdated && (
          <span className="ml-1">
            • Last updated {lastUpdated.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Flame className="h-5 w-5 text-amber-500" />
            Market Movers
          </CardTitle>
          <CardDescription>Top commodities mentioned across today’s headlines.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {movers.length > 0 ? (
            movers.map((mover) => (
              <Badge key={mover.keyword} variant="secondary">
                {mover.keyword} • {mover.count}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No gold, rubber, palm oil, or iron ore mentions in today’s headlines. We track these
              commodities for LRD impact.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} className="h-full">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-base leading-snug">{item.title}</CardTitle>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${item.title}`}
                  className="text-muted-foreground hover:text-primary"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <CardDescription className="text-xs">
                {item.source} • {item.time}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{item.summary}</p>
              <div className="flex flex-wrap gap-2">
                {(item.tags ?? []).map((tag) => (
                  <Badge key={`${item.id}-${tag}`} variant="outline">
                    {tag}
                  </Badge>
                ))}
                <Badge variant="outline">
                  {format(new Date(item.publishedAt), "MMM d, yyyy")}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
