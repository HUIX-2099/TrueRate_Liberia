import Parser from "rss-parser"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { LiberiaMarketNewsAuto, type LiberiaNewsItemClient } from "@/components/liberia-market-news-auto"

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
  "rates",
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
  "dollar",
  "forex",
  "remittance",
  "central bank",
  "cbl",
  "foreign exchange",
  "import",
  "trade",
  "budget",
  "finance",
]

const COMMODITY_KEYWORDS = ["gold", "rubber", "palm oil", "iron ore"]

const FEEDS = [
  {
    source: "FrontPageAfrica Economy",
    url: "https://frontpageafricaonline.com/category/business/economy/feed/",
  },
  {
    source: "FrontPageAfrica",
    url: "https://frontpageafricaonline.com/feed/",
  },
  {
    source: "allAfrica Business",
    url: "https://allafrica.com/tools/headlines/rdf/liberia/business/headlines.rdf",
  },
  {
    source: "allAfrica Liberia",
    url: "https://allafrica.com/tools/headlines/rdf/liberia/headlines.rdf",
  },
  {
    source: "New Dawn Liberia",
    url: "https://thenewdawnliberia.com/feed/",
  },
]

/** Display names for the "News sources" section on the page */
export const NEWS_OUTLET_LABELS = [
  "FrontPageAfrica (economy & general)",
  "allAfrica (Liberia business & headlines)",
  "New Dawn Liberia",
  "Central Bank of Liberia (CBL) — news & press releases",
  "Invest Liberia (National Investment Commission)",
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
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        "User-Agent": "TrueRateLiberiaBot/1.0 (Liberia market news)",
        Accept: "application/rss+xml, application/xml;q=0.9, text/xml;q=0.8, application/rdf+xml;q=0.7",
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
    return items
  } catch (error) {
    console.warn(`[LiberiaMarketNews] Feed failed: ${source}`, error)
    return []
  }
}

const CBL_NEWS_PRESS_URL = "https://www.cbl.org.lr/media/news-press-release"
const CBL_BASE = "https://www.cbl.org.lr"
const DATE_LIKE = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s+\w+\s+\d{1,2},\s+\d{4}$/

const fetchCblNewsPressReleases = async (): Promise<LiberiaNewsItem[]> => {
  try {
    const res = await fetch(CBL_NEWS_PRESS_URL, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "TrueRateLiberiaBot/1.0" },
    })
    if (!res.ok) return []
    const html = await res.text()
    const { load } = await import("cheerio")
    const $ = load(html)
    const seen = new Set<string>()
    const items: LiberiaNewsItem[] = []
    $('a[href*="/media/press-releases/"], a[href*="/media/features-articles/"]').each((_, el) => {
      const href = $(el).attr("href") ?? ""
      const title = $(el).text().trim()
      const url = href.startsWith("http") ? href : new URL(href, CBL_BASE).href
      if (title.length <= 10 || seen.has(url)) return
      seen.add(url)
      let publishedAt = new Date()
      const $el = $(el)
      const prevText = $el.parent().prev().text().trim()
      if (DATE_LIKE.test(prevText)) {
        const d = new Date(prevText)
        if (!Number.isNaN(d.getTime())) publishedAt = d
      }
      items.push({
        id: `cbl-news-${url}`,
        title,
        excerpt: "Central Bank of Liberia news and press release.",
        url,
        source: "CBL News",
        publishedAt,
        tags: extractTags(title, "Central Bank of Liberia news and press release."),
      })
    })
    return items.slice(0, 20)
  } catch (error) {
    console.error("[LiberiaMarket] CBL news/press-release scrape failed", error)
    return []
  }
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
    return items
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
    return items
  } catch (error) {
    console.error("[LiberiaMarket] Invest Liberia scrape failed", error)
    return []
  }
}

export const fetchLiberiaNews = async (): Promise<LiberiaNewsItem[]> => {
  const results = await Promise.allSettled([
    ...FEEDS.map((feed) => fetchFeed(feed.source, feed.url)),
    fetchCblNews(),
    fetchCblNewsPressReleases(),
    fetchInvestLiberia(),
  ])
  const merged = results
    .filter((r): r is PromiseFulfilledResult<LiberiaNewsItem[]> => r.status === "fulfilled")
    .flatMap((r) => r.value)
  const unique = new Map<string, LiberiaNewsItem>()
  for (const item of merged) {
    if (!unique.has(item.url)) unique.set(item.url, item)
  }
  const fxKeywords = ["rate", "rates", "currency", "exchange", "dollar", "forex", "lrd", "usd", "remittance", "cbl", "central bank", "inflation"]
  const scoreFxRelevance = (item: LiberiaNewsItem) => {
    const text = normalizeText(`${item.title} ${item.excerpt}`)
    return fxKeywords.filter((k) => text.includes(k)).length
  }
  return Array.from(unique.values())
    .sort((a, b) => {
      const scoreA = scoreFxRelevance(a)
      const scoreB = scoreFxRelevance(b)
      if (scoreB !== scoreA) return scoreB - scoreA
      return b.publishedAt.getTime() - a.publishedAt.getTime()
    })
    .slice(0, 15)
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
            <CardTitle>FX Pulse</CardTitle>
            <CardDescription>We could not load market headlines right now.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Please check back later. We refresh sources every 1–2 hours to stay within rate limits.
        </CardContent>
      </Card>
    )
  }

  const initialItems: LiberiaNewsItemClient[] = items.map((item) => ({
    id: item.id,
    title: item.title,
    source: item.source,
    time: formatDistanceToNow(item.publishedAt, { addSuffix: true }),
    publishedAt: item.publishedAt.toISOString(),
    summary: item.excerpt,
    url: item.url,
    tags: item.tags,
  }))

  return <LiberiaMarketNewsAuto initialItems={initialItems} />
}
