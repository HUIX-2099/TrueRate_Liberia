import type { PricePoint, CorrelationResult } from "./types"

/** Align two series by date and return [x[], y[]] for same dates. */
function alignSeries(a: PricePoint[], b: PricePoint[]): [number[], number[]] {
  const byDateA = new Map(a.map((p) => [p.date, p.value]))
  const byDateB = new Map(b.map((p) => [p.date, p.value]))
  const dates = [...new Set([...byDateA.keys(), ...byDateB.keys()])].sort()
  const x: number[] = []
  const y: number[] = []
  for (const d of dates) {
    const va = byDateA.get(d)
    const vb = byDateB.get(d)
    if (va !== undefined && vb !== undefined) {
      x.push(va)
      y.push(vb)
    }
  }
  return [x, y]
}

/** Pearson correlation coefficient. */
function pearson(x: number[], y: number[]): number {
  const n = x.length
  if (n < 2) return 0
  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = y.reduce((a, b) => a + b, 0)
  const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0)
  const sumX2 = x.reduce((a, b) => a + b * b, 0)
  const sumY2 = y.reduce((a, b) => a + b * b, 0)
  const num = n * sumXY - sumX * sumY
  const den = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))
  if (den === 0) return 0
  return num / den
}

function interpretation(r: number): CorrelationResult["interpretation"] {
  if (r >= 0.7) return "strong_positive"
  if (r >= 0.3) return "weak_positive"
  if (r >= -0.3) return "none"
  if (r >= -0.7) return "weak_negative"
  return "strong_negative"
}

/** Correlate commodity price series with exchange rate (e.g. LRD/USD) over overlapping dates. */
export function computeCorrelation(
  commodityId: string,
  commodityName: string,
  commoditySeries: PricePoint[],
  fxSeries: PricePoint[],
  periodDays: number
): CorrelationResult {
  const [x, y] = alignSeries(commoditySeries, fxSeries)
  const r = x.length < 2 ? 0 : pearson(x, y)
  return {
    commodityId,
    commodityName,
    correlation: Number(r.toFixed(4)),
    periodDays,
    overlappingPoints: x.length,
    interpretation: interpretation(r),
  }
}
