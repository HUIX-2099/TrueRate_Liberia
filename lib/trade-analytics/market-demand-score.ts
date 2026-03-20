import type { ImportRecord, ImportVolumeAnalysis, DemandPattern, MarketDemandScore } from "./types"
import { analyzeImportVolumes } from "./import-volumes"
import { detectDemandPatterns } from "./demand-patterns"

function normalize(x: number, min: number, max: number): number {
  if (max <= min) return 0.5
  return Math.max(0, Math.min(1, (x - min) / (max - min)))
}

/** Generate market demand score (0-100) from volume level, trend, growth, stability. */
export function generateMarketDemandScore(
  records: ImportRecord[],
  options: { period?: string; category?: string } = {}
): MarketDemandScore[] {
  const volumes = analyzeImportVolumes(records)
  const patterns = detectDemandPatterns(records)

  if (volumes.length === 0) return []

  const totalVolumes = volumes.map((v) => v.totalVolume)
  const volMin = Math.min(...totalVolumes)
  const volMax = Math.max(...totalVolumes)

  const targetPeriod = options.period ?? volumes[volumes.length - 1]?.period
  const targetVolume = volumes.find((v) => v.period === targetPeriod)
  if (!targetVolume) return []

  const patternMap = new Map(patterns.map((p) => [p.category, p]))

  const results: MarketDemandScore[] = []

  if (options.category) {
    const cat = targetVolume.byCategory.find((c) => c.category === options.category)
    const pat = patternMap.get(options.category)
    if (!cat && !pat) return []
    const volumeLevel = cat ? normalize(cat.volume, volMin / targetVolume.byCategory.length, volMax) : 0.5
    const trendDirection = pat?.trendStrength ?? 0
    const growthRate = pat?.growthRatePercent != null ? normalize(pat.growthRatePercent, -20, 30) : 0.5
    const volatility = 1 - Math.min(1, Math.abs(pat?.trendStrength ?? 0) * 2)
    const raw =
      volumeLevel * 0.3 +
      (trendDirection + 1) * 0.5 * 0.3 +
      growthRate * 0.2 +
      volatility * 0.2
    const score = Math.round(raw * 100)
    const label = score >= 75 ? "very_high" : score >= 50 ? "high" : score >= 25 ? "moderate" : "low"
    results.push({
      score: Math.max(0, Math.min(100, score)),
      period: targetPeriod,
      category: options.category,
      drivers: {
        volumeLevel,
        trendDirection,
        growthRate,
        volatility,
      },
      label,
    })
    return results
  }

  const volLevel = normalize(targetVolume.totalVolume, volMin, volMax)
  const avgPattern = patterns.reduce((a, p) => a + p.trendStrength, 0) / (patterns.length || 1)
  const withGrowth = patterns.filter((p) => p.growthRatePercent != null)
  const avgGrowth =
    withGrowth.length > 0
      ? withGrowth.reduce((a, p) => a + (p.growthRatePercent ?? 0), 0) / withGrowth.length
      : 0
  const trendDir = (avgPattern + 1) / 2
  const growthNorm = normalize(avgGrowth, -20, 30)
  const volNorm = 1 - Math.min(1, Math.abs(avgPattern) * 2)
  const raw = volLevel * 0.3 + trendDir * 0.3 + growthNorm * 0.2 + volNorm * 0.2
  const score = Math.round(raw * 100)
  const label = score >= 75 ? "very_high" : score >= 50 ? "high" : score >= 25 ? "moderate" : "low"

  results.push({
    score: Math.max(0, Math.min(100, score)),
    period: targetPeriod,
    drivers: {
      volumeLevel: volLevel,
      trendDirection: avgPattern,
      growthRate: growthNorm,
      volatility: volNorm,
    },
    label,
  })

  return results
}
