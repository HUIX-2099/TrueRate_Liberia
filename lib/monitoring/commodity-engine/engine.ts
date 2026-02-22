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
}

/** Run full monitoring: fetch data, compute trends/spikes/correlation, optionally evaluate alerts. */
export async function runMonitoring(options: EngineOptions = {}): Promise<EngineResult> {
  const days = options.days ?? 30
  const commodities = getMonitoredCommodities()
  const [fxSeries, ...commodityData] = await Promise.all([
    getExchangeRateSeries(days),
    ...commodities.map((c) =>
      getCommodityPriceSeries({ commodityId: c.id, commodityName: c.name, days })
    ),
  ])

  const trends: TrendResult[] = []
  const spikes: SpikeEvent[] = []
  const correlations: CorrelationResult[] = []

  for (const { commodityId, commodityName, series } of commodityData) {
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
  }
}
