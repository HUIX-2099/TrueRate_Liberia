import { NextResponse, type NextRequest } from "next/server"
import { generateHistoricalData } from "@/lib/api/multi-source-rates"
import { generateAdvancedPredictions } from "@/lib/api/advanced-prediction"

// Mark as dynamic route
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const requestedDays = Number.parseInt(searchParams.get("days") || "30")
    const days = Number.isFinite(requestedDays) ? Math.min(Math.max(requestedDays, 1), 30) : 30

    // Generate historical data for ML training (90 days)
    const trainingDays = 90
    const historicalData = generateHistoricalData(trainingDays)

    // Use advanced ensemble prediction
    const predictions = generateAdvancedPredictions(historicalData)

    return NextResponse.json({
      predictions: predictions.slice(0, Math.min(days, 30)),
      models: ["SMA", "EMA", "Linear Regression", "ARIMA", "Seasonal Decomposition"],
      methodology: "Ensemble learning with 5 ML models",
      explanation: `Based on the last ${trainingDays} days of rate history. Ensemble of 5 models: SMA, EMA, Linear Regression, ARIMA, Seasonal. Forecasts become less certain further out.`,
      trainingDays,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Error in predictions API:", error)
    return NextResponse.json({ error: "Failed to generate predictions" }, { status: 500 })
  }
}
