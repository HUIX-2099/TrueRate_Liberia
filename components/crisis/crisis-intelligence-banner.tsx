"use client"

import { useState } from "react"
import Link from "next/link"
import { AlertTriangle, X, ChevronDown, ChevronUp, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useCrisisIntelligence, type CrisisEvent } from "@/lib/crisis-intelligence-context"

const SEVERITY_CONFIG: Record<
  CrisisEvent["severity"],
  { bg: string; text: string; icon: string; label: string }
> = {
  low: {
    bg: "bg-amber-500/10 border-amber-500/30",
    text: "text-amber-800 dark:text-amber-200",
    icon: "text-amber-600",
    label: "MARKET ALERT",
  },
  medium: {
    bg: "bg-orange-500/10 border-orange-500/30",
    text: "text-orange-800 dark:text-orange-200",
    icon: "text-orange-600",
    label: "MARKET WARNING",
  },
  high: {
    bg: "bg-rose-500/10 border-rose-500/30",
    text: "text-rose-800 dark:text-rose-200",
    icon: "text-rose-600",
    label: "CRISIS ALERT",
  },
  critical: {
    bg: "bg-rose-600/20 border-rose-600/40",
    text: "text-rose-900 dark:text-rose-100",
    icon: "text-rose-700",
    label: "CRITICAL ALERT",
  },
}

export function CrisisIntelligenceBanner() {
  const { crisisActive, activeCrisis: crisis } = useCrisisIntelligence()
  const [expanded, setExpanded] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [aiBrief, setAiBrief] = useState("")
  const [loadingBrief, setLoadingBrief] = useState(false)

  const fetchAiBrief = async () => {
    if (!crisis || aiBrief) return
    setLoadingBrief(true)
    try {
      const res = await fetch("/api/crisis/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crisisId: crisis.id }),
      })
      const data = (await res.json()) as { brief?: string }
      if (typeof data.brief === "string" && data.brief.length > 0) setAiBrief(data.brief)
    } catch {
      // ignore
    } finally {
      setLoadingBrief(false)
    }
  }

  if (!crisisActive || !crisis || dismissed) return null

  const config = SEVERITY_CONFIG[crisis.severity]

  return (
    <div
      className={`border-b ${config.bg} animate-in slide-in-from-top-2 duration-300`}
      role="region"
      aria-label="Crisis alert"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 py-3">
          <AlertTriangle className={`h-4 w-4 shrink-0 ${config.icon}`} aria-hidden />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={`text-[10px] border ${config.bg} ${config.text} shrink-0`}>{config.label}</Badge>
              <p className={`text-sm font-medium ${config.text} line-clamp-2 sm:line-clamp-1`}>{crisis.brief}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                const next = !expanded
                setExpanded(next)
                if (next) void fetchAiBrief()
              }}
              className={`flex items-center gap-1 text-xs ${config.text} hover:opacity-70 transition`}
            >
              {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              {expanded ? "Less" : "What to do"}
            </button>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className={`${config.text} hover:opacity-70 transition p-0.5 rounded`}
              aria-label="Dismiss alert"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {expanded && (
          <div
            className={`pb-4 border-t ${config.bg.includes("rose") ? "border-rose-500/20" : "border-amber-500/20"} pt-3`}
          >
            {loadingBrief ? (
              <p className={`text-xs ${config.text} animate-pulse`}>TRFN Analyst generating crisis brief...</p>
            ) : aiBrief ? (
              <div className={`text-xs ${config.text} space-y-1 whitespace-pre-wrap leading-relaxed`}>
                {aiBrief.split("\n").map((line, i) => (
                  <p key={i} className={line.trimStart().startsWith("**") ? "font-semibold mt-2" : ""}>
                    {line.replace(/\*\*/g, "")}
                  </p>
                ))}
              </div>
            ) : (
              <div className={`text-xs ${config.text} space-y-3`}>
                {crisis.actions.length > 0 && (
                  <div>
                    <p className="font-semibold mb-1">What to do:</p>
                    {crisis.actions.map((a, i) => (
                      <p key={i}>
                        • {a}
                      </p>
                    ))}
                  </div>
                )}
                {crisis.avoid.length > 0 && (
                  <div>
                    <p className="font-semibold mb-1">What NOT to do:</p>
                    {crisis.avoid.map((a, i) => (
                      <p key={i}>
                        • {a}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <Link href="/crisis" className={`text-xs underline ${config.text} hover:opacity-70`}>
                Full crisis page →
              </Link>
              <Link
                href="/report-fraud"
                className={`flex items-center gap-1 text-xs underline ${config.text} hover:opacity-70`}
              >
                <Shield className="h-3 w-3 shrink-0" />
                Report related fraud →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
