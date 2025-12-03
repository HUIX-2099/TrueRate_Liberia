"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PiggyBank, Plus, Trash2, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"

interface BudgetItem {
  id: string
  name: string
  amount: number
  currency: string
  category: string
}

export default function BudgetPlannerPage() {
  const [exchangeRate, setExchangeRate] = useState(180)
  const [loading, setLoading] = useState(true)
  const [income, setIncome] = useState<BudgetItem[]>([
    { id: "1", name: "Monthly Salary", amount: 500, currency: "USD", category: "income" },
  ])
  const [expenses, setExpenses] = useState<BudgetItem[]>([
    { id: "1", name: "Rent", amount: 200, currency: "USD", category: "housing" },
    { id: "2", name: "Food", amount: 30000, currency: "LRD", category: "food" },
    { id: "3", name: "Transport", amount: 15000, currency: "LRD", category: "transport" },
  ])

  useEffect(() => {
    fetch("/api/rates/live")
      .then((res) => res.json())
      .then((data) => {
        setExchangeRate(data.rate)
        setLoading(false)
      })
      .catch((err) => {
        console.error("[v0] Error fetching rate:", err)
        setExchangeRate(180)
        setLoading(false)
      })
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
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <PiggyBank className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Budget Planner</h1>
              <p className="text-lg text-muted-foreground text-pretty">
                Track your income and expenses in both USD and LRD, see how exchange rate changes affect your budget
              </p>
            </div>
          </div>
        </section>

        {/* Budget Overview */}
        <section className="py-8 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Current Exchange Rate</CardTitle>
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
                        disabled={loading}
                      />
                    </div>
                    <div className="text-2xl font-bold">LRD</div>
                  </div>
                </CardContent>
              </Card>

              {/* Summary Cards */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground mb-1">Total Income</div>
                    <div className="text-2xl font-bold text-secondary flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />${totalIncome.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {(totalIncome * exchangeRate).toFixed(2)} LRD
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground mb-1">Total Expenses</div>
                    <div className="text-2xl font-bold text-destructive flex items-center gap-2">
                      <TrendingDown className="h-5 w-5" />${totalExpenses.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {(totalExpenses * exchangeRate).toFixed(2)} LRD
                    </div>
                  </CardContent>
                </Card>

                <Card className={balance >= 0 ? "border-secondary" : "border-destructive"}>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground mb-1">Balance</div>
                    <div className={`text-2xl font-bold ${balance >= 0 ? "text-secondary" : "text-destructive"}`}>
                      ${balance.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{balancePercent}% of income</div>
                  </CardContent>
                </Card>
              </div>

              {balance < 0 && (
                <Card className="mb-6 border-destructive/50 bg-destructive/5">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-destructive mb-1">Budget Deficit</h3>
                        <p className="text-sm text-muted-foreground">
                          Your expenses exceed your income by ${Math.abs(balance).toFixed(2)}. Consider reducing
                          expenses or increasing income.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Income Section */}
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">Income</CardTitle>
                      <CardDescription>Add all sources of income</CardDescription>
                    </div>
                    <Button onClick={addIncome} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
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
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Expenses Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">Expenses</CardTitle>
                      <CardDescription>Track all your monthly expenses</CardDescription>
                    </div>
                    <Button onClick={addExpense} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
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
                          <Trash2 className="h-4 w-4" />
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
