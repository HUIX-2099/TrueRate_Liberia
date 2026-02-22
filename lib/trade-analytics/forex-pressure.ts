import type { ImportRecord, ImportVolumeAnalysis, ForexPressureForecast } from "./types"
import { analyzeImportVolumes } from "./import-volumes"
import { getExchangeRateSeries } from "@/lib/monitoring/commodity-data"

/** Forecast forex pressure: import bill in USD/LRD and pressure index (0-100). */
export async function forecastForexPressure(
  records: ImportRecord[],
  options: { period?: string; fxRateOverride?: number } = {}
): Promise<ForexPressureForecast | null> {
  const volumes = analyzeImportVolumes(records)
  if (volumes.length === 0) return null

  const targetPeriod = options.period ?? volumes[volumes.length - 1]?.period
  const current = volumes.find((v) => v.period === targetPeriod)
  if (!current) return null

  const importBillUsd = current.totalValueUsd ?? current.totalVolume * 0.8
  let fxRate = options.fxRateOverride
  if (fxRate == null) {
    const fxSeries = await getExchangeRateSeries(30)
    fxRate = fxSeries.length > 0 ? fxSeries[fxSeries.length - 1].value : 185
  }
  const importBillLocal = importBillUsd * fxRate

  const prev = volumes[volumes.length - 2]
  const prevBill = prev?.totalValueUsd ?? prev?.totalVolume * 0.8 ?? importBillUsd
  const growth = prevBill !== 0 ? ((importBillUsd - prevBill) / prevBill) * 100 : 0

  const pressureFromLevel = Math.min(100, (importBillUsd / 500000) * 30)
  const pressureFromGrowth = Math.max(0, Math.min(40, growth * 2))
  const pressureIndex = Math.round(Math.min(100, pressureFromLevel + pressureFromGrowth + 20))

  let outlook: ForexPressureForecast["outlook"] = "stable"
  if (pressureIndex >= 70) outlook = "high"
  else if (pressureIndex >= 50) outlook = "building"
  else if (pressureIndex <= 30) outlook = "easing"

  const factors: string[] = []
  if (importBillUsd > 200000) factors.push("Large import bill in USD")
  if (growth > 10) factors.push("Rising import demand vs prior period")
  if (fxRate > 190) factors.push("LRD weakness increases local cost of imports")
  if (factors.length === 0) factors.push("Moderate import level and stable FX")

  const narrative =
    outlook === "high"
      ? "High forex pressure: significant import bill and/or LRD weakness increase demand for USD."
      : outlook === "building"
        ? "Forex pressure is building as import values rise or FX moves against LRD."
        : outlook === "easing"
          ? "Forex pressure is easing with lower import bill or firmer LRD."
          : "Forex pressure remains stable relative to recent periods."

  return {
    period: targetPeriod,
    pressureIndex: Math.max(0, Math.min(100, pressureIndex)),
    importBillUsd: Number(importBillUsd.toFixed(2)),
    importBillLocal: Number(importBillLocal.toFixed(2)),
    fxRateUsed: fxRate,
    outlook,
    narrative,
    contributingFactors: factors,
  }
}
