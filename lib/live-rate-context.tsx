"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

const RATE_STORAGE_KEY = "truerate-live-rate"
const RATE_TIMESTAMP_KEY = "truerate-live-rate-ts"
const DEFAULT_RATE = 192.5
const REFRESH_MS = 60_000

function readCachedRate(): number {
  if (typeof window === "undefined") return DEFAULT_RATE
  try {
    const s = window.localStorage.getItem(RATE_STORAGE_KEY)
    if (!s) return DEFAULT_RATE
    const n = Number.parseFloat(s)
    return Number.isFinite(n) && n > 100 && n < 300 ? n : DEFAULT_RATE
  } catch {
    return DEFAULT_RATE
  }
}

function writeCachedRate(rate: number) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(RATE_STORAGE_KEY, rate.toString())
    window.localStorage.setItem(RATE_TIMESTAMP_KEY, Date.now().toString())
  } catch {
    // ignore
  }
}

export interface LiveRateContextValue {
  rate: number
  loading: boolean
  refresh: () => Promise<void>
}

const LiveRateContext = createContext<LiveRateContextValue | null>(null)

export function LiveRateProvider({ children }: { children: ReactNode }) {
  const [rate, setRate] = useState<number>(readCachedRate)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/rates/live")
      const data = await res.json()
      const r = typeof data?.rate === "number" && data.rate > 100 && data.rate < 300 ? data.rate : null
      if (r != null) {
        setRate(r)
        writeCachedRate(r)
      }
    } catch {
      // keep existing rate
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
    const id = setInterval(refresh, REFRESH_MS)
    return () => clearInterval(id)
  }, [refresh])

  const value: LiveRateContextValue = {
    rate,
    loading,
    refresh,
  }

  return (
    <LiveRateContext.Provider value={value}>{children}</LiveRateContext.Provider>
  )
}

export function useLiveRate(): LiveRateContextValue {
  const ctx = useContext(LiveRateContext)
  if (!ctx) {
    return {
      rate: readCachedRate(),
      loading: true,
      refresh: async () => {},
    }
  }
  return ctx
}
