/**
 * Crisis severity scoring engine.
 *
 * Composes signals from commodity monitoring, exchange rate data,
 * and community reports into a single crisis severity level.
 *
 * Levels:
 *   GREEN  (0-24)  — Normal / stable
 *   YELLOW (25-49) — Elevated / watch
 *   ORANGE (50-74) — High / active crisis
 *   RED    (75-100) — Critical / emergency
 */

export type SeverityLevel = "green" | "yellow" | "orange" | "red"

export interface CrisisSignal {
  id: string
  name: string
  category: "fuel" | "currency" | "food" | "trade" | "community" | "government"
  value: number
  /** Score contribution 0-100 */
  score: number
  weight: number
  description: string
  direction: "up" | "down" | "stable"
  timestamp: string
}

export interface SeverityResult {
  level: SeverityLevel
  score: number
  signals: CrisisSignal[]
  headline: string
  description: string
  recommendations: string[]
  timestamp: string
}

interface CrisisSeverityInput {
  fuelPriceChangePercent?: number
  exchangeRateChangePercent?: number
  riceChangePercent?: number
  importVolumeChangePercent?: number
  communityReportsCount?: number
  governmentPriceControl?: boolean
  inflationMoM?: number
  globalOilChangePercent?: number
}

const SIGNAL_WEIGHTS = {
  fuel: 0.25,
  currency: 0.20,
  food: 0.20,
  trade: 0.10,
  community: 0.10,
  globalOil: 0.10,
  inflation: 0.05,
} as const

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

function scoreFromChange(changePercent: number, thresholds: [number, number, number]): number {
  const abs = Math.abs(changePercent)
  if (abs >= thresholds[2]) return 100
  if (abs >= thresholds[1]) return 50 + 50 * ((abs - thresholds[1]) / (thresholds[2] - thresholds[1]))
  if (abs >= thresholds[0]) return 25 + 25 * ((abs - thresholds[0]) / (thresholds[1] - thresholds[0]))
  return abs / thresholds[0] * 25
}

export function computeSeverity(input: CrisisSeverityInput): SeverityResult {
  const signals: CrisisSignal[] = []
  const now = new Date().toISOString()

  if (input.fuelPriceChangePercent !== undefined) {
    const score = scoreFromChange(input.fuelPriceChangePercent, [5, 15, 30])
    signals.push({
      id: "fuel",
      name: "Fuel price change",
      category: "fuel",
      value: input.fuelPriceChangePercent,
      score,
      weight: SIGNAL_WEIGHTS.fuel,
      description: `Fuel prices ${input.fuelPriceChangePercent > 0 ? "up" : "down"} ${Math.abs(input.fuelPriceChangePercent).toFixed(1)}%`,
      direction: input.fuelPriceChangePercent > 2 ? "up" : input.fuelPriceChangePercent < -2 ? "down" : "stable",
      timestamp: now,
    })
  }

  if (input.exchangeRateChangePercent !== undefined) {
    const score = scoreFromChange(input.exchangeRateChangePercent, [3, 10, 25])
    signals.push({
      id: "currency",
      name: "LRD depreciation",
      category: "currency",
      value: input.exchangeRateChangePercent,
      score,
      weight: SIGNAL_WEIGHTS.currency,
      description: `LRD ${input.exchangeRateChangePercent > 0 ? "weakened" : "strengthened"} ${Math.abs(input.exchangeRateChangePercent).toFixed(1)}% vs USD`,
      direction: input.exchangeRateChangePercent > 2 ? "up" : input.exchangeRateChangePercent < -2 ? "down" : "stable",
      timestamp: now,
    })
  }

  if (input.riceChangePercent !== undefined) {
    const score = scoreFromChange(input.riceChangePercent, [5, 12, 25])
    signals.push({
      id: "food",
      name: "Rice price change",
      category: "food",
      value: input.riceChangePercent,
      score,
      weight: SIGNAL_WEIGHTS.food,
      description: `Rice prices ${input.riceChangePercent > 0 ? "up" : "down"} ${Math.abs(input.riceChangePercent).toFixed(1)}%`,
      direction: input.riceChangePercent > 2 ? "up" : input.riceChangePercent < -2 ? "down" : "stable",
      timestamp: now,
    })
  }

  if (input.importVolumeChangePercent !== undefined) {
    const score = input.importVolumeChangePercent < 0
      ? scoreFromChange(input.importVolumeChangePercent, [10, 25, 50])
      : 0
    signals.push({
      id: "trade",
      name: "Import volume",
      category: "trade",
      value: input.importVolumeChangePercent,
      score,
      weight: SIGNAL_WEIGHTS.trade,
      description: `Import volumes ${input.importVolumeChangePercent < 0 ? "dropped" : "increased"} ${Math.abs(input.importVolumeChangePercent).toFixed(1)}%`,
      direction: input.importVolumeChangePercent < -5 ? "down" : input.importVolumeChangePercent > 5 ? "up" : "stable",
      timestamp: now,
    })
  }

  if (input.communityReportsCount !== undefined) {
    const score = clamp(input.communityReportsCount * 2, 0, 100)
    signals.push({
      id: "community",
      name: "Community crisis reports",
      category: "community",
      value: input.communityReportsCount,
      score,
      weight: SIGNAL_WEIGHTS.community,
      description: `${input.communityReportsCount} crisis reports in the last 24h`,
      direction: input.communityReportsCount > 20 ? "up" : "stable",
      timestamp: now,
    })
  }

  if (input.globalOilChangePercent !== undefined) {
    const score = scoreFromChange(input.globalOilChangePercent, [5, 15, 30])
    signals.push({
      id: "globalOil",
      name: "Global oil prices",
      category: "fuel",
      value: input.globalOilChangePercent,
      score,
      weight: SIGNAL_WEIGHTS.globalOil,
      description: `Brent crude ${input.globalOilChangePercent > 0 ? "up" : "down"} ${Math.abs(input.globalOilChangePercent).toFixed(1)}%`,
      direction: input.globalOilChangePercent > 3 ? "up" : input.globalOilChangePercent < -3 ? "down" : "stable",
      timestamp: now,
    })
  }

  if (input.inflationMoM !== undefined) {
    const score = scoreFromChange(input.inflationMoM, [1, 3, 8])
    signals.push({
      id: "inflation",
      name: "Monthly inflation",
      category: "food",
      value: input.inflationMoM,
      score,
      weight: SIGNAL_WEIGHTS.inflation,
      description: `Month-over-month inflation at ${input.inflationMoM.toFixed(1)}%`,
      direction: input.inflationMoM > 1 ? "up" : input.inflationMoM < -0.5 ? "down" : "stable",
      timestamp: now,
    })
  }

  const totalWeight = signals.reduce((s, sig) => s + sig.weight, 0) || 1
  const compositeScore = clamp(
    Math.round(signals.reduce((s, sig) => s + sig.score * sig.weight, 0) / totalWeight),
    0,
    100,
  )

  const level = severityFromScore(compositeScore)
  const { headline, description, recommendations } = generateAdvice(level, signals)

  return {
    level,
    score: compositeScore,
    signals,
    headline,
    description,
    recommendations,
    timestamp: now,
  }
}

