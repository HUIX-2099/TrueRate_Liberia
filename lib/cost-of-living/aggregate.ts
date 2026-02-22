import type { BasketDay } from "./types"

/** Input: commodity series list (same shape as commodity-engine). */
export interface CommoditySeriesInput {
  commodityId: string
  commodityName: string
  series: Array<{ date: string; value: number }>
}

/**
 * Aggregate commodity prices into a daily basket: for each date with at least one
 * price, compute sum and equal-weight average. Used for COL index and charts.
 */
export function aggregateCommodityPrices(
  seriesList: CommoditySeriesInput[]
): BasketDay[] {
  const allDates = new Set<string>()
  for (const { series } of seriesList) {
    for (const p of series) allDates.add(p.date)
  }
  const sortedDates = [...allDates].sort()
  const byDateCommodity = new Map<string, Array<{ id: string; name: string; value: number }>>()
  for (const date of sortedDates) {
    byDateCommodity.set(date, [])
  }
  for (const { commodityId, commodityName, series } of seriesList) {
    const byDate = new Map(series.map((p) => [p.date, p.value]))
    for (const date of sortedDates) {
      const value = byDate.get(date)
      if (value != null) {
        byDateCommodity.get(date)!.push({ id: commodityId, name: commodityName, value })
      }
    }
  }

  const result: BasketDay[] = []
  for (const date of sortedDates) {
    const prices = byDateCommodity.get(date)!
    if (prices.length === 0) continue
    const basketSum = prices.reduce((s, p) => s + p.value, 0)
    const itemCount = prices.length
    const basketAvg = basketSum / itemCount
    result.push({
      date,
      basketSum: Number(basketSum.toFixed(4)),
      basketAvg: Number(basketAvg.toFixed(4)),
      itemCount,
      prices: prices.map((p) => ({
        commodityId: p.id,
        commodityName: p.name,
        value: Number(p.value.toFixed(4)),
      })),
    })
  }
  return result
}
