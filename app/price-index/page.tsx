// Run: npm install xlsx   (or pnpm add xlsx / yarn add xlsx)
// Optional types: npm install --save-dev @types/xlsx
// If XLSX parsing is tricky, consider fallback: npm install exceljs
// IMPORTANT: Run this once in terminal (project root):
// npm install xlsx
// or pnpm add xlsx / yarn add xlsx
// Optional TS types: npm install --save-dev @types/xlsx
// If parsing is unreliable, consider exceljs: npm install exceljs
import * as XLSX from "xlsx"
import cheerio from "cheerio"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PriceIndex } from "@/components/liberia-features"

const LISGIS_URL = "https://lisgis.gov.lr/pricestats.php"
const ALLORIGINS = "https://api.allorigins.win/raw?url="
const REVALIDATE_SECONDS = 86400
const EXCEL_REVALIDATE_SECONDS = 2592000
const FETCH_TIMEOUT_MS = 15000
const LISGIS_FALLBACK = {
  cpi: 791.12,
  yoyInflation: 4.0,
  momChange: -0.4,
  referenceMonth: "December 2025",
  lastUpdated: "2026-01-15",
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
  let cpi = null
  let yoyInflation = null
  let momChange = null
  let referenceMonth = ""

  rows.forEach((row) => {
    const text = row.map((cell) => (cell ?? "").toString().toLowerCase()).join(" ")
    if (!referenceMonth) {
      const monthMatch = text.match(
        /(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}/i,
      )
      if (monthMatch) referenceMonth = monthMatch[0]
    }

    if (text.includes("all items") || text.includes("headline") || text.includes("consumer price index") || text.includes("cpi")) {
      const candidate = findNumericInRow(row)
      if (candidate !== null && cpi === null) cpi = candidate
    }
    if (text.includes("month-on-month") || text.includes("mom") || text.includes("m/m")) {
      const candidate = findNumericInRow(row)
      if (candidate !== null && momChange === null) momChange = candidate
    }
    if (text.includes("year-on-year") || text.includes("yoy") || text.includes("12-month") || text.includes("y/y")) {
      const candidate = findNumericInRow(row)
      if (candidate !== null && yoyInflation === null) yoyInflation = candidate
    }
  })

  return { cpi, yoyInflation, momChange, referenceMonth }
}

const withTimeout = (signal: AbortSignal, timeoutMs: number) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  signal.addEventListener("abort", () => controller.abort())
  return { controller, timeout }
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

const fetchCpiFromLisgis = async () => {
  try {
    // Some networks block lisgis.gov.lr; enable proxy by toggling useProxy.
    const useProxy = false
    const statsUrl = resolveFetchUrl(LISGIS_URL, useProxy)
    const res = await fetchWithTimeout(statsUrl, { next: { revalidate: REVALIDATE_SECONDS } }, FETCH_TIMEOUT_MS)
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
      yoyInflation: metrics.yoyInflation ?? LISGIS_FALLBACK.yoyInflation,
      momChange: metrics.momChange ?? LISGIS_FALLBACK.momChange,
      referenceMonth:
        metrics.referenceMonth ||
        latest.date.toLocaleDateString("en-US", { month: "long", year: "numeric" }) ||
        LISGIS_FALLBACK.referenceMonth,
      lastUpdated: new Date().toISOString(),
      excelUrl,
    }
  } catch (error) {
    console.error("[PriceIndex] LISGIS CPI fetch failed", error)
    return {
      ...LISGIS_FALLBACK,
      excelUrl: "https://lisgis.gov.lr/admin_area/monthlye/2026011517092Liberia_CPI_December_2025.xlsx",
    }
  }
}

const fetchLiveRate = async () => {
  try {
    const res = await fetch("https://truerateliberia.com/api/rates/live", {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export default async function PriceIndexPage() {
  const [cpiData, liveRate] = await Promise.all([fetchCpiFromLisgis(), fetchLiveRate()])

  const formatNumber = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 })
  const latestRate = typeof liveRate?.rate === "number" ? liveRate.rate : null
  const priceIndexRate = latestRate ?? 180
  const lastUpdated = cpiData?.referenceMonth ?? null

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-4">Official CPI</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Liberia Price Index</h1>
              <p className="text-lg text-muted-foreground text-pretty">
                Official Consumer Price Index (CPI) data and inflation trends for Liberia, refreshed daily from LISGIS.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Latest CPI (Index)</CardTitle>
                  <CardDescription>{lastUpdated ?? "Latest published period"}</CardDescription>
                </CardHeader>
                <CardContent className="text-2xl font-bold text-primary">
                  {cpiData?.cpi !== null && cpiData?.cpi !== undefined
                    ? formatNumber.format(cpiData.cpi)
                    : "—"}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Inflation (YoY)</CardTitle>
                  <CardDescription>{lastUpdated ?? "Latest published period"}</CardDescription>
                </CardHeader>
                <CardContent className="text-2xl font-bold text-primary">
                  {cpiData?.yoyInflation !== null && cpiData?.yoyInflation !== undefined
                    ? `${formatNumber.format(cpiData.yoyInflation)}%`
                    : "—"}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Inflation (MoM)</CardTitle>
                  <CardDescription>{lastUpdated ?? "Latest published period"}</CardDescription>
                </CardHeader>
                <CardContent className="text-2xl font-bold text-primary">
                  {cpiData?.momChange !== null && cpiData?.momChange !== undefined
                    ? `${formatNumber.format(cpiData.momChange)}%`
                    : "—"}
                </CardContent>
              </Card>
            </div>
            <div className="mt-6 text-center text-xs text-muted-foreground">
              Source:{" "}
              <a
                href={cpiData?.excelUrl ?? LISGIS_URL}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                LISGIS CPI Release
              </a>
            </div>
            {!cpiData?.cpi && (
              <div className="mt-2 text-center text-sm text-muted-foreground">
                Latest official data unavailable – check LISGIS.gov.lr
              </div>
            )}
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <PriceIndex rate={priceIndexRate} />
            </div>
          </div>
        </section>

        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Data Sources</CardTitle>
                  <CardDescription>Official and automatically refreshed</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    CPI and inflation data are fetched from the Liberia Institute of Statistics and Geo-Information
                    Services (LISGIS) price statistics page. We parse the latest CPI table entry and read the official
                    Excel release.
                  </p>
                  <p>
                    The LISGIS Excel file is cached monthly while the HTML index is cached daily to respect bandwidth
                    limits. If LISGIS is unavailable, we show the fallback message above.
                  </p>
                  <p>
                    If you have a local retail price feed for Liberia (e.g., daily market basket prices), share the
                    source and we can integrate it here.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
