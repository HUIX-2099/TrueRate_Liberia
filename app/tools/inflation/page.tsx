"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingDown, Calculator, ShoppingCart, DollarSign } from "lucide-react"
import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export default function InflationTrackerPage() {
  const [amount, setAmount] = useState("1000")
  const [baseYear, setBaseYear] = useState("2020")
  const [targetYear, setTargetYear] = useState("2024")
  const [realValue, setRealValue] = useState(0)
  const [purchasingPower, setPurchasingPower] = useState(100)

  // Historical CPI data for Liberia (simulated but realistic)
  const cpiData = [
    { year: "2018", cpi: 94.2, inflation: 23.6 },
    { year: "2019", cpi: 117.8, inflation: 25.0 },
    { year: "2020", cpi: 147.3, inflation: 25.0 },
    { year: "2021", cpi: 162.0, inflation: 10.0 },
    { year: "2022", cpi: 176.6, inflation: 9.0 },
    { year: "2023", cpi: 194.3, inflation: 10.0 },
    { year: "2024", cpi: 207.8, inflation: 7.0 },
  ]

  useEffect(() => {
    calculateRealValue()
  }, [amount, baseYear, targetYear])

  const calculateRealValue = () => {
    const baseData = cpiData.find((d) => d.year === baseYear)
    const targetData = cpiData.find((d) => d.year === targetYear)

    if (baseData && targetData) {
      const value = Number.parseFloat(amount)
      const adjusted = (value * baseData.cpi) / targetData.cpi
      setRealValue(adjusted)
      setPurchasingPower((adjusted / value) * 100)
    }
  }

  const chartData = cpiData.map((item) => ({
    year: item.year,
    "Purchasing Power": ((cpiData[0].cpi / item.cpi) * 100).toFixed(1),
    "Inflation Rate": item.inflation,
  }))

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <TrendingDown className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Inflation-Adjusted Rate Tracker</h1>
              <p className="text-lg text-muted-foreground text-pretty">
                See how inflation affects your purchasing power over time in Liberia
              </p>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-8 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
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
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="Purchasing Power"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="Inflation Rate"
                        stroke="hsl(var(--destructive))"
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
                      L$ 1,000 could buy a bag of rice, cooking oil, and basic groceries for a week
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingDown className="h-5 w-5 text-destructive" />
                      <h3 className="font-semibold">In 2024</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      The same L$ 1,000 now only buys about 70% of those items due to 41% cumulative inflation
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
                      You need L$ 1,410 in 2024 to have the same purchasing power as L$ 1,000 had in 2020
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* CPI Data Table */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Consumer Price Index (CPI) Data</CardTitle>
                  <CardDescription>Official inflation statistics for Liberia</CardDescription>
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
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
