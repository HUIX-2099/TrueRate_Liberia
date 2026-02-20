import { NextResponse, type NextRequest } from "next/server"
import { generateHistoricalData } from "@/lib/api/multi-source-rates"
import { generateAdvancedPredictions } from "@/lib/api/advanced-prediction"
import { fetchCblHistoricalRates } from "@/lib/cbl-rates"
import { fetchXeChartsRate } from "@/lib/xe-charts"

// Mark as dynamic route
export const dynamic = "force-dynamic"

/** Forecasts use central bank (CBL) historical data for training SMA, EMA, Linear Regression, ARIMA, and Seasonal models. */

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const requestedDays = Number.parseInt(searchParams.get("days") || "30")
    const days = Number.isFinite(requestedDays) ? Math.min(Math.max(requestedDays, 1), 30) : 30

    // Train on central bank historical data (up to 365 days when available)
    const maxTrainingDays = 365
    const cbl = await fetchCblHistoricalRates(maxTrainingDays)

    let historicalData: Array<{ date: string; rate: number }>
    let dataSource: string

    if (cbl.historical.length >= 14) {
      // Use only Central Bank of Liberia historical data for prediction training
      historicalData = cbl.historical.map((p) => ({ date: p.date, rate: p.rate }))
      dataSource = "Central Bank of Liberia"
    } else {
      // Fallback when CBL has insufficient data
      const generated = generateHistoricalData(90)
      historicalData = generated.map((p) => ({ date: p.date, rate: p.rate }))
      dataSource = "synthetic (CBL unavailable)"
    }

    // Optionally anchor last observation to current market (Xe) so forecasts extend from today's rate
    const today = new Date().toISOString().split("T")[0]
    const xeCharts = await fetchXeChartsRate()
    if (xeCharts && xeCharts.rate > 100 && xeCharts.rate < 300) {
      const last = historicalData[historicalData.length - 1]
      if (last?.date === today) {
        historicalData[historicalData.length - 1] = { date: today, rate: xeCharts.rate }
      } else {
        historicalData = [...historicalData, { date: today, rate: xeCharts.rate }]
      }
    }

    // Ensemble trained on central bank historical: SMA, EMA, Linear Regression, ARIMA, Seasonal
    const predictions = generateAdvancedPredictions(historicalData)

    const trainingDays = historicalData.length
    return NextResponse.json({
      predictions: predictions.slice(0, Math.min(days, 30)),
      models: ["SMA", "EMA", "Linear Regression", "ARIMA", "Seasonal Decomposition"],
      methodology: "Ensemble learning with 5 models trained on central bank historical data",
      explanation: `Forecasts use central bank historical data for prediction. Trained on ${trainingDays} days (${dataSource}). Models: SMA, EMA, Linear Regression, ARIMA, Seasonal. Forecasts become less certain further out.`,
      trainingDays,
      dataSource,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Error in predictions API:", error)
    return NextResponse.json({ error: "Failed to generate predictions" }, { status: 500 })
  }
}
