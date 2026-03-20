import type { PricePoint, TrendResult } from "./types"

/** Linear regression slope (per-day change). */
function slope(series: PricePoint[]): number {
  const n = series.length
  if (n < 2) return 0
  const xMean = (n - 1) / 2
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumX2 = 0
  for (let i = 0; i < n; i++) {
    const x = i
    const y = series[i].value
    sumX += x
    sumY += y
    sumXY += x * y
    sumX2 += x * x
  }
  const denom = n * sumX2 - sumX * sumX
  if (denom === 0) return 0
  return (n * sumXY - sumX * sumY) / denom
}

/** Moving average over last window points. */
function movingAverage(series: PricePoint[], window: number): number {
  if (series.length === 0) return 0
  const w = Math.min(window, series.length)
  const slice = series.slice(-w)
  const sum = slice.reduce((a, p) => a + p.value, 0)
  return sum / w
}

/** Classify trend direction from slope and recent volatility. */
function direction(series: PricePoint[], slopeVal: number): "up" | "down" | "stable" {
  if (series.length < 2) return "stable"
  const mean = series.reduce((a, p) => a + p.value, 0) / series.length
  const range = Math.max(...series.map((p) => p.value)) - Math.min(...series.map((p) => p.value))
  const threshold = range * 0.02 // 2% of range
  if (slopeVal > threshold) return "up"
  if (slopeVal < -threshold) return "down"
  return "stable"
}

export function computeTrend(
  commodityId: string,
  commodityName: string,
  series: PricePoint[],
  options: { window?: number } = {}
): TrendResult | null {
  const window = options.window ?? 7
  if (series.length < 2) return null
  const sorted = [...series].sort((a, b) => a.date.localeCompare(b.date))
  const slopeVal = slope(sorted)
  const mv = movingAverage(sorted, window)
  const first = sorted[0].value
  const last = sorted[sorted.length - 1]
  const periodDays = sorted.length
  const slopePercent = first !== 0 ? (slopeVal * periodDays * 100) / first : 0

  return {
    commodityId,
    commodityName,
    direction: direction(sorted, slopeVal),
    slope: Number(slopeVal.toFixed(6)),
    slopePercent: Number(slopePercent.toFixed(2)),
    movingAvg: Number(mv.toFixed(4)),
    periodDays,
    dataPoints: sorted.length,
    latestDate: last.date,
    latestValue: last.value,
  }
}
