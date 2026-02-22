import type {
  MarketRiskInputs,
  MarketRiskResult,
  MarketRiskDrivers,
  SupplyChange,
  ImportVolumeChange,
} from "./types"

/** Clamp value to [0, 1]. */
function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x))
}

/** Map volatility % to risk contribution 0–1. (e.g. 0% -> 0, 25%+ -> 1) */
function volatilityToRisk(avgVolatilityPercent: number): number {
  return clamp01(avgVolatilityPercent / 25)
}

/** Map supply change % to risk contribution. Negative change (contraction) = higher risk. */
function supplyChangeToRisk(changes: SupplyChange[]): number {
  if (changes.length === 0) return 0
  const latest = changes[changes.length - 1]
  // Contraction (negative) increases risk; large drop = 1
  if (latest.changePercent >= 0) return clamp01(latest.changePercent / 20) // growth can add slight risk if extreme
  return clamp01(-latest.changePercent / 15) // -15% -> 1
}

/** Map import volume change % to risk contribution. Large drops or swings = higher risk. */
function importVolumeChangeToRisk(changes: ImportVolumeChange[]): number {
  if (changes.length === 0) return 0
  const latest = changes[changes.length - 1]
  const abs = Math.abs(latest.changePercent)
  // Large negative = supply risk; large positive = demand/volatility
  return clamp01(abs / 20)
}

/** Map demand data to risk contribution. Very high or unstable demand adds risk. */
function demandToRisk(demandScore: number, trendStrength?: number, demandStability?: number): number {
  // Very high demand (80+) can indicate overheating
  const levelRisk = demandScore >= 80 ? clamp01((demandScore - 80) / 20) : 0
  // Strong trend (either direction) can indicate instability
  const trendRisk = trendStrength != null ? clamp01(Math.abs(trendStrength)) * 0.5 : 0
  // Low stability adds risk
  const stabilityRisk = demandStability != null ? (1 - demandStability) * 0.5 : 0
  return clamp01(levelRisk + trendRisk + stabilityRisk)
}

/** Volatility to price stability component (0–1). Higher volatility = lower stability. */
function volatilityToStability(avgVolatilityPercent: number): number {
  return 1 - volatilityToRisk(avgVolatilityPercent)
}

/** Supply change to stability (0–1). Small absolute change = high stability. */
function supplyChangeToStability(changes: SupplyChange[]): number {
  if (changes.length === 0) return 1
  const abs = Math.abs(changes[changes.length - 1].changePercent)
  return 1 - clamp01(abs / 15)
}

/** Import volume change to stability (0–1). */
function importVolumeChangeToStability(changes: ImportVolumeChange[]): number {
  if (changes.length === 0) return 1
  const abs = Math.abs(changes[changes.length - 1].changePercent)
  return 1 - clamp01(abs / 20)
}

/** Weights for market risk score (must sum to 1). */
const RISK_WEIGHTS = {
  volatility: 0.35,
  supply: 0.25,
  importVolume: 0.25,
  demand: 0.15,
} as const

/** Weights for price stability index. */
const STABILITY_WEIGHTS = {
  volatility: 0.5,
  supply: 0.25,
  importVolume: 0.25,
} as const

function riskLabel(score: number): MarketRiskResult["riskLabel"] {
  if (score >= 80) return "critical"
  if (score >= 60) return "high"
  if (score >= 40) return "elevated"
  if (score >= 20) return "moderate"
  return "low"
}

/**
 * Compute market risk score (0–100) and price stability index (0–100) from
 * commodity volatility, supply changes, import volume changes, and market demand.
 */
export function computeMarketRisk(inputs: MarketRiskInputs): MarketRiskResult {
  const { commodityPriceVolatility, supplyChanges, importVolumeChanges, marketDemandData } = inputs

  const volRisk = volatilityToRisk(commodityPriceVolatility.averageVolatilityPercent)
  const supplyRisk = supplyChangeToRisk(supplyChanges)
  const importRisk = importVolumeChangeToRisk(importVolumeChanges)
  const demandRisk = demandToRisk(
    marketDemandData.demandScore,
    marketDemandData.trendStrength,
    marketDemandData.demandStability
  )

  const weightedRisk =
    volRisk * RISK_WEIGHTS.volatility +
    supplyRisk * RISK_WEIGHTS.supply +
    importRisk * RISK_WEIGHTS.importVolume +
    demandRisk * RISK_WEIGHTS.demand

  const marketRiskScore = Math.round(weightedRisk * 100)

  const volStability = volatilityToStability(commodityPriceVolatility.averageVolatilityPercent)
  const supplyStability = supplyChangeToStability(supplyChanges)
  const importStability = importVolumeChangeToStability(importVolumeChanges)

  const priceStabilityIndex = Math.round(
    (volStability * STABILITY_WEIGHTS.volatility +
      supplyStability * STABILITY_WEIGHTS.supply +
      importStability * STABILITY_WEIGHTS.importVolume) *
      100
  )

  const period =
    commodityPriceVolatility.period ??
    marketDemandData.period ??
    supplyChanges[supplyChanges.length - 1]?.period ??
    importVolumeChanges[importVolumeChanges.length - 1]?.period ??
    "latest"

  const drivers: MarketRiskDrivers = {
    volatilityContribution: volRisk,
    supplyContribution: supplyRisk,
    importVolumeContribution: importRisk,
    demandContribution: demandRisk,
  }

  return {
    marketRiskScore: Math.max(0, Math.min(100, marketRiskScore)),
    priceStabilityIndex: Math.max(0, Math.min(100, priceStabilityIndex)),
    period,
    riskLabel: riskLabel(marketRiskScore),
    drivers,
    computedAt: new Date().toISOString(),
  }
}