function severityFromScore(score: number): SeverityLevel {
  if (score >= 75) return "red"
  if (score >= 50) return "orange"
  if (score >= 25) return "yellow"
  return "green"
}

function generateAdvice(
  level: SeverityLevel,
  signals: CrisisSignal[],
): { headline: string; description: string; recommendations: string[] } {
  const topSignal = signals.reduce(
    (best, s) => (s.score * s.weight > best.score * best.weight ? s : best),
    signals[0] ?? { name: "Unknown", score: 0, weight: 0 },
  )

  switch (level) {
    case "red":
      return {
        headline: "Economic Emergency",
        description: `Critical conditions detected. Primary driver: ${topSignal.name}. Immediate action recommended.`,
        recommendations: [
          "Stock up on essential goods now before prices rise further",
          "Avoid large LRD-denominated transactions if possible",
          "Contact diaspora family for emergency support",
          "Monitor TrueRate for real-time price updates",
          "Report price gouging to help your community",
        ],
      }
    case "orange":
      return {
        headline: "High Economic Stress",
        description: `Significant price pressures building. Key concern: ${topSignal.name}. Budget adjustments advisable.`,
        recommendations: [
          "Review your budget and cut non-essential spending",
          "Buy essentials in bulk where possible",
          "Consider alternative goods (local rice vs imported, charcoal vs gas)",
          "Set rate alerts for your target exchange rate",
          "Share availability information with your community",
        ],
      }
    case "yellow":
      return {
        headline: "Elevated Conditions",
        description: `Above-normal price movements detected. Watch: ${topSignal.name}. Stay informed.`,
        recommendations: [
          "Keep an eye on fuel and food prices this week",
          "Consider locking in any planned purchases",
          "Set up price alerts on TrueRate",
          "Build your emergency fund if you can",
        ],
      }
    default:
      return {
        headline: "Stable Economy",
        description: "No significant price shocks detected. Good time for planning ahead.",
        recommendations: [
          "Build or grow your emergency fund",
          "Compare remittance providers for best rates",
          "Use the budget planner to track spending",
          "Report any unusual prices you encounter",
        ],
      }
  }
}

export const SEVERITY_COLORS: Record<SeverityLevel, { bg: string; text: string; border: string; label: string }> = {
  green: { bg: "bg-green-500/10", text: "text-green-700 dark:text-green-400", border: "border-green-500/30", label: "Stable" },
  yellow: { bg: "bg-yellow-500/10", text: "text-yellow-700 dark:text-yellow-400", border: "border-yellow-500/30", label: "Elevated" },
  orange: { bg: "bg-orange-500/10", text: "text-orange-700 dark:text-orange-400", border: "border-orange-500/30", label: "High" },
  red: { bg: "bg-red-500/10", text: "text-red-700 dark:text-red-400", border: "border-red-500/30", label: "Critical" },
}
