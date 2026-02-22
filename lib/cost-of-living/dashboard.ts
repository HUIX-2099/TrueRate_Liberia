import type {
  CostOfLivingDashboard,
  CostOfLivingIndexSnapshot,
  AffordabilityIndex,
} from "./types"
import { aggregateCommodityPrices } from "./aggregate"
import { computeAffordabilityIndex } from "./affordability"
import { compareWithExchangeRateTrends } from "./fx-comparison"
import { computeCostOfLivingIndex } from "@/lib/monitoring/commodity-engine/cost-of-living"
import type { PricePoint } from "@/lib/monitoring/commodity-engine/types"

export interface CostOfLivingDashboardOptions {
  /** Number of days of history. */
  days?: number
  /** Base date for index (YYYY-MM-DD). If omitted, first date in range. */
  baseDate?: string
}

/** Input: list of commodity series (e.g. from getCommodityPriceSeries). */
export interface CommoditySeriesItem {
  commodityId: string
  commodityName: string
  series: PricePoint[]
}

/**
 * Build full cost-of-living dashboard data from commodity and FX series.
 * Caller is responsible for fetching series (e.g. via getCommodityPriceSeries, getExchangeRateSeries).
 */
export function buildCostOfLivingDashboard(
  commoditySeriesList: CommoditySeriesItem[],
  fxSeries: Array<{ date: string; value: number }>,
  options: CostOfLivingDashboardOptions = {}
): CostOfLivingDashboard {
  const days = options.days ?? 90
  const baseDate = options.baseDate ?? ""

  const aggregatedPrices = aggregateCommodityPrices(commoditySeriesList)
  const colResult = computeCostOfLivingIndex(commoditySeriesList, { baseDate: baseDate || undefined })

  let costOfLivingIndex: CostOfLivingIndexSnapshot | null = null
  let affordabilityIndex: AffordabilityIndex | null = null
  if (colResult) {
    costOfLivingIndex = {
      index: colResult.index,
      baseDate: colResult.baseDate,
      currentDate: colResult.currentDate,
      periodDays: colResult.periodDays,
      basket: colResult.basket,
    }
    const baseBasketAvg =
      aggregatedPrices.find((d) => d.date === colResult.baseDate)?.basketAvg ?? aggregatedPrices[0]?.basketAvg ?? 0
    const currentBasketAvg =
      aggregatedPrices.find((d) => d.date === colResult.currentDate)?.basketAvg ??
      aggregatedPrices[aggregatedPrices.length - 1]?.basketAvg ??
      0
    affordabilityIndex = computeAffordabilityIndex(
      baseBasketAvg,
      currentBasketAvg,
      colResult.baseDate,
      colResult.currentDate
    )
  }

  const exchangeRateComparison = compareWithExchangeRateTrends(aggregatedPrices, fxSeries, {
    baseBasketAvg: aggregatedPrices[0]?.basketAvg,
  })

  const currentDate = aggregatedPrices.length > 0 ? aggregatedPrices[aggregatedPrices.length - 1].date : ""
  const effectiveBaseDate = costOfLivingIndex?.baseDate ?? aggregatedPrices[0]?.date ?? ""

  return {
    aggregatedPrices,
    costOfLivingIndex,
    affordabilityIndex,
    exchangeRateComparison,
    baseDate: effectiveBaseDate,
    currentDate,
    periodDays: days,
    computedAt: new Date().toISOString(),
  }
}
