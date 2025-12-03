"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, AlertCircle, CheckCircle2 } from "lucide-react"
import { useState, useEffect } from "react"

interface RemittanceOption {
  provider: string
  exchangeRate: number
  transferFee: number
  totalCost: number
  recipientReceives: number
  deliveryTime: string
  recommended: boolean
}

export default function RemittanceCalculatorPage() {
  const [amount, setAmount] = useState("100")
  const [method, setMethod] = useState("bank")
  const [results, setResults] = useState<RemittanceOption[]>([])
  const [currentRate, setCurrentRate] = useState(180)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/rates/live")
      .then((res) => res.json())
      .then((data) => {
        setCurrentRate(data.rate)
        setLoading(false)
      })
      .catch((err) => {
        console.error("[v0] Error fetching rate:", err)
        setCurrentRate(180)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (amount && Number.parseFloat(amount) > 0 && !loading) {
      calculateRemittance()
    }
  }, [amount, method, currentRate, loading])

  const calculateRemittance = () => {
    const sendAmount = Number.parseFloat(amount)
    const baseRate = currentRate

    const options: RemittanceOption[] = [
      {
        provider: "Western Union",
        exchangeRate: baseRate - 2.5, // Worse spread
        transferFee: 8.0,
        totalCost: sendAmount + 8.0,
        recipientReceives: sendAmount * (baseRate - 2.5),
        deliveryTime: "Minutes",
        recommended: false,
      },
      {
        provider: "MoneyGram",
        exchangeRate: baseRate - 2.0,
        transferFee: 6.5,
        totalCost: sendAmount + 6.5,
        recipientReceives: sendAmount * (baseRate - 2.0),
        deliveryTime: "Minutes",
        recommended: true,
      },
      {
        provider: "Bank Transfer",
        exchangeRate: baseRate + 0.5, // Better rate but higher fee
        transferFee: 15.0,
        totalCost: sendAmount + 15.0,
        recipientReceives: sendAmount * (baseRate + 0.5),
        deliveryTime: "1-3 Days",
        recommended: false,
      },
      {
        provider: "Mobile Money (Lonestar)",
        exchangeRate: baseRate - 1.5,
        transferFee: 3.5,
        totalCost: sendAmount + 3.5,
        recipientReceives: sendAmount * (baseRate - 1.5),
        deliveryTime: "Instant",
        recommended: false,
      },
      {
        provider: "Orange Money",
        exchangeRate: baseRate - 1.2,
        transferFee: 3.0,
        totalCost: sendAmount + 3.0,
        recipientReceives: sendAmount * (baseRate - 1.2),
        deliveryTime: "Instant",
        recommended: false,
      },
      {
        provider: "Cash Exchange (Street)",
        exchangeRate: baseRate + 1.0, // Best rate, no fee
        transferFee: 0,
        totalCost: sendAmount,
        recipientReceives: sendAmount * (baseRate + 1.0),
        deliveryTime: "Immediate",
        recommended: false,
      },
    ]

    setResults(options.sort((a, b) => b.recipientReceives - a.recipientReceives))
  }

  const bestRate = results.length > 0 ? results[0].recipientReceives : 0
  const worstRate = results.length > 0 ? results[results.length - 1].recipientReceives : 0
  const savings = bestRate - worstRate

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
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Remittance Cost Calculator</h1>
              <p className="text-lg text-muted-foreground text-pretty">
                Compare the real cost of sending money to Liberia and find the best deal
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
                  <CardTitle className="text-2xl">Calculate Transfer Cost</CardTitle>
                  <CardDescription>Enter the amount you want to send and compare all options</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Send Amount (USD)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="100"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="method">Preferred Method</Label>
                      <Select value={method} onValueChange={setMethod}>
                        <SelectTrigger id="method">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any Method</SelectItem>
                          <SelectItem value="instant">Instant Transfer</SelectItem>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                          <SelectItem value="mobile">Mobile Money</SelectItem>
                          <SelectItem value="cash">Cash Pickup</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {results.length > 0 && (
                <>
                  {/* Summary */}
                  <Card className="mt-6 bg-primary/5">
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-3 gap-6 text-center">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Best Rate</div>
                          <div className="text-2xl font-bold text-secondary">{bestRate.toFixed(2)} LRD</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Worst Rate</div>
                          <div className="text-2xl font-bold text-destructive">{worstRate.toFixed(2)} LRD</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Potential Savings</div>
                          <div className="text-2xl font-bold text-primary">{savings.toFixed(2)} LRD</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Results */}
                  <div className="mt-6 space-y-4">
                    <h2 className="text-2xl font-bold">Comparison Results</h2>
                    {results.map((option, index) => (
                      <Card key={index} className={option.recommended ? "border-secondary" : ""}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-bold">{option.provider}</h3>
                                {index === 0 && <Badge variant="secondary">Best Rate</Badge>}
                                {option.recommended && <Badge>Recommended</Badge>}
                              </div>
                              <div className="text-sm text-muted-foreground">Delivery: {option.deliveryTime}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">
                                {option.recipientReceives.toFixed(2)} LRD
                              </div>
                              <div className="text-sm text-muted-foreground">Recipient gets</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Exchange Rate</div>
                              <div className="font-semibold">{option.exchangeRate.toFixed(2)}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Transfer Fee</div>
                              <div className="font-semibold">${option.transferFee.toFixed(2)}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Total Cost</div>
                              <div className="font-semibold">${option.totalCost.toFixed(2)}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Money Transfer Tips</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold mb-1">Compare All Fees</h3>
                        <p className="text-sm text-muted-foreground">
                          Look at both transfer fees and exchange rate spreads. A low fee doesn't always mean the best
                          deal.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold mb-1">Consider Speed vs Cost</h3>
                        <p className="text-sm text-muted-foreground">
                          Instant transfers often cost more. If time allows, bank transfers may offer better rates.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold mb-1">Watch for Hidden Costs</h3>
                        <p className="text-sm text-muted-foreground">
                          Some services advertise "no fees" but offer poor exchange rates. Always check the final
                          amount.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold mb-1">Use Mobile Money</h3>
                        <p className="text-sm text-muted-foreground">
                          Mobile money services like Lonestar and Orange often have the lowest fees for transfers within
                          Liberia.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
