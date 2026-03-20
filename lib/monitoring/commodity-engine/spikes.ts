import type { PricePoint, SpikeEvent } from "./types"

function mean(series: number[]): number {
  if (series.length === 0) return 0
  return series.reduce((a, b) => a + b, 0) / series.length
}

function stdDev(series: number[]): number {
  if (series.length < 2) return 0
  const m = mean(series)
  const sq = series.map((x) => (x - m) ** 2).reduce((a, b) => a + b, 0)
  return Math.sqrt(sq / (series.length - 1))
}

/** Z-score of the last value relative to previous values. */
function zScore(series: PricePoint[]): number | null {
  if (series.length < 3) return null
  const values = series.map((p) => p.value)
  const prev = values.slice(0, -1)
  const last = values[values.length - 1]
  const sd = stdDev(prev)
  if (sd === 0) return null
  return (last - mean(prev)) / sd
}

export interface SpikeOptions {
  percentThreshold?: number // e.g. 10 = 10% day-over-day
  zScoreThreshold?: number // e.g. 2.5
  useZScore?: boolean
}

/** Detect price spikes in a series. */
export function detectSpikes(
  commodityId: string,
  commodityName: string,
  series: PricePoint[],
  options: SpikeOptions = {}
): SpikeEvent[] {
  const percentThreshold = options.percentThreshold ?? 15
  const zScoreThreshold = options.zScoreThreshold ?? 2.5
  const useZScore = options.useZScore ?? false
  const sorted = [...series].sort((a, b) => a.date.localeCompare(b.date))
  const events: SpikeEvent[] = []

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1].value
    const curr = sorted[i].value
    if (prev === 0) continue
    const changePercent = ((curr - prev) / prev) * 100
    const isPercentSpike = Math.abs(changePercent) >= percentThreshold

    let z: number | null = null
    if (useZScore && i >= 2) {
      const window = sorted.slice(0, i + 1)
      z = zScore(window)
    }
    const isZSpike = z !== null && Math.abs(z) >= zScoreThreshold

    if (isPercentSpike) {
      events.push({
        date: sorted[i].date,
        value: curr,
        previousValue: prev,
        changePercent: Number(changePercent.toFixed(2)),
        zScore: z !== null ? Number(z.toFixed(2)) : undefined,
        threshold: "percent",
        commodityId,
        commodityName,
      })
    } else if (isZSpike) {
      events.push({
        date: sorted[i].date,
        value: curr,
        previousValue: prev,
        changePercent: Number(changePercent.toFixed(2)),
        zScore: Number(z!.toFixed(2)),
        threshold: "zscore",
        commodityId,
        commodityName,
      })
    }
  }

  return events
}
