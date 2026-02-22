/**
 * Types for market input data: import volume by category, major importers,
 * wholesale benchmarks, trade flow trends, commodity availability.
 */

/** Import volume by product category (e.g. rice, cement, fuel). */
export interface ImportVolumeByCategory {
  category: string
  volume: number
  unit: string
  sharePercent: number
  period: string
  valueUsd?: number
  valueLocal?: number
}

/** Aggregated view of volume by category for a period or latest. */
export interface ImportVolumeByCategorySummary {
  period: string
  byCategory: ImportVolumeByCategory[]
  totalVolume: number
  totalValueUsd?: number
  totalValueLocal?: number
}

/** Major importing company (or consignee). */
export interface MajorImporter {
  name: string
  category?: string
  volumeSharePercent: number
  valueUsd?: number
  valueLocal?: number
  period: string
  rank: number
}

/** Wholesale pricing benchmark (e.g. per MT, per gallon). */
export interface WholesalePricingBenchmark {
  commodityId: string
  commodityName: string
  unit: string
  benchmarkPrice: number
  currency: string
  period: string
  source: string
  minPrice?: number
  maxPrice?: number
}

/** Trade flow trend (direction and magnitude). */
export interface TradeFlowTrend {
  period: string
  direction: "up" | "down" | "stable"
  changePercent: number
  totalVolume: number
  topCategory: string
  narrative?: string
}

/** Commodity availability (in-stock / supply indicator). */
export interface CommodityAvailabilityReport {
  commodityId: string
  commodityName: string
  category: string
  availability: "high" | "adequate" | "tight" | "shortage"
  period: string
  indicatorValue?: number
  narrative?: string
}

/** Combined market input data payload. */
export interface MarketInputData {
  importVolumeByCategory: ImportVolumeByCategorySummary
  majorImporters: MajorImporter[]
  wholesaleBenchmarks: WholesalePricingBenchmark[]
  tradeFlowTrends: TradeFlowTrend[]
  commodityAvailability: CommodityAvailabilityReport[]
  timestamp: string
}
