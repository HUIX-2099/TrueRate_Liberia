/**
 * Data provider for trade analytics (import volumes, values).
 * Use TRADE_ANALYTICS_IMPORT_API_URL to point at your ingestion/DB API.
 */

import type { ImportRecord } from "./types"

const DEFAULT_PERIODS = 24 // e.g. 24 months

/** Fetch import/trade records. Replace with DB or external API when available. */
export async function getImportRecords(options: {
  periods?: number
  category?: string
  originCountry?: string
} = {}): Promise<ImportRecord[]> {
  const periods = options.periods ?? DEFAULT_PERIODS
  const apiUrl = process.env.TRADE_ANALYTICS_IMPORT_API_URL
  if (apiUrl) {
    try {
      const url = new URL(apiUrl)
      url.searchParams.set("periods", String(periods))
      if (options.category) url.searchParams.set("category", options.category)
      if (options.originCountry) url.searchParams.set("originCountry", options.originCountry)
      const res = await fetch(url.toString(), { next: { revalidate: 300 } })
      if (res.ok) {
        const data = (await res.json()) as { records?: ImportRecord[] }
        return (data.records ?? []).map(normalizeRecord)
      }
    } catch {
      // fall through to sample
    }
  }
  return generateSampleImportRecords(periods)
}

function normalizeRecord(r: Record<string, unknown>): ImportRecord {
  return {
    period: String(r.period ?? r.period_start ?? ""),
    productCategory: String(r.productCategory ?? r.product_category ?? r.category ?? "Unknown"),
    originCountry: r.originCountry ?? r.origin_country ? String(r.origin_country ?? r.originCountry) : undefined,
    volume: Number(r.volume ?? r.import_volume ?? 0),
    valueUsd: r.valueUsd ?? r.value_usd != null ? Number(r.value_usd ?? r.valueUsd) : undefined,
    valueLocal: r.valueLocal ?? r.value_local != null ? Number(r.value_local ?? r.valueLocal) : undefined,
  }
}

/** Generate sample import records for demo. */
function generateSampleImportRecords(periods: number): ImportRecord[] {
  const records: ImportRecord[] = []
  const categories = [
    { id: "rice", name: "Rice" },
    { id: "palm-oil", name: "Palm Oil" },
    { id: "cement", name: "Cement" },
    { id: "machinery", name: "Machinery" },
  ]
  const origins = ["US", "CN", "IN", "LR"]
  const end = new Date()
  for (let i = 0; i < periods; i++) {
    const d = new Date(end)
    d.setMonth(d.getMonth() - (periods - 1 - i))
    const period = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    for (const cat of categories) {
      const vol = 5000 + Math.random() * 15000 + (i * 80) + (cat.id === "rice" ? 2000 : 0)
      records.push({
        period,
        productCategory: cat.name,
        originCountry: origins[i % origins.length],
        volume: Math.round(vol * 100) / 100,
        valueUsd: Math.round(vol * 0.8 * 100) / 100,
        valueLocal: Math.round(vol * 0.8 * 185 * 100) / 100,
      })
    }
  }
  return records
}
