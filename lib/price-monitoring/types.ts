/**
 * Price monitoring data for essential commodities (Ministry-monitored).
 * Use cases: correlate LRD/USD with commodity prices, Cost of Living Index,
 * show how exchange rates affect daily life in Monrovia, fintech analytics.
 */

/** A single essential commodity line (e.g. Rice 25kg, Rice 50kg, Cooking oil). */
export interface EssentialCommodityItem {
  id: string
  name: string
  unit: string
  /** Links to data source (e.g. rice, palm-oil). Multiple items can share source (e.g. rice 25kg and 50kg). */
  sourceId: string
  /** Multiplier from source series (e.g. 2 for 50kg from 25kg-equivalent). */
  sourceMultiplier?: number
  category: "food" | "energy" | "construction" | "other"
}

/** Current/latest price for an essential commodity. */
export interface EssentialCommodityPrice {
  id: string
  name: string
  unit: string
  price: number
  currency: string
  date: string
  category: string
  /** Optional: min/max over the period. */
  minPrice?: number
  maxPrice?: number
}

/** Summary of how LRD/USD correlates with commodity basket (for dashboard). */
export interface FxCorrelationSummary {
  correlation: number
  interpretation: string
  period: string
  basketPercentChange: number
  fxPercentChange: number
}

/** Full price monitoring dashboard payload. */
export interface PriceMonitoringDashboard {
  essentialPrices: EssentialCommodityPrice[]
  costOfLivingIndex: number | null
  costOfLivingBaseDate: string | null
  fxCorrelation: FxCorrelationSummary | null
  period: string
  timestamp: string
  useCases: string[]
}
