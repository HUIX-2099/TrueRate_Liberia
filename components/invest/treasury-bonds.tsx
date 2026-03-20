"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Landmark,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Shield,
  ArrowRight,
  Calculator,
  BarChart3,
  AlertCircle,
  ChevronRight,
  Banknote,
  Percent,
  Timer,
  CircleDollarSign,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  type TreasurySecurity,
  type AuctionEvent,
  type YieldCurvePoint,
  TREASURY_SECURITIES,
  YIELD_CURVE,
  AUCTION_CALENDAR,
  formatLRD,
  calcTBillPrice,
  calcBondReturn,
  getTreasurySummary,
} from "@/lib/treasury/data"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from "recharts"

/* ─────────────────────── Status Badge ─────────────────────── */

const statusConfig: Record<string, { label: string; className: string }> = {
  Open: {
    label: "Open for Bidding",
    className: "bg-muted/40 border border-border/40 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  },
  Upcoming: {
    label: "Upcoming",
    className: "bg-muted/40 border border-border/40 text-blue-700 dark:text-blue-400 border-blue-500/20",
  },
  Closed: {
    label: "Closed",
    className: "bg-muted text-muted-foreground border-border",
  },
  Matured: {
    label: "Matured",
    className: "bg-muted/40 border border-border/40 text-amber-700 dark:text-amber-400 border-amber-500/20",
  },
}

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? statusConfig.Closed
  return (
    <Badge variant="outline" className={cn("text-[10px] font-medium border", cfg.className)}>
      {cfg.label}
    </Badge>
  )
}

/* ─────────────────────── Security Card ─────────────────────── */

