import type { ColVsExchangeRateComparison, ColVsFxPoint, BasketDay } from "./types"

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

/**
 * Compare cost-of-living (basket average) with exchange rate trends.
 * Aligns by date, computes % changes and correlation, returns interpretation.
 */
export function compareWithExchangeRateTrends(
  basketSeries: BasketDay[],
  fxSeries: Array<{ date: string; value: number }>,
  options: { useColIndex?: boolean; baseBasketAvg?: number } = {}
): ColVsExchangeRateComparison | null {
  const byDateBasket = new Map(basketSeries.map((b) => [b.date, b.basketAvg]))
  const byDateFx = new Map(fxSeries.map((p) => [p.date, p.value]))
  const dates = [...byDateBasket.keys()].filter((d) => byDateFx.has(d)).sort()
  if (dates.length < 2) return null

  const colValues = dates.map((d) => {
    const avg = byDateBasket.get(d)!
    if (options.useColIndex && options.baseBasketAvg != null && options.baseBasketAvg > 0) {
      return (avg / options.baseBasketAvg) * 100
    }
    return avg
  })
  const fxValues = dates.map((d) => byDateFx.get(d)!)

  const alignedSeries: ColVsFxPoint[] = dates.map((d, i) => ({
    date: d,
    colValue: Number(colValues[i].toFixed(4)),
    fxRate: Number(fxValues[i].toFixed(4)),
  }))

  const firstCol = colValues[0]
  const lastCol = colValues[colValues.length - 1]
  const firstFx = fxValues[0]
  const lastFx = fxValues[fxValues.length - 1]
  const colPercentChange = firstCol !== 0 ? (((lastCol - firstCol) / firstCol) * 100) : 0
  const fxPercentChange = firstFx !== 0 ? (((lastFx - firstFx) / firstFx) * 100) : 0

  const correlation = pearson(colValues, fxValues)

  let interpretation: ColVsExchangeRateComparison["interpretation"] = "weak_relationship"
  const colUp = colPercentChange > 1
  const fxUp = fxPercentChange > 1
  if (Math.abs(correlation) >= 0.5) {
    if (colUp && fxUp) {
      interpretation = colPercentChange > fxPercentChange + 5 ? "col_rising_faster" : "similar_trends"
      if (fxPercentChange > colPercentChange + 5) interpretation = "fx_rising_faster"
    } else if (colUp !== fxUp) {
      interpretation = "weak_relationship"
    } else {
      interpretation = "similar_trends"
    }
  }

  return {
    alignedSeries,
    colPercentChange: Number(colPercentChange.toFixed(2)),
    fxPercentChange: Number(fxPercentChange.toFixed(2)),
    correlation: Number(correlation.toFixed(4)),
    interpretation,
    periodDays: dates.length,
  }
}
