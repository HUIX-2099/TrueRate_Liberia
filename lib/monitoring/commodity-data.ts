/**
 * Data provider for commodity price monitoring.
 * Commodity series: plug in your DB or MONITORING_COMMODITY_API_URL.
 * FX series: uses CBL historical rates from existing lib.
 * Monitored commodities align with the Liberia Price Index basket (market risk, COL, affordability).
 */

import type { PricePoint } from "./commodity-engine/types"
import { fetchCblHistoricalRates } from "@/lib/cbl-rates"
import { getPriceIndexBasketForMonitoring } from "@/lib/price-index/basket"

const DEFAULT_DAYS = 90

export interface CommoditySeriesResult {
  commodityId: string
  commodityName: string
  series: PricePoint[]
  /** True when data comes from crowd-sourced DB submissions. */
  isLive: boolean
  /** True when no real data source is configured — callers should show a disclaimer. */
  isIndicative: boolean
}

/** Fetch commodity price history. Returns live data when configured, otherwise indicative sample data. */
export async function getCommodityPriceSeries(
  options: { commodityId?: string; commodityName?: string; days?: number } = {}
): Promise<CommoditySeriesResult> {
  const days = options.days ?? DEFAULT_DAYS
  const commodityId = options.commodityId ?? "default"
  const commodityName = options.commodityName ?? "Rice"

  // 1. Try external monitoring API (MONITORING_COMMODITY_API_URL)
  const apiUrl = process.env.MONITORING_COMMODITY_API_URL
  if (apiUrl) {
    try {
      const url = new URL(apiUrl)
      url.searchParams.set("days", String(days))
      if (options.commodityId) url.searchParams.set("commodityId", options.commodityId)
      const res = await fetch(url.toString(), { next: { revalidate: 300 } })
      if (res.ok) {
        const data = (await res.json()) as {
          commodityId?: string
          commodityName?: string
          series?: Array<{ date: string; value: number }>
        }
        const series: PricePoint[] = (data.series ?? []).map((p) => ({
          date: p.date,
          value: Number(p.value),
        }))
        return {
          commodityId: data.commodityId ?? commodityId,
          commodityName: data.commodityName ?? commodityName,
          series: series.sort((a, b) => a.date.localeCompare(b.date)),
          isLive: true,
          isIndicative: false,
        }
      }
    } catch {
      // fall through to DB
    }
  }

  // 2. Try crowd-sourced submissions from DB (MarketPriceSubmission)
  try {
    const { getPrismaClient } = await import("@/lib/db/prisma")
    const prisma = getPrismaClient()
    if (prisma) {
      const since = new Date()
      since.setDate(since.getDate() - days)
      const submissions = await (prisma as any).marketPriceSubmission.findMany({
        where: {
          item: { contains: commodityName, mode: "insensitive" },
          recordedAt: { gte: since },
        },
        orderBy: { recordedAt: "asc" },
        select: { recordedAt: true, price: true },
      })
      if (submissions.length >= 3) {
        const series: PricePoint[] = submissions.map((s: { recordedAt: Date; price: { toNumber: () => number } }) => ({
          date: s.recordedAt.toISOString().slice(0, 10),
          value: s.price.toNumber(),
        }))
        return { commodityId, commodityName, series, isLive: true, isIndicative: false }
      }
    }
  } catch {
    // fall through to indicative data
  }

  // 3. No real data — return indicative sample data with clear flag
  const series = generateSampleCommoditySeries(days)
  return { commodityId, commodityName, series, isLive: false, isIndicative: true }
}

/** Generate sample commodity series (e.g. rice LRD per bag) for demo. */
function generateSampleCommoditySeries(days: number): PricePoint[] {
  const points: PricePoint[] = []
  const base = 4200
  let v = base
  const start = new Date()
  start.setDate(start.getDate() - days)
  for (let i = 0; i < days; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    v = v + (Math.random() - 0.48) * 80
    if (v < base * 0.7) v = base * 0.7
    if (v > base * 1.4) v = base * 1.4
    points.push({
      date: d.toISOString().slice(0, 10),
      value: Math.round(v * 100) / 100,
    })
  }
  return points.sort((a, b) => a.date.localeCompare(b.date))
}

/** Fetch USD/LRD exchange rate history (CBL or fallback). */
export async function getExchangeRateSeries(days: number = DEFAULT_DAYS): Promise<PricePoint[]> {
  try {
    const cbl = await fetchCblHistoricalRates(days)
    if (cbl.historical.length > 0) {
      return cbl.historical.map((p) => ({ date: p.date, value: p.rate }))
    }
  } catch {
    // fallback below
  }
  const { generateHistoricalData } = await import("@/lib/api/multi-source-rates")
  const fallback = generateHistoricalData(days)
  return fallback.map((p) => ({ date: p.date, value: p.rate }))
}

/** List of commodity identifiers to monitor. Aligned with Price Index basket (COL, market risk, affordability). */
export function getMonitoredCommodities(): Array<{ id: string; name: string }> {
  const env = process.env.MONITORING_COMMODITIES
  if (env) {
    try {
      const list = JSON.parse(env) as Array<{ id: string; name: string }>
      if (Array.isArray(list) && list.length > 0) return list
    } catch {
      // ignore
    }
  }
  return getPriceIndexBasketForMonitoring()
}
