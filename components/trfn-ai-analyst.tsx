"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Bot, RefreshCw, Send, Sparkles } from "lucide-react"

/** Matches `/api/crypto` (CoinGecko) shape — passed through to `POST /api/trfn/analyze`. */
export type TrfnAiCryptoContext = Record<string, { usd?: number; usd_24h_change?: number }>

interface TrfnAiAnalystProps {
  crypto?: TrfnAiCryptoContext | null
}

const ANALYZE_URL = "/api/trfn/analyze"

export function TrfnAiAnalyst({ crypto }: TrfnAiAnalystProps) {
  const [analysis, setAnalysis] = useState<string>("")
  const [question, setQuestion] = useState("")
  const [loading, setLoading] = useState(false)
  const [timestamp, setTimestamp] = useState<string>("")
  const [hasLoaded, setHasLoaded] = useState(false)

  const fetchAnalysis = async (q?: string) => {
    setLoading(true)
    try {
      const qText = (typeof q === "string" ? q : question).trim()
      const body: { question?: string; context?: { crypto: TrfnAiCryptoContext } } = {}
      if (qText) body.question = qText
      if (crypto && Object.keys(crypto).length > 0) body.context = { crypto }

      const res = await fetch(ANALYZE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = (await res.json()) as { analysis?: string; error?: string; timestamp?: string }

      if (!res.ok) {
        setAnalysis(data.error ?? `Analysis failed (${res.status}).`)
        setTimestamp("")
      } else {
        setAnalysis(data.analysis ?? "No analysis available.")
        setTimestamp(data.timestamp ?? "")
      }
      setHasLoaded(true)
      setQuestion("")
    } catch {
      setAnalysis("Analysis unavailable at this time.")
      setTimestamp("")
      setHasLoaded(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-border/70 bg-card/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10">
            <Bot className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground dark:text-slate-200">
              TRFN Market Intelligence
            </p>
            <p className="text-[10px] text-muted-foreground dark:text-slate-500">TrueRate Financial Network</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {timestamp && (
            <span className="text-[10px] text-muted-foreground dark:text-slate-500">
              {new Date(timestamp).toLocaleTimeString()}
            </span>
          )}
          <Badge className="border border-cyan-500/30 bg-cyan-500/10 text-[10px] text-cyan-800 dark:text-cyan-200">
            <Sparkles className="mr-1 h-2.5 w-2.5" />
            LIVE INTELLIGENCE
          </Badge>
        </div>
      </div>

      {/* Analysis Output */}
      {!hasLoaded ? (
        <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10">
            <Sparkles className="h-6 w-6 text-cyan-600 dark:text-cyan-300" />
          </div>
          <p className="max-w-md text-sm text-muted-foreground dark:text-slate-400">
            Access institutional-grade market intelligence powered by TRFN&apos;s quantitative analysis engine for
            Liberia&apos;s financial markets.
          </p>
          <button
            type="button"
            onClick={() => fetchAnalysis()}
            disabled={loading}
            className="mt-2 flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-cyan-500 disabled:bg-muted dark:disabled:bg-slate-800"
          >
            {loading ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            {loading ? "Analyzing..." : "Run Market Analysis"}
          </button>
        </div>
      ) : (
        <div className="mb-4">
          {loading ? (
            <div className="flex items-center gap-3 py-4">
              <RefreshCw className="h-4 w-4 animate-spin text-cyan-600 dark:text-cyan-300" />
              <p className="text-sm text-muted-foreground">TRFN Market Intelligence processing live data...</p>
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

      {/* Question Input */}
      {hasLoaded && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && question.trim()) void fetchAnalysis(question)
            }}
            placeholder="Query TRFN Intelligence... e.g. 'What is the FX risk outlook for Liberian importers this week?'"
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-slate-800 dark:bg-slate-950"
          />
          <button
            type="button"
            onClick={() => question.trim() && fetchAnalysis(question)}
            disabled={loading || !question.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-cyan-500 disabled:bg-muted disabled:text-muted-foreground dark:disabled:bg-slate-800"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => fetchAnalysis()}
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
