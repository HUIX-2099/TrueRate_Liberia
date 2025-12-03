"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart, Line } from "recharts"
import { AlertCircle, TrendingUp, TrendingDown, Zap } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { useTheme } from "next-themes"
import {
  predictWithMA,
  predictWithExpSmoothing,
  predictWithLinearRegression,
  generateAnalytics,
  type AnalyticsData,
} from "@/lib/prediction-engine"

interface ChartDataPoint {
  day: string
  predicted: number
  ma: number
  exp: number
  linear: number
  confidence: number
}

interface EconomicFactor {
  factor: string
  impact: number
  explanation: string
  icon: string
  category: string
}

export default function PredictPage() {
  const [predictions, setPredictions] = useState<ChartDataPoint[]>([])
  const [currentRate, setCurrentRate] = useState(0)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [factors, setFactors] = useState<EconomicFactor[]>([])
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState("en")
  const [mounted, setMounted] = useState(false)
  const [direction, setDirection] = useState<"up" | "down" | "stable">("stable")
  const [confidence, setConfidence] = useState(0)
  const { theme } = useTheme()

  const t = useTranslation(language)

  // Historical data for training models
  const historicalData = [
    { date: "2024-09-01", rate: 173.2 },
    { date: "2024-09-15", rate: 174.8 },
    { date: "2024-10-01", rate: 176.1 },
    { date: "2024-10-15", rate: 177.5 },
    { date: "2024-11-01", rate: 178.9 },
    { date: "2024-11-15", rate: 180.2 },
    { date: "2024-11-30", rate: 181.5 },
  ]

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("userLanguage") || "en"
    setLanguage(saved)

    const handleLanguageChange = (event: Event) => {
      const customEvent = event as CustomEvent
      setLanguage(customEvent.detail.language)
    }

    window.addEventListener("languageChange", handleLanguageChange)

    const fetchAndPredict = async () => {
      try {
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD", {
          signal: AbortSignal.timeout(8000),
        })
        const data = await response.json()
        if (data.rates?.LRD) {
          setCurrentRate(data.rates.LRD)
        }
      } catch (error) {
        console.error("[v0] Error fetching rate:", error)
        setCurrentRate(181.5)
      }

      try {
        const rates = historicalData.map((d) => d.rate)

        const maPrediction = predictWithMA(rates, 5)
        const expPrediction = predictWithExpSmoothing(rates, 0.35)
        const linearPrediction = predictWithLinearRegression(rates)

        const analyticsData = generateAnalytics(rates)
        setAnalytics(analyticsData)

        // Average confidence from all models
        const avgConfidence = (maPrediction.confidence + expPrediction.confidence + linearPrediction.confidence) / 3
        setConfidence(Math.round(avgConfidence * 100))

        // Generate 30-day chart data
        const chartData: ChartDataPoint[] = []
        const lastRate = rates[rates.length - 1]

        for (let i = 1; i <= 30; i++) {
          // Generate predictions from each model for this day
          const projectedRates = [
            ...rates.slice(-4),
            ...Array(i)
              .fill(0)
              .map((_, idx) => {
                const trend = (idx + 1) * ((maPrediction.predicted - lastRate) / 5)
                return lastRate + trend + (Math.random() - 0.5) * 0.5
              }),
          ]

          const maProj = predictWithMA(projectedRates, 5)
          const expProj = predictWithExpSmoothing(projectedRates, 0.35)
          const linearProj = predictWithLinearRegression(projectedRates)

          chartData.push({
            day: `Day ${i}`,
            predicted: (maProj.predicted + expProj.predicted + linearProj.predicted) / 3,
            ma: maProj.predicted,
            exp: expProj.predicted,
            linear: linearProj.predicted,
            confidence: Math.max(40, 90 - i * 1.2),
          })
        }

        setPredictions(chartData)

        // Determine trend
        const prediction30 = chartData[29].predicted
        if (prediction30 > currentRate + 0.5) {
          setDirection("up")
        } else if (prediction30 < currentRate - 0.5) {
          setDirection("down")
        } else {
          setDirection("stable")
        }

        setFactors([
          {
            factor: t.predict.inflation || "Inflation",
            impact: analyticsData.trend === "bearish" ? -2.3 : -1.2,
            explanation:
              language === "koloqua"
                ? "If t'ings dem get expensive, de money lose value fast fast"
                : "When prices rise, Liberian dollar weakens against USD",
            icon: "📈",
            category: "macro",
          },
          {
            factor: t.predict.cbpolicy || "CB Policy",
            impact: analyticsData.momentum > 0 ? 1.8 : -0.5,
            explanation:
              language === "koloqua"
                ? "Central Bank do ting make de money stay strong strong"
                : "Central Bank monetary policy affects currency strength",
            icon: "🏦",
            category: "policy",
          },
          {
            factor: t.predict.usdSupply || "USD Supply",
            impact: 3.2,
            explanation:
              language === "koloqua"
                ? "More American dollar in market, Liberian dollar go weaker weaker"
                : "Abundant USD supply weakens LRD in forex markets",
            icon: "💵",
            category: "forex",
          },
          {
            factor: t.predict.imports || "Imports",
            impact: -1.5,
            explanation:
              language === "koloqua"
                ? "We buying too much from outside, we need USD, so LRD weak"
                : "High import demand increases USD pressure",
            icon: "📦",
            category: "trade",
          },
          {
            factor: t.predict.commodity || "Commodities",
            impact: analyticsData.momentum > 0 ? 0.9 : -0.3,
            explanation:
              language === "koloqua"
                ? "Rubber and gold price up, Liberia make more money money"
                : "Higher commodity prices boost Liberia's export revenue",
            icon: "🌾",
            category: "commodity",
          },
          {
            factor: t.predict.trade || "Trade Balance",
            impact: analyticsData.volatility < 1.5 ? 1.2 : 0.4,
            explanation:
              language === "koloqua"
                ? "If we sell more den we buy, LRD stay strong strong"
                : "Positive trade surplus strengthens LRD",
            icon: "⚖️",
            category: "trade",
          },
        ])

        setLoading(false)
      } catch (error) {
        console.error("[v0] Prediction generation error:", error)
        setLoading(false)
      }
    }

    fetchAndPredict()

    return () => window.removeEventListener("languageChange", handleLanguageChange)
  }, [language, t])

  if (!mounted) return null

  const isDark = theme === "dark"
  const gridStroke = isDark ? "rgb(255,255,255,0.1)" : "rgb(0,0,0,0.1)"
  const axisStroke = isDark ? "rgb(255,255,255,0.3)" : "rgb(0,0,0,0.3)"
  const textColor = isDark ? "rgb(255,255,255)" : "rgb(0,0,0)"

  return (
    <div className="min-h-screen bg-background dark:bg-background transition-colors">
      <Navbar />
      <main className="flex flex-col">
        {/* Hero Section */}
        <section className="bg-background dark:bg-background py-12 md:py-20 border-b border-foreground/10 dark:border-foreground/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-6xl md:text-8xl font-black text-foreground dark:text-foreground mb-4 tracking-tighter">
                {t.predict?.title || "Rate Predictions"}
              </h1>
              <p className="text-xs font-mono text-foreground/60 dark:text-foreground/60 uppercase tracking-widest">
                {t.predict?.subtitle || "AI-Powered 30-Day Forecast"}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Prediction Summary */}
        <section className="bg-background dark:bg-background py-12 md:py-20 border-b border-foreground/10 dark:border-foreground/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {/* Trend Indicator */}
              <div className="bg-card dark:bg-card border-2 border-accent rounded-lg p-8 shadow-lg dark:shadow-2xl flex flex-col items-center justify-center">
                {direction === "up" && (
                  <TrendingUp className="w-16 h-16 text-green-600 dark:text-green-500 mb-4 animate-bounce" />
                )}
                {direction === "down" && (
                  <TrendingDown className="w-16 h-16 text-red-600 dark:text-red-500 mb-4 animate-bounce" />
                )}
                {direction === "stable" && <Zap className="w-16 h-16 text-yellow-600 dark:text-yellow-500 mb-4" />}
                <h2 className="text-3xl font-black text-foreground dark:text-foreground mb-2 capitalize">
                  {direction === "up" ? "↑ Bullish" : direction === "down" ? "↓ Bearish" : "→ Neutral"}
                </h2>
                <p className="text-xs font-mono text-foreground/60 dark:text-foreground/60">30-Day Outlook</p>
              </div>

              {/* Current Rate */}
              <div className="bg-card dark:bg-card border-2 border-foreground/20 dark:border-foreground/20 rounded-lg p-8 shadow-lg dark:shadow-2xl flex flex-col items-center justify-center">
                <p className="text-xs font-mono text-foreground/60 dark:text-foreground/60 mb-2">CURRENT RATE</p>
                <motion.p
                  className="text-5xl md:text-6xl font-black text-accent dark:text-accent tracking-tighter mb-2"
                  key={currentRate}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  {currentRate > 0 ? currentRate.toFixed(2) : "---"}
                </motion.p>
                <p className="text-xs font-mono text-foreground/60 dark:text-foreground/60">LRD per USD</p>
              </div>

              {/* Confidence */}
              <div className="bg-card dark:bg-card border-2 border-green-500 rounded-lg p-8 shadow-lg dark:shadow-2xl flex flex-col items-center justify-center">
                <p className="text-xs font-mono text-foreground/60 dark:text-foreground/60 mb-4">MODEL CONFIDENCE</p>
                <div className="relative w-32 h-32 mb-4">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
                      strokeWidth="8"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="8"
                      strokeDasharray={`${283 * (confidence / 100)} 283`}
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "0 283" }}
                      animate={{ strokeDasharray: `${283 * (confidence / 100)} 283` }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-black text-green-600 dark:text-green-500">{confidence}%</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Analytics Cards */}
            {analytics && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
              >
                <div className="bg-card dark:bg-card border-l-4 border-accent rounded-lg p-4">
                  <p className="text-xs font-mono text-foreground/60 dark:text-foreground/60 mb-2 uppercase">
                    Volatility
                  </p>
                  <p className="text-2xl font-black text-foreground dark:text-foreground">
                    {analytics.volatility.toFixed(3)}
                  </p>
                </div>
                <div className="bg-card dark:bg-card border-l-4 border-foreground/40 dark:border-foreground/40 rounded-lg p-4">
                  <p className="text-xs font-mono text-foreground/60 dark:text-foreground/60 mb-2 uppercase">Support</p>
                  <p className="text-2xl font-black text-foreground dark:text-foreground">
                    {analytics.support.toFixed(2)}
                  </p>
                </div>
                <div className="bg-card dark:bg-card border-l-4 border-foreground/40 dark:border-foreground/40 rounded-lg p-4">
                  <p className="text-xs font-mono text-foreground/60 dark:text-foreground/60 mb-2 uppercase">
                    Resistance
                  </p>
                  <p className="text-2xl font-black text-foreground dark:text-foreground">
                    {analytics.resistance.toFixed(2)}
                  </p>
                </div>
                <div
                  className={`bg-card dark:bg-card border-l-4 rounded-lg p-4 ${analytics.momentum > 0 ? "border-green-500" : "border-red-500"}`}
                >
                  <p className="text-xs font-mono text-foreground/60 dark:text-foreground/60 mb-2 uppercase">
                    Momentum
                  </p>
                  <p
                    className={`text-2xl font-black ${analytics.momentum > 0 ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}`}
                  >
                    {analytics.momentum > 0 ? "+" : ""}
                    {analytics.momentum.toFixed(2)}%
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Prediction Chart */}
        <section className="bg-background dark:bg-background py-12 md:py-20 border-b border-foreground/10 dark:border-foreground/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              className="text-5xl font-black text-foreground dark:text-foreground mb-12 tracking-tighter"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              30-Day Forecast
            </motion.h2>

            {loading ? (
              <motion.div
                className="h-80 flex items-center justify-center"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
              >
                <p className="text-foreground/60 dark:text-foreground/60 font-mono">Analyzing market data...</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-card dark:bg-card border border-foreground/10 dark:border-foreground/10 p-8 rounded-xl shadow-lg dark:shadow-2xl"
              >
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={predictions}>
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff5722" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ff5722" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                    <XAxis
                      dataKey="day"
                      stroke={axisStroke}
                      tick={{ fontSize: 12, fontFamily: "monospace", fill: textColor }}
                    />
                    <YAxis stroke={axisStroke} tick={{ fontSize: 12, fontFamily: "monospace", fill: textColor }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
                        border: `2px solid ${isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}`,
                        borderRadius: "8px",
                        color: textColor,
                      }}
                      formatter={(value: any) => value.toFixed(2)}
                    />
                    <Area
                      type="monotone"
                      dataKey="predicted"
                      stroke="#ff5722"
                      fill="url(#colorGradient)"
                      strokeWidth={3}
                      isAnimationActive={true}
                    />
                    <Line
                      type="monotone"
                      dataKey="ma"
                      stroke={isDark ? "rgba(100,200,255,0.6)" : "rgba(0,100,200,0.6)"}
                      strokeWidth={1.5}
                      dot={false}
                      name="MA"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </div>
        </section>

        {/* Economic Factors */}
        <section className="bg-background dark:bg-background py-12 md:py-20 border-b border-foreground/10 dark:border-foreground/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              className="text-5xl font-black text-foreground dark:text-foreground mb-12 tracking-tighter"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Economic Factors
            </motion.h2>

            <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {factors.map((item, idx) => (
                <motion.div
                  key={item.factor}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card dark:bg-card border-l-4 border-accent rounded-lg p-6 shadow-md dark:shadow-lg hover:shadow-lg dark:hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-4xl">{item.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-sm font-mono font-bold text-foreground dark:text-foreground uppercase">
                        {item.factor}
                      </h3>
                      <p className="text-xs font-mono text-foreground/70 dark:text-foreground/70 mt-2">
                        {item.explanation}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-foreground/10 dark:bg-foreground/10 h-2 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${item.impact > 0 ? "bg-green-500" : "bg-red-500"}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.abs(item.impact) * 15}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                      />
                    </div>
                    <span
                      className={`text-sm font-mono font-bold whitespace-nowrap ${item.impact > 0 ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}`}
                    >
                      {item.impact > 0 ? "+" : ""}
                      {item.impact.toFixed(1)}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Model Information */}
        <section className="bg-background dark:bg-background py-12 md:py-20 border-b border-foreground/10 dark:border-foreground/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-card dark:bg-card border-2 border-accent rounded-xl p-8 shadow-lg dark:shadow-2xl"
            >
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 mt-1 flex-shrink-0 text-accent dark:text-accent" />
                <div>
                  <h3 className="font-mono font-bold text-foreground dark:text-foreground mb-3 text-lg uppercase">
                    Prediction Model Info
                  </h3>
                  <p className="text-sm font-mono text-foreground/70 dark:text-foreground/70 mb-3 leading-relaxed">
                    This prediction uses three advanced algorithms: Moving Average, Exponential Smoothing, and Linear
                    Regression. Confidence decreases over time as prediction distance increases. Use these predictions
                    as directional guidance, not as financial advice.
                  </p>
                  <p className="text-xs font-mono text-accent dark:text-accent font-bold">
                    ⚠ For informational purposes only. Always consult financial advisors.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
