/**
 * Fetch daily USD/LRD exchange rate history from Central Bank of Liberia.
 * Source: https://www.cbl.org.lr/research/buying-selling-rates
 */

const CBL_RATES_URL = "https://www.cbl.org.lr/research/buying-selling-rates"
const FETCH_TIMEOUT_MS = 15000

export interface CblHistoricalPoint {
  date: string
  rate: number
  buying: number
  selling: number
}

const MONTHS: Record<string, string> = {
  january: "01", february: "02", march: "03", april: "04", may: "05", june: "06",
  july: "07", august: "08", september: "09", october: "10", november: "11", december: "12",
}

function parseDate(str: string): string | null {
  const m = str.match(
    /(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday),?\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2}),?\s+(\d{4})/i,
  )
  if (!m) return null
  const month = MONTHS[m[1].toLowerCase()]
  const day = m[2].padStart(2, "0")
  return `${m[3]}-${month}-${day}`
}

const fetchWithTimeout = async (url: string, init: RequestInit, timeoutMs: number) => {
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(t)
  }
}

/** Parse table row: Date | Buying | Selling (e.g. Monday, February 16, 2026 | L$184.9247/US$1.00 | L$186.9973/US$1.00) */
function parseTableRow(row: string): CblHistoricalPoint | null {
  const dateStr = parseDate(row)
  if (!dateStr) return null
  const rateMatches = [...row.matchAll(/L\$?([\d.]+)\s*\/\s*US?\$?1\.00/gi)]
  if (rateMatches.length < 2) return null
  const buying = Number.parseFloat(rateMatches[0][1])
  const selling = Number.parseFloat(rateMatches[1][1])
  if (!Number.isFinite(buying) || !Number.isFinite(selling) || buying < 100 || selling > 300) return null
  const rate = Number(((buying + selling) / 2).toFixed(4))
  return { date: dateStr, rate, buying, selling }
}

function parseCblHtml(html: string): CblHistoricalPoint[] {
  const points: CblHistoricalPoint[] = []
  const normalized = html.replace(/\r\n/g, "\n").replace(/>\s+</g, "><")
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr\s*>/gi
  let m: RegExpExecArray | null
  while ((m = trRegex.exec(normalized)) !== null) {
    const row = m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
    if (!row) continue
    const point = parseTableRow(row)
    if (point && !points.some((p) => p.date === point.date)) points.push(point)
  }
  if (points.length > 0) return points

  const lines = html.split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const dateStr = parseDate(line)
    if (!dateStr) continue
    const nextLine = lines[i + 1] ?? ""
    const buyMatch = nextLine.match(/L\$?([\d.]+)\s*\/\s*US\$1\.00/)
    const sellMatches = nextLine.match(/L\$?([\d.]+)\s*\/\s*US\$1\.00/g)
    if (!buyMatch || !sellMatches || sellMatches.length < 2) continue
    const buying = Number.parseFloat(buyMatch[1])
    const sellStr = sellMatches[1] ?? ""
    const sellNum = sellStr.match(/[\d.]+/)?.[0]
    const selling = sellNum ? Number.parseFloat(sellNum) : buying + 2
    if (Number.isNaN(buying) || Number.isNaN(selling)) continue
    const mid = (buying + selling) / 2
    points.push({ date: dateStr, rate: Number(mid.toFixed(4)), buying, selling })
  }
  return points
}

export interface CblLatestRate {
  rate: number
  date: string
  buying: number
  selling: number
  lastUpdated: string
}

/** Fetch the latest USD/LRD rate from CBL research page (most recent published day). Uses selling as official rate. */
export async function fetchCblLatestRate(): Promise<CblLatestRate | null> {
  try {
    const points = await fetchCblPage(1, 60)
    if (points.length === 0) return null
    const byDateDesc = [...points].sort((a, b) => b.date.localeCompare(a.date))
    const latest = byDateDesc[0]
    const lastUpdated = `${latest.date}T12:00:00.000Z`
    return {
      rate: Number(latest.selling.toFixed(4)),
      date: latest.date,
      buying: latest.buying,
      selling: latest.selling,
      lastUpdated,
    }
  } catch {
    return null
  }
}

async function fetchCblPage(page: number, revalidateSeconds = 86400): Promise<CblHistoricalPoint[]> {
  const url = page <= 1 ? CBL_RATES_URL : `${CBL_RATES_URL}?page=${page}`
  const res = await fetchWithTimeout(
    url,
    { next: { revalidate: revalidateSeconds }, headers: { "User-Agent": "TrueRate-Liberia/1.0" } },
    FETCH_TIMEOUT_MS,
  )
  if (!res.ok) return []
  const html = await res.text()
  return parseCblHtml(html)
}

export async function fetchCblHistoricalRates(maxDays = 90): Promise<{
  historical: CblHistoricalPoint[]
  source: string
}> {
  const all: CblHistoricalPoint[] = []
  const seen = new Set<string>()

  for (let page = 1; page <= 5; page++) {
    try {
      const points = await fetchCblPage(page)
      for (const p of points) {
        if (!seen.has(p.date)) {
          seen.add(p.date)
          all.push(p)
        }
      }
      if (points.length < 30) break
    } catch (e) {
      console.error("[CBL] Page fetch failed", page, e)
      break
    }
  }

  all.sort((a, b) => a.date.localeCompare(b.date))
  const trimmed = all.slice(-maxDays)

  return {
    historical: trimmed,
    source: "Central Bank of Liberia",
  }
}
