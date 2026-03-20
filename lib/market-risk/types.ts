/**
 * Market risk engine – input/output types.
 * Inputs: commodity volatility, supply changes, import volume changes, market demand.
 * Outputs: market risk score, price stability index.
 */

/** Commodity price volatility input (e.g. from commodity-engine volatility or CV). */
export interface CommodityPriceVolatility {
  /** Period identifier (e.g. 2025-01 or latest). */
  period?: string
  /** Average volatility over the period (e.g. coefficient of variation %). Higher = riskier. */
  averageVolatilityPercent: number
  /** Optional: max single-point volatility in period. */
  maxVolatilityPercent?: number
  /** Optional: number of commodities/series used. */
  seriesCount?: number
}

/** Supply change input (period-over-period or index). */
export interface SupplyChange {
  period: string
  /** Period-over-period change in supply (%). Negative = contraction. */
  changePercent: number
  /** Optional category/commodity. */
  category?: string
}

/** Import volume change input (from trade analytics). */
export interface ImportVolumeChange {
  period: string
  /** Period-over-period change in import volume (%). */
  changePercent: number
  /** Optional total volume in period. */
  totalVolume?: number
  /** Optional per-category changes. */
  byCategory?: Array<{ category: string; changePercent: number }>
}

/** Market demand input (scores and/or patterns from trade analytics). */
export interface MarketDemandInput {
  period?: string
  /** Demand score 0–100 (e.g. from generateMarketDemandScore). */
  demandScore: number
  /** Trend strength -1 to 1 (negative = falling, positive = rising). */
  trendStrength?: number
  /** Label: low | moderate | high | very_high. */
  label?: "low" | "moderate" | "high" | "very_high"
  /** Optional: demand volatility / stability (0–1, higher = more stable). */
  demandStability?: number
}

/** All inputs for the market risk engine. */
export interface MarketRiskInputs {
  commodityPriceVolatility: CommodityPriceVolatility
  supplyChanges: SupplyChange[]
  importVolumeChanges: ImportVolumeChange[]
  marketDemandData: MarketDemandInput
}

/** Drivers contributing to market risk score (0–1 each, for transparency). */
export interface MarketRiskDrivers {
  /** Contribution from commodity price volatility. */
  volatilityContribution: number
  /** Contribution from supply shocks (contraction = risk). */
  supplyContribution: number
  /** Contribution from import volume swings (drops = risk). */
  importVolumeContribution: number
  /** Contribution from demand stress (extreme or unstable demand). */
  demandContribution: number
}

/** Result of the market risk engine. */
export interface MarketRiskResult {
  /** Market risk score 0–100. Higher = greater market risk. */
  marketRiskScore: number
  /** Price stability index 0–100. Higher = more stable prices. */
  priceStabilityIndex: number
  /** Period these metrics refer to. */
  period: string
  /** Optional risk label. */
  riskLabel: "low" | "moderate" | "elevated" | "high" | "critical"
  /** Optional breakdown of risk drivers (0–1). */
  drivers?: MarketRiskDrivers
  /** Computed at. */
  computedAt: string
}
