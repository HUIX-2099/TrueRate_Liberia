/**
 * Build market input data from trade analytics and commodity data.
 * Uses live data when APIs are configured; otherwise returns fixture data.
 */

import { getImportRecords } from "@/lib/trade-analytics/data"
import { analyzeImportVolumes } from "@/lib/trade-analytics/import-volumes"
import { getMonitoredCommodities } from "@/lib/monitoring/commodity-data"
import { getCommodityPriceSeries } from "@/lib/monitoring/commodity-data"
import type {
  MarketInputData,
  ImportVolumeByCategorySummary,
  MajorImporter,
  WholesalePricingBenchmark,
  TradeFlowTrend,
  CommodityAvailabilityReport,
} from "./types"

const DEFAULT_PERIODS = 12

/** Build import volume by category from trade records. */
async function buildImportVolumeByCategory(): Promise<ImportVolumeByCategorySummary> {
  const records = await getImportRecords({ periods: 6 })
  const analysis = analyzeImportVolumes(records)
  const latest = analysis[analysis.length - 1]
  if (!latest) {
    return {
      period: new Date().toISOString().slice(0, 7),
      byCategory: [],
      totalVolume: 0,
    }
  }
  const totalVolume = latest.totalVolume || 1
  return {
    period: latest.period,
    byCategory: latest.byCategory.map((c) => ({
      category: c.category,
      volume: c.volume,
      unit: "MT",
      sharePercent: c.sharePercent,
      period: latest.period,
      valueUsd: latest.totalValueUsd ? (c.volume / totalVolume) * latest.totalValueUsd : undefined,
      valueLocal: latest.totalValueLocal ? (c.volume / totalVolume) * latest.totalValueLocal : undefined,
    })),
    totalVolume: latest.totalVolume,
    totalValueUsd: latest.totalValueUsd,
    totalValueLocal: latest.totalValueLocal,
  }
}

/** Build major importing companies (fixture when no company-level API). */
async function buildMajorImporters(): Promise<MajorImporter[]> {
  const records = await getImportRecords({ periods: 6 })
  const totalVolume = records.reduce((s, r) => s + r.volume, 0) || 1
  // Fixture: simulate top importers by category share
  const byCategory = new Map<string, number>()
  for (const r of records) {
    byCategory.set(r.productCategory, (byCategory.get(r.productCategory) ?? 0) + r.volume)
  }
  const period = new Date().toISOString().slice(0, 7)
  const fixtureNames = [
    "Liberian Trading Co.",
    "Monrovia Grain & Commodities",
    "Atlantic Imports Ltd.",
    "West Africa Supply Co.",
    "Liberia Agri-Trade",
  ]
  const sorted = [...byCategory.entries()].sort((a, b) => b[1] - a[1])
  return fixtureNames.slice(0, 5).map((name, i) => {
    const cat = sorted[i % sorted.length]
    const vol = (cat?.[1] ?? totalVolume * 0.2) * (1 - i * 0.12)
    return {
      name,
      category: cat?.[0],
      volumeSharePercent: Number(((vol / totalVolume) * 100).toFixed(2)),
      valueUsd: vol * 0.8,
      valueLocal: vol * 0.8 * 185,
      period,
      rank: i + 1,
    }
  })
}

