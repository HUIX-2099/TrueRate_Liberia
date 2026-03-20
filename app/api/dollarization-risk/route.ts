import { NextResponse } from "next/server"
import { getServerApiUrl } from "@/lib/api/server-base-url"

export const dynamic = "force-dynamic"
export const revalidate = 0

/** Linear regression slope of y over x (index). */
function slope(y: number[]): number {
  const n = y.length
  if (n < 2) return 0
  const sumX = (n * (n - 1)) / 2
  const sumY = y.reduce((a, b) => a + b, 0)
  const sumXY = y.reduce((acc, yi, i) => acc + i * yi, 0)
  const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6
  const denom = n * sumX2 - sumX * sumX
  if (denom === 0) return 0
  return (n * sumXY - sumX * sumY) / denom
}

/** Sample std dev of daily log returns (as decimal). */
function volatilityFromCloses(closes: number[]): number {
  if (closes.length < 2) return 0
  const returns: number[] = []
  for (let i = 1; i < closes.length; i++) {
    if (closes[i - 1] > 0) returns.push(Math.log(closes[i] / closes[i - 1]))
  }
  if (returns.length < 2) return 0
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length
  const variance = returns.reduce((s, r) => s + (r - mean) ** 2, 0) / (returns.length - 1)
  return Math.sqrt(variance)
}

/**
 * GET /api/dollarization-risk
 * Returns USD demand pressure, LRD weakening trend, and market liquidity risk (0–100 each).
 * Bloomberg-style dollarization risk indicator for Liberia.
 */
export async function GET() {
  try {
    const days = 30
    const [candlesRes, marketRiskRes] = await Promise.all([
      fetch(getServerApiUrl(`/api/rates/candles?days=${days}`), { next: { revalidate: 0 } }),
      fetch(getServerApiUrl(`/api/market-risk?days=${days}`), { next: { revalidate: 0 } }),
    ])

    const candlesData = candlesRes.ok ? await candlesRes.json() : null
    const marketRiskData = marketRiskRes.ok ? await marketRiskRes.json() : null

    const candles: Array<{ date: string; open: number; high: number; low: number; close: number }> =
      candlesData?.candles ?? []
    const closes = candles.map((c) => c.close).filter((c) => typeof c === "number")
    const marketRiskScore = typeof marketRiskData?.marketRiskScore === "number" ? marketRiskData.marketRiskScore : 40
    const demandContribution = typeof marketRiskData?.drivers?.demandContribution === "number"
      ? marketRiskData.drivers.demandContribution
      : 0.2
    const demandScore = Math.round(demandContribution * 100)

    const n = closes.length
    const rateSlope = n >= 7 ? slope(closes) : 0
    const vol = n >= 2 ? volatilityFromCloses(closes) : 0
    const avgRate = n > 0 ? closes.reduce((a, b) => a + b, 0) / n : 0
    const range = n > 0 ? Math.max(...closes) - Math.min(...closes) : 0
    const rangePct = avgRate > 0 ? (range / avgRate) * 100 : 0

    // LRD weakening: positive slope = LRD weakening. Map slope (e.g. -0.5 to +0.5 LRD/day) to 0–100.
    const slopePerDay = rateSlope
    const slopeNorm = Math.max(-0.5, Math.min(0.5, slopePerDay))
    const lrdWeakeningTrend = Math.round(50 + slopeNorm * 100)

    // USD demand pressure: rising rate + high demand score = more pressure. 0–100.
    const trendComponent = Math.max(0, Math.min(100, 50 + slopePerDay * 80))
    const demandComponent = demandScore
    const usdDemandPressure = Math.round(0.55 * trendComponent + 0.45 * demandComponent)

    // Market liquidity risk: volatility (annualized as %) + range + market risk. 0–100.
    const volPct = vol * Math.sqrt(252) * 100
    const volScore = Math.min(100, volPct * 4)
    const rangeScore = Math.min(100, rangePct * 5)
    const marketLiquidityRisk = Math.round(
      Math.min(100, 0.4 * volScore + 0.2 * rangeScore + 0.4 * marketRiskScore)
    )

    const clamp = (x: number) => Math.max(0, Math.min(100, Math.round(x)))
    return NextResponse.json({
      usdDemandPressure: clamp(usdDemandPressure),
      lrdWeakeningTrend: clamp(lrdWeakeningTrend),
      marketLiquidityRisk: clamp(marketLiquidityRisk),
      period: `Last ${days} days`,
      inputs: {
        rateSlopePerDay: parseFloat(rateSlope.toFixed(4)),
        volatilityAnnualizedPct: parseFloat((vol * Math.sqrt(252) * 100).toFixed(2)),
        rangePct: parseFloat(rangePct.toFixed(2)),
        marketRiskScore,
        demandContribution,
      },
      computedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Dollarization risk]", error)
    return NextResponse.json(
      {
        error: "Dollarization risk computation failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
