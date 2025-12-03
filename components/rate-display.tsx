"use client"

import { useEffect, useState } from "react"
import { AlertCircle, RefreshCw, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslation } from "@/lib/i18n"
import { SkeletonLoader } from "./skeleton-loader"

interface RateData {
  usdToLrd: number | null
  lrdToUsd: number | null
  timestamp: Date | null
  loading: boolean
  error: string | null
  source: string
  previousRate?: number
  changePercent?: number
}

export function RateDisplay() {
  const [rateData, setRateData] = useState<RateData>({
    usdToLrd: null,
    lrdToUsd: null,
    timestamp: null,
    loading: true,
    error: null,
    source: "",
  })
  const [language, setLanguage] = useState("en")
  const [mounted, setMounted] = useState(false)
  const t = useTranslation(language)

  const fetchRate = async () => {
    try {
      setRateData((prev) => ({ ...prev, loading: true, error: null }))

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000)

      const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD", {
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) throw new Error(`API error: ${response.status}`)

      const data = await response.json()

      if (data.rates && data.rates.LRD) {
        const newRate = data.rates.LRD
        const now = new Date()
        const savedRate = localStorage.getItem("lastRate")
        const changePercent = savedRate
          ? ((newRate - Number.parseFloat(savedRate)) / Number.parseFloat(savedRate)) * 100
          : 0

        setRateData((prev) => ({
          ...prev,
          previousRate: prev.usdToLrd || undefined,
          usdToLrd: newRate,
          lrdToUsd: 1 / newRate,
          timestamp: now,
          loading: false,
          source: "exchangerate-api.com",
          changePercent,
        }))

        // Store in cookie and localStorage
        document.cookie = `lastRate=${newRate};max-age=${30 * 24 * 60 * 60}`
        document.cookie = `lastRateTime=${now.toISOString()};max-age=${30 * 24 * 60 * 60}`
        localStorage.setItem("lastRate", newRate.toString())
        localStorage.setItem("lastRateTime", now.toISOString())

        if (navigator.vibrate) {
          navigator.vibrate([5, 10, 5])
        }
      } else {
        throw new Error("Invalid rate data")
      }
    } catch (error) {
      setRateData((prev) => ({
        ...prev,
        error: `${t.home.noData}. ${t.home.tryAgain}.`,
        loading: false,
      }))
    }
  }

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("userLanguage") || "en"
    setLanguage(saved)

    const handleLanguageChange = (event: Event) => {
      const customEvent = event as CustomEvent
      setLanguage(customEvent.detail.language)
    }

    window.addEventListener("languageChange", handleLanguageChange)
    fetchRate()
    const interval = setInterval(fetchRate, 30000)

    return () => {
      clearInterval(interval)
      window.removeEventListener("languageChange", handleLanguageChange)
    }
  }, [])

  if (!mounted) return <SkeletonLoader />

  return (
    <section
      id="rates"
      className="bg-background dark:bg-background py-12 md:py-20 border-b-2 border-foreground/10 dark:border-foreground/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-6xl md:text-8xl font-black text-foreground dark:text-foreground mb-4 tracking-tighter">
            {t.home.title}
          </h2>
          <p className="text-xs font-mono text-foreground/60 dark:text-foreground/60 uppercase tracking-widest">
            {t.home.subtitle}
          </p>
        </motion.div>

        {/* Error State */}
        {rateData.error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 flex items-start gap-4"
          >
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-600 dark:text-red-500" />
            <div>
              <p className="text-sm font-mono text-red-900 dark:text-red-200 font-bold">{rateData.error}</p>
            </div>
          </motion.div>
        )}

        {/* Rate Cards - Native App Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {rateData.loading ? (
            <>
              <SkeletonLoader />
              <SkeletonLoader />
            </>
          ) : (
            <>
              {/* USD to LRD */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-card dark:bg-card rounded-xl border-2 border-accent/50 dark:border-accent/50 p-8 hover:border-accent transition-all duration-300 shadow-lg dark:shadow-2xl hover:shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-mono text-foreground/60 dark:text-foreground/60 uppercase tracking-wider font-bold">
                    {t.home.usdToLrd}
                  </div>
                  {rateData.changePercent !== undefined && rateData.changePercent !== 0 && (
                    <motion.div
                      className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${
                        rateData.changePercent > 0
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <TrendingUp
                        className="w-3 h-3"
                        style={{ transform: rateData.changePercent < 0 ? "scaleY(-1)" : "none" }}
                      />
                      {Math.abs(rateData.changePercent).toFixed(2)}%
                    </motion.div>
                  )}
                </div>
                <motion.div
                  className="text-6xl md:text-7xl font-black text-accent dark:text-accent tracking-tighter leading-none mb-6"
                  key={rateData.usdToLrd}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  {rateData.usdToLrd?.toFixed(2)}
                </motion.div>
                <div className="text-sm font-mono text-foreground/70 dark:text-foreground/70 font-semibold">
                  1 USD = {rateData.usdToLrd?.toFixed(4)} LRD
                </div>
              </motion.div>

              {/* LRD to USD */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-card dark:bg-card rounded-xl border-2 border-foreground/20 dark:border-foreground/20 p-8 hover:border-foreground/40 dark:hover:border-foreground/40 transition-all duration-300 shadow-lg dark:shadow-2xl hover:shadow-xl"
              >
                <div className="text-xs font-mono text-foreground/60 dark:text-foreground/60 uppercase tracking-wider mb-4 font-bold">
                  {t.home.lrdToUsd}
                </div>
                <motion.div
                  className="text-6xl md:text-7xl font-black text-foreground dark:text-foreground tracking-tighter leading-none mb-6"
                  key={rateData.lrdToUsd}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
                >
                  {rateData.lrdToUsd?.toFixed(4)}
                </motion.div>
                <div className="text-sm font-mono text-foreground/70 dark:text-foreground/70 font-semibold">
                  1 LRD ≈ {rateData.lrdToUsd ? (rateData.lrdToUsd * 100).toFixed(3) : "---"}¢ USD
                </div>
              </motion.div>
            </>
          )}
        </div>

        {/* Metadata Grid */}
        {!rateData.loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="border-t-2 border-foreground/10 dark:border-foreground/10 pt-12"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="border-l-2 border-accent pl-4">
                <h4 className="text-xs font-mono font-black text-foreground/60 dark:text-foreground/60 uppercase tracking-wider mb-3">
                  {t.home.date}
                </h4>
                <p className="text-lg font-mono font-black text-foreground dark:text-foreground">
                  {rateData.timestamp?.toLocaleDateString()}
                </p>
              </div>
              <div className="border-l-2 border-accent pl-4">
                <h4 className="text-xs font-mono font-black text-foreground/60 dark:text-foreground/60 uppercase tracking-wider mb-3">
                  {t.home.time}
                </h4>
                <p className="text-lg font-mono font-black text-foreground dark:text-foreground">
                  {rateData.timestamp?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <div className="border-l-2 border-accent pl-4">
                <h4 className="text-xs font-mono font-black text-foreground/60 dark:text-foreground/60 uppercase tracking-wider mb-3">
                  {t.home.source}
                </h4>
                <p className="text-lg font-mono font-black text-accent dark:text-accent">{rateData.source}</p>
              </div>
              <div className="border-l-2 border-green-500 pl-4">
                <h4 className="text-xs font-mono font-black text-foreground/60 dark:text-foreground/60 uppercase tracking-wider mb-3">
                  STATUS
                </h4>
                <motion.p
                  className="text-lg font-mono font-black text-green-600 dark:text-green-500"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                >
                  LIVE
                </motion.p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Refresh Button */}
        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={fetchRate}
            disabled={rateData.loading}
            className="px-8 py-3 bg-accent text-white dark:text-black font-mono font-black text-sm hover:bg-accent/90 dark:hover:bg-accent/80 transition-all disabled:opacity-50 flex items-center gap-2 uppercase tracking-widest border-2 border-accent hover:shadow-lg rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className={`w-4 h-4 ${rateData.loading ? "animate-spin" : ""}`} />
            {rateData.loading ? "FETCHING..." : t.home.refreshRate}
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
