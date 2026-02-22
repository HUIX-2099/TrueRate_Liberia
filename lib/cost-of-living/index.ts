export { aggregateCommodityPrices } from "./aggregate"
export type { CommoditySeriesInput } from "./aggregate"
export { computeAffordabilityIndex } from "./affordability"
export { compareWithExchangeRateTrends } from "./fx-comparison"
export { buildCostOfLivingDashboard } from "./dashboard"
export type { CostOfLivingDashboardOptions, CommoditySeriesItem } from "./dashboard"
export type {
  PricePoint,
  BasketDay,
  AggregatedBasketSeries,
  CostOfLivingIndexSnapshot,
  AffordabilityIndex,
  ExchangeRateTrend,
  ColVsFxPoint,
  ColVsExchangeRateComparison,
  CostOfLivingDashboard,
} from "./types"
