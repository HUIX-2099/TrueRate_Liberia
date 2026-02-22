import type { PricePoint, CostOfLivingIndex } from "./types"

/** Align multiple series by date; for each date return mean of values (equal-weight basket). */
function basketByDate(
  seriesList: Array<{ commodityId: string; commodityName: string; series: PricePoint[] }>
): Map<string, { sum: number; count: number; prices: Array<{ id: string; name: string; value: number }> }> {
  const byDate = new Map<
    string,
    { sum: number; count: number; prices: Array<{ id: string; name: string; value: number }> }
  >()
  const allDates = new Set<string>()
  for (const { commodityId, commodityName, series } of seriesList) {
    for (const p of series) {
      allDates.add(p.date)
    }
  }
  const sortedDates = [...allDates].sort()
  for (const date of sortedDates) {
    let sum = 0
    const prices: Array<{ id: string; name: string; value: number }> = []
    for (const { commodityId, commodityName, series } of seriesList) {
      const point = series.find((s) => s.date === date)
      if (point) {
        sum += point.value
        prices.push({ id: commodityId, name: commodityName, value: point.value })
      }
    }
    if (prices.length > 0) {
      byDate.set(date, { sum, count: prices.length, prices })
    }
  }
  return byDate
}

/** Compute cost-of-living index: basket average, base period = 100. */
export function computeCostOfLivingIndex(
  seriesList: Array<{ commodityId: string; commodityName: string; series: PricePoint[] }>,
  options: { baseDate?: string } = {}
): CostOfLivingIndex | null {
  const byDate = basketByDate(seriesList)
  const dates = [...byDate.keys()].sort()
  if (dates.length < 2) return null

  const baseDate = options.baseDate ?? dates[0]
  const base = byDate.get(baseDate)
  const currentDate = dates[dates.length - 1]
  const current = byDate.get(currentDate)
  if (!base || !current || base.count === 0) return null

  const baseAvg = base.sum / base.count
  const currentAvg = current.sum / current.count
  const index = baseAvg === 0 ? 100 : Number(((currentAvg / baseAvg) * 100).toFixed(2))

  const weight = 1 / current.prices.length
  const basket = current.prices.map((p) => ({
    commodityId: p.id,
    commodityName: p.name,
    weight,
    price: Number(p.value.toFixed(4)),
    contribution: Number(((p.value / currentAvg) * weight * 100).toFixed(2)),
  }))

  return {
    index,
    baseDate,
    currentDate,
    periodDays: dates.length,
    basket,
  }
}
