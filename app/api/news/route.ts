import Parser from "rss-parser"

// Refresh daily to align with "everyday" updates while keeping API load low.
export const revalidate = 86400

type NewsItem = {
  title: string
  source: string
  time: string
  summary: string
  url: string
}

const SOURCES = [
  { name: "FrontPageAfrica Economy", url: "https://frontpageafricaonline.com/category/business/economy/feed/" },
  { name: "allAfrica Business", url: "https://allafrica.com/tools/headlines/rdf/liberia/business/headlines.rdf" },
  { name: "allAfrica", url: "https://allafrica.com/tools/headlines/rdf/liberia/headlines.rdf" },
  { name: "FrontPageAfrica", url: "https://frontpageafricaonline.com/feed/" },
  { name: "New Dawn Liberia", url: "https://thenewdawnliberia.com/feed/" },
]

const isRelevant = (title: string) => {
  const value = title.toLowerCase()
  return (
    value.includes("economy") ||
    value.includes("market") ||
    value.includes("rate") ||
    value.includes("liberia") ||
    value.includes("business") ||
    value.includes("inflation")
  )
}

const stripHtml = (text: string) =>
  text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()

const truncate = (text: string, max = 180) =>
  text.length > max ? `${text.slice(0, max - 1)}…` : text

export async function GET() {
  const parser = new Parser()
  const results = await Promise.all(
    SOURCES.map(async (source) => {
      try {
        const res = await fetch(source.url, { next: { revalidate } })
        if (!res.ok) return []
        const xml = await res.text()
        const feed = await parser.parseString(xml)
        return (feed.items || []).map((item) => ({
          title: item.title || "Untitled",
          source: source.name,
          time: item.pubDate || item.isoDate || "Recently",
          summary: truncate(stripHtml(item.contentSnippet || item.content || item.summary || "")),
          url: item.link || item.guid || "",
        }))
      } catch {
        return []
      }
    })
  )

  const items = results
    .flat()
    .filter((item) => item.url && isRelevant(item.title))
    .slice(0, 8)

  return Response.json({ items })
}
