"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MapPin } from "lucide-react"

export interface CountyData {
  name: string
  opportunityCount: number
  avgReturn: number
  riskLevel: "Low" | "Medium" | "High" | "All"
}

interface LiberiaCountyMapProps {
  countyData: CountyData[]
  onCountyClick?: (county: string) => void
  selectedCounty?: string | null
  className?: string
}

const COUNTIES: Record<string, { path: string; label: [number, number] }> = {
  Montserrado: {
    // Coastal southwest — largest population center
    path: "M 90 175 L 110 165 L 120 170 L 115 185 L 100 190 L 88 183 Z",
    label: [102, 178],
  },
  Margibi: {
    path: "M 115 165 L 140 155 L 148 165 L 140 175 L 122 178 L 112 172 Z",
    label: [130, 167],
  },
  "Grand Cape Mount": {
    path: "M 60 145 L 85 135 L 92 148 L 88 158 L 68 162 L 56 155 Z",
    label: [73, 150],
  },
  Bomi: {
    path: "M 82 155 L 100 148 L 108 158 L 102 168 L 85 170 L 76 162 Z",
    label: [90, 161],
  },
  "Grand Bassa": {
    path: "M 118 180 L 148 172 L 162 180 L 158 195 L 138 200 L 118 193 Z",
    label: [140, 188],
  },
  Rivercess: {
    path: "M 148 195 L 172 188 L 182 200 L 176 214 L 155 218 L 146 208 Z",
    label: [164, 205],
  },
  Sinoe: {
    path: "M 166 212 L 195 205 L 205 218 L 198 232 L 175 236 L 164 226 Z",
    label: [185, 221],
  },
  "Grand Kru": {
    path: "M 180 235 L 205 228 L 215 240 L 208 252 L 188 255 L 178 246 Z",
    label: [196, 243],
  },
  Maryland: {
    path: "M 195 250 L 220 244 L 228 256 L 220 268 L 200 270 L 193 260 Z",
    label: [210, 258],
  },
  "River Gee": {
    path: "M 205 238 L 228 232 L 236 244 L 228 256 L 207 258 L 200 248 Z",
    label: [218, 246],
  },
  "Grand Gedeh": {
    path: "M 195 212 L 218 205 L 228 216 L 222 228 L 200 232 L 192 222 Z",
    label: [209, 219],
  },
  Nimba: {
    path: "M 165 175 L 198 168 L 210 180 L 205 195 L 178 198 L 162 188 Z",
    label: [185, 184],
  },
  Bong: {
    path: "M 128 158 L 162 150 L 170 162 L 164 175 L 140 178 L 126 168 Z",
    label: [148, 165],
  },
  Lofa: {
    path: "M 98 120 L 140 110 L 152 125 L 145 140 L 112 145 L 95 132 Z",
    label: [123, 130],
  },
  Gbarpolu: {
    path: "M 75 130 L 100 120 L 108 133 L 100 145 L 80 148 L 70 138 Z",
    label: [89, 136],
  },
}

function getCountyColor(data: CountyData | undefined, selected: boolean): string {
  if (selected) return "hsl(var(--primary))"
  if (!data) return "hsl(var(--muted))"
  const { opportunityCount } = data
  if (opportunityCount >= 6) return "hsl(var(--primary) / 0.9)"
  if (opportunityCount >= 4) return "hsl(var(--primary) / 0.65)"
  if (opportunityCount >= 2) return "hsl(var(--primary) / 0.35)"
  return "hsl(var(--primary) / 0.15)"
}

export function LiberiaCountyMap({ countyData, onCountyClick, selectedCounty, className }: LiberiaCountyMapProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  const dataByCounty = useMemo(() => {
    const map = new Map<string, CountyData>()
    for (const d of countyData) map.set(d.name, d)
    return map
  }, [countyData])

  return (
    <TooltipProvider>
      <div className={cn("relative w-full", className)}>
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Investment Opportunity Density by County
          </span>
        </div>

        <div className="relative rounded-2xl border border-border/40 bg-muted/10 overflow-hidden p-2">
          <svg
            viewBox="50 100 200 185"
            className="w-full h-auto"
            role="img"
            aria-label="Liberia county map showing investment opportunity density"
          >
            <title>Liberia County Investment Map</title>
            {Object.entries(COUNTIES).map(([name, { path, label }]) => {
              const data = dataByCounty.get(name)
              const isSelected = selectedCounty === name
              const isHovered = hovered === name
              const fill = getCountyColor(data, isSelected)

              return (
                <Tooltip key={name}>
                  <TooltipTrigger asChild>
                    <g
                      className="cursor-pointer"
                      onClick={() => onCountyClick?.(name)}
                      onMouseEnter={() => setHovered(name)}
                      onMouseLeave={() => setHovered(null)}
                      role="button"
                      aria-label={`${name}: ${data?.opportunityCount ?? 0} opportunities`}
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && onCountyClick?.(name)}
                    >
                      <path
                        d={path}
                        fill={fill}
                        stroke="hsl(var(--background))"
                        strokeWidth={isSelected || isHovered ? 1.5 : 1}
                        strokeLinejoin="round"
                        className="transition-all duration-200"
                        opacity={isHovered && !isSelected ? 0.85 : 1}
                      />
                      {/* County label for larger counties */}
                      {(isSelected || isHovered) && (
                        <text
                          x={label[0]}
                          y={label[1]}
                          textAnchor="middle"
                          fontSize="4"
                          fontWeight="bold"
                          fill={isSelected ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))"}
                          className="pointer-events-none select-none"
                        >
                          {name.split(" ").slice(-1)[0]}
                        </text>
                      )}
                    </g>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="rounded-xl border-border/40">
                    <div className="space-y-1 text-xs">
                      <p className="font-black text-sm">{name}</p>
                      {data ? (
                        <>
                          <p><span className="text-muted-foreground">Opportunities:</span> <strong>{data.opportunityCount}</strong></p>
                          <p><span className="text-muted-foreground">Avg Return:</span> <strong>{data.avgReturn}%</strong></p>
                          <p><span className="text-muted-foreground">Risk:</span> <strong>{data.riskLevel}</strong></p>
                        </>
                      ) : (
                        <p className="text-muted-foreground">No data</p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Density:</span>
          {[
            { label: "6+", opacity: "0.9" },
            { label: "4–5", opacity: "0.65" },
            { label: "2–3", opacity: "0.35" },
            { label: "1", opacity: "0.15" },
          ].map(({ label, opacity }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div
                className="h-3 w-3 rounded"
                style={{ background: `hsl(var(--primary) / ${opacity})`, border: "1px solid hsl(var(--border))" }}
              />
              <span className="text-[10px] font-bold text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}
