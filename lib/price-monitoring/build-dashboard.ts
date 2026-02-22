/**
 * Build price monitoring dashboard: essential commodity prices, COL index, FX correlation.
 */

import { getCommodityPriceSeries, getMonitoredCommodities, getExchangeRateSeries } from "@/lib/monitoring/commodity-data"
import { buildCostOfLivingDashboard } from "@/lib/cost-of-living"
import { ESSENTIAL_COMMODITIES, getEssentialSourceIds, DEFAULT_ESSENTIAL_PRICES } from "./essential-commodities"
import type {
  PriceMonitoringDashboard,
  EssentialCommodityPrice,
  FxCorrelationSummary,
} from "./types"

const DEFAULT_DAYS = 90

/** Get latest price for a source (from series or default). */
async function getSourcePrice(sourceId: string, days: number): Promise<{ price: number; date: string; min?: number; max?: number }> {
  const monitored = getMonitoredCommodities()
  const found = monitored.find((c) => c.id === sourceId)
  const defaultPrice = DEFAULT_ESSENTIAL_PRICES[sourceId] ?? 1000
  if (found) {
    try {
      const { series } = await getCommodityPriceSeries({
        commodityId: found.id,
        commodityName: found.name,
        days,
      })
      if (series.length > 0) {
        const sorted = [...series].sort((a, b) => b.date.localeCompare(a.date))
        const latest = sorted[0]!
        const values = series.map((p) => p.value).filter((v) => Number.isFinite(v))
        return {
          price: latest.value,
          date: latest.date,
          min: values.length ? Math.min(...values) : undefined,
          max: values.length ? Math.max(...values) : undefined,
        }
      }
    } catch {
      // fall through
    }
  }
  const today = new Date().toISOString().slice(0, 10)
  return { price: defaultPrice, date: today }
}

/** Build essential commodity prices list. */
async function buildEssentialPrices(days: number): Promise<EssentialCommodityPrice[]> {
  const sourcePrices = new Map<string, { price: number; date: string; min?: number; max?: number }>()
  const sourceIds = getEssentialSourceIds()
  await Promise.all(
    sourceIds.map(async (id) => {
      const p = await getSourcePrice(id, days)
      sourcePrices.set(id, p)
    })
  )
  const out: EssentialCommodityPrice[] = []
  for (const item of ESSENTIAL_COMMODITIES) {
    const src = sourcePrices.get(item.sourceId)
    const base = src?.price ?? DEFAULT_ESSENTIAL_PRICES[item.sourceId] ?? 1000
    const mult = item.sourceMultiplier ?? 1
    const price = Number((base * mult).toFixed(2))
    out.push({
      id: item.id,
      name: item.name,
      unit: item.unit,
      price,
      currency: "LRD",
      date: src?.date ?? new Date().toISOString().slice(0, 10),
      category: item.category,
      minPrice: src?.min != null ? Number((src.min * mult).toFixed(2)) : undefined,
      maxPrice: src?.max != null ? Number((src.max * mult).toFixed(2)) : undefined,
    })
  }
  return out
}

/** Build FX correlation summary from COL dashboard. */
function buildFxCorrelation(
  colIndex: number | null,
  baseDate: string | null,
  fxSeries: Array<{ date: string; value: number }>,
  aggregatedPrices: Array<{ date: string; basketAvg: number }>
): FxCorrelationSummary | null {
  if (aggregatedPrices.length < 2 || fxSeries.length < 2) return null
  const byDateBasket = new Map(aggregatedPrices.map((b) => [b.date, b.basketAvg]))
  const byDateFx = new Map(fxSeries.map((p) => [p.date, p.value]))
  const dates = [...byDateBasket.keys()].filter((d) => byDateFx.has(d)).sort()
  if (dates.length < 2) return null
  const basketValues = dates.map((d) => byDateBasket.get(d)!)
  const fxValues = dates.map((d) => byDateFx.get(d)!)
  const firstB = basketValues[0]!
  const lastB = basketValues[basketValues.length - 1]!
  const firstF = fxValues[0]!
  const lastF = fxValues[fxValues.length - 1]!
  const basketPct = firstB !== 0 ? (((lastB - firstB) / firstB) * 100) : 0
  const fxPct = firstF !== 0 ? (((lastF - firstF) / firstF) * 100) : 0
  const n = basketValues.length
  const sumB = basketValues.reduce((a, b) => a + b, 0)
  const sumF = fxValues.reduce((a, b) => a + b, 0)
  const sumBF = basketValues.reduce((acc, b, i) => acc + b * fxValues[i]!, 0)
  const sumB2 = basketValues.reduce((a, b) => a + b * b, 0)
  const sumF2 = fxValues.reduce((a, b) => a + b * b, 0)
  const num = n * sumBF - sumB * sumF
  const den = Math.sqrt((n * sumB2 - sumB * sumB) * (n * sumF2 - sumF * sumF))
  const correlation = den === 0 ? 0 : num / den
  let interpretation = "Weak relationship between basket prices and LRD/USD in this period."
  if (Math.abs(correlation) >= 0.5) {
    interpretation =
      correlation > 0
        ? "Basket prices tend to move with LRD/USD — a weaker LRD is associated with higher local commodity costs."
        : "Basket prices and LRD/USD moved in opposite directions in this period."
  }
  return {
    correlation: Number(correlation.toFixed(4)),
    interpretation,
    period: `${dates[0]} to ${dates[dates.length - 1]}`,
    basketPercentChange: Number(basketPct.toFixed(2)),
    fxPercentChange: Number(fxPct.toFixed(2)),
  }
}

/** Build full price monitoring dashboard. */
export async function buildPriceMonitoringDashboard(days: number = DEFAULT_DAYS): Promise<PriceMonitoringDashboard> {
  const commodities = getMonitoredCommodities()
  const [essentialPrices, commoditySeriesList, fxSeries] = await Promise.all([
    buildEssentialPrices(days),
    Promise.all(
      commodities.map((c) =>
        getCommodityPriceSeries({ commodityId: c.id, commodityName: c.name, days })
      )
    ),
    getExchangeRateSeries(days),
  ])
  const colDashboard = buildCostOfLivingDashboard(commoditySeriesList, fxSeries, { days })
  const fxCorrelation = buildFxCorrelation(
    colDashboard.costOfLivingIndex?.index ?? null,
    colDashboard.costOfLivingIndex?.baseDate ?? null,
    fxSeries,
    colDashboard.aggregatedPrices
  )
  const period = colDashboard.aggregatedPrices.length > 0
    ? `${colDashboard.aggregatedPrices[0]?.date ?? ""} to ${colDashboard.aggregatedPrices[colDashboard.aggregatedPrices.length - 1]?.date ?? ""}`
    : ""
  return {
    essentialPrices,
    costOfLivingIndex: colDashboard.costOfLivingIndex?.index ?? null,
    costOfLivingBaseDate: colDashboard.costOfLivingIndex?.baseDate ?? null,
    fxCorrelation,
    period,
    timestamp: new Date().toISOString(),
    useCases: [
      "Correlate LRD/USD rate with commodity prices",
      "Build a Cost of Living Index",
      "Show how exchange rates affect daily life in Monrovia",
      "Strengthen fintech analytics dashboard",
    ],
  }
}
