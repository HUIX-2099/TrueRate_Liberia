"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageHero } from "@/components/layout/page-hero"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  DollarSign, AlertCircle, CheckCircle2, AlertTriangle, ArrowRight,
  Heart, GraduationCap, Home, ShoppingBasket, Stethoscope, Zap,
  TrendingUp, Users, Globe, Clock, Shield, Smartphone, Send,
  Building2, Landmark, PiggyBank, Lightbulb, ChevronRight, Star,
  Calculator, Gift, Phone, Fuel, BookOpen, Baby
} from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { EmergencyRemittanceMode } from "@/components/crisis/EmergencyRemittanceMode"
import Link from "next/link"

interface RemittanceOption {
  provider: string
  exchangeRate: number
  transferFee: number
  totalCost: number
  recipientReceives: number
  deliveryTime: string
  recommended: boolean
  method: string
  icon: React.ReactNode
}

const FAMILY_SCENARIOS = [
  {
    id: "groceries",
    label: "Monthly Groceries",
    icon: <ShoppingBasket className="h-5 w-5 text-primary" />,
    amount: 75,
    description: "Rice, oil, vegetables, protein for a family of 4",
    frequency: "Monthly",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-muted/40 border border-border/40",
    borderColor: "border-green-500/20",
  },
  {
    id: "school",
    label: "School Fees",
    icon: <GraduationCap className="h-5 w-5 text-primary" />,
    amount: 150,
    description: "Tuition, books & uniforms for one semester",
    frequency: "Per semester",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-muted/40 border border-border/40",
    borderColor: "border-blue-500/20",
  },
  {
    id: "medical",
    label: "Medical Bills",
    icon: <Stethoscope className="h-5 w-5 text-primary" />,
    amount: 100,
    description: "Doctor visit, prescriptions & lab tests",
    frequency: "As needed",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-muted/40 border border-border/40",
    borderColor: "border-red-500/20",
  },
  {
    id: "rent",
    label: "Rent Support",
    icon: <Home className="h-5 w-5 text-primary" />,
    amount: 200,
    description: "Average rent in Monrovia for a 2-bedroom",
    frequency: "Monthly",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-muted/40 border border-border/40",
    borderColor: "border-purple-500/20",
  },
  {
    id: "emergency",
    label: "Emergency Fund",
    icon: <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
    amount: 300,
    description: "Urgent support for unexpected crises",
    frequency: "One-time",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-muted/40 border border-border/40",
    borderColor: "border-orange-500/20",
  },
  {
    id: "business",
    label: "Small Business",
    icon: <Building2 className="h-5 w-5 text-primary" />,
    amount: 500,
    description: "Seed capital for a market stall or shop",
    frequency: "One-time",
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-muted/40 border border-border/40",
    borderColor: "border-indigo-500/20",
  },
]

const MONTHLY_SUPPORT_PLANS = [
  {
    name: "Essential Support",
    amount: 100,
    description: "Cover the basics: food, transport, and phone credit",
    items: ["25kg bag of rice", "Cooking oil & seasonings", "Weekly transport", "Monthly phone credit"],
  },
  {
    name: "Comfortable Living",
    amount: 250,
    description: "Food, utilities, transport, and small savings buffer",
    items: ["Full monthly groceries", "Electricity & water", "Daily transport", "School supplies", "Small savings"],
  },
  {
    name: "Full Family Care",
    amount: 500,
    description: "Complete household support including education & health",
    items: ["All food & household needs", "Rent contribution", "School fees", "Healthcare fund", "Emergency reserve", "Mobile data & credit"],
  },
]

