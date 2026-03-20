"use client"

import { useMemo } from "react"
import { Line, LineChart, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

/** Minimal sparkline: no axes, single line. Data: { value: number }[] */
export function Sparkline({
  data,
  dataKey = "value",
  color = "var(--primary)",
  className,
  height = 36,
}: {
  data: { value: number }[]
  dataKey?: string
  color?: string
  className?: string
  height?: number
}) {
  const series = useMemo(() => {
    if (!data?.length) return []
    const values = data.map((d) => (typeof d.value === "number" ? d.value : 0))
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1
    return data.map((d, i) => ({
      ...d,
      [dataKey]: typeof d.value === "number" ? d.value : 0,
      _index: i,
    }))
  }, [data, dataKey])

  if (series.length < 2) return <div className={cn("flex items-center justify-center text-muted-foreground/50 text-[10px]", className)} style={{ height }}>—</div>

  return (
    <div className={cn("w-full overflow-hidden", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={series} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
