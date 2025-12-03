export interface PredictionData {
  timestamp: Date
  predicted: number
  confidence: number
  method: "ma" | "exp" | "linear"
}

export interface AnalyticsData {
  volatility: number
  trend: "bullish" | "bearish" | "neutral"
  support: number
  resistance: number
  momentum: number
}

/**
 * Simple Moving Average prediction
 */
export function predictWithMA(rates: number[], periods = 7): PredictionData {
  if (rates.length < periods) {
    return {
      timestamp: new Date(),
      predicted: rates[rates.length - 1],
      confidence: 0.5,
      method: "ma",
    }
  }

  const ma = rates.slice(-periods).reduce((a, b) => a + b) / periods
  const lastRate = rates[rates.length - 1]
  const trend = lastRate > ma ? 1 : -1
  const confidence = Math.min(0.95, 0.6 + Math.abs(lastRate - ma) / lastRate)

  return {
    timestamp: new Date(),
    predicted: lastRate + trend * (Math.abs(lastRate - ma) * 0.5),
    confidence,
    method: "ma",
  }
}

/**
 * Exponential smoothing prediction
 */
export function predictWithExpSmoothing(rates: number[], alpha = 0.3): PredictionData {
  if (rates.length === 0) {
    return {
      timestamp: new Date(),
      predicted: 177.5,
      confidence: 0.5,
      method: "exp",
    }
  }

  let smoothed = rates[0]
  for (let i = 1; i < rates.length; i++) {
    smoothed = alpha * rates[i] + (1 - alpha) * smoothed
  }

  const lastRate = rates[rates.length - 1]
  const change = lastRate - smoothed
  const predicted = lastRate + change * 0.3

  return {
    timestamp: new Date(),
    predicted: Math.max(160, predicted),
    confidence: Math.min(0.9, 0.65 + Math.abs(change) / lastRate),
    method: "exp",
  }
}

/**
 * Linear regression prediction
 */
export function predictWithLinearRegression(rates: number[]): PredictionData {
  if (rates.length < 2) {
    return {
      timestamp: new Date(),
      predicted: rates[0] || 177.5,
      confidence: 0.4,
      method: "linear",
    }
  }

  const n = rates.length
  const x = Array.from({ length: n }, (_, i) => i)
  const y = rates

  const xSum = x.reduce((a, b) => a + b)
  const ySum = y.reduce((a, b) => a + b)
  const xySum = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
  const xxSum = x.reduce((sum, xi) => sum + xi * xi, 0)

  const slope = (n * xySum - xSum * ySum) / (n * xxSum - xSum * xSum)
  const intercept = (ySum - slope * xSum) / n

  const predicted = slope * (n + 1) + intercept
  const rSquared = calculateRSquared(rates, slope, intercept)
  const confidence = Math.min(0.95, Math.abs(rSquared))

  return {
    timestamp: new Date(),
    predicted: Math.max(160, predicted),
    confidence,
    method: "linear",
  }
}

/**
 * Calculate R-squared value
 */
function calculateRSquared(rates: number[], slope: number, intercept: number): number {
  const yMean = rates.reduce((a, b) => a + b) / rates.length
  const ssTotal = rates.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0)
  const ssRes = rates.reduce((sum, y, i) => {
    const predicted = slope * i + intercept
    return sum + Math.pow(y - predicted, 2)
  }, 0)

  return 1 - ssRes / ssTotal
}

/**
 * Generate analytics from rates
 */
export function generateAnalytics(rates: number[]): AnalyticsData {
  if (rates.length < 2) {
    return {
      volatility: 0,
      trend: "neutral",
      support: rates[0] - 1,
      resistance: rates[0] + 1,
      momentum: 0,
    }
  }

  // Volatility: standard deviation
  const mean = rates.reduce((a, b) => a + b) / rates.length
  const variance = rates.reduce((sum, rate) => sum + Math.pow(rate - mean, 2), 0) / rates.length
  const volatility = Math.sqrt(variance)

  // Support and Resistance
  const support = Math.min(...rates)
  const resistance = Math.max(...rates)

  // Trend
  const firstHalf = rates.slice(0, Math.floor(rates.length / 2))
  const secondHalf = rates.slice(Math.floor(rates.length / 2))
  const firstAvg = firstHalf.reduce((a, b) => a + b) / firstHalf.length
  const secondAvg = secondHalf.reduce((a, b) => a + b) / secondHalf.length

  let trend: "bullish" | "bearish" | "neutral" = "neutral"
  if (secondAvg > firstAvg * 1.002) trend = "bullish"
  else if (secondAvg < firstAvg * 0.998) trend = "bearish"

  // Momentum (rate of change)
  const momentum = ((rates[rates.length - 1] - rates[0]) / rates[0]) * 100

  return {
    volatility: Math.round(volatility * 100) / 100,
    trend,
    support,
    resistance,
    momentum: Math.round(momentum * 100) / 100,
  }
}
