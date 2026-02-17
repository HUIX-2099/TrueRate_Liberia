/**
 * Fetch latest USD/LRD buying and selling rates from the Central Bank of Liberia homepage.
 * Source: https://www.cbl.org.lr/ (Market Buying and Selling Rates table)
 * @see https://cbl.org.lr/
 */

const CBL_HOMEPAGE_URL = "https://www.cbl.org.lr/"
const FETCH_TIMEOUT_MS = 15000

export interface CblHomepageRate {
  /** Selling rate (LRD per US$1.00) - used as the primary official rate */
  rate: number
  buying: number
  selling: number
  /** Date string from CBL (e.g. "February 16, 2026") */
  date: string
  /** ISO timestamp for last updated */
  lastUpdated: string
  source: string
}

/**
 * Parse CBL homepage HTML for the "Market Buying and Selling Rates" table.
 * Expects table rows with L$ buying and L$ selling (e.g. L$184.9247/1.00 and L$186.9973/US$1.00).
 */
export function parseCblHomepageHtml(html: string): CblHomepageRate | null {
  const normalized = html.replace(/\s+/g, " ").replace(/>\s+</g, "><")
  const tableSection = normalized.match(/Market\s+Buying\s+and\s+Selling\s+Rates[\s\S]*?View\s+All/i)
  if (!tableSection) return null

  const section = tableSection[0]
  const dateMatch = section.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/i)
  const dateStr = dateMatch ? dateMatch[0] : ""

  let buying: number
  let selling: number

  const rateRow = section.match(/L\$?\s*([\d.]+)\s*\/\s*1\.00[\s\S]*?L\$?\s*([\d.]+)\s*\/\s*US?\$?\s*1\.00/i)
  if (rateRow && rateRow.length >= 3) {
    buying = Number.parseFloat(rateRow[1])
    selling = Number.parseFloat(rateRow[2])
  } else {
    const alt = section.match(/L\$?\s*([\d.]+)\s*\/\s*[\d.]+[\s\S]*?L\$?\s*([\d.]+)\s*\/\s*US?\$?[\d.]+/i)
    if (!alt || alt.length < 3) {
      const twoRates = section.match(/(18[0-5]\.[\d]{4})[\s\S]*?(18[5-9]\.[\d]{4}|19[0-5]\.[\d]{4})/)
      if (!twoRates || twoRates.length < 3) return null
      buying = Number.parseFloat(twoRates[1])
      selling = Number.parseFloat(twoRates[2])
    } else {
      buying = Number.parseFloat(alt[1])
      selling = Number.parseFloat(alt[2])
    }
  }

  if (!Number.isFinite(buying) || !Number.isFinite(selling) || buying < 100 || selling > 300) return null
  if (buying > selling) [buying, selling] = [selling, buying]

  return {
    rate: Number(selling.toFixed(4)),
    buying,
    selling,
    date: dateStr,
    lastUpdated: new Date().toISOString(),
    source: "Central Bank of Liberia",
  }
}

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<string> {
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "TrueRate-Liberia/1.0 (https://truerate-liberia.com)" },
      signal: controller.signal,
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error(`CBL homepage ${res.status}`)
    return await res.text()
  } finally {
    clearTimeout(t)
  }
}

/**
 * Fetch the last updated rate from the CBL official homepage (https://www.cbl.org.lr/).
 * Returns the selling rate as the primary "official" rate (LRD per US$1.00).
 */
export async function fetchCblRateFromHomepage(): Promise<CblHomepageRate | null> {
  try {
    const html = await fetchWithTimeout(CBL_HOMEPAGE_URL, FETCH_TIMEOUT_MS)
    const parsed = parseCblHomepageHtml(html)
    if (parsed && parsed.rate >= 150 && parsed.rate <= 220) return parsed
    return null
  } catch (e) {
    console.error("[CBL Homepage] Fetch failed:", e)
    return null
  }
}
