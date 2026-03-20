import type { PricePoint, InflationIndicator } from "./types"

/** Average price across commodities for each date (equal-weight basket). */
function dailyBasketAvg(
  seriesList: Array<{ commodityId: string; commodityName: string; series: PricePoint[] }>
): Map<string, number> {
  const byDate = new Map<string, number[]>()
  for (const { series } of seriesList) {
    for (const p of series) {
      const arr = byDate.get(p.date) ?? []
      arr.push(p.value)
      byDate.set(p.date, arr)
    }
  }
  const result = new Map<string, number>()
  for (const [date, values] of byDate) {
    result.set(date, values.reduce((a, b) => a + b, 0) / values.length)
  }
  return result
}

/** Period average from a map of date -> value. */
function periodAvg(map: Map<string, number>, dates: string[]): number {
  const vals = dates.map((d) => map.get(d)).filter((v): v is number => v !== undefined)
  if (vals.length === 0) return 0
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

/** % change between two period averages. */
export function computeInflationIndicators(
  seriesList: Array<{ commodityId: string; commodityName: string; series: PricePoint[] }>,
  options: { days?: number } = {}
): InflationIndicator[] {
  const days = options.days ?? 90
  const basket = dailyBasketAvg(seriesList)
  const sortedDates = [...basket.keys()].sort()
  if (sortedDates.length < 2) return []

  const result: InflationIndicator[] = []

  // MoM: last 30 days vs previous 30 days
  const momWindow = 30
  if (sortedDates.length >= momWindow * 2) {
    const currentMom = sortedDates.slice(-momWindow)
    const previousMom = sortedDates.slice(-momWindow * 2, -momWindow)
    const avgCurrent = periodAvg(basket, currentMom)
    const avgPrevious = periodAvg(basket, previousMom)
    const momPct = avgPrevious === 0 ? 0 : ((avgCurrent - avgPrevious) / avgPrevious) * 100
    const breakdown: InflationIndicator["commodityBreakdown"] = seriesList.map(({ commodityId, commodityName, series }) => {
      const byDate = new Map(series.map((p) => [p.date, p.value]))
      const curr = periodAvg(byDate, currentMom)
      const prev = periodAvg(byDate, previousMom)
      const ch = prev === 0 ? 0 : ((curr - prev) / prev) * 100
      return { commodityId, commodityName, changePercent: Number(ch.toFixed(2)) }
    })
    result.push({
      period: "mom",
      value: Number(momPct.toFixed(2)),
      fromDate: previousMom[0] ?? "",
      toDate: currentMom[currentMom.length - 1] ?? "",
      previousPeriodLabel: "Previous 30 days",
      basketIndexChange: Number(momPct.toFixed(2)),
      commodityBreakdown: breakdown,
    })
  }

  // YoY: last 365 vs previous 365 (or available max)
  const yoyWindow = Math.min(365, Math.floor(sortedDates.length / 2))
  if (yoyWindow >= 30 && sortedDates.length >= yoyWindow * 2) {
    const currentYoy = sortedDates.slice(-yoyWindow)
    const previousYoy = sortedDates.slice(-yoyWindow * 2, -yoyWindow)
    const avgCurrent = periodAvg(basket, currentYoy)
    const avgPrevious = periodAvg(basket, previousYoy)
    const yoyPct = avgPrevious === 0 ? 0 : ((avgCurrent - avgPrevious) / avgPrevious) * 100
    const breakdown: InflationIndicator["commodityBreakdown"] = seriesList.map(({ commodityId, commodityName, series }) => {
      const byDate = new Map(series.map((p) => [p.date, p.value]))
      const curr = periodAvg(byDate, currentYoy)
      const prev = periodAvg(byDate, previousYoy)
      const ch = prev === 0 ? 0 : ((curr - prev) / prev) * 100
      return { commodityId, commodityName, changePercent: Number(ch.toFixed(2)) }
    })
    result.push({
      period: "yoy",
      value: Number(yoyPct.toFixed(2)),
      fromDate: previousYoy[0] ?? "",
      toDate: currentYoy[currentYoy.length - 1] ?? "",
      previousPeriodLabel: `Previous ${yoyWindow} days`,
      basketIndexChange: Number(yoyPct.toFixed(2)),
      commodityBreakdown: breakdown,
    })
  }

  return result
}
