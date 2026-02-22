/**
 * Cost of living index module – types for aggregation, affordability, FX comparison, dashboard.
 */

/** Single price point (aligns with commodity-engine). */
export interface PricePoint {
  date: string
  value: number
}

/** One day's aggregated basket: sum and equal-weight average of commodity prices. */
export interface BasketDay {
  date: string
  /** Sum of prices in basket (LRD). */
  basketSum: number
  /** Equal-weight average (LRD). */
  basketAvg: number
  /** Number of commodities with data. */
  itemCount: number
  /** Per-commodity prices. */
  prices: Array<{ commodityId: string; commodityName: string; value: number }>
}

/** Time series of aggregated basket for charts. */
export type AggregatedBasketSeries = BasketDay[]

/** Cost of living index (base period = 100). */
export interface CostOfLivingIndexSnapshot {
  index: number
  baseDate: string
  currentDate: string
  periodDays: number
  basket: Array<{
    commodityId: string
    commodityName: string
    weight: number
    price: number
    contribution: number
  }>
}

/** Affordability index: 100 = base period; higher = more affordable, lower = less. */
export interface AffordabilityIndex {
  /** Index value (100 = same as base). */
  index: number
  baseDate: string
  currentDate: string
  /** Basket average at base (LRD). */
  baseBasketAvg: number
  /** Basket average at current (LRD). */
  currentBasketAvg: number
  /** Interpretation label. */
  label: "much_more_affordable" | "more_affordable" | "stable" | "less_affordable" | "much_less_affordable"
}

/** Exchange rate trend vs cost of living. */
export interface ExchangeRateTrend {
  date: string
  rate: number
  /** LRD per USD. */
}

/** Aligned pair for comparison (same dates). */
export interface ColVsFxPoint {
  date: string
  /** Basket average (LRD) or COL index. */
  colValue: number
  /** FX rate (LRD/USD). */
  fxRate: number
}

/** Comparison of cost of living with exchange rate trends. */
export interface ColVsExchangeRateComparison {
  /** Aligned time series for charts. */
  alignedSeries: ColVsFxPoint[]
  /** COL change over period (%). */
  colPercentChange: number
  /** FX rate change over period (%). */
  fxPercentChange: number
  /** Pearson correlation (COL level vs FX level). */
  correlation: number
  /** Short interpretation. */
  interpretation: "col_rising_faster" | "fx_rising_faster" | "similar_trends" | "weak_relationship"
  periodDays: number
}

/** Full dashboard payload for cost of living. */
export interface CostOfLivingDashboard {
  /** Aggregated commodity prices over time. */
  aggregatedPrices: AggregatedBasketSeries
  /** Cost of living index (base = 100). */
  costOfLivingIndex: CostOfLivingIndexSnapshot | null
  /** Affordability index (100 = base). */
  affordabilityIndex: AffordabilityIndex | null
  /** COL vs exchange rate comparison. */
  exchangeRateComparison: ColVsExchangeRateComparison | null
  /** Base date used. */
  baseDate: string
  /** Current/latest date. */
  currentDate: string
  /** Query/options used. */
  periodDays: number
  computedAt: string
}
