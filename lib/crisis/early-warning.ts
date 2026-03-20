/**
 * Early warning system for price hikes and economic shocks.
 *
 * Integrates multiple signals to predict crises BEFORE they happen:
 *   - Global crude oil price trends (Brent)
 *   - LRD depreciation velocity
 *   - Import volume drops
 *   - Regional fuel price movements
 *   - Government fiscal signals
 */

export interface WarningSignal {
  id: string
  name: string
  category: "global_oil" | "currency" | "imports" | "regional" | "fiscal" | "commodity"
  status: "normal" | "watch" | "warning" | "alert"
  value: number
  unit: string
  changePercent: number
  changePeriod: string
  description: string
  lastUpdated: string
}

export interface EarlyWarningResult {
  overallRisk: "low" | "moderate" | "high" | "critical"
  riskScore: number
  signals: WarningSignal[]
  predictions: WarningPrediction[]
  timestamp: string
}

export interface WarningPrediction {
  commodity: string
  direction: "up" | "down" | "stable"
  confidence: number
  timeframe: string
  estimatedChangePercent: number
  drivers: string[]
}

function signalStatus(changePercent: number, thresholds: [number, number, number]): WarningSignal["status"] {
  const abs = Math.abs(changePercent)
  if (abs >= thresholds[2]) return "alert"
  if (abs >= thresholds[1]) return "warning"
  if (abs >= thresholds[0]) return "watch"
  return "normal"
}

export function computeEarlyWarnings(params: {
  brentCrudePrice?: number
  brentCrudeChange30d?: number
  exchangeRate?: number
  exchangeRateChange30d?: number
  importVolumeChange?: number
  regionalFuelPrices?: Array<{ country: string; priceUSD: number; change: number }>
  fuelPriceLocal?: number
  fuelPriceChange7d?: number
  ricePriceChange30d?: number
}): EarlyWarningResult {
  const signals: WarningSignal[] = []
  const now = new Date().toISOString()

  if (params.brentCrudePrice !== undefined && params.brentCrudeChange30d !== undefined) {
    signals.push({
      id: "brent_crude",
      name: "Brent Crude Oil",
      category: "global_oil",
      status: signalStatus(params.brentCrudeChange30d, [5, 15, 25]),
      value: params.brentCrudePrice,
      unit: "USD/barrel",
      changePercent: params.brentCrudeChange30d,
      changePeriod: "30 days",
      description: params.brentCrudeChange30d > 10
        ? "Global oil prices surging — expect domestic fuel hike within 2-4 weeks"
        : params.brentCrudeChange30d > 5
          ? "Oil prices rising — monitor for potential fuel price adjustment"
          : "Oil prices stable",
      lastUpdated: now,
    })
  }

  if (params.exchangeRate !== undefined && params.exchangeRateChange30d !== undefined) {
    signals.push({
      id: "lrd_depreciation",
      name: "LRD Depreciation Velocity",
      category: "currency",
      status: signalStatus(params.exchangeRateChange30d, [3, 8, 15]),
      value: params.exchangeRate,
      unit: "LRD/USD",
      changePercent: params.exchangeRateChange30d,
      changePeriod: "30 days",
      description: params.exchangeRateChange30d > 8
        ? "Rapid LRD weakening — imported goods will become significantly more expensive"
        : params.exchangeRateChange30d > 3
          ? "LRD depreciating — watch for price pass-through to imports"
          : "Exchange rate relatively stable",
      lastUpdated: now,
    })
  }

  if (params.importVolumeChange !== undefined) {
    signals.push({
      id: "import_volume",
      name: "Import Volumes",
      category: "imports",
      status: params.importVolumeChange < -20
        ? "alert"
        : params.importVolumeChange < -10
          ? "warning"
          : params.importVolumeChange < -5
            ? "watch"
            : "normal",
      value: params.importVolumeChange,
      unit: "% change",
      changePercent: params.importVolumeChange,
      changePeriod: "30 days",
      description: params.importVolumeChange < -15
        ? "Sharp drop in imports — shortage risk for essential goods"
        : params.importVolumeChange < -5
          ? "Import volumes declining — potential supply tightening"
          : "Import flows normal",
      lastUpdated: now,
    })
  }

  if (params.regionalFuelPrices?.length) {
    const avgChange = params.regionalFuelPrices.reduce((s, r) => s + r.change, 0) / params.regionalFuelPrices.length
    const rising = params.regionalFuelPrices.filter((r) => r.change > 5)
    signals.push({
      id: "regional_fuel",
      name: "Regional Fuel Prices",
      category: "regional",
      status: signalStatus(avgChange, [5, 12, 20]),
      value: avgChange,
      unit: "% avg change",
      changePercent: avgChange,
      changePeriod: "30 days",
      description: rising.length >= 2
        ? `Fuel rising in ${rising.map((r) => r.country).join(", ")} — Liberia likely to follow`
        : "Regional fuel prices stable",
      lastUpdated: now,
    })
  }

  if (params.fuelPriceLocal !== undefined && params.fuelPriceChange7d !== undefined) {
    signals.push({
      id: "local_fuel",
      name: "Local Fuel Price",
      category: "commodity",
      status: signalStatus(params.fuelPriceChange7d, [5, 15, 25]),
      value: params.fuelPriceLocal,
      unit: "LRD/gallon",
      changePercent: params.fuelPriceChange7d,
      changePeriod: "7 days",
      description: params.fuelPriceChange7d > 15
        ? "Major fuel price hike underway"
        : params.fuelPriceChange7d > 5
          ? "Fuel prices rising"
          : "Fuel prices stable",
      lastUpdated: now,
    })
  }

  if (params.ricePriceChange30d !== undefined) {
    signals.push({
      id: "rice_price",
      name: "Rice Price Trend",
      category: "commodity",
      status: signalStatus(params.ricePriceChange30d, [5, 12, 20]),
      value: params.ricePriceChange30d,
      unit: "% change",
      changePercent: params.ricePriceChange30d,
      changePeriod: "30 days",
      description: params.ricePriceChange30d > 10
        ? "Rice prices surging — food security concern"
        : params.ricePriceChange30d > 5
          ? "Rice prices trending up"
          : "Rice prices stable",
      lastUpdated: now,
    })
  }

  const predictions = generatePredictions(signals, params)

  const alertCount = signals.filter((s) => s.status === "alert").length
  const warningCount = signals.filter((s) => s.status === "warning").length
  const watchCount = signals.filter((s) => s.status === "watch").length

  const riskScore = Math.min(
    100,
    alertCount * 30 + warningCount * 15 + watchCount * 5,
  )

  const overallRisk: EarlyWarningResult["overallRisk"] =
    riskScore >= 70 ? "critical" : riskScore >= 45 ? "high" : riskScore >= 20 ? "moderate" : "low"

  return { overallRisk, riskScore, signals, predictions, timestamp: now }
}

