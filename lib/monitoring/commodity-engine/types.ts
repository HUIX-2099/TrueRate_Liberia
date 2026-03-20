/** Single price point in a time series */
export interface PricePoint {
  date: string // YYYY-MM-DD
  value: number
}

/** Trend analysis result */
export interface TrendResult {
  commodityId: string
  commodityName: string
  direction: "up" | "down" | "stable"
  slope: number // per-day change
  slopePercent: number // approximate % change over period
  movingAvg: number
  periodDays: number
  dataPoints: number
  latestDate: string
  latestValue: number
}

/** Detected price spike event */
export interface SpikeEvent {
  date: string
  value: number
  previousValue: number
  changePercent: number
  zScore?: number
  threshold: "percent" | "zscore"
  commodityId: string
  commodityName: string
}

/** Correlation between commodity price and exchange rate (e.g. LRD/USD) */
export interface CorrelationResult {
  commodityId: string
  commodityName: string
  correlation: number // Pearson -1 to 1
  periodDays: number
  overlappingPoints: number
  interpretation: "strong_positive" | "weak_positive" | "none" | "weak_negative" | "strong_negative"
}

/** Alert severity and type */
export type AlertSeverity = "info" | "warning" | "critical"
export type AlertType = "spike" | "trend" | "correlation" | "threshold"

export interface MonitoringAlert {
  id: string
  type: AlertType
  severity: AlertSeverity
  title: string
  message: string
  commodityId?: string
  commodityName?: string
  payload?: Record<string, unknown>
  createdAt: string // ISO
  acknowledgedAt?: string
}

export interface AlertRule {
  id: string
  name: string
  type: AlertType
  enabled: boolean
  config: {
    spikePercentThreshold?: number
    zScoreThreshold?: number
    trendDirection?: "up" | "down"
    correlationThreshold?: number
  }
}

/** Cost of living index (basket = 100 at base period) */
export interface CostOfLivingIndex {
  index: number
  baseDate: string
  currentDate: string
  periodDays: number
  basket: Array<{ commodityId: string; commodityName: string; weight: number; price: number; contribution: number }>
}

/** Single point for volatility chart */
export interface VolatilityPoint {
  date: string
  volatility: number // e.g. rolling std dev or coefficient of variation
  value?: number
}

/** Volatility series for charting */
export interface VolatilitySeries {
  commodityId: string
  commodityName: string
  windowDays: number
  points: VolatilityPoint[]
}

/** Forex impact: how FX moves affect commodity price */
export interface ForexImpactInsight {
  commodityId: string
  commodityName: string
  correlation: number
  beta: number // % change in commodity per 1% change in LRD/USD
  insight: string
  periodDays: number
}

/** Market inflation indicator (period-over-period) */
export interface InflationIndicator {
  period: "mom" | "yoy"
  value: number // percent change
  fromDate: string
  toDate: string
  previousPeriodLabel: string
  basketIndexChange?: number
  commodityBreakdown?: Array<{ commodityId: string; commodityName: string; changePercent: number }>
}
