import { NextResponse, type NextRequest } from "next/server"
import { generateHistoricalData } from "@/lib/api/multi-source-rates"
import { generateAdvancedPredictions } from "@/lib/api/advanced-prediction"

// Mark as dynamic route
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
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
