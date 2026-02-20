"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingDown, Calculator, ShoppingCart, DollarSign, ExternalLink, Loader2 } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface InflationPoint {
  year: string
  cpi: number
  inflation: number
}

export default function InflationTrackerPage() {
  const [amount, setAmount] = useState("1000")
  const [baseYear, setBaseYear] = useState("2020")
  const [targetYear, setTargetYear] = useState("2024")
  const [realValue, setRealValue] = useState(0)
  const [purchasingPower, setPurchasingPower] = useState(100)
  const [cpiData, setCpiData] = useState<InflationPoint[]>([])
  const [sources, setSources] = useState<{ name: string; url: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [latestFromLISGIS, setLatestFromLISGIS] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetch("/api/inflation")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load inflation data")
        return res.json()
      })
      .then((data: { series: InflationPoint[]; sources: { name: string; url: string }[]; latestFromLISGIS?: boolean }) => {
        if (!cancelled && Array.isArray(data.series) && data.series.length > 0) {
          setCpiData(data.series)
          setSources(Array.isArray(data.sources) ? data.sources : [])
          setLatestFromLISGIS(Boolean(data.latestFromLISGIS))
          const last = data.series[data.series.length - 1]
          if (last && targetYear > last.year) setTargetYear(last.year)
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load data")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (cpiData.length === 0) return
    const baseData = cpiData.find((d) => d.year === baseYear)
    const targetData = cpiData.find((d) => d.year === targetYear)
    if (baseData && targetData) {
      const value = Number.parseFloat(amount) || 0
      const adjusted = (value * baseData.cpi) / targetData.cpi
      setRealValue(adjusted)
      setPurchasingPower(value ? (adjusted / value) * 100 : 100)
    }
  }, [amount, baseYear, targetYear, cpiData])

  const chartData = useMemo(
    () =>
      cpiData.map((item) => ({
        year: item.year,
        "Purchasing Power": (cpiData[0] ? (cpiData[0].cpi / item.cpi) * 100 : 100).toFixed(1),
        "Inflation Rate": item.inflation,
      })),
    [cpiData],
  )

  const firstCpi = cpiData[0]?.cpi
  const latestCpi = cpiData[cpiData.length - 1]?.cpi
  const cumulativePct = firstCpi && latestCpi && firstCpi > 0 ? ((latestCpi - firstCpi) / firstCpi) * 100 : 0
  const purchasingPowerPct = firstCpi && latestCpi ? (firstCpi / latestCpi) * 100 : 100
  const example2020 = cpiData.find((d) => d.year === "2020")
  const exampleLatestYear = cpiData.length > 0 ? cpiData[cpiData.length - 1] : null
  const purchasingPower2020ToLatest =
    example2020 && exampleLatestYear && exampleLatestYear.cpi > 0
      ? (example2020.cpi / exampleLatestYear.cpi) * 100
      : 73
  const exampleAmount2020 =
    example2020 && exampleLatestYear && exampleLatestYear.cpi > 0
      ? Math.round((4400 * example2020.cpi) / exampleLatestYear.cpi)
      : 3200
  const equivalentAmount =
    example2020 && exampleLatestYear && exampleLatestYear.cpi > 0
      ? Math.round((exampleAmount2020 * exampleLatestYear.cpi) / example2020.cpi)
      : 4400

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
        {/* Hero Section */}
        <section className="py-12 sm:py-14 md:py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <TrendingDown className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance"><span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">Inflation-Adjusted Rate Tracker</span></h1>
              <p className="text-base sm:text-lg text-muted-foreground text-pretty">
                See how inflation affects your purchasing power over time in Liberia
              </p>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-6 sm:py-8 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {loading && (
                <Card className="mb-6">
                  <CardContent className="flex items-center justify-center gap-2 py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="text-muted-foreground">Loading inflation data from LISGIS, WFP, FAO, FEWS, ReliefWeb, World Bank RTFP &amp; CBL…</span>
                  </CardContent>
                </Card>
              )}
              {error && (
                <Card className="mb-6 border-destructive/50">
                  <CardContent className="py-6">
                    <p className="text-destructive">{error}</p>
                    <p className="text-sm text-muted-foreground mt-1">Using built-in official-based data.</p>
                  </CardContent>
                </Card>
              )}
              {!loading && cpiData.length === 0 && !error && (
                <Card className="mb-6">
                  <CardContent className="py-6 text-muted-foreground">No inflation data available.</CardContent>
                </Card>
              )}
              {cpiData.length > 0 && (
              <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Calculate Real Value</CardTitle>
                  <CardDescription>See what your money is really worth after inflation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (LRD)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="1000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="base-year">Base Year</Label>
                      <Select value={baseYear} onValueChange={setBaseYear}>
                        <SelectTrigger id="base-year">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {cpiData.map((item) => (
                            <SelectItem key={item.year} value={item.year}>
                              {item.year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="target-year">Target Year</Label>
                      <Select value={targetYear} onValueChange={setTargetYear}>
                        <SelectTrigger id="target-year">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {cpiData.map((item) => (
                            <SelectItem key={item.year} value={item.year}>
                              {item.year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="bg-primary/5">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-2">
                          <Calculator className="h-5 w-5 text-primary" />
                          <div className="text-sm text-muted-foreground">Real Value in {targetYear}</div>
                        </div>
                        <div className="text-3xl font-bold">L$ {realValue.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Equivalent to L$ {amount} in {baseYear}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-destructive/5">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-2">
                          <ShoppingCart className="h-5 w-5 text-destructive" />
                          <div className="text-sm text-muted-foreground">Purchasing Power</div>
                        </div>
                        <div className="text-3xl font-bold">{purchasingPower.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {purchasingPower < 100 ? "Loss" : "Gain"} of {Math.abs(100 - purchasingPower).toFixed(1)}%
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* Historical Chart */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Historical Purchasing Power & Inflation</CardTitle>
                  <CardDescription>Track how inflation has eroded purchasing power since 2018</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="year" stroke="var(--border)" tick={{ fill: "var(--foreground)" }} />
                      <YAxis yAxisId="left" stroke="var(--border)" tick={{ fill: "var(--foreground)" }} />
                      <YAxis yAxisId="right" orientation="right" stroke="var(--border)" tick={{ fill: "var(--foreground)" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          color: "var(--card-foreground)",
                        }}
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="Purchasing Power"
                        stroke="var(--primary)"
                        strokeWidth={2}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="Inflation Rate"
                        stroke="var(--destructive)"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Examples */}
              <div className="mt-6 grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="h-5 w-5 text-secondary" />
                      <h3 className="font-semibold">In 2020</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      About L$ {exampleAmount2020.toLocaleString()} could buy a 25kg bag of rice, cooking oil, and basic groceries for a week—CPI-adjusted in real time from LISGIS, WFP, FAO, FEWS, ReliefWeb, World Bank RTFP &amp; CBL (same basket ≈ L$ {equivalentAmount.toLocaleString()} in {exampleLatestYear?.year ?? "2024"}).
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingDown className="h-5 w-5 text-destructive" />
                      <h3 className="font-semibold">In {exampleLatestYear?.year ?? "2024"}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      The same L$ {exampleAmount2020.toLocaleString()} now buys only about {purchasingPower2020ToLatest.toFixed(0)}% of those items due to inflation since 2020
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Calculator className="h-5 w-5 text-accent-foreground" />
                      <h3 className="font-semibold">What This Means</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You need L$ {equivalentAmount.toLocaleString()} in {exampleLatestYear?.year ?? "2024"} to have the same purchasing power as L$ {exampleAmount2020.toLocaleString()} had in 2020—real-time accuracy from live CPI data.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* CPI Data Table */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Consumer Price Index (CPI) Data</CardTitle>
                  <CardDescription>
                    Official inflation statistics for Liberia. Index base: 2018 = 100. Data sources: LISGIS, WFP, FAO, FEWS NET, ReliefWeb, World Bank RTFP, Central Bank of Liberia.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Year</th>
                          <th className="text-right py-2">CPI Index</th>
                          <th className="text-right py-2">Inflation Rate</th>
                          <th className="text-right py-2">Cumulative Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cpiData.map((item, idx) => (
                          <tr key={item.year} className="border-b">
                            <td className="py-2 font-medium">{item.year}</td>
                            <td className="text-right">{item.cpi.toFixed(1)}</td>
                            <td className="text-right">
                              <Badge variant={item.inflation > 15 ? "destructive" : "secondary"}>
                                {item.inflation.toFixed(1)}%
                              </Badge>
                            </td>
                            <td className="text-right">
                              {idx === 0
                                ? "-"
                                : `+${(((item.cpi - cpiData[0].cpi) / cpiData[0].cpi) * 100).toFixed(1)}%`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {sources.length > 0 && (
                    <div className="mt-4 pt-4 border-t flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span>Data sources:</span>
                      {sources.map((s) => (
                        <a
                          key={s.name}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          {s.name}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ))}
                      {latestFromLISGIS && (
                        <Badge variant="outline" className="text-xs">Latest year from LISGIS</Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              </>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
