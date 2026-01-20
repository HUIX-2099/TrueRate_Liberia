import { NextResponse } from "next/server"
import * as XLSX from "xlsx"
import cheerio from "cheerio"

const TRADING_ECON_CPI_URL = "https://tradingeconomics.com/liberia/consumer-price-index-cpi"
const TRADING_ECON_INFL_URL = "https://tradingeconomics.com/liberia/inflation-cpi"
const LISGIS_URL = "https://lisgis.gov.lr/pricestats.php"
const ALLORIGINS = "https://api.allorigins.win/raw?url="
const FETCH_TIMEOUT_MS = 15000
const EXCEL_REVALIDATE_SECONDS = 2592000

const LISGIS_FALLBACK = {
  cpi: 791.12,
  inflationYoY: 4.0,
  inflationMoM: -0.4,
  lastMonth: "December 2025",
  updatedAt: "2026-01-15",
  source: "LISGIS (fallback)",
  excelUrl: "https://lisgis.gov.lr/admin_area/monthlye/2026011517092Liberia_CPI_December_2025.xlsx",
}

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

const parseNumber = (value: string) => {
  const cleaned = value.replace(/,/g, "").match(/-?\d+(\.\d+)?/)
  if (!cleaned) return null
  return Number.parseFloat(cleaned[0])
}

const findNumericInRow = (row: unknown[]) => {
  return row
    .map((cell) => {
      if (typeof cell === "number") return cell
      if (typeof cell === "string") return parseNumber(cell)
      return null
    })
    .find((value) => value !== null) ?? null
}

