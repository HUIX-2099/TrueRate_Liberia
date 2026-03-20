"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChartContainer } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts"
import { BarChart3 } from "lucide-react"
import {
  INVESTMENT_OPPORTUNITIES,
  type InvestmentOpportunity,
  type RiskLevel,
} from "./investment-opportunities"
import { getRegionalChartColor } from "@/lib/regional-chart-colors"

const REGIONS = [
  "All",
  "Montserrado",
  "Bong",
  "Nimba",
  "Lofa",
  "Grand Bassa",
  "Margibi",
  "Bomi",
  "Sinoe",
  "Grand Gedeh",
  "Maryland",
]

const SECTORS = ["All", ...new Set(INVESTMENT_OPPORTUNITIES.map((o) => o.sector))]

const RISK_LEVELS: RiskLevel[] = ["All", "Low", "Medium", "High"]

function parseRegions(regionStr: string): string[] {
  return regionStr.split(",").map((s) => s.trim()).filter(Boolean)
}

function aggregateByRegion(opportunities: InvestmentOpportunity[]): { region: string; count: number; fill: string }[] {
  const map = new Map<string, number>()
  for (const opp of opportunities) {
    const regions = parseRegions(opp.region)
    for (const r of regions) {
      map.set(r, (map.get(r) ?? 0) + 1)
    }
  }
  const sorted = [...map.entries()].sort((a, b) => b[1] - a[1])
  return sorted.map(([region, count]) => ({
    region,
    count,
    fill: getRegionalChartColor(region),
  }))
}

const chartConfig = {
  count: { label: "Opportunities", color: "var(--primary)" },
}

export function RegionalInsights() {
  const [regionFilter, setRegionFilter] = useState<string>("All")
  const [sectorFilter, setSectorFilter] = useState<string>("All")
  const [riskFilter, setRiskFilter] = useState<string>("All")

  const filtered = useMemo(() => {
    let list = [...INVESTMENT_OPPORTUNITIES]
    if (sectorFilter !== "All") list = list.filter((o) => o.sector === sectorFilter)
    if (riskFilter !== "All") list = list.filter((o) => o.riskLevel === riskFilter)
    if (regionFilter !== "All") {
      list = list.filter((o) => parseRegions(o.region).includes(regionFilter))
    }
    return list
  }, [regionFilter, sectorFilter, riskFilter])

  const chartData = useMemo(() => aggregateByRegion(filtered), [filtered])

  return (
    <Card className="rounded-2xl border-border/60 bg-card shadow-[var(--shadow-institutional)] overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-base sm:text-lg font-semibold">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted/40 border border-border/40 text-primary">
            <BarChart3 className="h-4 w-4 text-primary" aria-hidden />
          </div>
          Regional Insights
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Investment opportunities by region. Use filters to narrow by sector and risk level.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger size="sm" className="w-[180px] rounded-xl">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sectorFilter} onValueChange={setSectorFilter}>
            <SelectTrigger size="sm" className="w-[200px] rounded-xl">
              <SelectValue placeholder="Sector" />
            </SelectTrigger>
            <SelectContent>
              {SECTORS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger size="sm" className="w-[140px] rounded-xl">
              <SelectValue placeholder="Risk Level" />
            </SelectTrigger>
            <SelectContent>
              {RISK_LEVELS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-[280px] flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/20 text-muted-foreground text-sm">
            <BarChart3 className="h-10 w-10 opacity-50 text-primary" aria-hidden />
            <p className="font-medium">No data for selected filters</p>
            <p className="text-xs">Try different region, sector, or risk level.</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <BarChart
              data={chartData}
              margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <YAxis
                type="category"
                dataKey="region"
                width={100}
                tick={{ fontSize: 11, fill: "var(--foreground)" }}
              />
              <Tooltip
                content={({ active, payload }) =>
                  active && payload?.[0] ? (
                    <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-md">
                      <span className="text-muted-foreground">{payload[0].payload.region}</span>
                      <span className="ml-2 font-mono font-semibold">{payload[0].value} opportunities</span>
                    </div>
                  ) : null
                }
              />
              <Bar dataKey="count" name="Opportunities" radius={[0, 4, 4, 0]} maxBarSize={28}>
                {chartData.map((entry) => (
                  <Cell key={entry.region} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
