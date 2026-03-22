"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageHero } from "@/components/layout/page-hero"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PiggyBank, Plus, Trash2, TrendingUp, TrendingDown, Shield } from "lucide-react"
import { useState, useEffect } from "react"
import { useLiveRate } from "@/lib/live-rate-context"
import { SurvivalBudgetMode } from "@/components/tools/SurvivalBudgetMode"
import { BudgetHealthSummary } from "@/components/tools/budget-health-summary"

interface BudgetItem {
  id: string
  name: string
  amount: number
  currency: string
  category: string
}

/** Shape of `/api/liberia-cpi` JSON (subset). */
interface LiberiaCpiSnapshot {
  cpi?: number
  inflationYoY?: number
  inflationMoM?: number
  lastMonth?: string
  updatedAt?: string
  source?: string
}

export default function BudgetPlannerPage() {
  const { effectiveRate, loading: rateLoading } = useLiveRate()
  const [cpi, setCpi] = useState<LiberiaCpiSnapshot | null>(null)

  const DEFAULT_INCOME: BudgetItem[] = [
    { id: "inc-1", name: "Monthly salary", amount: 400, currency: "USD", category: "income" },
  ]

  const DEFAULT_EXPENSES: BudgetItem[] = [
    { id: "exp-1", name: "Rent (2-bedroom Monrovia)", amount: 200, currency: "USD", category: "housing" },
    { id: "exp-2", name: "Rice & groceries", amount: 75, currency: "USD", category: "food" },
    { id: "exp-3", name: "Transport (daily taxi/kekeh)", amount: 40, currency: "USD", category: "transport" },
    { id: "exp-4", name: "Fuel", amount: 30, currency: "USD", category: "energy" },
    { id: "exp-5", name: "Phone credit & data", amount: 15, currency: "USD", category: "communication" },
    { id: "exp-6", name: "School fees (monthly portion)", amount: 25, currency: "USD", category: "education" },
  ]

  const [exchangeRate, setExchangeRate] = useState(180)
  const [income, setIncome] = useState<BudgetItem[]>(DEFAULT_INCOME)
  const [expenses, setExpenses] = useState<BudgetItem[]>(DEFAULT_EXPENSES)

  useEffect(() => {
    if (typeof effectiveRate === "number" && Number.isFinite(effectiveRate) && effectiveRate > 0) {
      setExchangeRate(effectiveRate)
    }
  }, [effectiveRate])

  useEffect(() => {
    fetch("/api/liberia-cpi")
      .then((r) => r.json())
      .then((data: unknown) => setCpi(data as LiberiaCpiSnapshot))
      .catch(() => {})
  }, [])

  const addIncome = () => {
    setIncome([
      ...income,
      {
        id: Date.now().toString(),
        name: "",
        amount: 0,
        currency: "USD",
        category: "income",
      },
    ])
  }

  const addExpense = () => {
    setExpenses([
      ...expenses,
      {
        id: Date.now().toString(),
        name: "",
        amount: 0,
        currency: "USD",
        category: "other",
      },
    ])
  }

  const removeItem = (list: BudgetItem[], setList: Function, id: string) => {
    setList(list.filter((item) => item.id !== id))
  }

  const updateItem = (list: BudgetItem[], setList: Function, id: string, field: string, value: any) => {
    setList(list.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const convertToUSD = (amount: number, currency: string) => {
    return currency === "USD" ? amount : amount / exchangeRate
  }

  const totalIncome = income.reduce((sum, item) => sum + convertToUSD(item.amount, item.currency), 0)
  const totalExpenses = expenses.reduce((sum, item) => sum + convertToUSD(item.amount, item.currency), 0)
  const balance = totalIncome - totalExpenses
  const balancePercent = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
        <PageHero
          ariaLabel="Budget planner"
          label="Budget"
          title="Budget Planner"
          description="Track your income and expenses in both USD and LRD, see how exchange rate changes affect your budget"
          variant="centered"
          contentMaxWidth="max-w-3xl"
        />

        {/* Budget Overview */}
        <section className="py-6 sm:py-8 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="mb-6 border-border/40 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-foreground">Current Exchange Rate</CardTitle>
                  <CardDescription>Used for converting between USD and LRD</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label htmlFor="rate">1 USD =</Label>
                      <Input
                        id="rate"
                        type="number"
                        value={exchangeRate}
                        onChange={(e) => setExchangeRate(Number.parseFloat(e.target.value))}
                        className="text-lg font-semibold"
                        disabled={rateLoading}
                      />
                    </div>
                    <div className="text-2xl font-bold">LRD</div>
                  </div>
                  {(cpi?.inflationYoY != null || cpi?.lastMonth) && (
                    <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                      Liberia CPI context:{" "}
                      {cpi.inflationYoY != null ? `${cpi.inflationYoY}% YoY inflation` : "latest index"}
                      {cpi.lastMonth ? ` · ${cpi.lastMonth}` : ""}
                      {cpi.source ? ` · ${cpi.source}` : ""}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Summary Cards */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <Card className="border-border/40 rounded-2xl">
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground mb-1">Total Income</div>
                    <div className="text-2xl font-bold text-secondary flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />${totalIncome.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {(totalIncome * exchangeRate).toFixed(2)} LRD
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/40 rounded-2xl">
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground mb-1">Total Expenses</div>
                    <div className="text-2xl font-bold text-destructive flex items-center gap-2">
                      <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />${totalExpenses.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {(totalExpenses * exchangeRate).toFixed(2)} LRD
                    </div>
                  </CardContent>
                </Card>

                <Card className={`border-border/40 rounded-2xl ${balance >= 0 ? "border-secondary" : "border-destructive"}`}>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground mb-1">Balance</div>
                    <div className={`text-2xl font-bold ${balance >= 0 ? "text-secondary" : "text-destructive"}`}>
                      ${balance.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{balancePercent}% of income</div>
                  </CardContent>
                </Card>
              </div>

              <BudgetHealthSummary
                totalIncome={totalIncome}
                totalExpenses={totalExpenses}
                effectiveRate={
                  typeof effectiveRate === "number" && Number.isFinite(effectiveRate) && effectiveRate > 0
                    ? effectiveRate
                    : exchangeRate
                }
                cpi={cpi}
              />

              {/* Income Section */}
              <Card className="mb-6 border-border/40 rounded-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-foreground">Income</CardTitle>
                      <CardDescription>Add all sources of income</CardDescription>
                    </div>
                    <Button onClick={addIncome} size="sm" className="rounded-xl min-h-[44px]">
                      <Plus className="h-4 w-4 mr-2 text-primary" />
                      Add Income
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {income.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-5">
                        <Label className="text-xs">Name</Label>
                        <Input
                          placeholder="Salary, Business, etc."
                          value={item.name}
                          onChange={(e) => updateItem(income, setIncome, item.id, "name", e.target.value)}
                        />
                      </div>
                      <div className="col-span-3">
                        <Label className="text-xs">Amount</Label>
                        <Input
                          type="number"
                          value={item.amount}
                          onChange={(e) =>
                            updateItem(income, setIncome, item.id, "amount", Number.parseFloat(e.target.value))
                          }
                        />
                      </div>
                      <div className="col-span-3">
                        <Label className="text-xs">Currency</Label>
                        <Select
                          value={item.currency}
                          onValueChange={(value) => updateItem(income, setIncome, item.id, "currency", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="LRD">LRD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-1">
                        <Button variant="ghost" size="icon" onClick={() => removeItem(income, setIncome, item.id)}>
                          <Trash2 className="h-4 w-4 text-primary" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Survival Budget Mode */}
              {expenses.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-orange-700 dark:text-orange-400">Crisis Impact on Your Budget</span>
                  </div>
                  <SurvivalBudgetMode
                    expenses={expenses}
                    exchangeRate={exchangeRate}
                    fuelHikePercent={22}
                  />
                </div>
              )}

              {/* Expenses Section */}
              <Card className="border-border/40 rounded-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-foreground">Expenses</CardTitle>
                      <CardDescription>Track all your monthly expenses</CardDescription>
                    </div>
                    <Button onClick={addExpense} size="sm" className="rounded-xl min-h-[44px]">
                      <Plus className="h-4 w-4 mr-2 text-primary" />
                      Add Expense
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {expenses.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-5">
                        <Label className="text-xs">Name</Label>
                        <Input
                          placeholder="Rent, Food, Transport, etc."
                          value={item.name}
                          onChange={(e) => updateItem(expenses, setExpenses, item.id, "name", e.target.value)}
                        />
                      </div>
                      <div className="col-span-3">
                        <Label className="text-xs">Amount</Label>
                        <Input
                          type="number"
                          value={item.amount}
                          onChange={(e) =>
                            updateItem(expenses, setExpenses, item.id, "amount", Number.parseFloat(e.target.value))
                          }
                        />
                      </div>
                      <div className="col-span-3">
                        <Label className="text-xs">Currency</Label>
                        <Select
                          value={item.currency}
                          onValueChange={(value) => updateItem(expenses, setExpenses, item.id, "currency", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="LRD">LRD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-1">
                        <Button variant="ghost" size="icon" onClick={() => removeItem(expenses, setExpenses, item.id)}>
                          <Trash2 className="h-4 w-4 text-primary" />
                        </Button>
                      </div>
                    </div>
                  ))}
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
