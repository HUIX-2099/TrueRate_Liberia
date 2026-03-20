import type { PricePoint, ForexImpactInsight } from "./types"

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

/** Percent changes from one period to next. */
function pctChanges(arr: number[]): number[] {
  const out: number[] = []
  for (let i = 1; i < arr.length; i++) {
    const prev = arr[i - 1]
    const curr = arr[i]
    if (prev !== 0) out.push(((curr - prev) / prev) * 100)
  }
  return out
}

/** Beta: regression slope of commodity % change on FX % change (sensitivity to forex). */
function beta(commodityPct: number[], fxPct: number[]): number {
  if (commodityPct.length < 2 || commodityPct.length !== fxPct.length) return 0
  const n = commodityPct.length
  const meanC = commodityPct.reduce((a, b) => a + b, 0) / n
  const meanF = fxPct.reduce((a, b) => a + b, 0) / n
  let cov = 0
  let varF = 0
  for (let i = 0; i < n; i++) {
    cov += (commodityPct[i] - meanC) * (fxPct[i] - meanF)
    varF += (fxPct[i] - meanF) ** 2
  }
  if (varF === 0) return 0
  return cov / varF
}

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
  return den === 0 ? 0 : num / den
}

/** Compute forex impact insight: correlation and beta (commodity % change per 1% FX change). */
export function computeForexImpact(
  commodityId: string,
  commodityName: string,
  commoditySeries: PricePoint[],
  fxSeries: PricePoint[],
  periodDays: number
): ForexImpactInsight {
  const [cValues, fxValues] = alignSeries(commoditySeries, fxSeries)
  const cPct = pctChanges(cValues)
  const fxPct = pctChanges(fxValues)
  const len = Math.min(cPct.length, fxPct.length)
  const cSlice = cPct.slice(-len)
  const fxSlice = fxPct.slice(-len)

  const r = len < 2 ? 0 : pearson(cSlice, fxSlice)
  const b = len < 2 ? 0 : beta(cSlice, fxSlice)

  let insight: string
  if (Math.abs(r) < 0.2) {
    insight = `${commodityName} shows little short-term link to USD/LRD moves.`
  } else {
    const dir = b > 0 ? "rise" : "fall"
    const strength = Math.abs(b) > 0.5 ? "strong" : "moderate"
    insight = `A 1% rise in LRD per USD is associated with a ${strength} ${dir} in ${commodityName} prices (beta ${b.toFixed(2)}).`
  }

  return {
    commodityId,
    commodityName,
    correlation: Number(r.toFixed(4)),
    beta: Number(b.toFixed(4)),
    insight,
    periodDays,
  }
}
