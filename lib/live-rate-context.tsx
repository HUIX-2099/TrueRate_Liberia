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
const RATE_CBL_LAST_UPDATED_KEY = "truerate-live-cbl-last-updated"
const RATE_SOURCE_PREF_KEY = "truerate-rate-source"
const DEFAULT_RATE = 185.72 // Market mid rate: main 185.72, Sell Rate 187.72 (effectiveRate + 2)
const REFRESH_MS = 60_000 // Auto-update market and CBL rate every minute

export type RateSourcePreference = "market" | "official"

function readRateSourcePreference(): RateSourcePreference {
  if (typeof window === "undefined") return "market"
  try {
    const s = window.localStorage.getItem(RATE_SOURCE_PREF_KEY)
    if (s === "official" || s === "market") return s
    return "market"
  } catch {
    return "market"
  }
}

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

function readCachedMeta(): { sources: string[]; timestamp: string; cblRate: number | null; cblBuying: number | null; cblSelling: number | null; cblLastUpdated: string | null } {
  if (typeof window === "undefined") return { sources: [], timestamp: "", cblRate: null, cblBuying: null, cblSelling: null, cblLastUpdated: null }
  try {
    const raw = window.localStorage.getItem(RATE_SOURCES_KEY)
    const sources: string[] = raw ? (JSON.parse(raw) as string[]) : []
    const timestamp = window.localStorage.getItem(RATE_TIMESTAMP_KEY) ?? ""
    const cblS = window.localStorage.getItem(RATE_CBL_KEY)
    const cblRate = cblS != null ? Number.parseFloat(cblS) : null
    const cblLastUpdated = window.localStorage.getItem(RATE_CBL_LAST_UPDATED_KEY) ?? null
    return {
      sources: Array.isArray(sources) ? sources : [],
      timestamp,
      cblRate: cblRate != null && Number.isFinite(cblRate) ? cblRate : null,
      cblBuying: null,
      cblSelling: null,
      cblLastUpdated: cblLastUpdated || null,
    }
  } catch {
    return { sources: [], timestamp: "", cblRate: null, cblBuying: null, cblSelling: null, cblLastUpdated: null }
  }
}

