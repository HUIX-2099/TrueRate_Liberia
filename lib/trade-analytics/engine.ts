/**
 * Trade analytics engine: import volumes, demand patterns, market demand score,
 * forex pressure forecast, and historical trend storage.
 */

import { getImportRecords } from "./data"
import { analyzeImportVolumes } from "./import-volumes"
import { detectDemandPatterns } from "./demand-patterns"
import { generateMarketDemandScore } from "./market-demand-score"
import { forecastForexPressure } from "./forex-pressure"
import { storeHistoricalTrend, getHistoricalTrends } from "./historical-trends"
import type {
  ImportRecord,
  ImportVolumeAnalysis,
  DemandPattern,
  MarketDemandScore,
  ForexPressureForecast,
  HistoricalTrendSnapshot,
} from "./types"

export interface TradeAnalyticsOptions {
  periods?: number
  category?: string
  storeHistory?: boolean
}

export interface TradeAnalyticsResult {
  volumeAnalysis: ImportVolumeAnalysis[]
  demandPatterns: DemandPattern[]
  marketDemandScores: MarketDemandScore[]
  forexPressure: ForexPressureForecast | null
  historicalSnapshot?: HistoricalTrendSnapshot
  timestamp: string
}

/** Run full trade analytics and optionally store a historical snapshot. */
export async function runTradeAnalytics(
  options: TradeAnalyticsOptions = {}
): Promise<TradeAnalyticsResult> {
  const periods = options.periods ?? 24
  const records = await getImportRecords({ periods, category: options.category })
  const volumeAnalysis = analyzeImportVolumes(records)
  const demandPatterns = detectDemandPatterns(records)
  const marketDemandScores = generateMarketDemandScore(records, {
    period: undefined,
    category: options.category,
  })
  const forexPressure = await forecastForexPressure(records)

  const latestPeriod = volumeAnalysis[volumeAnalysis.length - 1]
  let historicalSnapshot: HistoricalTrendSnapshot | undefined
  if (options.storeHistory !== false && latestPeriod) {
    historicalSnapshot = storeHistoricalTrend({
      period: latestPeriod.period,
      volumeAnalysis: latestPeriod,
      demandScores: marketDemandScores,
      forexPressure,
      demandPatterns,
    })
  }

  return {
    volumeAnalysis,
    demandPatterns,
    marketDemandScores,
    forexPressure,
    historicalSnapshot,
    timestamp: new Date().toISOString(),
  }
}

export { getHistoricalTrends, getHistoricalTrendById } from "./historical-trends"
