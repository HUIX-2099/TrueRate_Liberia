/**
 * Parse LISGIS CPI Excel files for commodity average prices.
 * LISGIS files use COICOP structure with commodity classes and item-level prices (in LRD).
 */

import * as cheerio from "cheerio"
import * as XLSX from "xlsx"

const LISGIS_URL = "https://lisgis.gov.lr/pricestats.php"
const EXCEL_REVALIDATE_SECONDS = 2592000
const FETCH_TIMEOUT_MS = 20000

export interface LisgisPriceItem {
  key: string
  name: string
  category: string
  icon: string
  priceLRD: number | null
  change: number | null
}

/** Map commodity keywords to our display items. Order matters for matching. */
const COMMODITY_MATCHES: Array<{
  key: string
  name: string
  category: string
  icon: string
  keywords: string[]
}> = [
  { key: "rice-thai", name: "25kg Rice (Thai)", category: "food", icon: "wheat", keywords: ["rice", "thai", "imported"] },
  { key: "rice-local", name: "25kg Rice (Local)", category: "food", icon: "wheat", keywords: ["rice", "local"] },
  { key: "gas", name: "Gallon of Gas", category: "fuel", icon: "fuel", keywords: ["gas", "petrol", "gasoline"] },
  { key: "diesel", name: "Gallon of Diesel", category: "fuel", icon: "fuel", keywords: ["diesel"] },
  { key: "cement", name: "Cement (50kg)", category: "construction", icon: "cement", keywords: ["cement"] },
  { key: "steel", name: "Steel Rods (bundle)", category: "construction", icon: "steel", keywords: ["steel"] },
  { key: "palm-oil", name: "Palm Oil (gallon)", category: "food", icon: "oil", keywords: ["palm", "oil"] },
  { key: "cooking-gas", name: "Cooking Gas (14kg)", category: "fuel", icon: "gas", keywords: ["lpg"] },
]

const parseNumber = (value: unknown): number | null => {
  if (typeof value === "number" && !Number.isNaN(value)) return value
  if (typeof value === "string") {
    const cleaned = value.replace(/,/g, "").match(/-?\d+(\.\d+)?/)
    if (cleaned) return Number.parseFloat(cleaned[0])
  }
  return null
}

/** Extract numeric values from a row (excluding very small or index-like numbers). */
function extractPriceFromRow(row: unknown[]): { price: number; change: number | null } {
  const nums = row
    .map((cell) => parseNumber(cell))
    .filter((n): n is number => n !== null && n > 0)

  // Prices in LRD: typically 100–500000. CPI indices are 100–1000. Inflation % is -20 to 50.
  const prices = nums.filter((n) => n >= 50 && n <= 1_000_000)
  const changes = nums.filter((n) => n >= -50 && n <= 100 && Math.abs(n) < 50)

  return {
    price: prices[0] ?? nums[0] ?? 0,
    change: changes.length > 0 ? changes[0] : null,
  }
}

/** Check if row text matches commodity keywords (all must match). */
function matchesCommodity(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase()
  return keywords.every((kw) => lower.includes(kw.toLowerCase()))
}

/** Differentiate rice-thai vs rice-local by extra keywords. */
function resolveRiceKey(text: string): "rice-thai" | "rice-local" | null {
  const lower = text.toLowerCase()
  if (lower.includes("thai") || lower.includes("imported") || lower.includes("parboiled")) return "rice-thai"
  if (lower.includes("local") || lower.includes("swamp")) return "rice-local"
  return null
}

export function extractCommodityPrices(rows: unknown[][]): LisgisPriceItem[] {
  const found = new Map<string, LisgisPriceItem>()

  for (const row of rows) {
    const text = row.map((cell) => (cell ?? "").toString()).join(" ")
    if (!text.trim()) continue

    for (const item of COMMODITY_MATCHES) {
      if (found.has(item.key)) continue

      // Special handling for rice to avoid double-match
      if (item.key.startsWith("rice-")) {
        const riceKey = resolveRiceKey(text)
        if (riceKey !== item.key) continue
        if (!text.toLowerCase().includes("rice")) continue
      } else if (!matchesCommodity(text, item.keywords)) {
        continue
      }

      const { price, change } = extractPriceFromRow(row)
      if (price > 0) {
        found.set(item.key, {
          key: item.key,
          name: item.name,
          category: item.category,
          icon: item.icon,
          priceLRD: price,
          change,
        })
        break
      }
    }
  }

  return Array.from(found.values())
}

const fetchWithTimeout = async (url: string, init: RequestInit, timeoutMs: number) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}

export interface LisgisPricesResult {
  items: LisgisPriceItem[]
  referenceMonth: string
  excelUrl: string
  lastUpdated: string
}

/** Fetch latest LISGIS CPI Excel and extract commodity prices. */
export async function fetchLisgisPrices(): Promise<LisgisPricesResult | null> {
  try {
    const res = await fetchWithTimeout(LISGIS_URL, { next: { revalidate: 86400 } }, FETCH_TIMEOUT_MS)
    if (!res.ok) return null
    const html = await res.text()

    const $ = cheerio.load(html)

    const monthMap: Record<string, number> = {
      january: 0,
      february: 1,
      march: 2,
      april: 3,
      may: 4,
      june: 5,
      july: 6,
      august: 7,
      september: 8,
      october: 9,
      november: 10,
      december: 11,
    }
    const parseMonthYear = (value: string) => {
      const match = value.match(
        /(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})/i,
      )
      if (!match) return null
      const month = monthMap[match[1].toLowerCase()]
      const year = Number.parseInt(match[2], 10)
      return new Date(year, month, 1)
    }

    const rows = $("table tr").toArray()
    const candidates = rows
      .map((row) => {
        const rowText = $(row).text().replace(/\s+/g, " ").trim()
        const lower = rowText.toLowerCase()
        if (!lower.includes("consumer price index") && !lower.includes("cpi")) return null
        const date = parseMonthYear(rowText)
        const link = $(row)
          .find('a[href*="Liberia_CPI_"][href$=".xlsx"], a[href*="Liberia_CPI_"][href$=".xls"]')
          .attr("href")
        if (!link || !date) return null
        return { date, link, rowText }
      })
      .filter(Boolean) as { date: Date; link: string; rowText: string }[]

    const latest = candidates.sort((a, b) => b.date.getTime() - a.date.getTime())[0]
    if (!latest) return null

    const excelUrl = new URL(latest.link, LISGIS_URL).toString()
    const excelRes = await fetchWithTimeout(
      excelUrl,
      { next: { revalidate: EXCEL_REVALIDATE_SECONDS } },
      FETCH_TIMEOUT_MS,
    )
    if (!excelRes.ok) return null

    const buffer = await excelRes.arrayBuffer()
    const { items, referenceMonth } = parseLisgisExcel(buffer)

    return {
      items,
      referenceMonth,
      excelUrl,
      lastUpdated: new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export function parseLisgisExcel(buffer: ArrayBuffer): {
  items: LisgisPriceItem[]
  referenceMonth: string
} {
  const workbook = XLSX.read(buffer, { type: "array" })
  let referenceMonth = ""
  const allRows: unknown[][] = []

  for (const name of workbook.SheetNames) {
    const sheet = workbook.Sheets[name]
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" }) as unknown[][]

    for (const row of rows) {
      const text = row.map((c) => (c ?? "").toString()).join(" ")
      if (!referenceMonth) {
        const m = text.match(
          /(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}/i,
        )
        if (m) referenceMonth = m[0]
      }
      allRows.push(row)
    }
  }

  const items = extractCommodityPrices(allRows)
  return { items, referenceMonth }
}