function writeCachedRate(rate: number, meta?: { sources: string[]; timestamp: string; cblRate: number | null; cblBuying?: number | null; cblSelling?: number | null; cblLastUpdated?: string | null }) {
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
      if (meta.cblLastUpdated) {
        window.localStorage.setItem(RATE_CBL_LAST_UPDATED_KEY, meta.cblLastUpdated)
      } else {
        window.localStorage.removeItem(RATE_CBL_LAST_UPDATED_KEY)
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
  /** CBL official (sell) rate when available (for comparison) */
  cblRate: number | null
  /** CBL buying rate when available (for Buy/Sell display when official is selected) */
  cblBuying: number | null
  /** CBL selling rate when available (for Sell Rate display when official is selected) */
  cblSelling: number | null
  /** CBL rate date from source (e.g. research page table date); ISO string when available */
  cblLastUpdated: string | null
  /** User preference: which rate to use for display and conversion */
  rateSource: RateSourcePreference
  setRateSource: (source: RateSourcePreference) => void
  /** Effective rate: official when selected and available, else market */
  effectiveRate: number
}

const LiveRateContext = createContext<LiveRateContextValue | null>(null)

export function LiveRateProvider({ children }: { children: ReactNode }) {
  // Use DEFAULT_RATE for initial state so server and client render the same (avoids hydration mismatch).
  // Cache is applied in useEffect after mount.
  const [rate, setRate] = useState<number>(DEFAULT_RATE)
  const [meta, setMeta] = useState<{ sources: string[]; timestamp: string; cblRate: number | null; cblBuying: number | null; cblSelling: number | null; cblLastUpdated: string | null }>(() => ({
    sources: [],
    timestamp: "",
    cblRate: null,
    cblBuying: null,
    cblSelling: null,
    cblLastUpdated: null,
  }))
  const [loading, setLoading] = useState(true)
  const [rateSource, setRateSourceState] = useState<RateSourcePreference>("market")

  useEffect(() => {
    setRateSourceState(readRateSourcePreference())
  }, [])

  const setRateSource = useCallback((source: RateSourcePreference) => {
    setRateSourceState(source)
    try {
      if (typeof window !== "undefined") window.localStorage.setItem(RATE_SOURCE_PREF_KEY, source)
    } catch {
      // ignore
    }
  }, [])

  const effectiveRate =
    rateSource === "official" && meta.cblRate != null && meta.cblRate > 0 ? meta.cblRate : rate

  const refresh = useCallback(async () => {
    try {
      // Official (CBL) is updated only from the CBL API so it never gets mixed with market/sources
      let cblRate: number | null = null
      let cblLastUpdated: string | null = null
      let cblBuying: number | null = null
      let cblSelling: number | null = null
      try {
        const cblRes = await fetch("/api/rates/cbl")
        const cblData = await cblRes.json()
        if (cblRes.ok && typeof cblData?.rate === "number" && cblData.rate > 100 && cblData.rate < 300) {
          cblRate = Number(cblData.rate.toFixed(4))
          cblLastUpdated = typeof cblData?.lastUpdated === "string" ? cblData.lastUpdated : null
          if (typeof cblData?.buying === "number" && cblData.buying > 100 && cblData.buying < 300) cblBuying = Number(cblData.buying.toFixed(4))
          if (typeof cblData?.selling === "number" && cblData.selling > 100 && cblData.selling < 300) cblSelling = Number(cblData.selling.toFixed(4))
        }
      } catch {
        // keep existing CBL values on CBL API failure
      }

      const res = await fetch(`/api/rates/live?t=${Date.now()}`, { cache: "no-store" })
      const data = await res.json()
      const r = typeof data?.rate === "number" && data.rate > 100 && data.rate < 300 ? data.rate : null
      const sources = Array.isArray(data?.sources) ? data.sources : Array.isArray(data?.official?.sources) ? data.official.sources : []
      const timestamp = typeof data?.timestamp === "string" ? data.timestamp : data?.official?.timestamp ?? new Date().toISOString()
      // Keep CBL from CBL API only; only use live payload for CBL if we didn't get it from CBL API
      if (cblRate == null && typeof data?.cblRate === "number" && data.cblRate > 100 && data.cblRate < 300) {
        cblRate = data.cblRate
        cblLastUpdated = typeof data?.cblLastUpdated === "string" ? data.cblLastUpdated : null
        if (typeof data?.cblBuying === "number") cblBuying = Number(data.cblBuying.toFixed(4))
        if (typeof data?.cblSelling === "number") cblSelling = Number(data.cblSelling.toFixed(4))
      }
      if (r != null) {
        setRate(r)
        const nextMeta = { sources, timestamp, cblRate, cblBuying, cblSelling, cblLastUpdated }
        setMeta(nextMeta)
        writeCachedRate(r, nextMeta)
      } else {
        setMeta((prev) => ({ ...prev, cblRate, cblBuying, cblSelling, cblLastUpdated }))
      }
    } catch {
      // keep existing rate
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setRate(readCachedRate())
    setMeta(readCachedMeta())
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
    cblBuying: meta.cblBuying,
    cblSelling: meta.cblSelling,
    cblLastUpdated: meta.cblLastUpdated,
    rateSource,
    setRateSource,
    effectiveRate,
  }

  return (
    <LiveRateContext.Provider value={value}>{children}</LiveRateContext.Provider>
  )
}

export function useLiveRate(): LiveRateContextValue {
  const ctx = useContext(LiveRateContext)
  const fallbackRate = readCachedRate()
  const cached = readCachedMeta()
  if (!ctx) {
    return {
      rate: fallbackRate,
      loading: true,
      refresh: async () => {},
      sources: cached.sources,
      timestamp: cached.timestamp,
      cblRate: cached.cblRate,
      cblBuying: null,
      cblSelling: null,
      cblLastUpdated: cached.cblLastUpdated,
      rateSource: "market",
      setRateSource: () => {},
      effectiveRate: fallbackRate,
    }
  }
  return ctx
}
