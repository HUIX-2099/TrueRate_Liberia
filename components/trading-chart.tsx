"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  CandlestickChart,
  LineChart,
  BarChart3,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react"

interface CandleData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface Prediction {
  date: string
  predicted: number
  confidence: number
}

interface TradingChartProps {
  data: CandleData[]
  predictions: Prediction[]
  currentRate: number
}

export function TradingChart({ data, predictions, currentRate }: TradingChartProps) {
  const [chartType, setChartType] = useState<"candle" | "line" | "area">("candle")
  const [timeframe, setTimeframe] = useState<"1D" | "1W" | "1M" | "3M">("1M")
  const [hoveredCandle, setHoveredCandle] = useState<CandleData | null>(null)
  const [animationProgress, setAnimationProgress] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Generate realistic demo data if none provided
  const generateDemoData = (): CandleData[] => {
    const days = timeframe === "1D" ? 24 : timeframe === "1W" ? 7 : timeframe === "1M" ? 30 : 90
    const data: CandleData[] = []
    let price = currentRate - 5
    
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (days - i))
      
      const volatility = 0.5 + Math.random() * 1.5
      const trend = Math.sin(i / 10) * 0.3 + (Math.random() - 0.5) * 0.5
      
      const open = price
      const change = trend + (Math.random() - 0.5) * volatility
      price = Math.max(150, Math.min(200, price + change))
      const close = price
      const high = Math.max(open, close) + Math.random() * volatility
      const low = Math.min(open, close) - Math.random() * volatility
      const volume = Math.floor(50000 + Math.random() * 200000)

      data.push({
        date: date.toISOString().split("T")[0],
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume,
      })
    }
    return data
  }

  const chartData = data.length > 0 ? data : generateDemoData()

  // Animation effect
  useEffect(() => {
    setAnimationProgress(0)
    const interval = setInterval(() => {
      setAnimationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 20)
    return () => clearInterval(interval)
  }, [timeframe, chartType])

  // Canvas rendering for smooth animations
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    const padding = { top: 20, right: 60, bottom: 40, left: 20 }
    const chartWidth = rect.width - padding.left - padding.right
    const chartHeight = rect.height - padding.top - padding.bottom

    // Calculate price range
    const prices = chartData.flatMap((d) => [d.high, d.low])
    const minPrice = Math.min(...prices) - 1
    const maxPrice = Math.max(...prices) + 1
    const priceRange = maxPrice - minPrice

    // Animated data slice
    const visibleData = chartData.slice(0, Math.ceil((chartData.length * animationProgress) / 100))

    // Draw grid
    ctx.strokeStyle = "rgba(128, 128, 128, 0.1)"
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(rect.width - padding.right, y)
      ctx.stroke()

      // Price labels
      const price = maxPrice - (priceRange / 5) * i
      ctx.fillStyle = "rgba(128, 128, 128, 0.8)"
      ctx.font = "11px monospace"
      ctx.textAlign = "left"
      ctx.fillText(price.toFixed(2), rect.width - padding.right + 5, y + 4)
    }

    const candleWidth = Math.max(3, chartWidth / chartData.length - 2)
    const getX = (i: number) => padding.left + (chartWidth / chartData.length) * i + candleWidth / 2
    const getY = (price: number) => padding.top + ((maxPrice - price) / priceRange) * chartHeight

    if (chartType === "candle") {
      // Draw candlesticks
      visibleData.forEach((candle, i) => {
        const x = getX(i)
        const isUp = candle.close >= candle.open

        // Wick
        ctx.strokeStyle = isUp ? "#22c55e" : "#ef4444"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x, getY(candle.high))
        ctx.lineTo(x, getY(candle.low))
        ctx.stroke()

        // Body
        const bodyTop = getY(Math.max(candle.open, candle.close))
        const bodyBottom = getY(Math.min(candle.open, candle.close))
        const bodyHeight = Math.max(1, bodyBottom - bodyTop)

        ctx.fillStyle = isUp ? "#22c55e" : "#ef4444"
        ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight)
      })
    } else if (chartType === "line" || chartType === "area") {
      // Draw line/area chart
      ctx.beginPath()
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 2

      visibleData.forEach((candle, i) => {
        const x = getX(i)
        const y = getY(candle.close)
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()

      if (chartType === "area") {
        // Fill area
        ctx.lineTo(getX(visibleData.length - 1), padding.top + chartHeight)
        ctx.lineTo(getX(0), padding.top + chartHeight)
        ctx.closePath()
        const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight)
        gradient.addColorStop(0, "rgba(59, 130, 246, 0.3)")
        gradient.addColorStop(1, "rgba(59, 130, 246, 0)")
        ctx.fillStyle = gradient
        ctx.fill()
      }
    }

    // Draw predictions (dashed line)
    if (predictions.length > 0 && animationProgress === 100) {
      ctx.setLineDash([5, 5])
      ctx.strokeStyle = "#f59e0b"
      ctx.lineWidth = 2
      ctx.beginPath()

      const lastDataPoint = chartData[chartData.length - 1]
      ctx.moveTo(getX(chartData.length - 1), getY(lastDataPoint.close))

      predictions.forEach((pred, i) => {
        const x = getX(chartData.length + i)
        const y = getY(pred.predicted)
        ctx.lineTo(x, y)
      })
      ctx.stroke()
      ctx.setLineDash([])

      // Prediction dots
      predictions.forEach((pred, i) => {
        const x = getX(chartData.length + i)
        const y = getY(pred.predicted)
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = "#f59e0b"
        ctx.fill()
      })
    }

    // Current price line
    if (animationProgress === 100) {
      ctx.setLineDash([3, 3])
      ctx.strokeStyle = "#8b5cf6"
      ctx.lineWidth = 1
      const currentY = getY(currentRate)
      ctx.beginPath()
      ctx.moveTo(padding.left, currentY)
      ctx.lineTo(rect.width - padding.right, currentY)
      ctx.stroke()
      ctx.setLineDash([])

      // Current price label
      ctx.fillStyle = "#8b5cf6"
      ctx.fillRect(rect.width - padding.right + 2, currentY - 10, 55, 20)
      ctx.fillStyle = "#fff"
      ctx.font = "bold 11px monospace"
      ctx.fillText(currentRate.toFixed(2), rect.width - padding.right + 5, currentY + 4)
    }

    // Volume bars at bottom
    const maxVolume = Math.max(...chartData.map((d) => d.volume))
    const volumeHeight = 30
    visibleData.forEach((candle, i) => {
      const x = getX(i)
      const barHeight = (candle.volume / maxVolume) * volumeHeight
      const isUp = candle.close >= candle.open
      ctx.fillStyle = isUp ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"
      ctx.fillRect(
        x - candleWidth / 2,
        rect.height - padding.bottom / 2 - barHeight,
        candleWidth,
        barHeight
      )
    })
  }, [chartData, predictions, currentRate, chartType, animationProgress])

  // Calculate stats
  const lastCandle = chartData[chartData.length - 1]
  const firstCandle = chartData[0]
  const change = lastCandle ? lastCandle.close - firstCandle.close : 0
  const changePercent = firstCandle ? (change / firstCandle.close) * 100 : 0

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <CardTitle className="text-xl">USD/LRD</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{currentRate.toFixed(2)}</span>
              <Badge
                variant={change >= 0 ? "destructive" : "default"}
                className={change >= 0 ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"}
              >
                {change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {change >= 0 ? "+" : ""}{changePercent.toFixed(2)}%
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Tabs value={chartType} onValueChange={(v) => setChartType(v as typeof chartType)}>
              <TabsList className="h-8">
                <TabsTrigger value="candle" className="h-6 px-2">
                  <CandlestickChart className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="line" className="h-6 px-2">
                  <LineChart className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="area" className="h-6 px-2">
                  <BarChart3 className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as typeof timeframe)}>
              <TabsList className="h-8">
                <TabsTrigger value="1D" className="h-6 px-2 text-xs">1D</TabsTrigger>
                <TabsTrigger value="1W" className="h-6 px-2 text-xs">1W</TabsTrigger>
                <TabsTrigger value="1M" className="h-6 px-2 text-xs">1M</TabsTrigger>
                <TabsTrigger value="3M" className="h-6 px-2 text-xs">3M</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-[400px] md:h-[500px]"
            style={{ display: "block" }}
          />
          
          {/* Hover info tooltip */}
          {hoveredCandle && (
            <div className="absolute top-4 left-4 bg-card/95 backdrop-blur border rounded-lg p-3 shadow-lg text-sm">
              <div className="font-medium mb-2">{hoveredCandle.date}</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <span className="text-muted-foreground">Open:</span>
                <span className="font-mono">{hoveredCandle.open.toFixed(2)}</span>
                <span className="text-muted-foreground">High:</span>
                <span className="font-mono text-green-500">{hoveredCandle.high.toFixed(2)}</span>
                <span className="text-muted-foreground">Low:</span>
                <span className="font-mono text-red-500">{hoveredCandle.low.toFixed(2)}</span>
                <span className="text-muted-foreground">Close:</span>
                <span className="font-mono">{hoveredCandle.close.toFixed(2)}</span>
                <span className="text-muted-foreground">Volume:</span>
                <span className="font-mono">{hoveredCandle.volume.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded" />
              <span>Bullish</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded" />
              <span>Bearish</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-amber-500" style={{ borderStyle: "dashed" }} />
              <span>Prediction</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-violet-500" />
              <span>Current</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
