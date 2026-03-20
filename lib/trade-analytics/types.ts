/** Single import/trade record (period-level). */
export interface ImportRecord {
  period: string // e.g. 2025-01, 2025-Q1
  productCategory: string
  originCountry?: string
  volume: number
  valueUsd?: number
  valueLocal?: number
}

/** Aggregated import volume analysis. */
export interface ImportVolumeAnalysis {
  period: string
  totalVolume: number
  totalValueUsd?: number
  totalValueLocal?: number
  byCategory: Array<{ category: string; volume: number; sharePercent: number }>
  byOrigin?: Array<{ country: string; volume: number; sharePercent: number }>
  recordCount: number
}

/** Detected demand pattern. */
export interface DemandPattern {
  category: string
  pattern: "rising" | "falling" | "stable" | "seasonal"
  trendStrength: number // -1 to 1
  growthRatePercent?: number // period-over-period
  seasonalPeakMonth?: number // 1-12 if seasonal
  confidence: number // 0-1
}

/** Market demand score (0-100). */
export interface MarketDemandScore {
  score: number
  period: string
  category?: string // optional: per-category score
  drivers: {
    volumeLevel: number // normalized 0-1
    trendDirection: number // -1 to 1
    growthRate: number // normalized
    volatility: number // inverse: stable = higher contribution
  }
  label: "low" | "moderate" | "high" | "very_high"
}

/** Forex pressure forecast. */
export interface ForexPressureForecast {
  period: string
  pressureIndex: number // 0-100, higher = more pressure on LRD
  importBillUsd: number
  importBillLocal?: number
  fxRateUsed?: number
  outlook: "easing" | "stable" | "building" | "high"
  narrative: string
  contributingFactors: string[]
}

/** Stored historical trend snapshot. */
export interface HistoricalTrendSnapshot {
  id: string
  recordedAt: string // ISO
  period: string
  summary: {
    totalVolume: number
    demandScore: number
    forexPressureIndex: number
    topCategory?: string
  }
  byCategory: Array<{
    category: string
    volume: number
    demandScore: number
    pattern: string
  }>
}
