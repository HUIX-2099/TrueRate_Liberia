import type { PricePoint, VolatilitySeries, VolatilityPoint } from "./types"

function mean(arr: number[]): number {
  if (arr.length === 0) return 0
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

function stdDev(arr: number[]): number {
  if (arr.length < 2) return 0
  const m = mean(arr)
  const sq = arr.reduce((a, x) => a + (x - m) ** 2, 0)
  return Math.sqrt(sq / (arr.length - 1))
}

/** Rolling volatility (std dev of returns or of levels over window). */
export function computeVolatilitySeries(
  commodityId: string,
  commodityName: string,
  series: PricePoint[],
  windowDays: number = 7
): VolatilitySeries {
  const sorted = [...series].sort((a, b) => a.date.localeCompare(b.date))
  const points: VolatilityPoint[] = []

  for (let i = windowDays - 1; i < sorted.length; i++) {
    const window = sorted.slice(i - windowDays + 1, i + 1).map((p) => p.value)
    const vol = stdDev(window)
    const date = sorted[i].date
    const value = sorted[i].value
    const cv = value !== 0 ? (vol / value) * 100 : 0 // coefficient of variation %
    points.push({
      date,
      volatility: Number(cv.toFixed(4)),
      value: Number(value.toFixed(4)),
    })
  }

  return {
    commodityId,
    commodityName,
    windowDays,
    points,
  }
}
