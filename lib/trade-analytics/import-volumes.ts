import type { ImportRecord, ImportVolumeAnalysis } from "./types"

/** Group records by period. */
function byPeriod(records: ImportRecord[]): Map<string, ImportRecord[]> {
  const map = new Map<string, ImportRecord[]>()
  for (const r of records) {
    const list = map.get(r.period) ?? []
    list.push(r)
    map.set(r.period, list)
  }
  return map
}

/** Analyze import volumes: totals and breakdown by category (and optional origin). */
export function analyzeImportVolumes(records: ImportRecord[]): ImportVolumeAnalysis[] {
  const byPeriodMap = byPeriod(records)
  const result: ImportVolumeAnalysis[] = []

  for (const [period, list] of byPeriodMap) {
    const totalVolume = list.reduce((s, r) => s + r.volume, 0)
    const totalValueUsd = list.reduce((s, r) => s + (r.valueUsd ?? 0), 0) || undefined
    const totalValueLocal = list.reduce((s, r) => s + (r.valueLocal ?? 0), 0) || undefined

    const byCat = new Map<string, number>()
    for (const r of list) {
      byCat.set(r.productCategory, (byCat.get(r.productCategory) ?? 0) + r.volume)
    }
    const byCategory = [...byCat.entries()].map(([category, volume]) => ({
      category,
      volume,
      sharePercent: totalVolume > 0 ? Number(((volume / totalVolume) * 100).toFixed(2)) : 0,
    }))

    const byOrigin = new Map<string, number>()
    for (const r of list) {
      const country = r.originCountry ?? "Unknown"
      byOrigin.set(country, (byOrigin.get(country) ?? 0) + r.volume)
    }
    const byOriginList = [...byOrigin.entries()].map(([country, volume]) => ({
      country,
      volume,
      sharePercent: totalVolume > 0 ? Number(((volume / totalVolume) * 100).toFixed(2)) : 0,
    }))

    result.push({
      period,
      totalVolume: Number(totalVolume.toFixed(4)),
      totalValueUsd: totalValueUsd > 0 ? Number(totalValueUsd.toFixed(2)) : undefined,
      totalValueLocal: totalValueLocal > 0 ? Number(totalValueLocal.toFixed(2)) : undefined,
      byCategory,
      byOrigin: byOriginList,
      recordCount: list.length,
    })
  }

  return result.sort((a, b) => a.period.localeCompare(b.period))
}
