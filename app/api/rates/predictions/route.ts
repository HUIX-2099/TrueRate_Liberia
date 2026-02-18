import { NextResponse, type NextRequest } from "next/server"
import { generateHistoricalData } from "@/lib/api/multi-source-rates"
import { generateAdvancedPredictions } from "@/lib/api/advanced-prediction"
import { fetchCblHistoricalRates } from "@/lib/cbl-rates"
import { fetchXeChartsRate } from "@/lib/xe-charts"

// Mark as dynamic route
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const requestedDays = Number.parseInt(searchParams.get("days") || "30")
    const days = Number.isFinite(requestedDays) ? Math.min(Math.max(requestedDays, 1), 30) : 30

    // Prefer real CBL buying/selling rates from https://cbl.org.lr/research/buying-selling-rates
    const trainingDays = 90
    let historicalData: Array<{ date: string; rate: number }>
    let dataSource = "synthetic"

    const cbl = await fetchCblHistoricalRates(trainingDays)
    if (cbl.historical.length >= 14) {
      historicalData = cbl.historical.map((p) => ({ date: p.date, rate: p.rate }))
      dataSource = cbl.source
    } else {
      const generated = generateHistoricalData(trainingDays)
      historicalData = generated.map((p) => ({ date: p.date, rate: p.rate }))
    }

    // Anchor with current rate from Xe currency charts (mid-market close)
    const today = new Date().toISOString().split("T")[0]
    const xeCharts = await fetchXeChartsRate()
    if (xeCharts && xeCharts.rate > 100 && xeCharts.rate < 300) {
      const last = historicalData[historicalData.length - 1]
      if (last?.date === today) {
        historicalData[historicalData.length - 1] = { date: today, rate: xeCharts.rate }
      } else {
        historicalData = [...historicalData, { date: today, rate: xeCharts.rate }]
      }
      dataSource = dataSource === "synthetic" ? `Xe charts + ${dataSource}` : `${dataSource} + Xe charts`
    }

    // Use advanced ensemble prediction
    const predictions = generateAdvancedPredictions(historicalData)

    return NextResponse.json({
      predictions: predictions.slice(0, Math.min(days, 30)),
      models: ["SMA", "EMA", "Linear Regression", "ARIMA", "Seasonal Decomposition"],
      methodology: "Ensemble learning with 5 ML models",
      explanation: `Based on the last ${trainingDays} days of rate history (${dataSource}). Latest rate from Xe currency charts when available. Ensemble of 5 models: SMA, EMA, Linear Regression, ARIMA, Seasonal. Forecasts become less certain further out.`,
      trainingDays,
      dataSource,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Error in predictions API:", error)
    return NextResponse.json({ error: "Failed to generate predictions" }, { status: 500 })
  }
}