export default function RemittanceCalculatorPage() {
  const [amount, setAmount] = useState("100")
  const [method, setMethod] = useState("any")
  const [results, setResults] = useState<RemittanceOption[]>([])
  const [currentRate, setCurrentRate] = useState(180)
  const [loading, setLoading] = useState(true)
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [sendCurrency, setSendCurrency] = useState("USD")

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

  const calculateRemittance = () => {
    const sendAmount = Number.parseFloat(amount)
    const baseRate = currentRate

    const options: RemittanceOption[] = [
      {
        provider: "Western Union",
        exchangeRate: baseRate - 2.5,
        transferFee: 8.0,
        totalCost: sendAmount + 8.0,
        recipientReceives: sendAmount * (baseRate - 2.5),
        deliveryTime: "Minutes",
        recommended: false,
        method: "cash",
        icon: <Globe className="h-5 w-5 text-primary" />,
      },
      {
        provider: "MoneyGram",
        exchangeRate: baseRate - 2.0,
        transferFee: 6.5,
        totalCost: sendAmount + 6.5,
        recipientReceives: sendAmount * (baseRate - 2.0),
        deliveryTime: "Minutes",
        recommended: true,
        method: "cash",
        icon: <Send className="h-5 w-5 text-primary" />,
      },
      {
        provider: "Bank Transfer",
        exchangeRate: baseRate + 0.5,
        transferFee: 15.0,
        totalCost: sendAmount + 15.0,
        recipientReceives: sendAmount * (baseRate + 0.5),
        deliveryTime: "1-3 Days",
        recommended: false,
        method: "bank",
        icon: <Landmark className="h-5 w-5 text-primary" />,
      },
      {
        provider: "Mobile Money (Lonestar)",
        exchangeRate: baseRate - 1.5,
        transferFee: 3.5,
        totalCost: sendAmount + 3.5,
        recipientReceives: sendAmount * (baseRate - 1.5),
        deliveryTime: "Instant",
        recommended: false,
        method: "mobile",
        icon: <Smartphone className="h-5 w-5 text-primary" />,
      },
      {
        provider: "Orange Money",
        exchangeRate: baseRate - 1.2,
        transferFee: 3.0,
        totalCost: sendAmount + 3.0,
        recipientReceives: sendAmount * (baseRate - 1.2),
        deliveryTime: "Instant",
        recommended: false,
        method: "mobile",
        icon: <Smartphone className="h-5 w-5 text-primary" />,
      },
    ]

    const filtered = method === "any"
      ? options
      : options.filter((o) => o.method === method || (method === "instant" && o.deliveryTime === "Instant"))

    setResults(filtered.sort((a, b) => b.recipientReceives - a.recipientReceives))
  }

  useEffect(() => {
    if (amount && Number.parseFloat(amount) > 0 && !loading) {
      calculateRemittance()
    }
  }, [amount, method, currentRate, loading])

  const bestRate = results.length > 0 ? results[0].recipientReceives : 0
  const worstRate = results.length > 0 ? results[results.length - 1].recipientReceives : 0
  const savings = bestRate - worstRate

  const handleScenarioSelect = (scenario: typeof FAMILY_SCENARIOS[number]) => {
    setSelectedScenario(scenario.id)
    setAmount(scenario.amount.toString())
  }

  const purchasingPower = useMemo(() => {
    const usd = Number.parseFloat(amount) || 0
    const lrd = usd * currentRate
    return {
      rice25kg: Math.floor(lrd / 4500),
      fuelGallons: Math.floor(lrd / 900),
      taxiRides: Math.floor(lrd / 150),
      daysOfFood: Math.floor(lrd / 600),
      phoneCredit: Math.floor(lrd / 250),
      schoolDays: Math.floor(lrd / 300),
    }
  }, [amount, currentRate])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
        <PageHero
          ariaLabel="Remittance calculator"
          label="For the Liberian Diaspora"
          title="Send Smarter, Support Better"
          description="Every dollar you send home matters. Compare real-time rates, find the cheapest way to support your family, and see exactly what your money can buy in Liberia today."
          variant="centered"
          badges={
            <Badge variant="secondary" className="mb-4 gap-1.5 px-3 py-1">
              <Heart className="h-3 w-3 text-primary" /> For the Liberian Diaspora
            </Badge>
          }
          footer="Trusted by Liberians in the US, UK, Ghana, Nigeria, and beyond"
          contentMaxWidth="max-w-3xl"
        >
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mt-6">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-muted/40 border border-border/40 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-foreground">Live Rate</div>
                <div className="text-xs">{currentRate.toFixed(2)} LRD/USD</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-muted/40 border border-border/40 flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-foreground">5 Providers</div>
                <div className="text-xs">Compared in real time</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-accent/40 flex items-center justify-center">
                <Clock className="h-4 w-4 -foreground text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-foreground">Instant Delivery</div>
                <div className="text-xs">Mobile money options</div>
              </div>
            </div>
          </div>
        </PageHero>

        {/* Emergency Banner (crisis mode) */}
        <section className="py-4 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <EmergencyRemittanceMode currentRate={currentRate} crisisActive={true} />
            </div>
          </div>
        </section>

        {/* Use-Case Tabs */}
        <section className="py-8 sm:py-10 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <Tabs defaultValue="family" className="space-y-6">
                <div className="text-center mb-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">How Are You Supporting Home?</h2>
                  <p className="text-sm text-muted-foreground">Choose your situation and we&apos;ll help you send the right amount, the right way</p>
                </div>
                <TabsList className="grid w-full grid-cols-2 gap-1.5 rounded-xl border border-border/50 bg-muted/40 p-1.5 h-auto sm:grid-cols-3">
                  <TabsTrigger value="family" className="w-full gap-1.5 px-3 py-2.5 text-xs sm:text-sm min-h-[44px]"><Heart className="h-3.5 w-3.5 text-primary" /> Family</TabsTrigger>
                  <TabsTrigger value="monthly" className="w-full gap-1.5 px-3 py-2.5 text-xs sm:text-sm min-h-[44px]"><PiggyBank className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> Monthly Plans</TabsTrigger>
                  <TabsTrigger value="invest" className="w-full gap-1.5 px-3 py-2.5 text-xs sm:text-sm min-h-[44px]"><TrendingUp className="h-3.5 w-3.5 text-green-600 dark:text-green-400" /> Invest</TabsTrigger>
                </TabsList>

                {/* Family Support Tab */}
                <TabsContent value="family">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {FAMILY_SCENARIOS.map((scenario) => {
                      const lrd = scenario.amount * currentRate
                      const isSelected = selectedScenario === scenario.id
                      return (
                        <button
                          key={scenario.id}
                          onClick={() => handleScenarioSelect(scenario)}
                          className={`text-left p-5 rounded-2xl border transition-all ${
                            isSelected
                              ? `${scenario.borderColor} ${scenario.bg} ring-2 ring-primary/20`
                              : "border-border/40 hover:border-primary/30 hover:bg-muted/30"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className={`h-10 w-10 rounded-xl ${scenario.bg} flex items-center justify-center ${scenario.color}`}>
                              {scenario.icon}
                            </div>
                            {isSelected && (
                              <Badge variant="secondary" className="text-[10px]">Selected</Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-foreground mb-1">{scenario.label}</h3>
                          <p className="text-xs text-muted-foreground mb-3">{scenario.description}</p>
                          <div className="flex items-baseline justify-between">
                            <div>
                              <span className="text-2xl font-bold text-foreground">${scenario.amount}</span>
                              <span className="text-xs text-muted-foreground ml-1">USD</span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-primary">{lrd.toLocaleString()} LRD</div>
                              <div className="text-[10px] text-muted-foreground">{scenario.frequency}</div>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </TabsContent>

                {/* Monthly Plans Tab */}
                <TabsContent value="monthly">
                  <div className="grid md:grid-cols-3 gap-5">
                    {MONTHLY_SUPPORT_PLANS.map((plan, idx) => {
                      const lrd = plan.amount * currentRate
                      const isPopular = idx === 1
                      return (
                        <Card
                          key={plan.name}
                          className={`rounded-2xl relative overflow-hidden cursor-pointer transition-all hover:shadow-md ${ isPopular ? "border-primary ring-1 ring-primary/20" : "border-border/40" }`}
                          onClick={() => {
                            setAmount(plan.amount.toString())
                            setSelectedScenario(null)
                          }}
                        >
                          {isPopular && (
                            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                              MOST POPULAR
                            </div>
                          )}
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">{plan.name}</CardTitle>
                            <CardDescription className="text-xs">{plan.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="mb-4">
                              <span className="text-3xl font-bold text-foreground">${plan.amount}</span>
                              <span className="text-sm text-muted-foreground">/month</span>
                              <div className="text-sm text-primary font-medium mt-1">
                                ≈ {lrd.toLocaleString()} LRD
                              </div>
                            </div>
                            <div className="space-y-2.5">
                              {plan.items.map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm">
                                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                                  <span className="text-muted-foreground">{item}</span>
                                </div>
                              ))}
                            </div>
                            <Button
                              variant={isPopular ? "default" : "outline"}
                              className="w-full mt-5 rounded-xl"
                              onClick={(e) => {
                                e.stopPropagation()
                                setAmount(plan.amount.toString())
                                setSelectedScenario(null)
                                document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })
                              }}
                            >
                              Calculate Cost <ArrowRight className="h-4 w-4 ml-1 text-muted-foreground" />
                            </Button>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </TabsContent>

                {/* Investment Tab */}
                <TabsContent value="invest">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Card className="border-border/40 rounded-2xl">
                      <CardHeader>
                        <div className="h-10 w-10 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center mb-2">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">Real Estate</CardTitle>
                        <CardDescription>Build or buy property in Liberia while abroad</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Land in Monrovia suburbs</span>
                            <span className="font-semibold">$2,000-8,000</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Small rental property</span>
                            <span className="font-semibold">$15,000-30,000</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Monthly rental income</span>
                            <span className="font-semibold text-secondary">$100-300</span>
                          </div>
                        </div>
                        <Link href="/invest">
                          <Button variant="outline" className="w-full rounded-xl">
                            Explore Investments <ChevronRight className="h-4 w-4 ml-1 text-muted-foreground" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>

                    <Card className="border-border/40 rounded-2xl">
                      <CardHeader>
                        <div className="h-10 w-10 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center mb-2">
                          <PiggyBank className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <CardTitle className="text-lg">Fund a Family Business</CardTitle>
                        <CardDescription>Empower your loved ones with a small business</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Market stall setup</span>
                            <span className="font-semibold">$200-500</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Motorbike for transport</span>
                            <span className="font-semibold">$800-1,500</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Potential monthly return</span>
                            <span className="font-semibold text-secondary">$50-200</span>
                          </div>
                        </div>
                        <Link href="/invest">
                          <Button variant="outline" className="w-full rounded-xl">
                            Learn More <ChevronRight className="h-4 w-4 ml-1 text-muted-foreground" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>

                    <Card className="border-border/40 rounded-2xl">
                      <CardHeader>
                        <div className="h-10 w-10 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center mb-2">
                          <Landmark className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">Treasury Bonds</CardTitle>
                        <CardDescription>Earn interest while supporting Liberia&apos;s development</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Min. investment</span>
                            <span className="font-semibold">$100</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Annual yield</span>
                            <span className="font-semibold text-secondary">8-12%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Term</span>
                            <span className="font-semibold">6-24 months</span>
                          </div>
                        </div>
                        <Link href="/invest/treasury">
                          <Button variant="outline" className="w-full rounded-xl">
                            View Bonds <ChevronRight className="h-4 w-4 ml-1 text-muted-foreground" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>

                    <Card className="border-border/40 rounded-2xl">
                      <CardHeader>
                        <div className="h-10 w-10 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center mb-2">
                          <GraduationCap className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">Education Sponsorship</CardTitle>
                        <CardDescription>Sponsor a student&apos;s education back home</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Primary school (annual)</span>
                            <span className="font-semibold">$150-300</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">High school (annual)</span>
                            <span className="font-semibold">$300-600</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">University (annual)</span>
                            <span className="font-semibold">$800-2,000</span>
                          </div>
                        </div>
                        <Link href="/diaspora/marketplace">
                          <Button variant="outline" className="w-full rounded-xl">
                            Browse Options <ChevronRight className="h-4 w-4 ml-1 text-muted-foreground" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Remittance Corridors */}
        <section className="py-8 sm:py-10 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Popular Corridors</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-primary/20 bg-primary/5 rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🇺🇸</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="text-lg">🇱🇷</span>
                    </div>
                    <div className="text-xl font-bold">{currentRate.toFixed(2)} LRD</div>
                    <p className="text-xs text-muted-foreground">per $1 USD</p>
                  </CardContent>
                </Card>
                <Card className="border-border/40 rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🇬🇧</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="text-lg">🇱🇷</span>
                    </div>
                    <div className="text-xl font-bold">~{(currentRate * 1.27).toFixed(0)} LRD</div>
                    <p className="text-xs text-muted-foreground">per £1 GBP</p>
                  </CardContent>
                </Card>
                <Card className="border-border/40 rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🇪🇺</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="text-lg">🇱🇷</span>
                    </div>
                    <div className="text-xl font-bold">~{(currentRate * 1.09).toFixed(0)} LRD</div>
                    <p className="text-xs text-muted-foreground">per €1 EUR</p>
                  </CardContent>
                </Card>
                <Card className="border-border/40 rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🇬🇭</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="text-lg">🇱🇷</span>
                    </div>
                    <div className="text-xl font-bold">~{(currentRate / 15.5).toFixed(2)} LRD</div>
                    <p className="text-xs text-muted-foreground">per 1 GHS</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section id="calculator" className="py-8 sm:py-10 bg-muted/20 scroll-mt-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Compare Transfer Costs</h2>
                <p className="text-sm text-muted-foreground">See the real cost across all providers — fees + exchange rate spread</p>
              </div>

              <Card className="border-border/40 rounded-2xl shadow-sm">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-sm font-medium">You Send</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <Input
                          id="amount"
                          type="number"
                          value={amount}
                          onChange={(e) => {
                            setAmount(e.target.value)
                            setSelectedScenario(null)
                          }}
                          placeholder="100"
                          className="pl-9 h-12 text-lg font-semibold"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency" className="text-sm font-medium">Currency</Label>
                      <Select value={sendCurrency} onValueChange={setSendCurrency}>
                        <SelectTrigger id="currency" className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">🇺🇸 US Dollar (USD)</SelectItem>
                          <SelectItem value="GBP">🇬🇧 British Pound (GBP)</SelectItem>
                          <SelectItem value="EUR">🇪🇺 Euro (EUR)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="method" className="text-sm font-medium">Transfer Method</Label>
                      <Select value={method} onValueChange={setMethod}>
                        <SelectTrigger id="method" className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">All Methods</SelectItem>
                          <SelectItem value="instant">Instant Transfer</SelectItem>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                          <SelectItem value="mobile">Mobile Money</SelectItem>
                          <SelectItem value="cash">Cash Pickup</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {results.length > 0 && (
                    <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">They Receive (Best)</div>
                          <div className="text-xl font-bold text-secondary">{bestRate.toLocaleString(undefined, { maximumFractionDigits: 0 })} LRD</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">They Receive (Worst)</div>
                          <div className="text-xl font-bold text-destructive">{worstRate.toLocaleString(undefined, { maximumFractionDigits: 0 })} LRD</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">You Could Save</div>
                          <div className="text-xl font-bold text-primary">{savings.toLocaleString(undefined, { maximumFractionDigits: 0 })} LRD</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Savings in USD</div>
                          <div className="text-xl font-bold text-foreground">${(savings / currentRate).toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Results */}
              {results.length > 0 && (
                <div className="mt-6 space-y-3">
                  {results.map((option, index) => (
                    <Card
                      key={index}
                      className={`rounded-2xl transition-all ${ index === 0 ? "border-secondary/40 bg-secondary/5 shadow-sm" : option.recommended ? "border-primary/20" : "border-border/40" }`}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${ index === 0 ? "bg-muted/40 border border-border/40 text-secondary" : "bg-muted/50 text-muted-foreground" }`}>
                              {option.icon}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <h3 className="font-bold text-foreground">{option.provider}</h3>
                                {index === 0 && <Badge variant="secondary" className="text-[10px]"><Star className="h-2.5 w-2.5 mr-0.5 text-amber-600 dark:text-amber-400" /> Best Value</Badge>}
                                {option.recommended && <Badge className="text-[10px]">Recommended</Badge>}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-blue-600 dark:text-blue-400" /> {option.deliveryTime}
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3 text-emerald-600 dark:text-emerald-400" /> ${option.transferFee.toFixed(2)} fee
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {option.recipientReceives.toLocaleString(undefined, { maximumFractionDigits: 0 })} LRD
                            </div>
                            <div className="text-xs text-muted-foreground">recipient gets</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-3 pt-3 border-t border-border/30">
                          <div className="p-2 rounded-lg bg-muted/30">
                            <div className="text-[10px] text-muted-foreground">Rate</div>
                            <div className="text-sm font-semibold">{option.exchangeRate.toFixed(2)}</div>
                          </div>
                          <div className="p-2 rounded-lg bg-muted/30">
                            <div className="text-[10px] text-muted-foreground">Fee</div>
                            <div className="text-sm font-semibold">${option.transferFee.toFixed(2)}</div>
                          </div>
                          <div className="p-2 rounded-lg bg-muted/30">
                            <div className="text-[10px] text-muted-foreground">You Pay</div>
                            <div className="text-sm font-semibold">${option.totalCost.toFixed(2)}</div>
                          </div>
                          <div className="p-2 rounded-lg bg-muted/30">
                            <div className="text-[10px] text-muted-foreground">Effective Rate</div>
                            <div className="text-sm font-semibold">
                              {(option.recipientReceives / option.totalCost).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Purchasing Power */}
        {Number.parseFloat(amount) > 0 && (
          <section className="py-8 sm:py-10 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                    What ${Number.parseFloat(amount).toLocaleString()} Buys in Liberia Today
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Based on current prices — {(Number.parseFloat(amount) * currentRate).toLocaleString()} LRD at today&apos;s rate
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {purchasingPower.rice25kg > 0 && (
                    <div className="p-4 rounded-2xl border border-border/40 bg-card text-center">
                      <ShoppingBasket className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold text-foreground">{purchasingPower.rice25kg}</div>
                      <div className="text-xs text-muted-foreground">Bags of Rice (25kg)</div>
                    </div>
                  )}
                  {purchasingPower.fuelGallons > 0 && (
                    <div className="p-4 rounded-2xl border border-border/40 bg-card text-center">
                      <Fuel className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold text-foreground">{purchasingPower.fuelGallons}</div>
                      <div className="text-xs text-muted-foreground">Gallons of Fuel</div>
                    </div>
                  )}
                  {purchasingPower.daysOfFood > 0 && (
                    <div className="p-4 rounded-2xl border border-border/40 bg-card text-center">
                      <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold text-foreground">{purchasingPower.daysOfFood}</div>
                      <div className="text-xs text-muted-foreground">Days of Family Meals</div>
                    </div>
                  )}
                  {purchasingPower.taxiRides > 0 && (
                    <div className="p-4 rounded-2xl border border-border/40 bg-card text-center">
                      <ArrowRight className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <div className="text-2xl font-bold text-foreground">{purchasingPower.taxiRides}</div>
                      <div className="text-xs text-muted-foreground">Taxi Rides</div>
                    </div>
                  )}
                  {purchasingPower.phoneCredit > 0 && (
                    <div className="p-4 rounded-2xl border border-border/40 bg-card text-center">
                      <Phone className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold text-foreground">{purchasingPower.phoneCredit}</div>
                      <div className="text-xs text-muted-foreground">Phone Top-ups</div>
                    </div>
                  )}
                  {purchasingPower.schoolDays > 0 && (
                    <div className="p-4 rounded-2xl border border-border/40 bg-card text-center">
                      <BookOpen className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold text-foreground">{purchasingPower.schoolDays}</div>
                      <div className="text-xs text-muted-foreground">Days of School</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Smart Sending Tips */}
        <section className="py-10 sm:py-12 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-foreground text-center">Smart Sending Tips</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="border-border/40 rounded-2xl">
                  <CardContent className="p-5">
                    <div className="flex gap-3">
                      <div className="h-9 w-9 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center shrink-0">
                        <TrendingUp className="h-4.5 w-4.5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-foreground">Watch the Rate Trend</h3>
                        <p className="text-sm text-muted-foreground">
                          The LRD/USD rate fluctuates daily. If you&apos;re not in a rush, wait for a favorable dip to maximize what your family receives.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/40 rounded-2xl">
                  <CardContent className="p-5">
                    <div className="flex gap-3">
                      <div className="h-9 w-9 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center shrink-0">
                        <Calculator className="h-4.5 w-4.5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-foreground">Compare Total Cost, Not Just Fees</h3>
                        <p className="text-sm text-muted-foreground">
                          A $0 fee can hide a 3-5% markup in the exchange rate. Always check the final LRD amount your recipient actually gets.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/40 rounded-2xl">
                  <CardContent className="p-5">
                    <div className="flex gap-3">
                      <div className="h-9 w-9 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center shrink-0">
                        <Smartphone className="h-4.5 w-4.5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-foreground">Use Mobile Money for Small Amounts</h3>
                        <p className="text-sm text-muted-foreground">
                          For under $100, Orange Money and Lonestar are often the cheapest. Your family gets it instantly on their phone.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/40 rounded-2xl">
                  <CardContent className="p-5">
                    <div className="flex gap-3">
                      <div className="h-9 w-9 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center shrink-0">
                        <Gift className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-foreground">Send Goods, Not Just Cash</h3>
                        <p className="text-sm text-muted-foreground">
                          Use the <Link href="/diaspora/marketplace" className="text-primary hover:underline">Diaspora Marketplace</Link> to buy rice, fuel, or school supplies directly — sometimes cheaper than sending cash.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/40 rounded-2xl">
                  <CardContent className="p-5">
                    <div className="flex gap-3">
                      <div className="h-9 w-9 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center shrink-0">
                        <AlertCircle className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-foreground">Avoid Street Exchangers</h3>
                        <p className="text-sm text-muted-foreground">
                          While street rates look better, there&apos;s no consumer protection. Licensed providers are safer and more reliable for your family.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/40 rounded-2xl">
                  <CardContent className="p-5">
                    <div className="flex gap-3">
                      <div className="h-9 w-9 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center shrink-0">
                        <Lightbulb className="h-4.5 w-4.5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-foreground">Set Up Recurring Transfers</h3>
                        <p className="text-sm text-muted-foreground">
                          Many providers offer discounted fees for recurring monthly transfers. Great for consistent family support.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-10 sm:py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-foreground text-center">More Ways to Support Home</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/diaspora/marketplace" className="group">
                  <Card className="border-border/40 rounded-2xl h-full transition-all group-hover:border-primary/30 group-hover:shadow-md">
                    <CardContent className="p-5 text-center">
                      <div className="h-12 w-12 rounded-2xl bg-muted/40 border border-border/40 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                        <ShoppingBasket className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">Marketplace</h3>
                      <p className="text-xs text-muted-foreground">Buy & deliver goods directly to loved ones</p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/tools/budget" className="group">
                  <Card className="border-border/40 rounded-2xl h-full transition-all group-hover:border-primary/30 group-hover:shadow-md">
                    <CardContent className="p-5 text-center">
                      <div className="h-12 w-12 rounded-2xl bg-muted/40 border border-border/40 flex items-center justify-center mx-auto mb-3 group-hover:bg-secondary/20 transition-colors">
                        <PiggyBank className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">Budget Planner</h3>
                      <p className="text-xs text-muted-foreground">Plan your family&apos;s monthly expenses in LRD</p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/invest" className="group">
                  <Card className="border-border/40 rounded-2xl h-full transition-all group-hover:border-primary/30 group-hover:shadow-md">
                    <CardContent className="p-5 text-center">
                      <div className="h-12 w-12 rounded-2xl bg-muted/40 border border-border/40 flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-500/20 transition-colors">
                        <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">Invest Back Home</h3>
                      <p className="text-xs text-muted-foreground">Real estate, bonds & business opportunities</p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/converter" className="group">
                  <Card className="border-border/40 rounded-2xl h-full transition-all group-hover:border-primary/30 group-hover:shadow-md">
                    <CardContent className="p-5 text-center">
                      <div className="h-12 w-12 rounded-2xl bg-accent/40 flex items-center justify-center mx-auto mb-3 group-hover:bg-accent/60 transition-colors">
                        <DollarSign className="h-6 w-6 -foreground text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">Rate Converter</h3>
                      <p className="text-xs text-muted-foreground">Live USD/LRD conversion with historical rates</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trust / FAQ */}
        <section className="py-10 sm:py-12 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-foreground text-center">Common Questions</h2>
              <div className="space-y-3">
                {[
                  {
                    q: "How does TrueRate save me money?",
                    a: "We compare the total cost — fees plus exchange rate spread — across all major providers so you always see which one delivers the most LRD to your family. No hidden markups, no sponsored rankings.",
                  },
                  {
                    q: "What's the fastest way to send money to Liberia?",
                    a: "Orange Money and Lonestar Mobile Money deliver instantly to your recipient's phone. Western Union and MoneyGram are available in minutes for cash pickup in Monrovia and other cities.",
                  },
                  {
                    q: "Can I send from the UK or Europe?",
                    a: "Yes. Most providers support GBP and EUR. The rates shown here are in USD — your provider will convert from your local currency first. We recommend comparing the final LRD amount after all conversions.",
                  },
                  {
                    q: "Is it better to send money or buy goods directly?",
                    a: "It depends on the situation. For recurring support, cash gives your family flexibility. For specific needs like rice or school supplies, our Diaspora Marketplace lets you buy and deliver goods directly — often at bulk prices.",
                  },
                  {
                    q: "How often do rates update?",
                    a: "Our rates update multiple times per day from real market data. Provider-specific rates are estimates based on current spreads and may vary slightly at the time of your actual transfer.",
                  },
                ].map((faq, i) => (
                  <details key={i} className="group rounded-2xl border border-border/40 bg-card">
                    <summary className="flex items-center justify-between p-5 cursor-pointer list-none font-semibold text-foreground hover:bg-muted/20 transition-colors">
                      {faq.q}
                      <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90 shrink-0 ml-3 text-muted-foreground" />
                    </summary>
                    <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
