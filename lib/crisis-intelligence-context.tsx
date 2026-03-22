"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

export interface CrisisEvent {
  id: string
  severity: "low" | "medium" | "high" | "critical"
  trigger_type: string
  brief: string
  actions: string[]
  avoid: string[]
  created_at: string
}

function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string")
  if (typeof v === "string") {
    try {
      const p = JSON.parse(v) as unknown
      return Array.isArray(p) ? p.filter((x): x is string => typeof x === "string") : []
    } catch {
      return []
    }
  }
  return []
}

function normalizeSeverity(raw: unknown): CrisisEvent["severity"] {
  if (raw === "low" || raw === "medium" || raw === "high" || raw === "critical") return raw
  return "medium"
}

export function normalizeCrisis(raw: unknown): CrisisEvent | null {
  if (!raw || typeof raw !== "object") return null
  const o = raw as Record<string, unknown>
  const id = typeof o.id === "string" ? o.id : null
  if (!id) return null
  return {
    id,
    severity: normalizeSeverity(o.severity),
    trigger_type: typeof o.trigger_type === "string" ? o.trigger_type : "",
    brief: typeof o.brief === "string" ? o.brief : "",
    actions: asStringArray(o.actions),
    avoid: asStringArray(o.avoid),
    created_at: typeof o.created_at === "string" ? o.created_at : "",
  }
}

type CrisisIntelValue = {
  crisisActive: boolean
  /** First unresolved crisis from the API, if any */
  activeCrisis: CrisisEvent | null
  severity: string | null
  refresh: () => void
}

const CrisisIntelligenceContext = createContext<CrisisIntelValue | null>(null)

export function CrisisIntelligenceProvider({ children }: { children: ReactNode }) {
  const [crisisActive, setCrisisActive] = useState(false)
  const [activeCrisis, setActiveCrisis] = useState<CrisisEvent | null>(null)
  const [severity, setSeverity] = useState<string | null>(null)

  const load = useCallback(() => {
    fetch("/api/crisis/intelligence")
      .then((r) => r.json())
      .then((data: { active?: boolean; crises?: unknown[]; severity?: string | null }) => {
        const active = data.active === true
        setCrisisActive(active)
        setSeverity(typeof data.severity === "string" ? data.severity : null)
        if (active && Array.isArray(data.crises) && data.crises[0]) {
          const c = normalizeCrisis(data.crises[0])
          setActiveCrisis(c)
        } else {
          setActiveCrisis(null)
        }
      })
      .catch(() => {
        setCrisisActive(false)
        setActiveCrisis(null)
        setSeverity(null)
      })
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const value = useMemo(
    () => ({
      crisisActive,
      activeCrisis,
      severity,
      refresh: load,
    }),
    [crisisActive, activeCrisis, severity, load]
  )

  return <CrisisIntelligenceContext.Provider value={value}>{children}</CrisisIntelligenceContext.Provider>
}

export function useCrisisIntelligence(): CrisisIntelValue {
  const ctx = useContext(CrisisIntelligenceContext)
  if (!ctx) {
    throw new Error("useCrisisIntelligence must be used within CrisisIntelligenceProvider")
  }
  return ctx
}
