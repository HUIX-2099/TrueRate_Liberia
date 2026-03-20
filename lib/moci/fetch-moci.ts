/**
 * Fetch and parse data from https://www.moci.gov.lr/
 * Source: Ministry of Commerce & Industry, Liberia (Commerce Today bulletin, news, documents).
 */

import * as cheerio from "cheerio"
import type { MociPageData, MociNewsItem, MociDocument, MociBulletinRef } from "./types"

const MOCI_BASE = "https://www.moci.gov.lr"
const MOCI_HOME = `${MOCI_BASE}/`
const FETCH_TIMEOUT_MS = 15000

async function fetchHtml(url: string): Promise<string> {
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "TrueRate-Liberia/1.0 (Ministry of Commerce data)" },
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.text()
  } finally {
    clearTimeout(t)
  }
}

/** Extract news & press items from the homepage. */
function parseNews($: cheerio.CheerioAPI): MociNewsItem[] {
  const items: MociNewsItem[] = []
  const seen = new Set<string>()

  $("a[href*='/media/press-releases/']").each((_, el) => {
    const $a = $(el)
    const href = $a.attr("href")
    const title = $a.text().trim()
    if (!href || !title || title.length < 5) return
    const url = href.startsWith("http") ? href : new URL(href, MOCI_BASE).toString()
    if (seen.has(url)) return
    seen.add(url)

    let date = ""
    const parent = $a.closest("div, article, li")
    const text = parent.text()
    const dateMatch = text.match(/(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})/i)
    if (dateMatch) date = dateMatch[0]
    else {
      const short = text.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/gi)
      if (short && short[0]) date = short[0]
    }

    items.push({ title, date, url })
  })

  return items.slice(0, 15)
}

/** Extract recent and key document links. */
function parseDocuments($: cheerio.CheerioAPI): { recent: MociDocument[]; key: MociDocument[] } {
  const recent: MociDocument[] = []
  const key: MociDocument[] = []
  const recentUrls = new Set<string>()
  const keyUrls = new Set<string>()

  $("a[href*='.pdf'], a[href*='/sites/default/files/']").each((_, el) => {
    const $a = $(el)
    const href = $a.attr("href")
    const title = $a.text().trim()
    if (!href || !title || title.length < 3) return
    const url = href.startsWith("http") ? href : new URL(href, MOCI_BASE).toString()

    const isKey =
      /special economic zones|annual performance|administrative guidelines|importation of (rice|electronics)/i.test(title)
    if (isKey && !keyUrls.has(url)) {
      keyUrls.add(url)
      key.push({ title, url })
    } else if (!recentUrls.has(url)) {
      recentUrls.add(url)
      recent.push({ title, url })
    }
  })

  return { recent: recent.slice(0, 10), key: key.slice(0, 8) }
}

/** Extract Commerce Today bulletin references. */
function parseBulletins($: cheerio.CheerioAPI): MociBulletinRef[] {
  const bulletins: MociBulletinRef[] = []
  $("a[href*='commerce-today'], a[href*='commodities-bulletin']").each((_, el) => {
    const $a = $(el)
    const href = $a.attr("href")
    const title = $a.text().trim() || "Commerce Today"
    const url = href ? (href.startsWith("http") ? href : new URL(href, MOCI_BASE).toString()) : undefined
    if (!bulletins.some((b) => b.title === title && b.url === url)) {
      bulletins.push({
        title,
        description: "Monthly critical commodities bulletin — key commodities inventory and pricing.",
        url,
      })
    }
  })
  if (bulletins.length === 0) {
    bulletins.push({
      title: "Commerce Today Monthly Critical Commodities Bulletin",
      description:
        "Product of the Ministry of Commerce and Industry to inform the public on key commodities inventory and pricing. Data from import documents and targeted market surveys.",
      url: `${MOCI_BASE}/publications/document-type/commerce-today-monthly-critical-commodities-bulletin`,
    })
  }
  return bulletins
}

/** Fetch and parse MoCI homepage; return structured data. */
export async function fetchMociPageData(): Promise<MociPageData> {
  const html = await fetchHtml(MOCI_HOME)
  const $ = cheerio.load(html)

  const news = parseNews($)
  const bulletins = parseBulletins($)
  const { recent: recentDocuments, key: keyDocuments } = parseDocuments($)

  const bulletinLink = bulletins[0]?.url

  return {
    source: MOCI_HOME,
    fetchedAt: new Date().toISOString(),
    news,
    bulletins,
    recentDocuments,
    keyDocuments,
    commerceTodayPublicationUrl: bulletinLink,
  }
}
