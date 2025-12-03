import { NextResponse } from "next/server"
import { generateHistoricalData } from "@/lib/api/multi-source-rates"
import { generateAdvancedPredictions } from "@/lib/api/advanced-prediction"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "30")

    // Generate historical data for ML training
    const historicalData = generateHistoricalData(90)

    // Use advanced ensemble prediction
    const predictions = generateAdvancedPredictions(historicalData)

    return NextResponse.json({
      predictions: predictions.slice(0, Math.min(days, 30)),
      models: ["SMA", "EMA", "Linear Regression", "ARIMA", "Seasonal Decomposition"],
      methodology: "Ensemble learning with 5 ML models",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Error in predictions API:", error)
    return NextResponse.json({ error: "Failed to generate predictions" }, { status: 500 })
  }
}

export const revalidate = 3600 // Revalidate every hour
