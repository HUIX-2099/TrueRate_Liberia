interface PredictionModel {
  name: string
  predict: (historicalData: number[]) => number[]
  weight: number
}

// Simple Moving Average
function smaPredict(data: number[], periods: number): number[] {
  const predictions: number[] = []
  for (let i = 0; i < periods; i++) {
    const recentData = data.slice(-(20 + i))
    const avg = recentData.reduce((sum, val) => sum + val, 0) / recentData.length
    predictions.push(avg)
  }
  return predictions
}

// Exponential Moving Average (more weight on recent data)
function emaPredict(data: number[], periods: number): number[] {
  const predictions: number[] = []
  const alpha = 0.3 // Smoothing factor

  let ema = data[data.length - 1]
  for (let i = 0; i < periods; i++) {
    predictions.push(ema)
    // Assume slight trend continuation
    const trend = data[data.length - 1] - data[data.length - 2]
    ema = ema + trend * 0.5
  }
  return predictions
}

// Linear Regression
function linearRegressionPredict(data: number[], periods: number): number[] {
  const n = data.length
  const x = Array.from({ length: n }, (_, i) => i)
  const y = data

  // Calculate slope and intercept
  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = y.reduce((a, b) => a + b, 0)
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0)

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  const predictions: number[] = []
  for (let i = 0; i < periods; i++) {
    predictions.push(slope * (n + i) + intercept)
  }
  return predictions
}

// ARIMA-inspired prediction (simplified)
function arimaPredict(data: number[], periods: number): number[] {
  const predictions: number[] = []
  const p = 3 // autoregressive order

  for (let i = 0; i < periods; i++) {
    const recent = i === 0 ? data.slice(-p) : [...data.slice(-p + i), ...predictions].slice(-p)
    // Simple AR model
    const prediction = recent.reduce((sum, val) => sum + val, 0) / p
    predictions.push(prediction)
  }
  return predictions
}

// Seasonal decomposition with trend
function seasonalPredict(data: number[], periods: number): number[] {
  const predictions: number[] = []
  const seasonalPeriod = 7 // Weekly seasonality

  for (let i = 0; i < periods; i++) {
    const seasonalIndex = (data.length + i) % seasonalPeriod
    const seasonalValues = data.filter((_, idx) => idx % seasonalPeriod === seasonalIndex)
    const seasonal = seasonalValues.reduce((a, b) => a + b, 0) / seasonalValues.length

    // Add trend
    const recentTrend = data[data.length - 1] - data[data.length - 8]
    predictions.push(seasonal + (recentTrend / 7) * i)
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
