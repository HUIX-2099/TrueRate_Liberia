import Parser from "rss-parser"
import { formatDistanceToNow, format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ExternalLink, Flame } from "lucide-react"

export interface LiberiaNewsItem {
  id: string
  title: string
  excerpt: string
  url: string
  source: string
  publishedAt: Date
  tags: string[]
}

const KEYWORDS = [
  "economy",
  "economic",
  "business",
  "market",
  "currency",
  "exchange",
  "rate",
  "investment",
  "gold",
  "rubber",
  "palm oil",
  "iron ore",
  "mining",
  "revenue",
  "export",
  "inflation",
  "lrd",
  "usd",
]

const COMMODITY_KEYWORDS = ["gold", "rubber", "palm oil", "iron ore"]

const FEEDS = [
  {
    source: "FrontPageAfrica",
    url: "https://frontpageafricaonline.com/category/business/economy/feed/",
  },
  {
    source: "allAfrica",
    url: "https://allafrica.com/tools/headlines/rdf/liberia/business/headlines.rdf",
  },
]

const parser = new Parser()

const normalizeText = (value: string) => value.toLowerCase().replace(/\s+/g, " ").trim()

const matchesKeywords = (title: string, excerpt: string) => {
  const haystack = normalizeText(`${title} ${excerpt}`)
  return KEYWORDS.some((keyword) => haystack.includes(keyword))
}

const extractTags = (title: string, excerpt: string) => {
  const haystack = normalizeText(`${title} ${excerpt}`)
  return KEYWORDS.filter((keyword) => haystack.includes(keyword)).slice(0, 3)
}

const formatExcerpt = (value: string) => {
  const clean = value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim()
  if (clean.length <= 180) return clean
  return `${clean.slice(0, 177)}...`
}

const toDate = (value?: string) => {
  if (!value) return new Date()
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed
}

const fetchFeed = async (source: string, url: string): Promise<LiberiaNewsItem[]> => {
  // Cache each feed for 1 hour to stay fresh without overloading sources.
  const res = await fetch(url, {
    next: { revalidate: 3600 },
    headers: {
      "User-Agent": "TrueRateLiberiaBot/1.0",
      Accept: "application/rss+xml, application/xml;q=0.9, text/xml;q=0.8",
    },
  })
  if (!res.ok) return []
  const xml = await res.text()
  const feed = await parser.parseString(xml)
  const items = (feed.items ?? []).map((item) => {
    const title = item.title ?? "Untitled"
    const excerpt = formatExcerpt(item.contentSnippet ?? item.content ?? "")
    const publishedAt = toDate(item.isoDate ?? item.pubDate)
    return {
      id: `${source}-${item.guid ?? item.link ?? title}`,
      title,
      excerpt,
      url: item.link ?? url,
      source,
      publishedAt,
      tags: extractTags(title, excerpt),
    }
  })
  return items.filter((item) => matchesKeywords(item.title, item.excerpt))
}

const fetchCblNews = async (): Promise<LiberiaNewsItem[]> => {
  try {
    const res = await fetch("https://www.cbl.org.lr/", {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "TrueRateLiberiaBot/1.0" },
    })
    if (!res.ok) return []
    const html = await res.text()
    const { load } = await import("cheerio")
    const $ = load(html)
    const links = $("a")
      .map((_, el) => ({
        title: $(el).text().trim(),
        href: $(el).attr("href") ?? "",
      }))
      .get()
      .filter((link) => link.title && link.href.includes("cbl.org.lr"))
    const items = links.slice(0, 12).map((link) => ({
      id: `cbl-${link.href}`,
      title: link.title,
      excerpt: "Central Bank of Liberia update.",
      url: link.href,
      source: "CBL",
      publishedAt: new Date(),
      tags: extractTags(link.title, "Central Bank of Liberia update."),
    }))
    return items.filter((item) => matchesKeywords(item.title, item.excerpt))
  } catch (error) {
    console.error("[LiberiaMarket] CBL scrape failed", error)
    return []
  }
}

const fetchInvestLiberia = async (): Promise<LiberiaNewsItem[]> => {
  try {
    const res = await fetch("https://www.investliberia.gov.lr/news-and-media", {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "TrueRateLiberiaBot/1.0" },
    })
    if (!res.ok) return []
    const html = await res.text()
    const { load } = await import("cheerio")
    const $ = load(html)
    const items = $("a")
      .map((_, el) => ({
        title: $(el).text().trim(),
        href: $(el).attr("href") ?? "",
      }))
      .get()
      .filter((item) => item.title && item.href.includes("investliberia.gov.lr"))
      .slice(0, 10)
      .map((item) => ({
        id: `invest-${item.href}`,
        title: item.title,
        excerpt: "Liberia National Investment Commission update.",
        url: item.href,
        source: "Invest Liberia",
        publishedAt: new Date(),
        tags: extractTags(item.title, "Liberia National Investment Commission update."),
      }))
    return items.filter((item) => matchesKeywords(item.title, item.excerpt))
  } catch (error) {
    console.error("[LiberiaMarket] Invest Liberia scrape failed", error)
    return []
  }
}

export const fetchLiberiaNews = async (): Promise<LiberiaNewsItem[]> => {
  const results = await Promise.all([
    ...FEEDS.map((feed) => fetchFeed(feed.source, feed.url)),
    fetchCblNews(),
    fetchInvestLiberia(),
  ])
  const merged = results.flat()
  const unique = new Map<string, LiberiaNewsItem>()
  for (const item of merged) {
    if (!unique.has(item.url)) unique.set(item.url, item)
  }
  return Array.from(unique.values())
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, 10)
}

const buildMarketMovers = (items: LiberiaNewsItem[]) => {
  return COMMODITY_KEYWORDS.map((keyword) => {
    const mentions = items.filter((item) =>
      normalizeText(`${item.title} ${item.excerpt}`).includes(keyword),
    )
    return {
      keyword,
      count: mentions.length,
      latest: mentions[0],
    }
  }).filter((entry) => entry.count > 0)
}

export async function LiberiaMarketNews() {
  const items = await fetchLiberiaNews()
  const movers = buildMarketMovers(items)

  if (!items.length) {
    return (
      <Card className="border-dashed">
        <CardHeader className="flex flex-row items-center gap-3">
          <AlertCircle className="h-5 w-5 text-muted-foreground" />
          <div>
            <CardTitle>Latest Market & Economy News</CardTitle>
            <CardDescription>We could not load market headlines right now.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Please check back later. We refresh sources every 1–2 hours to stay within rate limits.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Latest Liberia Market & Economy Headlines</h2>
        <p className="text-muted-foreground">
          Curated from trusted Liberian sources. Updated automatically every 1–2 hours.
        </p>
      </div>

      {movers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Flame className="h-5 w-5 text-amber-500" />
              Market Movers
            </CardTitle>
            <CardDescription>Top commodities mentioned across today’s headlines.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {movers.map((mover) => (
              <Badge key={mover.keyword} variant="secondary">
                {mover.keyword} • {mover.count}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}

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
                {item.source} •{" "}
                {formatDistanceToNow(item.publishedAt, { addSuffix: true })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{item.excerpt}</p>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <Badge key={`${item.id}-${tag}`} variant="outline">
                    {tag}
                  </Badge>
                ))}
                <Badge variant="outline">
                  {format(item.publishedAt, "MMM d, yyyy")}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  )
}
