import { NextResponse } from "next/server"
import { getCommodityPriceSeries, getMonitoredCommodities } from "@/lib/monitoring/commodity-data"
import { computeVolatilitySeries } from "@/lib/monitoring/commodity-engine/volatility"
import { getImportRecords } from "@/lib/trade-analytics/data"
import { analyzeImportVolumes } from "@/lib/trade-analytics/import-volumes"
import { generateMarketDemandScore } from "@/lib/trade-analytics/market-demand-score"
import { detectDemandPatterns } from "@/lib/trade-analytics/demand-patterns"
import { computeMarketRisk } from "@/lib/market-risk"
import type { SupplyChange } from "@/lib/market-risk"
import { PRICE_INDEX_BASKET_ID } from "@/lib/price-index/basket"

export const dynamic = "force-dynamic"
export const revalidate = 0

/** Period-over-period import volume changes from volume analyses. */
function importVolumeChangesFromAnalyses(
  analyses: Array<{ period: string; totalVolume: number }>
): Array<{ period: string; changePercent: number; totalVolume?: number }> {
  const out: Array<{ period: string; changePercent: number; totalVolume?: number }> = []
  for (let i = 1; i < analyses.length; i++) {
    const prev = analyses[i - 1].totalVolume
    const curr = analyses[i].totalVolume
    const changePercent = prev !== 0 ? ((curr - prev) / prev) * 100 : 0
    out.push({
      period: analyses[i].period,
      changePercent: Number(changePercent.toFixed(2)),
      totalVolume: analyses[i].totalVolume,
    })
  }
  return out
}

/** Build market risk inputs from live/sample data. */
async function buildMarketRiskInputs(options: {
  days: number
  periods: number
  windowDays: number
  supplyChanges: SupplyChange[]
}) {
  const { days, periods, windowDays, supplyChanges } = options
  const commodities = getMonitoredCommodities()
  const commodityResults = await Promise.all(
    commodities.slice(0, 5).map((c) =>
      getCommodityPriceSeries({ commodityId: c.id, commodityName: c.name, days })
    )
  )
  const volatilitySeries = commodityResults.map(({ commodityId, commodityName, series }) =>
    computeVolatilitySeries(commodityId, commodityName, series, windowDays)
  )
  const allVolatilities = volatilitySeries.flatMap((s) => s.points.map((p) => p.volatility))
  const averageVolatilityPercent =
    allVolatilities.length > 0 ? allVolatilities.reduce((a, b) => a + b, 0) / allVolatilities.length : 0
  const maxVolatilityPercent = allVolatilities.length > 0 ? Math.max(...allVolatilities) : 0
  const periodFromVol = volatilitySeries[0]?.points[0]?.date.slice(0, 7)

  const records = await getImportRecords({ periods })
  const volumeAnalyses = analyzeImportVolumes(records)
  const importVolumeChanges = importVolumeChangesFromAnalyses(volumeAnalyses)
  const demandScores = generateMarketDemandScore(records, {})
  const patterns = detectDemandPatterns(records)
  const latestDemand = demandScores[demandScores.length - 1]
  const avgTrend =
    patterns.length > 0 ? patterns.reduce((a, p) => a + p.trendStrength, 0) / patterns.length : 0
  const demandStability = latestDemand?.drivers.volatility ?? 0.5

  return {
    commodityPriceVolatility: {
      period: periodFromVol,
      averageVolatilityPercent: Number(averageVolatilityPercent.toFixed(4)),
      maxVolatilityPercent: Number(maxVolatilityPercent.toFixed(4)),
      seriesCount: commodityResults.length,
    },
    supplyChanges,
    importVolumeChanges,
    marketDemandData: {
      period: latestDemand?.period,
      demandScore: latestDemand?.score ?? 50,
      trendStrength: latestDemand ? avgTrend : undefined,
      label: latestDemand?.label,
      demandStability,
    },
  }
}

/** GET /api/market-risk — Market risk score and price stability index from live/sample data. */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Math.min(365, Math.max(14, parseInt(searchParams.get("days") ?? "90", 10) || 90))
    const periods = Math.min(60, Math.max(6, parseInt(searchParams.get("periods") ?? "24", 10) || 24))
    const windowDays = Math.min(30, Math.max(3, parseInt(searchParams.get("window") ?? "7", 10) || 7))

    const inputs = await buildMarketRiskInputs({ days, periods, windowDays, supplyChanges: [] })
    const result = computeMarketRisk(inputs)
    return NextResponse.json({ ...result, priceIndexBasketId: PRICE_INDEX_BASKET_ID })
  } catch (error) {
    console.error("[Market risk]", error)
    return NextResponse.json(
      {
        error: "Market risk computation failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

/** POST /api/market-risk — Same as GET but allow supplying supplyChanges in body. */
export async function POST(request: Request) {
  try {
    let supplyChanges: SupplyChange[] = []
    try {
      const body = (await request.json()) as { supplyChanges?: Array<{ period: string; changePercent: number; category?: string }> }
      if (Array.isArray(body?.supplyChanges)) {
        supplyChanges = body.supplyChanges.map((s) => ({
          period: String(s.period),
          changePercent: Number(s.changePercent),
          category: s.category,
        }))
      }
    } catch {
      // no body or invalid JSON
    }

    const { searchParams } = new URL(request.url)
    const days = Math.min(365, Math.max(14, parseInt(searchParams.get("days") ?? "90", 10) || 90))
    const periods = Math.min(60, Math.max(6, parseInt(searchParams.get("periods") ?? "24", 10) || 24))
    const windowDays = Math.min(30, Math.max(3, parseInt(searchParams.get("window") ?? "7", 10) || 7))

    const inputs = await buildMarketRiskInputs({ days, periods, windowDays, supplyChanges })
    const result = computeMarketRisk(inputs)
    return NextResponse.json({
      ...result,
      priceIndexBasketId: PRICE_INDEX_BASKET_ID,
      supplyChangesUsed: supplyChanges.length,
    })
  } catch (error) {
    console.error("[Market risk POST]", error)
    return NextResponse.json(
      {
        error: "Market risk computation failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
