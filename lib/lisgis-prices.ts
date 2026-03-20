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
  { key: "palm-oil", name: "Palm Oil (gallon)", category: "food", icon: "oil", keywords: ["palm", "oil"] },
  { key: "sugar", name: "Sugar (1kg)", category: "food", icon: "sugar", keywords: ["sugar"] },
  { key: "flour", name: "Flour (25kg)", category: "food", icon: "wheat", keywords: ["flour"] },
  { key: "bread", name: "Bread (loaf)", category: "food", icon: "bread", keywords: ["bread"] },
  { key: "chicken", name: "Chicken (1kg)", category: "food", icon: "chicken", keywords: ["chicken"] },
  { key: "fish", name: "Fish (1kg)", category: "food", icon: "fish", keywords: ["fish"] },
  { key: "eggs", name: "Eggs (tray)", category: "food", icon: "egg", keywords: ["egg"] },
  { key: "onions", name: "Onions (1kg)", category: "food", icon: "food", keywords: ["onion"] },
  { key: "cassava", name: "Cassava (kg)", category: "food", icon: "food", keywords: ["cassava"] },
  { key: "tomato", name: "Tomato (1kg)", category: "food", icon: "tomato", keywords: ["tomato"] },
  { key: "pepper", name: "Pepper (1kg)", category: "food", icon: "pepper", keywords: ["pepper", "chili"] },
  { key: "plantain", name: "Plantain (bunch)", category: "food", icon: "plantain", keywords: ["plantain"] },
  { key: "beans", name: "Beans (1kg)", category: "food", icon: "wheat", keywords: ["bean"] },
  { key: "beef", name: "Beef (1kg)", category: "food", icon: "beef", keywords: ["beef", "meat"] },
  { key: "milk", name: "Milk (1L)", category: "food", icon: "milk", keywords: ["milk"] },
  { key: "potato", name: "Potato (1kg)", category: "food", icon: "potato", keywords: ["potato"] },
  { key: "stock-cubes", name: "Stock Cubes (pack)", category: "food", icon: "food", keywords: ["stock", "maggi", "cube", "bouillon"] },
  { key: "spaghetti", name: "Spaghetti (500g)", category: "food", icon: "wheat", keywords: ["spaghetti", "pasta", "noodle"] },
  { key: "sardines", name: "Sardines (tin)", category: "food", icon: "fish", keywords: ["sardine", "tin", "canned"] },
  { key: "greens", name: "Greens (bundle)", category: "food", icon: "greens", keywords: ["greens", "leafy", "potato greens", "collard"] },
  { key: "sweet-potato", name: "Sweet Potato (kg)", category: "food", icon: "potato", keywords: ["sweet", "potato"] },
  { key: "gas", name: "Gallon of Gas", category: "fuel", icon: "fuel", keywords: ["gas", "petrol", "gasoline"] },
  { key: "diesel", name: "Gallon of Diesel", category: "fuel", icon: "fuel", keywords: ["diesel"] },
  { key: "kerosene", name: "Kerosene (gallon)", category: "fuel", icon: "fuel", keywords: ["kerosene"] },
  { key: "cooking-gas", name: "Cooking Gas (14kg)", category: "fuel", icon: "gas", keywords: ["lpg"] },
  { key: "charcoal", name: "Charcoal (bag)", category: "fuel", icon: "charcoal", keywords: ["charcoal"] },
  { key: "cement", name: "Cement (50kg)", category: "construction", icon: "cement", keywords: ["cement"] },
  { key: "steel", name: "Steel Rods (bundle)", category: "construction", icon: "steel", keywords: ["steel"] },
  { key: "nails", name: "Nails (1kg)", category: "construction", icon: "steel", keywords: ["nail"] },
  { key: "paint", name: "Paint (gallon)", category: "construction", icon: "paint", keywords: ["paint"] },
  { key: "plywood", name: "Plywood (sheet)", category: "construction", icon: "plywood", keywords: ["plywood", "ply"] },
  { key: "sand", name: "Sand (bag)", category: "construction", icon: "sand", keywords: ["sand"] },
  { key: "roofing-sheet", name: "Roofing Sheet (zinc)", category: "construction", icon: "steel", keywords: ["roof", "zinc", "corrugated"] },
  { key: "binding-wire", name: "Binding Wire (roll)", category: "construction", icon: "steel", keywords: ["wire", "binding"] },
  { key: "door", name: "Door (standard)", category: "construction", icon: "door", keywords: ["door"] },
  { key: "window", name: "Window (standard)", category: "construction", icon: "door", keywords: ["window"] },
  { key: "paint-brush", name: "Paint Brush", category: "construction", icon: "paint", keywords: ["brush", "paint"] },
  { key: "gravel", name: "Gravel (bag)", category: "construction", icon: "sand", keywords: ["gravel", "stone"] },
  { key: "soap", name: "Laundry Soap (bar)", category: "household", icon: "soap", keywords: ["soap", "laundry"] },
  { key: "salt", name: "Salt (1kg)", category: "household", icon: "salt", keywords: ["salt"] },
  { key: "toilet-soap", name: "Toilet Soap (bar)", category: "household", icon: "soap", keywords: ["toilet", "soap", "bath"] },
  { key: "toothpaste", name: "Toothpaste (tube)", category: "household", icon: "toothpaste", keywords: ["toothpaste"] },
  { key: "matches", name: "Matches (box)", category: "household", icon: "matches", keywords: ["match"] },
  { key: "candles", name: "Candles (pack)", category: "household", icon: "candles", keywords: ["candle"] },
  { key: "mosquito-coil", name: "Mosquito Coil (pack)", category: "household", icon: "mosquito", keywords: ["mosquito"] },
  { key: "bleach", name: "Bleach (bottle)", category: "household", icon: "bleach", keywords: ["bleach"] },
  { key: "washing-powder", name: "Washing Powder (1kg)", category: "household", icon: "soap", keywords: ["washing", "powder", "detergent"] },
  { key: "toilet-paper", name: "Toilet Paper (roll)", category: "household", icon: "toilet-paper", keywords: ["toilet", "paper", "tissue"] },
  { key: "sanitary-pads", name: "Sanitary Pads (pack)", category: "household", icon: "sanitary", keywords: ["sanitary", "pad", "napkin"] },
  { key: "batteries", name: "Batteries (pack of 4)", category: "household", icon: "batteries", keywords: ["batter"] },
  { key: "plastic-bucket", name: "Plastic Bucket", category: "household", icon: "bucket", keywords: ["bucket", "pail"] },
]

const parseNumber = (value: unknown): number | null => {
  if (typeof value === "number" && !Number.isNaN(value)) return value
  if (typeof value === "string") {
    const cleaned = value.replace(/,/g, "").match(/-?\d+(\.\d+)?/)
    if (cleaned) return Number.parseFloat(cleaned[0])
  }
  return null
}

/** Minimum LRD value to treat as a commodity price (avoids CPI index base 100). */
const MIN_LRD_PRICE = 500

/** Extract numeric values from a row (excluding CPI index-like numbers). */
function extractPriceFromRow(row: unknown[]): { price: number; change: number | null } {
  const nums = row
    .map((cell) => parseNumber(cell))
    .filter((n): n is number => n !== null && n > 0)

  // Prices in LRD: essential goods are typically 500–500000. CPI indices are 100–1000; exclude index-like values.
  const prices = nums.filter((n) => n >= MIN_LRD_PRICE && n <= 1_000_000)
  const changes = nums.filter((n) => n >= -50 && n <= 100 && Math.abs(n) < 50)

  return {
    price: prices[0] ?? 0,
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
      if (price >= MIN_LRD_PRICE) {
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
