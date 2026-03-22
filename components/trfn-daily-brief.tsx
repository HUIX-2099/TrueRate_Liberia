"use client"

import { useState, type ElementType } from "react"
import { Badge } from "@/components/ui/badge"
import { FileText, RefreshCw, User, Briefcase, Globe, GraduationCap, ChevronDown, ChevronUp } from "lucide-react"

type UserType = "consumer" | "business" | "diaspora" | "student"

const USER_TYPES: { id: UserType; label: string; icon: ElementType; desc: string }[] = [
  { id: "consumer", label: "Household", icon: User, desc: "Daily expenses & family" },
  { id: "business", label: "Business", icon: Briefcase, desc: "Import/export & forex" },
  { id: "diaspora", label: "Diaspora", icon: Globe, desc: "Sending money home" },
  { id: "student", label: "Student", icon: GraduationCap, desc: "Budget & tuition" },
]

function renderBrief(text: string) {
  const lines = text.split("\n").filter(Boolean)
  return (
    <div className="space-y-3 text-sm">
      {lines.map((line, i) => {
        const trimmed = line.trim()
        if (
          trimmed.startsWith("**Good") ||
          trimmed.startsWith("**Today") ||
          /^\*\*Good (morning|afternoon)/i.test(trimmed)
        ) {
          return (
            <p key={i} className="font-semibold text-foreground text-base leading-snug">
              {trimmed.replace(/\*\*/g, "")}
            </p>
          )
        }
        if (
          trimmed.startsWith("**What to watch") ||
          trimmed.startsWith("**One thing") ||
          trimmed.startsWith("**Market mood")
        ) {
          return (
            <p key={i} className="font-semibold text-foreground mt-4">
              {trimmed.replace(/\*\*/g, "")}
            </p>
          )
        }
        if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
          return (
            <div key={i} className="flex gap-2 text-muted-foreground">
              <span className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">•</span>
              <span>{trimmed.replace(/^[•\-]\s*/, "")}</span>
            </div>
          )
        }
        return (
          <p key={i} className="text-muted-foreground leading-relaxed">
            {trimmed.replace(/\*\*/g, "")}
          </p>
        )
      })}
    </div>
  )
}

export function TrfnDailyBrief() {
  const [userType, setUserType] = useState<UserType>("consumer")
  const [brief, setBrief] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [generatedAt, setGeneratedAt] = useState<string>("")
  const [expanded, setExpanded] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  const fetchBrief = async (type: UserType) => {
    setLoading(true)
    setBrief("")
    try {
      const res = await fetch(`/api/trfn/daily-brief?type=${type}`)
      const data = (await res.json()) as { brief?: string; generatedAt?: string; error?: string }
      if (!res.ok) {
        setBrief(data.error ?? "The brief could not be loaded. Please try again shortly.")
        setHasLoaded(true)
        setExpanded(true)
        return
      }
      if (data.brief) {
        setBrief(data.brief)
        setGeneratedAt(data.generatedAt ?? "")
        setExpanded(true)
        setHasLoaded(true)
      } else {
        setBrief(data.error ?? "No brief was returned. Please try again shortly.")
        setHasLoaded(true)
        setExpanded(true)
      }
    } catch {
      setBrief("The brief could not be loaded. Please try again shortly.")
      setHasLoaded(true)
      setExpanded(true)
    } finally {
      setLoading(false)
    }
  }

  const handleTypeChange = (type: UserType) => {
    setUserType(type)
    if (hasLoaded) void fetchBrief(type)
  }

  const today = new Date().toLocaleDateString("en-LR", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="rounded-2xl border border-border/70 bg-card/95 overflow-hidden shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="px-5 pt-5 pb-4 border-b border-border/50 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-muted/40">
              <FileText className="h-4 w-4 text-foreground/80" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground tracking-tight">My Liberia Daily</p>
              <p className="text-[10px] text-muted-foreground">{today}</p>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] font-medium text-muted-foreground border-border/60">
            Market brief
          </Badge>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {USER_TYPES.map(({ id, label, icon: Icon, desc }) => (
            <button
              key={id}
              type="button"
              title={desc}
              onClick={() => handleTypeChange(id)}
              className={`flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-[10px] font-medium transition-all ${
                userType === id
                  ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                  : "bg-muted/40 border border-border/50 text-muted-foreground hover:bg-muted/60"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-4">
        {!hasLoaded ? (
          <div className="flex flex-col items-center justify-center py-6 text-center gap-4">
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Same-day view of exchange rates, inflation context, and market conditions in Liberia—framed for the
              profile you select below.
            </p>
            <button
              type="button"
              onClick={() => void fetchBrief(userType)}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 disabled:opacity-60 px-5 py-2.5 text-sm font-semibold text-white transition-colors shadow-sm min-h-[44px]"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin shrink-0" aria-hidden />
                  Preparing brief…
                </>
              ) : (
                `View today's market brief`
              )}
            </button>
          </div>
        ) : (
          <>
            {loading ? (
              <div className="flex items-center gap-3 py-6">
                <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground shrink-0" aria-hidden />
                <p className="text-sm text-muted-foreground">Loading brief…</p>
              </div>
            ) : (
              <>
                <div
                  className={`overflow-hidden transition-all duration-300 ${expanded ? "max-h-[600px]" : "max-h-[80px]"}`}
                >
                  <div className={!expanded ? "line-clamp-3" : ""}>{renderBrief(brief)}</div>
                </div>

                <button
                  type="button"
                  onClick={() => setExpanded(!expanded)}
                  className="mt-3 flex items-center gap-1 text-xs text-foreground/80 hover:text-foreground hover:underline"
                >
                  {expanded ? (
                    <>
                      <ChevronUp className="h-3.5 w-3.5" /> Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3.5 w-3.5" /> Read full brief
                    </>
                  )}
                </button>

                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">
                    Last updated{" "}
                    {generatedAt
                      ? new Date(generatedAt).toLocaleTimeString("en-LR", { hour: "2-digit", minute: "2-digit" })
                      : "—"}
                    {" · "}
                    <span className="text-foreground/70">TrueRate Liberia</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => void fetchBrief(userType)}
                    disabled={loading}
                    className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground transition disabled:opacity-50"
                  >
                    <RefreshCw className="h-3 w-3 shrink-0" aria-hidden />
                    Update
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
