import type { ImportRecord, DemandPattern } from "./types"

/** Volume series per category (period -> volume). */
function volumeSeriesByCategory(records: ImportRecord[]): Map<string, { period: string; volume: number }[]> {
  const byCat = new Map<string, { period: string; volume: number }[]>()
  for (const r of records) {
    const list = byCat.get(r.productCategory) ?? []
    list.push({ period: r.period, volume: r.volume })
    byCat.set(r.productCategory, list)
  }
  for (const list of byCat.values()) {
    list.sort((a, b) => a.period.localeCompare(b.period))
  }
  return byCat
}

function mean(arr: number[]): number {
  if (arr.length === 0) return 0
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

function slope(x: number[], y: number[]): number {
  const n = x.length
  if (n < 2) return 0
  const xMean = (n - 1) / 2
  const yMean = mean(y)
  let num = 0
  let den = 0
  for (let i = 0; i < n; i++) {
    num += (i - xMean) * (y[i] - yMean)
    den += (i - xMean) ** 2
  }
  return den === 0 ? 0 : num / den
}

/** Detect seasonal peak month from period strings (YYYY-MM). */
function seasonalPeak(periods: string[], volumes: number[]): number | undefined {
  if (periods.length < 12) return undefined
  const byMonth = new Map<number, number[]>()
  for (let i = 0; i < periods.length; i++) {
    const m = parseInt(periods[i].slice(5, 7), 10)
    const list = byMonth.get(m) ?? []
    list.push(volumes[i])
    byMonth.set(m, list)
  }
  let maxAvg = -1
  let peakMonth: number | undefined
  for (const [month, vals] of byMonth) {
    const avg = mean(vals)
    if (avg > maxAvg) {
      maxAvg = avg
      peakMonth = month
    }
  }
  return peakMonth
}

/** Detect demand patterns (trend, seasonality) per category. */
export function detectDemandPatterns(records: ImportRecord[]): DemandPattern[] {
  const byCategory = volumeSeriesByCategory(records)
  const result: DemandPattern[] = []

  for (const [category, points] of byCategory) {
    if (points.length < 2) {
      result.push({
        category,
        pattern: "stable",
        trendStrength: 0,
        confidence: 0,
      })
      continue
    }

    const volumes = points.map((p) => p.volume)
    const periods = points.map((p) => p.period)
    const x = volumes.map((_, i) => i)
    const sl = slope(x, volumes)
    const avgVol = mean(volumes)
    const trendStrength = avgVol !== 0 ? Math.max(-1, Math.min(1, (sl * points.length) / avgVol)) : 0
    const growthRatePercent =
      points.length >= 2 && volumes[0] !== 0
        ? ((volumes[volumes.length - 1] - volumes[0]) / volumes[0]) * 100
        : undefined
    const peakMonth = seasonalPeak(periods, volumes)

    let pattern: DemandPattern["pattern"] = "stable"
    if (trendStrength > 0.15) pattern = "rising"
    else if (trendStrength < -0.15) pattern = "falling"
    else if (peakMonth !== undefined && points.length >= 12) pattern = "seasonal"

    const confidence =
      points.length >= 6 ? Math.min(1, 0.3 + (points.length / 24) * 0.7) : points.length / 6

    result.push({
      category,
      pattern,
      trendStrength: Number(trendStrength.toFixed(4)),
      growthRatePercent: growthRatePercent !== undefined ? Number(growthRatePercent.toFixed(2)) : undefined,
      seasonalPeakMonth: peakMonth,
      confidence: Number(confidence.toFixed(2)),
    })
  }

  return result
}
