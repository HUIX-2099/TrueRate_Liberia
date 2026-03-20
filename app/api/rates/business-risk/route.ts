import { NextResponse } from "next/server"
import { getServerApiUrl } from "@/lib/api/server-base-url"
import { getCanonicalFallbackRate } from "@/lib/canonical-rate"

export const dynamic = "force-dynamic"
export const revalidate = 0

/** Annualized volatility (std dev of daily log returns) as percentage. */
function volatilityFromCloses(closes: number[]): number {
  if (closes.length < 2) return 0
  const returns: number[] = []
  for (let i = 1; i < closes.length; i++) {
    if (closes[i - 1]! > 0) returns.push(Math.log(closes[i]! / closes[i - 1]!))
  }
  if (returns.length < 2) return 0
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length
  const variance = returns.reduce((s, r) => s + (r - mean) ** 2, 0) / (returns.length - 1)
  const std = Math.sqrt(variance)
  return std * Math.sqrt(252) * 100
}

/** Linear regression slope (rate per day). */
function slope(closes: number[]): number {
  const n = closes.length
  if (n < 2) return 0
  const sumX = (n * (n - 1)) / 2
  const sumY = closes.reduce((a, b) => a + b, 0)
  const sumXY = closes.reduce((acc, y, i) => acc + i * y, 0)
  const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6
  const denom = n * sumX2 - sumX * sumX
  if (denom === 0) return 0
  return (n * sumXY - sumX * sumY) / denom
}

/**
 * GET /api/rates/business-risk
 * Returns 30-day trend, volatility, high-risk flag, rate movement analytics, and smart recommendation (Hold USD / Convert Now).
 */
export async function GET() {
  try {
    const res = await fetch(getServerApiUrl("/api/rates/candles?days=30"), { next: { revalidate: 0 } })
    if (!res.ok) throw new Error("Candles fetch failed")
    const data = (await res.json()) as {
      candles?: Array<{ date: string; open: number; high: number; low: number; close: number }>
      currentRate?: number
    }
    const candles = data?.candles ?? []
    const closes = candles.map((c) => c.close).filter((c) => typeof c === "number")
    const currentRate = data?.currentRate ?? closes[closes.length - 1] ?? getCanonicalFallbackRate()

    if (closes.length < 2) {
      return NextResponse.json({
        currentRate,
        trend30d: "neutral",
        trendPercent30d: 0,
        volatilityPercent: 0,
        dayChange: 0,
        dayChangePercent: 0,
        weekChange: 0,
        weekChangePercent: 0,
        isHighRiskPeriod: false,
        recommendation: "neutral" as const,
        reason: "Insufficient data.",
        analytics: { slopePerDay: 0 },
        period: "30 days",
        computedAt: new Date().toISOString(),
      })
    }

    const vol = volatilityFromCloses(closes)
    const rateStart = closes[0]!
    const rateEnd = closes[closes.length - 1]!
    const trendPercent30d = rateStart > 0 ? ((rateEnd - rateStart) / rateStart) * 100 : 0
    const slopePerDay = slope(closes)

    const dayChange = closes.length >= 2 ? rateEnd - (closes[closes.length - 2] ?? rateEnd) : 0
    const dayChangePercent = closes.length >= 2 && (closes[closes.length - 2] ?? 0) > 0
      ? (dayChange / (closes[closes.length - 2] ?? 1)) * 100
      : 0

    const weekAgo = closes.length >= 7 ? closes[closes.length - 7]! : rateStart
    const weekChange = rateEnd - weekAgo
    const weekChangePercent = weekAgo > 0 ? (weekChange / weekAgo) * 100 : 0

    const trend30d: "up" | "down" | "neutral" =
      trendPercent30d > 0.5 ? "up" : trendPercent30d < -0.5 ? "down" : "neutral"

    const isHighRiskPeriod = vol >= 12 || (trend30d === "up" && weekChangePercent >= 1.5)

    let recommendation: "hold_usd" | "convert_now" | "neutral"
    let reason: string

    if (isHighRiskPeriod && trend30d === "up") {
      recommendation = "hold_usd"
      reason = "LRD weakening with elevated volatility. Holding USD reduces exposure to further depreciation."
    } else if (trend30d === "down" || (trend30d === "neutral" && vol < 10)) {
      recommendation = "convert_now"
      reason = "Rate favorable or stable. Consider converting to lock in current levels before conditions shift."
    } else {
      recommendation = "neutral"
      reason = "Mixed signals. Monitor the 30-day trend and volatility before large conversions."
    }

    return NextResponse.json({
      currentRate,
      candles: candles.map((c) => ({ date: c.date, close: c.close })),
      trend30d,
      trendPercent30d: Number(trendPercent30d.toFixed(2)),
      volatilityPercent: Number(vol.toFixed(2)),
      dayChange: Number(dayChange.toFixed(2)),
      dayChangePercent: Number(dayChangePercent.toFixed(2)),
      weekChange: Number(weekChange.toFixed(2)),
      weekChangePercent: Number(weekChangePercent.toFixed(2)),
      isHighRiskPeriod,
      recommendation,
      reason,
      analytics: {
        slopePerDay: Number(slopePerDay.toFixed(4)),
        high30d: Math.max(...closes),
        low30d: Math.min(...closes),
      },
      period: "30 days",
      computedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Business risk]", error)
    return NextResponse.json(
      {
        error: "Business risk computation failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
