"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { LineChart, RefreshCw, Send } from "lucide-react"

/** Matches `/api/crypto` (CoinGecko) shape — passed through to `POST /api/trfn/analyze`. */
export type TrfnAiCryptoContext = Record<string, { usd?: number; usd_24h_change?: number }>

export type TrfnAiRateContext = {
  rate?: number
  cblRate?: number | null
  sources?: string[]
  timestamp?: string
}

interface TrfnAiAnalystProps {
  crypto?: TrfnAiCryptoContext | null
  rateContext?: TrfnAiRateContext
}

const ANALYZE_URL = "/api/trfn/analyze"

export function TrfnAiAnalyst({ crypto, rateContext }: TrfnAiAnalystProps) {
  const [analysis, setAnalysis] = useState<string>("")
  const [question, setQuestion] = useState("")
  const [loading, setLoading] = useState(false)
  const [timestamp, setTimestamp] = useState<string>("")
  const [hasLoaded, setHasLoaded] = useState(false)
  const [error, setError] = useState<string>("")

  const fetchAnalysis = async (q?: string) => {
    setLoading(true)
    setError("")
    try {
      const body = JSON.stringify({
        question: q ?? question ?? "",
        context: {
          crypto: crypto ?? null,
          rate: rateContext?.rate ?? null,
          cblRate: rateContext?.cblRate ?? null,
          sources: rateContext?.sources ?? [],
          timestamp: rateContext?.timestamp ?? new Date().toISOString(),
        },
      })

      const res = await fetch(ANALYZE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      })

      const data = (await res.json()) as { analysis?: string; error?: string; timestamp?: string }

      if (!res.ok) {
        setError(data.error ?? "Analysis unavailable")
        setHasLoaded(true)
        return
      }

      setAnalysis(data.analysis ?? "No analysis available.")
      setTimestamp(data.timestamp ?? "")
      setHasLoaded(true)
      setQuestion("")
    } catch {
      setError("Network error. Please try again.")
      setHasLoaded(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-border/70 bg-card/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/70 bg-muted/40">
            <LineChart className="h-4 w-4 text-foreground/80" aria-hidden />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground dark:text-slate-200">
              TRFN Market Analyst
            </p>
            <p className="text-[10px] text-muted-foreground dark:text-slate-500">
              Liberia market data · TrueRate
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {timestamp && (
            <span className="text-[10px] text-muted-foreground dark:text-slate-500">
              {new Date(timestamp).toLocaleTimeString()}
            </span>
          )}
          <Badge variant="outline" className="text-[10px] font-medium text-muted-foreground border-border/60">
            Live desk
          </Badge>
        </div>
      </div>

      {!hasLoaded ? (
        <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
          <p className="max-w-md text-sm text-muted-foreground dark:text-slate-400 leading-relaxed">
            Commentary on current Liberia conditions—exchange rates, price submissions, CPI context, and related
            indicators—updated from the same data you see elsewhere on TrueRate.
          </p>
          <button
            type="button"
            onClick={() => void fetchAnalysis()}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60 min-h-[44px] shadow-sm"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin shrink-0" aria-hidden />
                Preparing analysis…
              </>
            ) : (
              `Run market briefing`
            )}
          </button>
        </div>
      ) : (
        <div className="mb-4">
          {loading ? (
            <div className="flex items-center gap-3 py-4">
              <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground shrink-0" aria-hidden />
              <p className="text-sm text-muted-foreground">Loading analysis…</p>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4">
              <p className="text-sm text-rose-700 dark:text-rose-300">{error}</p>
            </div>
          ) : (
            <div className="rounded-lg border border-border/50 bg-muted/30 p-4 dark:border-slate-800 dark:bg-slate-950/50">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground dark:text-slate-200">
                {analysis}
              </p>
            </div>
          )}
        </div>
      )}

      {hasLoaded && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && question.trim()) void fetchAnalysis(question)
            }}
            placeholder="Ask about rates, prices, remittance timing, business risk..."
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition focus:outline-none focus:ring-2 focus:ring-emerald-600/40 dark:border-slate-800 dark:bg-slate-950"
          />
          <button
            type="button"
            onClick={() => question.trim() && void fetchAnalysis(question)}
            disabled={loading || !question.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600 disabled:bg-muted disabled:text-muted-foreground dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:disabled:bg-slate-800"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => void fetchAnalysis()}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
            title="Refresh analysis"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      )}
    </div>
  )
}
