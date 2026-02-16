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
const RATE_SOURCES_KEY = "truerate-live-sources"
const RATE_CBL_KEY = "truerate-live-cbl"
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

function readCachedMeta(): { sources: string[]; timestamp: string; cblRate: number | null } {
  if (typeof window === "undefined") return { sources: [], timestamp: "", cblRate: null }
  try {
    const raw = window.localStorage.getItem(RATE_SOURCES_KEY)
    const sources: string[] = raw ? (JSON.parse(raw) as string[]) : []
    const timestamp = window.localStorage.getItem(RATE_TIMESTAMP_KEY) ?? ""
    const cblS = window.localStorage.getItem(RATE_CBL_KEY)
    const cblRate = cblS != null ? Number.parseFloat(cblS) : null
    return {
      sources: Array.isArray(sources) ? sources : [],
      timestamp,
      cblRate: cblRate != null && Number.isFinite(cblRate) ? cblRate : null,
    }
  } catch {
    return { sources: [], timestamp: "", cblRate: null }
  }
}

function writeCachedRate(rate: number, meta?: { sources: string[]; timestamp: string; cblRate: number | null }) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(RATE_STORAGE_KEY, rate.toString())
    if (meta) {
      window.localStorage.setItem(RATE_TIMESTAMP_KEY, meta.timestamp)
      window.localStorage.setItem(RATE_SOURCES_KEY, JSON.stringify(meta.sources))
      if (meta.cblRate != null) {
        window.localStorage.setItem(RATE_CBL_KEY, meta.cblRate.toString())
      } else {
        window.localStorage.removeItem(RATE_CBL_KEY)
      }
    } else {
      window.localStorage.setItem(RATE_TIMESTAMP_KEY, Date.now().toString())
    }
  } catch {
    // ignore
  }
}

export interface LiveRateContextValue {
  rate: number
  loading: boolean
  refresh: () => Promise<void>
  /** Where the rate comes from (e.g. Central Bank of Liberia, ExchangeRate API) */
  sources: string[]
  /** ISO timestamp of last successful fetch */
  timestamp: string
  /** CBL official rate when available (for comparison) */
  cblRate: number | null
}

const LiveRateContext = createContext<LiveRateContextValue | null>(null)

export function LiveRateProvider({ children }: { children: ReactNode }) {
  const [rate, setRate] = useState<number>(readCachedRate)
  const [meta, setMeta] = useState(readCachedMeta)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/rates/live")
      const data = await res.json()
      const r = typeof data?.rate === "number" && data.rate > 100 && data.rate < 300 ? data.rate : null
      const sources = Array.isArray(data?.sources) ? data.sources : Array.isArray(data?.official?.sources) ? data.official.sources : []
      const timestamp = typeof data?.timestamp === "string" ? data.timestamp : data?.official?.timestamp ?? new Date().toISOString()
      const cblRate = typeof data?.cblRate === "number" && data.cblRate > 100 && data.cblRate < 300 ? data.cblRate : null
      if (r != null) {
        setRate(r)
        const nextMeta = { sources, timestamp, cblRate }
        setMeta(nextMeta)
        writeCachedRate(r, nextMeta)
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
    sources: meta.sources,
    timestamp: meta.timestamp,
    cblRate: meta.cblRate,
  }

  return (
    <LiveRateContext.Provider value={value}>{children}</LiveRateContext.Provider>
  )
}

export function useLiveRate(): LiveRateContextValue {
  const ctx = useContext(LiveRateContext)
  if (!ctx) {
    const cached = readCachedMeta()
    return {
      rate: readCachedRate(),
      loading: true,
      refresh: async () => {},
      sources: cached.sources,
      timestamp: cached.timestamp,
      cblRate: cached.cblRate,
    }
  }
  return ctx
}
