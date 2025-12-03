"use client"

import { useEffect, useState, useRef } from "react"
import { Bell } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface RateAlert {
  id: string
  type: "increase" | "decrease" | "threshold"
  rate: number
  previousRate: number
  message: string
  timestamp: Date
}

export function RateMonitor() {
  const [currentRate, setCurrentRate] = useState<number | null>(null)
  const [previousRate, setPreviousRate] = useState<number | null>(null)
  const [alerts, setAlerts] = useState<RateAlert[]>([])
  const [mounted, setMounted] = useState(false)
  const monitoringRef = useRef(true)
  const lastAlertRef = useRef<number>(0)
  const ratesRef = useRef<{ current: number | null; previous: number | null }>({ current: null, previous: null })
  const ALERT_THRESHOLD = 1000 // Only show alert once per second
  const RATE_CHANGE_THRESHOLD = 0.5 // Alert if rate changes by 0.5% or more

  useEffect(() => {
    setMounted(true)

    const monitorRates = async () => {
      if (!monitoringRef.current) return

      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)

        const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD", {
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) return

        const data = await response.json()
        const rate = data.rates?.LRD

        if (rate && monitoringRef.current) {
          if (ratesRef.current.current !== null) {
            const percentChange = ((rate - ratesRef.current.current) / ratesRef.current.current) * 100

            if (Math.abs(percentChange) >= RATE_CHANGE_THRESHOLD) {
              const now = Date.now()

              if (now - lastAlertRef.current > ALERT_THRESHOLD) {
                const alertType = percentChange > 0 ? "increase" : "decrease"
                const alert: RateAlert = {
                  id: Math.random().toString(),
                  type: alertType,
                  rate,
                  previousRate: ratesRef.current.current,
                  message: `Rate ${alertType === "increase" ? "↑" : "↓"} ${Math.abs(percentChange).toFixed(2)}%`,
                  timestamp: new Date(),
                }

                setAlerts((prev) => [alert, ...prev.slice(0, 4)])
                lastAlertRef.current = now

                if ("Notification" in window && Notification.permission === "granted") {
                  new Notification("TrueRate Alert", {
                    body: `USD-LRD: ${rate.toFixed(2)} (${percentChange > 0 ? "+" : ""}${percentChange.toFixed(2)}%)`,
                    icon: "/icon-192x192.png",
                    badge: "/icon-96x96.png",
                    tag: "rate-alert",
                  })
                }

                if (navigator.vibrate) {
                  navigator.vibrate([100, 50, 100])
                }
              }
            }
          }

          ratesRef.current.previous = ratesRef.current.current
          ratesRef.current.current = rate

          setCurrentRate(rate)
          setPreviousRate(ratesRef.current.previous)

          // Store in session storage for real-time updates
          sessionStorage.setItem(
            "rateMonitoring",
            JSON.stringify({
              rate,
              timestamp: new Date().toISOString(),
              change: ratesRef.current.previous
                ? ((rate - ratesRef.current.previous) / ratesRef.current.previous) * 100
                : 0,
            }),
          )
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          console.error("[v0] Rate monitoring error: signal timed out")
        } else {
          console.error("[v0] Rate monitoring error:", error)
        }
      }
    }

    // Initial fetch
    monitorRates()

    // Monitor every 15 seconds
    const interval = setInterval(monitorRates, 15000)

    return () => {
      clearInterval(interval)
      monitoringRef.current = false
    }
  }, [])

  useEffect(() => {
    // Request notification permission on mount
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  if (!mounted || alerts.length === 0) return null

  return (
    <div className="fixed top-24 right-4 z-50 max-w-xs space-y-2">
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className={`bg-card dark:bg-card border-2 border-l-4 rounded-lg p-4 shadow-lg dark:shadow-2xl ${
              alert.type === "increase"
                ? "border-green-500 border-l-green-600 dark:border-l-green-500"
                : "border-red-500 border-l-red-600 dark:border-l-red-500"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-1 ${alert.type === "increase" ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}`}
              >
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-mono font-bold text-foreground dark:text-foreground">{alert.message}</p>
                <p className="text-xs text-foreground/60 dark:text-foreground/60">
                  {alert.previousRate.toFixed(2)} → {alert.rate.toFixed(2)} LRD
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