const extractCpiMetrics = (rows: unknown[][]) => {
  let cpi: number | null = null
  let inflationMoM: number | null = null
  let inflationYoY: number | null = null
  let referenceMonth = ""

  rows.forEach((row) => {
    const text = row.map((cell) => (cell ?? "").toString().toLowerCase()).join(" ")
    if (!referenceMonth) {
      const monthMatch = text.match(
        /(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}/i,
      )
      if (monthMatch) referenceMonth = monthMatch[0]
    }
    if (
      text.includes("all items") ||
      text.includes("headline") ||
      text.includes("consumer price index") ||
      text.includes("cpi")
    ) {
      const candidate = findNumericInRow(row)
      if (candidate !== null && cpi === null) cpi = candidate
    }
    if (text.includes("month-on-month") || text.includes("mom") || text.includes("m/m")) {
      const candidate = findNumericInRow(row)
      if (candidate !== null && inflationMoM === null) inflationMoM = candidate
    }
    if (text.includes("year-on-year") || text.includes("yoy") || text.includes("12-month") || text.includes("y/y")) {
      const candidate = findNumericInRow(row)
      if (candidate !== null && inflationYoY === null) inflationYoY = candidate
    }
  })

  return { cpi, inflationMoM, inflationYoY, referenceMonth }
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

const resolveFetchUrl = (url: string, useProxy: boolean) =>
  useProxy ? `${ALLORIGINS}${encodeURIComponent(url)}` : url

const parseTradingEconomics = (html: string) => {
  const $ = cheerio.load(html)
  const metaDesc = $('meta[name="description"]').attr("content") ?? ""
  const bodyText = $("body").text().replace(/\s+/g, " ").trim()
  const text = `${metaDesc} ${bodyText}`

  const cpi = parseNumber(text.match(/consumer price index[^0-9]*([0-9]+(?:\.[0-9]+)?)/i)?.[1] ?? "")
  const inflationYoY = parseNumber(text.match(/inflation rate[^0-9-]*(-?[0-9]+(?:\.[0-9]+)?)/i)?.[1] ?? "")
  const inflationMoM = parseNumber(text.match(/month[-\s]?on[-\s]?month[^0-9-]*(-?[0-9]+(?:\.[0-9]+)?)/i)?.[1] ?? "")
  const monthMatch = text.match(
    /(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}/i,
  )

  return {
    cpi: cpi ?? null,
    inflationYoY: inflationYoY ?? null,
    inflationMoM: inflationMoM ?? null,
    lastMonth: monthMatch ? monthMatch[0] : "",
  }
}

const fetchTradingEconomics = async () => {
  const useProxy = false
  const cpiUrl = resolveFetchUrl(TRADING_ECON_CPI_URL, useProxy)
  const inflUrl = resolveFetchUrl(TRADING_ECON_INFL_URL, useProxy)

  const [cpiRes, inflRes] = await Promise.all([
    fetchWithTimeout(cpiUrl, { next: { revalidate: 3600 } }, FETCH_TIMEOUT_MS),
    fetchWithTimeout(inflUrl, { next: { revalidate: 3600 } }, FETCH_TIMEOUT_MS),
  ])

  if (!cpiRes.ok || !inflRes.ok) return null
  const [cpiHtml, inflHtml] = await Promise.all([cpiRes.text(), inflRes.text()])
  const cpiData = parseTradingEconomics(cpiHtml)
  const inflData = parseTradingEconomics(inflHtml)

  return {
    cpi: cpiData.cpi ?? null,
    inflationYoY: inflData.inflationYoY ?? null,
    inflationMoM: inflData.inflationMoM ?? null,
    lastMonth: cpiData.lastMonth || inflData.lastMonth || "",
    updatedAt: new Date().toISOString(),
    source: "Trading Economics",
    excelUrl: "",
  }
}

const fetchLisgisExcel = async () => {
  const useProxy = false
  const statsUrl = resolveFetchUrl(LISGIS_URL, useProxy)
  const res = await fetchWithTimeout(statsUrl, { next: { revalidate: 86400 } }, FETCH_TIMEOUT_MS)
  if (!res.ok) throw new Error(`LISGIS page status ${res.status}`)
  const html = await res.text()
  const $ = cheerio.load(html)

  const rows = $("table tr").toArray()
  const candidates = rows
    .map((row) => {
      const rowText = $(row).text().replace(/\s+/g, " ").trim()
      const lower = rowText.toLowerCase()
      if (!lower.includes("consumer price index") && !lower.includes("cpi")) return null
      if (!lower.includes("december") || !lower.includes("2025") || !lower.includes("2026-01")) return null
      const date = parseMonthYear(rowText)
      const link = $(row)
        .find('a[href*="Liberia_CPI_"][href$=".xlsx"], a[href*="Liberia_CPI_"][href$=".xls"]')
        .attr("href")
      if (!link || !date) return null
      return { date, link, rowText }
    })
    .filter(Boolean) as { date: Date; link: string; rowText: string }[]

  const latest = candidates.sort((a, b) => b.date.getTime() - a.date.getTime())[0]
  if (!latest) throw new Error("No CPI entry found")

  const excelUrl = new URL(latest.link, LISGIS_URL).toString()
  const excelFetchUrl = resolveFetchUrl(excelUrl, useProxy)
  const excelRes = await fetchWithTimeout(
    excelFetchUrl,
    { next: { revalidate: EXCEL_REVALIDATE_SECONDS } },
    FETCH_TIMEOUT_MS,
  )
  if (!excelRes.ok) throw new Error(`LISGIS Excel status ${excelRes.status}`)

  const buffer = await excelRes.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: "array" })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rowsData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" })
  const metrics = extractCpiMetrics(rowsData)

  return {
    cpi: metrics.cpi ?? LISGIS_FALLBACK.cpi,
    inflationYoY: metrics.inflationYoY ?? LISGIS_FALLBACK.inflationYoY,
    inflationMoM: metrics.inflationMoM ?? LISGIS_FALLBACK.inflationMoM,
    lastMonth:
      metrics.referenceMonth ||
      latest.date.toLocaleDateString("en-US", { month: "long", year: "numeric" }) ||
      LISGIS_FALLBACK.lastMonth,
    updatedAt: new Date().toISOString(),
    source: "LISGIS",
    excelUrl,
  }
}

export async function GET() {
  try {
    const trading = await fetchTradingEconomics()
    if (trading?.cpi) {
      return NextResponse.json(trading)
    }
  } catch (error) {
    console.error("[Liberia CPI] Trading Economics failed", error)
  }

  try {
    const lisgis = await fetchLisgisExcel()
    return NextResponse.json(lisgis)
  } catch (error) {
    console.error("[Liberia CPI] LISGIS fallback failed", error)
    return NextResponse.json(LISGIS_FALLBACK, { status: 200 })
  }
}