function SecurityCard({ security }: { security: TreasurySecurity }) {
  const isOpen = security.status === "Open" || security.status === "Upcoming"
  const subscriptionPct = Math.min(
    100,
    Math.round((security.amountSubscribed / security.issueSize) * 100)
  )
  const yieldChange = security.previousYield
    ? security.yield - security.previousYield
    : 0

  return (
    <Card
      className={cn(
        "h-full flex flex-col rounded-2xl border-border/60 bg-card shadow-[var(--shadow-institutional)] transition-colors duration-200 hover:border-border/80",
        isOpen && "ring-1 ring-emerald-500/20"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {security.type === "T-Bill" ? (
              <Banknote className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
            ) : (
              <Landmark className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            )}
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              {security.name}
            </h3>
          </div>
          <StatusBadge status={security.status} />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {security.issuer} · ISIN: {security.isin}
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3 pt-0">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-muted/30 p-2.5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Yield</p>
            <div className="flex items-center gap-1.5">
              <span className="tabular-nums font-mono font-bold text-sm text-foreground">
                {security.yield.toFixed(2)}%
              </span>
              {yieldChange !== 0 && (
                <span
                  className={cn(
                    "flex items-center text-[10px] font-medium",
                    yieldChange > 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  )}
                >
                  {yieldChange > 0 ? (
                    <TrendingUp className="h-2.5 w-2.5 mr-0.5 text-green-600 dark:text-green-400" />
                  ) : (
                    <TrendingDown className="h-2.5 w-2.5 mr-0.5 text-red-600 dark:text-red-400" />
                  )}
                  {yieldChange > 0 ? "+" : ""}
                  {yieldChange.toFixed(2)}
                </span>
              )}
            </div>
          </div>
          <div className="rounded-lg bg-muted/30 p-2.5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {security.type === "Bond" ? "Coupon" : "Tenor"}
            </p>
            <span className="tabular-nums font-mono font-bold text-sm text-foreground">
              {security.type === "Bond"
                ? `${security.couponRate.toFixed(2)}%`
                : security.tenor}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CircleDollarSign className="h-3 w-3 shrink-0 text-primary" aria-hidden />
            Issue: {formatLRD(security.issueSize)}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Timer className="h-3 w-3 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden />
            {security.tenor}
          </span>
          {security.couponFrequency && security.type === "Bond" && (
            <>
              <span>·</span>
              <span>{security.couponFrequency}</span>
            </>
          )}
        </div>

        {security.status !== "Upcoming" && (
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Subscription</span>
              <span className="tabular-nums font-mono">{subscriptionPct}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  subscriptionPct >= 100
                    ? "bg-emerald-500"
                    : subscriptionPct >= 50
                      ? "bg-primary"
                      : "bg-amber-500"
                )}
                style={{ width: `${Math.min(subscriptionPct, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>{formatLRD(security.amountSubscribed)} subscribed</span>
              <span>of {formatLRD(security.issueSize)}</span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground mt-auto pt-2 border-t border-border/50">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-primary" aria-hidden />
            Auction: {new Date(security.auctionDate).toLocaleDateString("en-LR", { month: "short", day: "numeric", year: "numeric" })}
          </span>
          <span>→</span>
          <span>Maturity: {new Date(security.maturityDate).toLocaleDateString("en-LR", { month: "short", day: "numeric", year: "numeric" })}</span>
        </div>

        {isOpen && (
          <Button
            size="sm"
            className="w-full mt-1 rounded-xl font-medium min-h-[44px] shadow-[var(--shadow-institutional)]"
          >
            <span className="inline-flex items-center gap-2">
              Place Bid
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
            </span>
          </Button>
        )}

        {security.bidToCover && (
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <BarChart3 className="h-3 w-3 text-primary" aria-hidden />
            Bid-to-Cover: {security.bidToCover.toFixed(2)}x
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/* ─────────────────────── Yield Curve Chart ─────────────────────── */

function YieldCurveChart({ data }: { data: YieldCurvePoint[] }) {
  return (
    <Card className="rounded-2xl border-border/60 bg-card shadow-[var(--shadow-institutional)]">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" aria-hidden />
          <CardTitle className="text-sm font-semibold">CBL Yield Curve</CardTitle>
        </div>
        <p className="text-xs text-muted-foreground">
          Government securities yield across maturities — current vs. previous auction
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] sm:h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
              <XAxis
                dataKey="tenor"
                tick={{ fontSize: 11 }}
                className="fill-muted-foreground"
              />
              <YAxis
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 11 }}
                className="fill-muted-foreground"
                domain={[4, 16]}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--card))",
                  fontSize: "12px",
                }}
                formatter={(value) => [`${Number(value).toFixed(2)}%`, ""]}
              />
              <Legend
                wrapperStyle={{ fontSize: "11px" }}
              />
              <Area
                type="monotone"
                dataKey="yield"
                stroke="hsl(var(--primary))"
                fill="url(#yieldGradient)"
                strokeWidth={2}
                name="Current Yield"
                dot={{ r: 4, fill: "hsl(var(--primary))" }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="previousYield"
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="5 5"
                strokeWidth={1.5}
                name="Previous Yield"
                dot={{ r: 3, fill: "hsl(var(--muted-foreground))" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-border/50">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              The yield curve shows the relationship between interest rates and time to maturity.
              An upward-sloping curve is normal, reflecting higher compensation for longer-term holdings.
              Yields have shifted upward across all tenors, indicating tighter monetary conditions.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* ─────────────────────── Bond Calculator ─────────────────────── */

function BondCalculator() {
  const [calcType, setCalcType] = useState<"tbill" | "bond">("tbill")
  const [faceValue, setFaceValue] = useState(10_000_000)
  const [yieldRate, setYieldRate] = useState(6.35)
  const [days, setDays] = useState(91)
  const [couponRate, setCouponRate] = useState(10.0)
  const [years, setYears] = useState(2)

  const tbillResult = useMemo(() => {
    const price = calcTBillPrice(faceValue, yieldRate, days)
    const discount = faceValue - price
    return { price, discount, returnPct: (discount / price) * 100 }
  }, [faceValue, yieldRate, days])

  const bondResult = useMemo(() => {
    return calcBondReturn(faceValue, couponRate, years)
  }, [faceValue, couponRate, years])

  return (
    <Card className="rounded-2xl border-border/60 bg-card shadow-[var(--shadow-institutional)]">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Calculator className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          <CardTitle className="text-sm font-semibold">Investment Calculator</CardTitle>
        </div>
        <p className="text-xs text-muted-foreground">
          Estimate returns on CBL Treasury bills and bonds
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Button
            size="sm"
            variant={calcType === "tbill" ? "default" : "outline"}
            onClick={() => setCalcType("tbill")}
            className="rounded-xl min-h-[40px] text-xs"
          >
            <Banknote className="h-3.5 w-3.5 mr-1.5 text-emerald-600 dark:text-emerald-400" aria-hidden />
            T-Bill
          </Button>
          <Button
            size="sm"
            variant={calcType === "bond" ? "default" : "outline"}
            onClick={() => setCalcType("bond")}
            className="rounded-xl min-h-[40px] text-xs"
          >
            <Landmark className="h-3.5 w-3.5 mr-1.5 text-primary" aria-hidden />
            Bond
          </Button>
        </div>

        {calcType === "tbill" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Face Value (LRD)</Label>
                <Input
                  type="number"
                  value={faceValue}
                  onChange={(e) => setFaceValue(Number(e.target.value))}
                  className="rounded-xl tabular-nums font-mono"
                  min={1_000_000}
                  step={1_000_000}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Yield (%)</Label>
                <Input
                  type="number"
                  value={yieldRate}
                  onChange={(e) => setYieldRate(Number(e.target.value))}
                  className="rounded-xl tabular-nums font-mono"
                  min={0}
                  max={30}
                  step={0.05}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Days to Maturity</Label>
                <Input
                  type="number"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="rounded-xl tabular-nums font-mono"
                  min={1}
                  max={364}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-muted/30 border border-border/50">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Purchase Price</p>
                <p className="tabular-nums font-mono font-bold text-sm text-foreground">
                  {formatLRD(tbillResult.price)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Discount Earned</p>
                <p className="tabular-nums font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                  +{formatLRD(tbillResult.discount)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Return</p>
                <p className="tabular-nums font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                  {tbillResult.returnPct.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Investment (LRD)</Label>
                <Input
                  type="number"
                  value={faceValue}
                  onChange={(e) => setFaceValue(Number(e.target.value))}
                  className="rounded-xl tabular-nums font-mono"
                  min={1_000_000}
                  step={1_000_000}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Coupon Rate (%)</Label>
                <Input
                  type="number"
                  value={couponRate}
                  onChange={(e) => setCouponRate(Number(e.target.value))}
                  className="rounded-xl tabular-nums font-mono"
                  min={0}
                  max={25}
                  step={0.25}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Years to Maturity</Label>
                <Input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="rounded-xl tabular-nums font-mono"
                  min={1}
                  max={30}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-muted/30 border border-border/50">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Annual Income</p>
                <p className="tabular-nums font-mono font-bold text-sm text-foreground">
                  {formatLRD(bondResult.annualIncome)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Coupons</p>
                <p className="tabular-nums font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                  +{formatLRD(bondResult.totalCoupons)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Return</p>
                <p className="tabular-nums font-mono font-bold text-sm text-foreground">
                  {formatLRD(bondResult.totalReturn)}
                </p>
              </div>
            </div>
          </div>
        )}

        <p className="text-[10px] text-muted-foreground mt-3">
          Estimates only. Actual returns depend on auction results and market conditions. Consult your broker or CBL for official terms.
        </p>
      </CardContent>
    </Card>
  )
}

/* ─────────────────────── Auction Calendar ─────────────────────── */

function AuctionCalendarSection({ events }: { events: AuctionEvent[] }) {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.auctionDate).getTime() - new Date(b.auctionDate).getTime()
  )

  return (
    <Card className="rounded-2xl border-border/60 bg-card shadow-[var(--shadow-institutional)]">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          <CardTitle className="text-sm font-semibold">Auction Calendar</CardTitle>
        </div>
        <p className="text-xs text-muted-foreground">
          Upcoming CBL Treasury auctions and settlement dates
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sortedEvents.map((event) => (
            <div
              key={event.id}
              className={cn(
                "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-xl border transition-colors",
                event.status === "In Progress"
                  ? "border-emerald-500/20 bg-emerald-500/5"
                  : "border-border/50 bg-muted/20"
              )}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div
                  className={cn(
                    "h-2 w-2 rounded-full shrink-0",
                    event.status === "In Progress"
                      ? "bg-emerald-500 animate-pulse"
                      : event.status === "Completed"
                        ? "bg-muted-foreground"
                        : "bg-blue-500"
                  )}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {event.securityName}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {event.tenor} · {formatLRD(event.amount)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground sm:text-right">
                <div>
                  <p className="text-[10px] uppercase tracking-wider">Auction</p>
                  <p className="tabular-nums font-mono text-foreground">
                    {new Date(event.auctionDate).toLocaleDateString("en-LR", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden />
                <div>
                  <p className="text-[10px] uppercase tracking-wider">Settlement</p>
                  <p className="tabular-nums font-mono text-foreground">
                    {new Date(event.settlementDate).toLocaleDateString("en-LR", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "shrink-0 text-[10px] font-medium border",
                  event.status === "In Progress"
                    ? "bg-muted/40 border border-border/40 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                    : event.status === "Completed"
                      ? "bg-muted text-muted-foreground border-border"
                      : "bg-muted/40 border border-border/40 text-blue-700 dark:text-blue-400 border-blue-500/20"
                )}
              >
                {event.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

/* ─────────────────────── KPI Summary Bar ─────────────────────── */

function TreasuryKPIs({ securities }: { securities: TreasurySecurity[] }) {
  const summary = getTreasurySummary(securities)

  const kpis = [
    { label: "Open Offerings", value: String(summary.openOfferings), icon: Banknote },
    { label: "Total Issued", value: formatLRD(summary.totalIssued), icon: CircleDollarSign },
    { label: "Avg Bid/Cover", value: `${summary.avgBidToCover}x`, icon: BarChart3 },
    { label: "Yield Spread", value: `${summary.yieldSpread}%`, sub: "91D–10Y", icon: Percent },
    { label: "Short Rate", value: `${summary.shortTermYield}%`, sub: "91-Day", icon: Timer },
    { label: "Long Rate", value: `${summary.longTermYield}%`, sub: "10-Year", icon: Clock },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="rounded-xl border border-border/50 bg-card p-3 shadow-[var(--shadow-institutional)]"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <kpi.icon className="h-3 w-3 text-primary shrink-0" aria-hidden />
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider truncate">
              {kpi.label}
            </p>
          </div>
          <p className="tabular-nums font-mono font-bold text-sm text-foreground">{kpi.value}</p>
          {kpi.sub && (
            <p className="text-[10px] text-muted-foreground">{kpi.sub}</p>
          )}
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────── Main Dashboard ─────────────────────── */

type FilterType = "All" | "T-Bill" | "Bond"
type FilterStatus = "All" | "Open" | "Upcoming" | "Closed"

export function TreasuryBondsDashboard() {
  const [typeFilter, setTypeFilter] = useState<FilterType>("All")
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("All")

  const filtered = useMemo(() => {
    return TREASURY_SECURITIES.filter((s) => {
      if (typeFilter !== "All" && s.type !== typeFilter) return false
      if (statusFilter !== "All" && s.status !== statusFilter) return false
      return true
    })
  }, [typeFilter, statusFilter])

  return (
    <div className="space-y-6">
      <TreasuryKPIs securities={TREASURY_SECURITIES} />

      <Tabs defaultValue="offerings" className="w-full">
        <TabsList className="w-full justify-start bg-muted/30 rounded-xl p-1 h-auto flex-wrap">
          <TabsTrigger value="offerings" className="rounded-lg text-xs min-h-[40px] data-[state=active]:shadow-sm">
            <Banknote className="h-3.5 w-3.5 mr-1.5 text-emerald-600 dark:text-emerald-400" aria-hidden />
            Securities
          </TabsTrigger>
          <TabsTrigger value="yield-curve" className="rounded-lg text-xs min-h-[40px] data-[state=active]:shadow-sm">
            <TrendingUp className="h-3.5 w-3.5 mr-1.5 text-green-600 dark:text-green-400" aria-hidden />
            Yield Curve
          </TabsTrigger>
          <TabsTrigger value="calculator" className="rounded-lg text-xs min-h-[40px] data-[state=active]:shadow-sm">
            <Calculator className="h-3.5 w-3.5 mr-1.5 text-primary" aria-hidden />
            Calculator
          </TabsTrigger>
          <TabsTrigger value="calendar" className="rounded-lg text-xs min-h-[40px] data-[state=active]:shadow-sm">
            <Calendar className="h-3.5 w-3.5 mr-1.5 text-primary" aria-hidden />
            Auction Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="offerings" className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-1.5">
              {(["All", "T-Bill", "Bond"] as FilterType[]).map((t) => (
                <Button
                  key={t}
                  size="sm"
                  variant={typeFilter === t ? "default" : "outline"}
                  onClick={() => setTypeFilter(t)}
                  className="rounded-xl text-xs min-h-[36px]"
                >
                  {t === "All" ? "All Types" : t === "T-Bill" ? "T-Bills" : "Bonds"}
                </Button>
              ))}
            </div>
            <div className="h-4 w-px bg-border/50 hidden sm:block" />
            <div className="flex gap-1.5">
              {(["All", "Open", "Upcoming", "Closed"] as FilterStatus[]).map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={statusFilter === s ? "secondary" : "ghost"}
                  onClick={() => setStatusFilter(s)}
                  className="rounded-xl text-xs min-h-[36px]"
                >
                  {s === "All" ? "All Status" : s}
                </Button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-8 w-8 mx-auto mb-3 text-primary" aria-hidden />
              <p className="text-sm text-muted-foreground">No securities match filters</p>
            </div>
          ) : (
            <ul className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0">
              {filtered.map((s) => (
                <li key={s.id}>
                  <SecurityCard security={s} />
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="yield-curve" className="mt-4">
          <YieldCurveChart data={YIELD_CURVE} />
        </TabsContent>

        <TabsContent value="calculator" className="mt-4">
          <BondCalculator />
        </TabsContent>

        <TabsContent value="calendar" className="mt-4">
          <AuctionCalendarSection events={AUCTION_CALENDAR} />
        </TabsContent>
      </Tabs>

      <Card className="rounded-2xl border-border/60 bg-card shadow-[var(--shadow-institutional)]">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 mt-0.5 shrink-0 text-primary" aria-hidden />
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-1">About CBL Government Securities</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Treasury bills and bonds are sovereign debt instruments issued by the Central Bank of Liberia (CBL) on behalf
                of the Government of Liberia. T-bills are short-term, zero-coupon discount securities (91–364 days).
                Bonds are longer-term instruments (2–10 years) that pay semi-annual coupons. These are considered the
                lowest-risk LRD-denominated investments, backed by the full faith and credit of the Republic of Liberia.
                Participation is open to commercial banks, institutional investors, and qualified individuals through primary
                dealer banks. Data sourced from CBL auction results.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
