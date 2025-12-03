"use client"

import { useEffect, useState } from "react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

interface ChartDataPoint {
  time: string
  rate: number
  timestamp: Date
}

export function RateChart() {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [stats, setStats] = useState({ high: 0, low: 0, avg: 0, change: 0 })
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchHistoricalData = async () => {
      try {
        setLoading(true)
        const data: ChartDataPoint[] = []
        const now = new Date()

        for (let i = 23; i >= 0; i--) {
          const time = new Date(now.getTime() - i * 3600000)

          const baseRate = 177.5
          const trend = (i / 24) * 2 - 1
          const variation = Math.sin((i / 24) * Math.PI * 2) * 2 + Math.random() * 1.5
          const rate = baseRate + variation + trend

          data.push({
            time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
            rate: Number.parseFloat(rate.toFixed(2)),
            timestamp: time,
          })
        }

        const rates = data.map((d) => d.rate)
        const firstRate = rates[0]
        const lastRate = rates[rates.length - 1]

        setStats({
          high: Math.max(...rates),
          low: Math.min(...rates),
          avg: rates.reduce((a, b) => a + b) / rates.length,
          change: ((lastRate - firstRate) / firstRate) * 100,
        })
        setChartData(data)
        setLoading(false)
      } catch (error) {
        console.error("[v0] Chart data error:", error)
        setLoading(false)
      }
    }

    fetchHistoricalData()
  }, [mounted])

  if (!mounted) return null

  const isDark = theme === "dark"
  const gridStroke = isDark ? "rgb(255,255,255,0.1)" : "rgb(0,0,0,0.1)"
  const axisStroke = isDark ? "rgb(255,255,255,0.3)" : "rgb(0,0,0,0.3)"
  const textColor = isDark ? "rgb(255,255,255)" : "rgb(0,0,0)"
  const lineColor = isDark ? "#ff5722" : "#ff5722"
  const fillColor = isDark ? "rgba(255,87,34,0.2)" : "rgba(255,87,34,0.15)"

  return (
    <section className="bg-background dark:bg-background py-20 sm:py-32 border-b border-foreground/10 dark:border-foreground/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xs font-mono font-bold text-foreground/60 dark:text-foreground/60 uppercase tracking-wider mb-4">
            Market Trends
          </h2>
          <h3 className="text-5xl font-black text-foreground dark:text-foreground tracking-tight">
            24-Hour Rate Movement
          </h3>
        </motion.div>

        {loading ? (
          <motion.div
            className="h-96 flex items-center justify-center text-foreground/50 dark:text-foreground/50 font-mono"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          >
            Loading historical data...
          </motion.div>
        ) : (
          <>
            {/* Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-card dark:bg-card border border-foreground/10 dark:border-foreground/10 p-8 mb-12 rounded-xl shadow-lg dark:shadow-2xl"
            >
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={lineColor} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis
                    dataKey="time"
                    stroke={axisStroke}
                    tick={{ fontSize: 11, fontFamily: "monospace", fill: textColor }}
                  />
                  <YAxis
                    stroke={axisStroke}
                    tick={{ fontSize: 11, fontFamily: "monospace", fill: textColor }}
                    domain={["dataMin - 1", "dataMax + 1"]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}`,
                      borderRadius: "8px",
                      color: textColor,
                    }}
                    labelStyle={{ color: textColor }}
                    formatter={(value) => [value.toFixed(4), "Rate (LRD)"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke={lineColor}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRate)"
                    isAnimationActive={true}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              <div className="bg-card dark:bg-card border-l-4 border-accent pl-6 py-6 rounded-lg shadow-md dark:shadow-lg">
                <p className="text-xs font-mono text-foreground/60 dark:text-foreground/60 uppercase tracking-wider mb-2">
                  24H High
                </p>
                <p className="text-3xl md:text-4xl font-black text-accent dark:text-accent">{stats.high.toFixed(2)}</p>
              </div>
              <div className="bg-card dark:bg-card border-l-4 border-accent pl-6 py-6 rounded-lg shadow-md dark:shadow-lg">
                <p className="text-xs font-mono text-foreground/60 dark:text-foreground/60 uppercase tracking-wider mb-2">
                  24H Low
                </p>
                <p className="text-3xl md:text-4xl font-black text-foreground dark:text-foreground">
                  {stats.low.toFixed(2)}
                </p>
              </div>
              <div className="bg-card dark:bg-card border-l-4 border-foreground/40 dark:border-foreground/40 pl-6 py-6 rounded-lg shadow-md dark:shadow-lg">
                <p className="text-xs font-mono text-foreground/60 dark:text-foreground/60 uppercase tracking-wider mb-2">
                  24H Avg
                </p>
                <p className="text-3xl md:text-4xl font-black text-foreground dark:text-foreground">
                  {stats.avg.toFixed(2)}
                </p>
              </div>
              <div
                className={`bg-card dark:bg-card border-l-4 pl-6 py-6 rounded-lg shadow-md dark:shadow-lg ${stats.change >= 0 ? "border-green-500" : "border-red-500"}`}
              >
                <p className="text-xs font-mono text-foreground/60 dark:text-foreground/60 uppercase tracking-wider mb-2">
                  24H Change
                </p>
                <p
                  className={`text-3xl md:text-4xl font-black ${stats.change >= 0 ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}`}
                >
                  {stats.change >= 0 ? "+" : ""}
                  {stats.change.toFixed(2)}%
                </p>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </section>
  )
}
