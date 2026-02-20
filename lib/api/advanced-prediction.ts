/**
 * Forecasting models trained on central bank historical data (e.g. CBL buying/selling rates).
 * SMA, EMA, Linear Regression, ARIMA, and Seasonal decomposition are used for prediction.
 */

interface PredictionModel {
  name: string
  predict: (historicalData: number[]) => number[]
  weight: number
}

const SMA_WINDOW = 14 // days of history for moving average

// Simple Moving Average: trained on recent central bank history
function smaPredict(data: number[], periods: number): number[] {
  const predictions: number[] = []
  const n = data.length
  if (n === 0) return []
  for (let i = 0; i < periods; i++) {
    const window = Math.min(SMA_WINDOW + i, n)
    const recentData = data.slice(-window)
    const avg = recentData.reduce((sum, val) => sum + val, 0) / recentData.length
    predictions.push(avg)
  }
  return predictions
}

// Exponential Moving Average: alpha = 2/(span+1), more weight on recent CBL data
function emaPredict(data: number[], periods: number): number[] {
  const predictions: number[] = []
  const n = data.length
  if (n === 0) return []
  const span = 14
  const alpha = 2 / (span + 1)
  let ema = data[0] ?? 0
  for (let t = 1; t < n; t++) {
    ema = alpha * (data[t] ?? ema) + (1 - alpha) * ema
  }
  for (let i = 0; i < periods; i++) {
    predictions.push(ema)
    const trend = n >= 2 ? (data[n - 1] ?? ema) - (data[n - 2] ?? ema) : 0
    ema = ema + trend * 0.3
  }
  return predictions
}

// Linear Regression on central bank historical series (trend extrapolation)
function linearRegressionPredict(data: number[], periods: number): number[] {
  const n = data.length
  const x = Array.from({ length: n }, (_, i) => i)
  const y = data

  // Calculate slope and intercept
  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = y.reduce((a, b) => a + b, 0)
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0)

  const denominator = n * sumX2 - sumX * sumX
  if (denominator === 0 || n === 0) {
    return Array.from({ length: periods }, () => data[data.length - 1] ?? 0)
  }
  const slope = (n * sumXY - sumX * sumY) / denominator
  const intercept = (sumY - slope * sumX) / n

  const predictions: number[] = []
  for (let i = 0; i < periods; i++) {
    predictions.push(slope * (n + i) + intercept)
  }
  return predictions
}

// ARIMA-inspired autoregressive model trained on CBL history (order p=5)
function arimaPredict(data: number[], periods: number): number[] {
  const predictions: number[] = []
  const p = Math.min(5, Math.max(2, Math.floor(data.length / 10)))

  for (let i = 0; i < periods; i++) {
    const recent =
      i === 0 ? data.slice(-p) : [...data.slice(-Math.max(0, p - i)), ...predictions].slice(-p)
    const prediction =
      recent.length > 0 ? recent.reduce((sum, val) => sum + val, 0) / recent.length : data[data.length - 1] ?? 0
    predictions.push(prediction)
  }
  return predictions
}

// Seasonal decomposition (weekly) + trend from central bank historical data
function seasonalPredict(data: number[], periods: number): number[] {
  const predictions: number[] = []
  const seasonalPeriod = 7

  for (let i = 0; i < periods; i++) {
    const seasonalIndex = (data.length + i) % seasonalPeriod
    const seasonalValues = data.filter((_, idx) => idx % seasonalPeriod === seasonalIndex)
    const seasonal =
      seasonalValues.length > 0
        ? seasonalValues.reduce((a, b) => a + b, 0) / seasonalValues.length
        : data[data.length - 1] ?? 0
    const recentTrend = data.length >= seasonalPeriod ? (data[data.length - 1]! - data[data.length - seasonalPeriod]!) : 0
    predictions.push(Number((seasonal + (recentTrend / seasonalPeriod) * (i + 1)).toFixed(4)))
  }
  return predictions
}

const MODELS: PredictionModel[] = [
  { name: "SMA", predict: (data) => smaPredict(data, 30), weight: 0.15 },
  { name: "EMA", predict: (data) => emaPredict(data, 30), weight: 0.2 },
  { name: "Linear Regression", predict: (data) => linearRegressionPredict(data, 30), weight: 0.2 },
  { name: "ARIMA", predict: (data) => arimaPredict(data, 30), weight: 0.25 },
  { name: "Seasonal", predict: (data) => seasonalPredict(data, 30), weight: 0.2 },
]

export interface PredictionResult {
  date: string
  predicted: number
  confidence: number
  lower: number
  upper: number
}

export function generateAdvancedPredictions(historicalData: Array<{ rate: number }>): PredictionResult[] {
  const rates = historicalData.map((d) => d.rate)
  if (rates.length === 0) {
    return []
  }

  // Get predictions from all models
  const allPredictions = MODELS.map((model) => ({
    name: model.name,
    predictions: model.predict(rates),
    weight: model.weight,
  }))

  // Ensemble predictions (weighted average)
  const predictions: PredictionResult[] = []
  const now = Date.now()

  for (let i = 0; i < 30; i++) {
    const date = new Date(now + (i + 1) * 24 * 60 * 60 * 1000)

    // Weighted average of all model predictions
    let weightedSum = 0
    let totalWeight = 0

    allPredictions.forEach(({ predictions, weight }) => {
      if (predictions[i]) {
        weightedSum += predictions[i] * weight
        totalWeight += weight
      }
    })

    const predicted = weightedSum / totalWeight

    // Calculate variance between models for confidence
    const modelPredictions = allPredictions.map((p) => p.predictions[i]).filter(Boolean)
    const variance =
      modelPredictions.reduce((sum, pred) => sum + Math.pow(pred - predicted, 2), 0) / modelPredictions.length
    const stdDev = Math.sqrt(variance)

    // Confidence decreases with time and variance
    const timeDecay = Math.exp(-i / 15) // Exponential decay
    const confidence = Math.max(0.1, Math.min(0.95, (1 - stdDev / predicted) * timeDecay))

    predictions.push({
      date: date.toISOString().split("T")[0],
      predicted: Number(predicted.toFixed(2)),
      confidence: Number(confidence.toFixed(2)),
      lower: Number((predicted - stdDev * 2).toFixed(2)),
      upper: Number((predicted + stdDev * 2).toFixed(2)),
    })
  }

  return predictions
}
