"use client"

import { SEVERITY_COLORS, type SeverityLevel } from "@/lib/crisis/severity-engine"
import { AlertTriangle, Shield, ShieldAlert, ShieldCheck } from "lucide-react"

interface CrisisSeverityMeterProps {
  level: SeverityLevel
  score: number
  headline: string
  description: string
}

const LEVEL_ICONS = {
  green: ShieldCheck,
  yellow: Shield,
  orange: ShieldAlert,
  red: AlertTriangle,
}

export function CrisisSeverityMeter({ level, score, headline, description }: CrisisSeverityMeterProps) {
  const colors = SEVERITY_COLORS[level]
  const Icon = LEVEL_ICONS[level]
  const rotation = (score / 100) * 180 - 90

  return (
    <div className={`rounded-2xl border ${colors.border} ${colors.bg} p-6`}>
      <div className="flex items-start gap-4">
        <div className={`h-14 w-14 rounded-full flex items-center justify-center ${colors.bg} shrink-0`}>
          <Icon className={`h-7 w-7 ${colors.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h2 className={`text-xl font-bold ${colors.text}`}>{headline}</h2>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
              {colors.label}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>Stable</span>
          <span className="font-semibold text-foreground">Score: {score}/100</span>
          <span>Critical</span>
        </div>
        <div className="relative h-3 rounded-full bg-muted overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${score}%`,
              background: level === "green"
                ? "linear-gradient(90deg, #22c55e, #4ade80)"
                : level === "yellow"
                  ? "linear-gradient(90deg, #eab308, #facc15)"
                  : level === "orange"
                    ? "linear-gradient(90deg, #f97316, #fb923c)"
                    : "linear-gradient(90deg, #ef4444, #f87171)",
            }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          {(["green", "yellow", "orange", "red"] as SeverityLevel[]).map((l) => (
            <div
              key={l}
              className={`w-1/4 h-1 rounded-full mx-0.5 ${l === level ? "opacity-100" : "opacity-20"}`}
              style={{
                background: l === "green" ? "#22c55e" : l === "yellow" ? "#eab308" : l === "orange" ? "#f97316" : "#ef4444",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
