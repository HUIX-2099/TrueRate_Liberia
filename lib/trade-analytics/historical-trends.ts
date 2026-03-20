import type { HistoricalTrendSnapshot } from "./types"
import type { ImportVolumeAnalysis } from "./types"
import type { MarketDemandScore } from "./types"
import type { ForexPressureForecast } from "./types"
import type { DemandPattern } from "./types"

const store: HistoricalTrendSnapshot[] = []
let idCounter = 0

function nextId(): string {
  idCounter += 1
  return `trend_${Date.now()}_${idCounter}`
}

/** Store a snapshot of current trends (call after running analytics). */
export function storeHistoricalTrend(params: {
  period: string
  volumeAnalysis: ImportVolumeAnalysis
  demandScores: MarketDemandScore[]
  forexPressure: ForexPressureForecast | null
  demandPatterns: DemandPattern[]
}): HistoricalTrendSnapshot {
  const topCat = params.volumeAnalysis.byCategory[0]
  const overallScore = params.demandScores[0]?.score ?? 0
  const pressureIndex = params.forexPressure?.pressureIndex ?? 0

  const byCategory = params.volumeAnalysis.byCategory.map((c) => {
    const score = params.demandScores.find((s) => s.category === c.category)?.score ?? overallScore
    const pattern = params.demandPatterns.find((p) => p.category === c.category)
    return {
      category: c.category,
      volume: c.volume,
      demandScore: score,
      pattern: pattern?.pattern ?? "stable",
    }
  })

  const snapshot: HistoricalTrendSnapshot = {
    id: nextId(),
    recordedAt: new Date().toISOString(),
    period: params.period,
    summary: {
      totalVolume: params.volumeAnalysis.totalVolume,
      demandScore: overallScore,
      forexPressureIndex: pressureIndex,
      topCategory: topCat?.category,
    },
    byCategory,
  }

  store.push(snapshot)
  const maxStored = 500
  if (store.length > maxStored) store.splice(0, store.length - maxStored)
  return snapshot
}

/** Retrieve stored historical trends. */
export function getHistoricalTrends(options: {
  period?: string
  since?: string // ISO date
  limit?: number
} = {}): HistoricalTrendSnapshot[] {
  let list = [...store]
  if (options.period) list = list.filter((s) => s.period === options.period)
  if (options.since) list = list.filter((s) => s.recordedAt >= options.since!)
  list.sort((a, b) => (b.recordedAt > a.recordedAt ? 1 : -1))
  const limit = options.limit ?? 50
  return list.slice(0, limit)
}

/** Get a single snapshot by id. */
export function getHistoricalTrendById(id: string): HistoricalTrendSnapshot | null {
  return store.find((s) => s.id === id) ?? null
}
