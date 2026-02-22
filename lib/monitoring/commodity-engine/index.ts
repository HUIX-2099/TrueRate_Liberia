export { computeTrend } from "./trends"
export { detectSpikes } from "./spikes"
export type { SpikeOptions } from "./spikes"
export { computeCorrelation } from "./correlation"
export { computeCostOfLivingIndex } from "./cost-of-living"
export { computeVolatilitySeries } from "./volatility"
export { computeForexImpact } from "./forex-impact"
export { computeInflationIndicators } from "./inflation"
export {
  addAlert,
  getAlerts,
  acknowledgeAlert,
  evaluateAlerts,
  DEFAULT_RULES,
} from "./alerts"
export { runMonitoring } from "./engine"
export type {
  PricePoint,
  TrendResult,
  SpikeEvent,
  CorrelationResult,
  CostOfLivingIndex,
  VolatilitySeries,
  VolatilityPoint,
  ForexImpactInsight,
  InflationIndicator,
  MonitoringAlert,
  AlertRule,
  AlertSeverity,
  AlertType,
} from "./types"
export type { EngineResult, EngineOptions } from "./engine"
