"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Star, AlertTriangle, CheckCircle, XCircle, MinusCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useLiveRate } from "@/lib/live-rate-context"
import type { ElementType } from "react"

const GRADE_CONFIG: Record<
  string,
  {
    icon: ElementType
    bg: string
    border: string
    text: string
    badgeBg: string
  }
> = {
  A: {
    icon: CheckCircle,
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-700 dark:text-emerald-300",
    badgeBg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-800 dark:text-emerald-200",
  },
  B: {
    icon: CheckCircle,
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-700 dark:text-blue-300",
    badgeBg: "bg-blue-500/15 border-blue-500/30 text-blue-800 dark:text-blue-200",
  },
  C: {
    icon: MinusCircle,
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-700 dark:text-amber-300",
    badgeBg: "bg-amber-500/15 border-amber-500/30 text-amber-800 dark:text-amber-200",
  },
  D: {
    icon: AlertTriangle,
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    text: "text-orange-700 dark:text-orange-300",
    badgeBg: "bg-orange-500/15 border-orange-500/30 text-orange-800 dark:text-orange-200",
  },
  F: {
    icon: XCircle,
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    text: "text-rose-700 dark:text-rose-300",
    badgeBg: "bg-rose-500/15 border-rose-500/30 text-rose-800 dark:text-rose-200",
  },
}

interface ScoreResult {
  ok?: boolean
  quotedRate?: number
  marketRate?: number
  cblRate?: number | null
  grade?: string
  score?: string
  diffPct?: number
  verdict?: string
  advice?: string
}

export function TrueRateScore() {
  const { effectiveRate, loading: rateLoading } = useLiveRate()
  const [quotedRate, setQuotedRate] = useState("")
  const [result, setResult] = useState<ScoreResult | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const checkScore = async () => {
    const rate = parseFloat(quotedRate)
    if (!rate || rate < 100 || rate > 300) return
    setLoading(true)
    setErrorMsg(null)
    try {
      const res = await fetch("/api/rates/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quotedRate: rate }),
      })
      const data = (await res.json()) as ScoreResult & { error?: string }
      if (res.ok && data.ok && data.grade) {
        setResult(data)
      } else {
        setResult(null)
        setErrorMsg(typeof data?.error === "string" ? data.error : "Could not score this rate.")
      }
    } catch {
      setResult(null)
      setErrorMsg("Something went wrong. Try again.")
    } finally {
      setLoading(false)
    }
  }

  const config = result?.grade ? GRADE_CONFIG[result.grade] : null

  const rateLabel =
    rateLoading || !Number.isFinite(effectiveRate) ? "..." : `L$${effectiveRate.toFixed(2)}`

  return (
    <div className="rounded-xl border border-border/70 bg-card/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
          <Star className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground">TrueRate Score</p>
          <p className="text-[10px] text-muted-foreground">Is my quoted rate fair? · Market: {rateLabel}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">L$</span>
          <input
            type="number"
            value={quotedRate}
            onChange={(e) => setQuotedRate(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && checkScore()}
            placeholder="Enter rate you were quoted..."
            className="w-full bg-background border border-border rounded-lg pl-8 pr-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition dark:bg-slate-950 dark:border-slate-800"
          />
        </div>
        <button
          type="button"
          onClick={checkScore}
          disabled={loading || !quotedRate}
          className="flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground px-4 py-2.5 text-xs font-bold text-primary-foreground transition"
        >
          <Search className="h-3.5 w-3.5" />
          {loading ? "Checking..." : "Check"}
        </button>
      </div>

      {errorMsg && (
        <p className="text-xs text-destructive text-center mb-3" role="alert">
          {errorMsg}
        </p>
      )}

      {result && config && result.diffPct !== undefined && (
        <div className={`rounded-xl border ${config.border} ${config.bg} p-4 space-y-3`}>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 ${config.border} ${config.bg}`}
              >
                <span className={`text-2xl font-black ${config.text}`}>{result.grade}</span>
              </div>
              <div className="min-w-0">
                <p className={`text-base font-bold ${config.text}`}>{result.score}</p>
                <p className="text-xs text-muted-foreground">
                  You were quoted L${Number(result.quotedRate).toFixed(2)}
                </p>
              </div>
            </div>
            <Badge className={`text-xs border shrink-0 ${config.badgeBg}`}>
              {result.diffPct >= 0 ? "+" : ""}
              {result.diffPct.toFixed(1)}% vs market
            </Badge>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-muted-foreground gap-2">
              <span>Your quote</span>
              <span className={config.text}>L${Number(result.quotedRate).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground gap-2">
              <span>Live market</span>
              <span className="text-foreground">L${Number(result.marketRate).toFixed(2)}</span>
            </div>
            {result.cblRate != null && result.cblRate > 0 && (
              <div className="flex justify-between text-muted-foreground gap-2">
                <span>CBL official</span>
                <span className="text-foreground">L${Number(result.cblRate).toFixed(2)}</span>
              </div>
            )}
          </div>

          <p className={`text-sm font-medium ${config.text}`}>{result.verdict}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{result.advice}</p>

          {result.grade === "F" && (
            <Link
              href="/report-fraud"
              className="flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:opacity-80 transition"
            >
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              Report this changer →
            </Link>
          )}
        </div>
      )}

      {!result && !errorMsg && (
        <p className="text-xs text-muted-foreground text-center py-2">
          Enter any rate a changer quoted you — we&apos;ll score it against live market data instantly.
        </p>
      )}
    </div>
  )
}
