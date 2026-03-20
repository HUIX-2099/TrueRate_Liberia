"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageHero } from "@/components/layout/page-hero"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  GraduationCap,
  Bus,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  DollarSign,
  Info,
} from "lucide-react"
import {
  STUDENT_BUDGET_SCHOOLS,
  TUITION_BY_SCHOOL,
  TRANSPORT_DEFAULTS,
  SEMESTER_MONTHS,
  type SchoolId,
} from "@/lib/student-budget-data"

function formatUSD(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n)
}
function formatLRD(n: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n) + " LRD"
}

export default function StudentBudgetPage() {
  const [rate, setRate] = useState(195)
  const [school, setSchool] = useState<SchoolId>("ul")
  const [tuitionCustomUSD, setTuitionCustomUSD] = useState<number | "">("")
  const [transportRoundTripsPerWeek, setTransportRoundTripsPerWeek] = useState(10)
  const [transportCostPerTripLRD, setTransportCostPerTripLRD] = useState(75)
  const [monthsInSemester, setMonthsInSemester] = useState(SEMESTER_MONTHS)
  const [livingMonthlyUSD, setLivingMonthlyUSD] = useState(150)
  const [otherFeesUSD, setOtherFeesUSD] = useState(0)
  const [affordIncomeUSD, setAffordIncomeUSD] = useState("")
  const [affordFrequency, setAffordFrequency] = useState<"monthly" | "semester">("monthly")

  useEffect(() => {
    fetch("/api/rates/live")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data?.rate === "number") setRate(data.rate)
      })
      .catch(() => {})
  }, [])

  const tuitionData = TUITION_BY_SCHOOL[school]
  const tuitionMidUSD = (tuitionData.minUSD + tuitionData.maxUSD) / 2
  const tuitionUseUSD = typeof tuitionCustomUSD === "number" ? tuitionCustomUSD : tuitionMidUSD
  const transportDefault = TRANSPORT_DEFAULTS[school]
  const transportPerTrip = school === "cuttington" ? transportCostPerTripLRD : transportCostPerTripLRD || transportDefault.oneWayLRD
  const monthlyTransportLRD = transportRoundTripsPerWeek * 4.33 * transportPerTrip * 2
  const monthlyTransportUSD = monthlyTransportLRD / rate
  const semesterTransportUSD = monthlyTransportUSD * monthsInSemester
  const semesterTotalUSD = tuitionUseUSD + otherFeesUSD + livingMonthlyUSD * monthsInSemester + semesterTransportUSD
  const monthlyTotalUSD = semesterTotalUSD / monthsInSemester

  const affordIncome = parseFloat(affordIncomeUSD)
  const affordTarget = affordFrequency === "monthly" ? monthlyTotalUSD : semesterTotalUSD
  const canAfford = Number.isFinite(affordIncome) && affordIncome >= affordTarget
  const shortfall = Number.isFinite(affordIncome) && affordIncome < affordTarget ? affordTarget - affordIncome : 0
  const surplus = Number.isFinite(affordIncome) && affordIncome >= affordTarget ? affordIncome - affordTarget : 0

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
        <PageHero
          ariaLabel="Student budget tool"
          label="For Students"
          title="Student Budget Tool"
          description='Semester budget estimator, tuition breakdown, monthly transport, and "Can I afford this?" — for UL, Cuttington, and Stella Maris students.'
          variant="centered"
          badges={
            <>
              <Badge variant="secondary">University of Liberia</Badge>
              <Badge variant="secondary">Cuttington</Badge>
            </>
          }
          contentMaxWidth="max-w-3xl"
        />

        <div className="container mx-auto px-4 py-8 max-w-4xl space-y-10">
          {/* 1. Tuition breakdown */}
          <Card className="border-primary/20 border-border/40 rounded-2xl shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <CardTitle className="text-foreground">Tuition breakdown</CardTitle>
              </div>
              <CardDescription>Indicative fees by institution. Verify with the registrar before paying.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {STUDENT_BUDGET_SCHOOLS.map((s) => (
                  <Button
                    key={s.id}
                    variant={school === s.id ? "default" : "outline"}
                    size="sm"
                    className="rounded-xl min-h-[44px]"
                    onClick={() => setSchool(s.id)}
                  >
                    {s.short}
                  </Button>
                ))}
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm font-medium text-foreground mb-2">
                  {STUDENT_BUDGET_SCHOOLS.find((s) => s.id === school)?.name} ({STUDENT_BUDGET_SCHOOLS.find((s) => s.id === school)?.location})
                </p>
                <ul className="space-y-2 text-sm">
                  {tuitionData.breakdown.map((item, i) => (
                    <li key={i} className="flex justify-between gap-2">
                      <span className="text-muted-foreground">
                        {item.label}
                        {item.notes && (
                          <span className="block text-xs text-muted-foreground/80">{item.notes}</span>
                        )}
                      </span>
                      <span className="font-medium tabular-nums">{formatUSD(item.amountUSD)}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                  Typical range: {formatUSD(tuitionData.minUSD)} – {formatUSD(tuitionData.maxUSD)} per semester
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 2. Semester budget estimator */}
          <Card className="border-primary/20 border-border/40 rounded-2xl shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                <CardTitle className="text-foreground">Semester budget estimator</CardTitle>
              </div>
              <CardDescription>Estimate total cost per semester for your school and situation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Tuition &amp; fees this semester (USD)</Label>
                  <Input
                    type="number"
                    min={0}
                    step={10}
                    placeholder={String(Math.round(tuitionMidUSD))}
                    value={tuitionCustomUSD === "" ? "" : tuitionCustomUSD}
                    onChange={(e) => {
                      const v = e.target.value === "" ? "" : parseFloat(e.target.value)
                      setTuitionCustomUSD(Number.isFinite(v) ? v : "")
                    }}
                  />
                  <p className="text-xs text-muted-foreground">Leave blank to use school midpoint</p>
                </div>
                <div className="space-y-2">
                  <Label>Other one-time fees this semester (USD)</Label>
                  <Input
                    type="number"
                    min={0}
                    step={5}
                    value={otherFeesUSD}
                    onChange={(e) => setOtherFeesUSD(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Living expenses per month (USD)</Label>
                  <Input
                    type="number"
                    min={0}
                    step={25}
                    value={livingMonthlyUSD}
                    onChange={(e) => setLivingMonthlyUSD(parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">Food, supplies, etc.</p>
                </div>
                <div className="space-y-2">
                  <Label>Months in semester</Label>
                  <Input
                    type="number"
                    min={1}
                    max={6}
                    value={monthsInSemester}
                    onChange={(e) => setMonthsInSemester(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  />
                </div>
              </div>
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                <p className="text-sm font-medium text-muted-foreground mb-1">Estimated semester total</p>
                <p className="text-2xl font-bold text-primary">{formatUSD(semesterTotalUSD)}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatLRD(semesterTotalUSD * rate)} at {rate} LRD/USD · ~{formatUSD(monthlyTotalUSD)}/month
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 3. Monthly transport estimate */}
          <Card className="border-primary/20 border-border/40 rounded-2xl shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-foreground">Monthly transport estimate</CardTitle>
              </div>
              <CardDescription>Round trips per week × cost per one-way trip. Adjust for your route.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Info className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                {transportDefault.note}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Round trips per week</Label>
                  <Input
                    type="number"
                    min={0}
                    max={14}
                    value={transportRoundTripsPerWeek}
                    onChange={(e) => setTransportRoundTripsPerWeek(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cost per one-way trip (LRD)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={transportCostPerTripLRD}
                    onChange={(e) => setTransportCostPerTripLRD(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  />
                </div>
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm font-medium text-muted-foreground">Estimated monthly transport</p>
                <p className="text-xl font-bold">{formatLRD(monthlyTransportLRD)}</p>
                <p className="text-sm text-muted-foreground">≈ {formatUSD(monthlyTransportUSD)} at current rate</p>
              </div>
            </CardContent>
          </Card>

          {/* 4. Can I afford this? */}
          <Card className="border-primary/20 border-border/40 rounded-2xl shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <CardTitle className="text-foreground">Can I afford this?</CardTitle>
              </div>
              <CardDescription>Compare your income to your estimated semester or monthly cost.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={affordFrequency === "monthly" ? "default" : "outline"}
                  size="sm"
                  className="rounded-xl min-h-[44px]"
                  onClick={() => setAffordFrequency("monthly")}
                >
                  Compare to monthly income
                </Button>
                <Button
                  variant={affordFrequency === "semester" ? "default" : "outline"}
                  size="sm"
                  className="rounded-xl min-h-[44px]"
                  onClick={() => setAffordFrequency("semester")}
                >
                  Compare to semester total
                </Button>
              </div>
              <div className="space-y-2">
                <Label>
                  {affordFrequency === "monthly" ? "Monthly" : "Semester"} income or budget (USD)
                </Label>
                <Input
                  type="number"
                  min={0}
                  step={25}
                  placeholder={affordFrequency === "monthly" ? "e.g. 200" : "e.g. 800"}
                  value={affordIncomeUSD}
                  onChange={(e) => setAffordIncomeUSD(e.target.value)}
                />
              </div>
              {affordIncomeUSD !== "" && (
                <div
                  className={`rounded-lg border p-4 ${ canAfford ? "bg-muted/40 border border-border/40 border-green-500/30" : "bg-muted/40 border border-border/40 border-amber-500/30" }`}
                >
                  {canAfford ? (
                    <>
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-semibold">
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                        You can afford this
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        About {formatUSD(surplus)} left over per {affordFrequency === "monthly" ? "month" : "semester"} after estimated costs.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold">
                        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        Shortfall
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        You need about {formatUSD(shortfall)} more per {affordFrequency === "monthly" ? "month" : "semester"} to cover estimated costs. Consider part-time work, scholarships, or reducing expenses.
                      </p>
                    </>
                  )}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Target: {formatUSD(affordTarget)} {affordFrequency === "monthly" ? "per month" : "per semester"}
              </p>
            </CardContent>
          </Card>

          {/* Rate & disclaimer */}
          <Card className="border-border/40 rounded-2xl bg-muted/20">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                <strong>Exchange rate used:</strong> 1 USD = {rate} LRD (from live rates). Tuition and fee figures are indicative; always confirm with your university before making payments.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