/** Build wholesale pricing benchmarks from commodity series or fixture. */
async function buildWholesaleBenchmarks(): Promise<WholesalePricingBenchmark[]> {
  const commodities = getMonitoredCommodities()
  const period = new Date().toISOString().slice(0, 7)
  const defaults: Record<string, { unit: string; low: number; high: number }> = {
    rice: { unit: "bag (25kg)", low: 4200, high: 5200 },
    "palm-oil": { unit: "gallon", low: 850, high: 1200 },
    cement: { unit: "bag (50kg)", low: 3200, high: 4000 },
  }
  const out: WholesalePricingBenchmark[] = []
  for (const c of commodities) {
    try {
      const { series } = await getCommodityPriceSeries({ commodityId: c.id, commodityName: c.name, days: 30 })
      const values = series.map((p) => p.value).filter((v) => Number.isFinite(v))
      const benchmarkPrice = values.length ? values[values.length - 1]! : (defaults[c.id]?.low ?? 1000) + (defaults[c.id]?.high ?? 1500) / 2
      const minPrice = values.length ? Math.min(...values) : undefined
      const maxPrice = values.length ? Math.max(...values) : undefined
      out.push({
        commodityId: c.id,
        commodityName: c.name,
        unit: defaults[c.id]?.unit ?? "unit",
        benchmarkPrice: Number(benchmarkPrice.toFixed(2)),
        currency: "LRD",
        period,
        source: "commodity_series",
        minPrice: minPrice != null ? Number(minPrice.toFixed(2)) : undefined,
        maxPrice: maxPrice != null ? Number(maxPrice.toFixed(2)) : undefined,
      })
    } catch {
      const d = defaults[c.id]
      const mid = d ? (d.low + d.high) / 2 : 1000
      out.push({
        commodityId: c.id,
        commodityName: c.name,
        unit: d?.unit ?? "unit",
        benchmarkPrice: Number(mid.toFixed(2)),
        currency: "LRD",
        period,
        source: "fixture",
        minPrice: d?.low,
        maxPrice: d?.high,
      })
    }
  }
  return out
}

/** Build trade flow trends from volume analysis. */
async function buildTradeFlowTrends(): Promise<TradeFlowTrend[]> {
  const records = await getImportRecords({ periods: DEFAULT_PERIODS })
  const analysis = analyzeImportVolumes(records)
  const out: TradeFlowTrend[] = []
  for (let i = 1; i < analysis.length; i++) {
    const prev = analysis[i - 1]!
    const curr = analysis[i]!
    const changePercent = prev.totalVolume > 0
      ? Number((((curr.totalVolume - prev.totalVolume) / prev.totalVolume) * 100).toFixed(2))
      : 0
    const topCat = curr.byCategory.sort((a, b) => b.volume - a.volume)[0]
    out.push({
      period: curr.period,
      direction: changePercent > 2 ? "up" : changePercent < -2 ? "down" : "stable",
      changePercent,
      totalVolume: curr.totalVolume,
      topCategory: topCat?.category ?? "—",
      narrative: changePercent > 5 ? "Imports increased vs prior period." : changePercent < -5 ? "Imports decreased vs prior period." : undefined,
    })
  }
  return out.slice(-6)
}

/** Build commodity availability reports (fixture based on categories). */
async function buildCommodityAvailability(): Promise<CommodityAvailabilityReport[]> {
  const commodities = getMonitoredCommodities()
  const period = new Date().toISOString().slice(0, 7)
  const availabilityList: Array<"high" | "adequate" | "tight" | "shortage"> = ["high", "adequate", "adequate", "tight"]
  return commodities.map((c, i) => ({
    commodityId: c.id,
    commodityName: c.name,
    category: "food",
    availability: availabilityList[i % availabilityList.length]!,
    period,
    indicatorValue: 70 + (i % 3) * 10,
    narrative: undefined,
  }))
}

/** Build full market input data. */
export async function buildMarketInputData(): Promise<MarketInputData> {
  const [importVolumeByCategory, majorImporters, wholesaleBenchmarks, tradeFlowTrends, commodityAvailability] =
    await Promise.all([
      buildImportVolumeByCategory(),
      buildMajorImporters(),
      buildWholesaleBenchmarks(),
      buildTradeFlowTrends(),
      buildCommodityAvailability(),
    ])
  return {
    importVolumeByCategory,
    majorImporters,
    wholesaleBenchmarks,
    tradeFlowTrends,
    commodityAvailability,
    timestamp: new Date().toISOString(),
  }
}