function generatePredictions(
  signals: WarningSignal[],
  params: Parameters<typeof computeEarlyWarnings>[0],
): WarningPrediction[] {
  const predictions: WarningPrediction[] = []

  const oilSignal = signals.find((s) => s.id === "brent_crude")
  const fxSignal = signals.find((s) => s.id === "lrd_depreciation")
  const fuelSignal = signals.find((s) => s.id === "local_fuel")

  const oilUp = (oilSignal?.changePercent ?? 0) > 5
  const fxWeakening = (fxSignal?.changePercent ?? 0) > 3
  const fuelRising = (fuelSignal?.changePercent ?? 0) > 5

  if (oilUp || fxWeakening) {
    const fuelEstimate = (oilSignal?.changePercent ?? 0) * 0.6 + (fxSignal?.changePercent ?? 0) * 0.4
    predictions.push({
      commodity: "Fuel (PMS)",
      direction: "up",
      confidence: Math.min(0.9, 0.5 + (oilUp ? 0.2 : 0) + (fxWeakening ? 0.15 : 0)),
      timeframe: "2-4 weeks",
      estimatedChangePercent: Number(fuelEstimate.toFixed(1)),
      drivers: [
        ...(oilUp ? ["Global oil price increase"] : []),
        ...(fxWeakening ? ["LRD depreciation"] : []),
      ],
    })
  }

  if (fuelRising || fxWeakening) {
    const foodEstimate = (fuelSignal?.changePercent ?? 0) * 0.35 + (fxSignal?.changePercent ?? 0) * 0.25
    predictions.push({
      commodity: "Food basket",
      direction: foodEstimate > 2 ? "up" : "stable",
      confidence: Math.min(0.85, 0.4 + (fuelRising ? 0.2 : 0) + (fxWeakening ? 0.15 : 0)),
      timeframe: "1-3 weeks",
      estimatedChangePercent: Number(foodEstimate.toFixed(1)),
      drivers: [
        ...(fuelRising ? ["Fuel price increase (transport costs)"] : []),
        ...(fxWeakening ? ["Import cost increase from LRD weakness"] : []),
      ],
    })
  }

  if (fuelRising) {
    predictions.push({
      commodity: "Transportation",
      direction: "up",
      confidence: 0.85,
      timeframe: "1-7 days",
      estimatedChangePercent: Number(((fuelSignal?.changePercent ?? 0) * 0.7).toFixed(1)),
      drivers: ["Direct fuel cost pass-through to fares"],
    })
  }

  if (predictions.length === 0) {
    predictions.push({
      commodity: "General prices",
      direction: "stable",
      confidence: 0.7,
      timeframe: "2-4 weeks",
      estimatedChangePercent: 0,
      drivers: ["No significant shock signals detected"],
    })
  }

  return predictions
}
