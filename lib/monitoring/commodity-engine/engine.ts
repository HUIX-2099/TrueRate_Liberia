/**
 * Commodity price monitoring engine: orchestrates trends, spikes, correlation, and alerts.
 */

import { getCommodityPriceSeries, getExchangeRateSeries, getMonitoredCommodities } from "../commodity-data"
import { computeTrend } from "./trends"
import { detectSpikes } from "./spikes"
import { computeCorrelation } from "./correlation"
import { evaluateAlerts } from "./alerts"
import type { TrendResult, SpikeEvent, CorrelationResult, MonitoringAlert } from "./types"

export interface EngineOptions {
  days?: number
  spikePercentThreshold?: number
  spikeZScoreThreshold?: number
  evaluateAlertRules?: boolean
}

export interface EngineResult {
  trends: TrendResult[]
  spikes: SpikeEvent[]
  correlations: CorrelationResult[]
  alertsGenerated: MonitoringAlert[]
  timestamp: string
  /** True when commodity data comes from indicative sample data, not a live source. */
  isIndicative: boolean
}

/** Run full monitoring: fetch data, compute trends/spikes/correlation, optionally evaluate alerts. */
export async function runMonitoring(options: EngineOptions = {}): Promise<EngineResult> {
  const days = options.days ?? 30
  const commodities = getMonitoredCommodities()
  const [fxSeries, ...commodityResults] = await Promise.all([
    getExchangeRateSeries(days),
    ...commodities.map((c) =>
      getCommodityPriceSeries({ commodityId: c.id, commodityName: c.name, days })
    ),
  ])

  const trends: TrendResult[] = []
  const spikes: SpikeEvent[] = []
  const correlations: CorrelationResult[] = []
  let anyIndicative = false

  for (const result of commodityResults) {
    const { commodityId, commodityName, series, isIndicative } = result
    if (isIndicative) anyIndicative = true

    const trend = computeTrend(commodityId, commodityName, series)
    if (trend) trends.push(trend)

    const spikeList = detectSpikes(commodityId, commodityName, series, {
      percentThreshold: options.spikePercentThreshold ?? 15,
      zScoreThreshold: options.spikeZScoreThreshold ?? 2.5,
      useZScore: true,
    })
    spikes.push(...spikeList)

    const corr = computeCorrelation(commodityId, commodityName, series, fxSeries, days)
    correlations.push(corr)
  }

  let alertsGenerated: MonitoringAlert[] = []
  if (options.evaluateAlertRules !== false) {
    alertsGenerated = evaluateAlerts(trends, spikes, correlations)
  }

  return {
    trends,
    spikes,
    correlations,
    alertsGenerated,
    timestamp: new Date().toISOString(),
    isIndicative: anyIndicative,
  }
}
