"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar, Bell } from "lucide-react"
import Link from "next/link"
import { useLiveRate } from "@/lib/live-rate-context"

const TIMEFRAMES = [
  { value: "1 week", label: "1 week" },
  { value: "2 weeks", label: "2 weeks" },
  { value: "1 month", label: "1 month" },
] as const

export interface PlanInLRDProps {
  /** Optional fixed rate when not using context (e.g. server-rendered) */
  rate?: number | null
  /** Compact card for sidebar or small spaces */
  compact?: boolean
  className?: string
}

export function PlanInLRD({ rate: rateProp = null, compact = false, className = "" }: PlanInLRDProps) {
  const { rate: contextRate } = useLiveRate()
  const rate = rateProp ?? contextRate
  const [targetLRD, setTargetLRD] = useState("50000")
  const [timeframe, setTimeframe] = useState<string>("2 weeks")

  const targetNum = Math.max(0, parseFloat(targetLRD.replace(/,/g, "")) || 0)
  const usdToSend = typeof rate === "number" && rate > 0 ? targetNum / rate : null
  const hasResult = targetNum > 0 && usdToSend !== null

  if (compact) {
    return (
      <Card className={`border-primary/20 bg-gradient-to-br from-primary/5 to-card ${className}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Plan in LRD
          </CardTitle>
          <CardDescription className="text-xs">
            Need a target amount in LRD? See how much USD to send and get alerted when the rate moves.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Target (LRD)</Label>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="50,000"
                value={targetLRD}
                onChange={(e) => setTargetLRD(e.target.value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ","))}
                className="h-9 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">When</Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEFRAMES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {hasResult && (
            <>
              <p className="text-xs text-muted-foreground">
                At today&apos;s rate you&apos;d send <span className="font-semibold text-foreground">~${usdToSend.toFixed(0)}</span>. We&apos;ll alert you if the rate moves.
              </p>
              <Button asChild size="sm" className="w-full gap-1.5">
                <Link href="/business">
                  <Bell className="h-3.5 w-3.5" />
                  Set alert
                </Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`group border-primary/20 bg-gradient-to-br from-primary/5 to-card shadow-sm hover:shadow-lg transition-all ${className}`}>
      <CardHeader className="pb-3">
        <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
          <Calendar className="h-7 w-7 text-primary" />
        </div>
        <CardTitle className="text-lg text-primary">Plan in LRD</CardTitle>
        <CardDescription>
          Need a target amount in Liberian dollars? Plan how much to send and get alerted when the rate moves so you can send at a better time.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">I need (LRD)</Label>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="50,000"
              value={targetLRD}
              onChange={(e) => setTargetLRD(e.target.value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ","))}
              className="h-10 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">When</Label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="h-10 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEFRAMES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasResult && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-2">
            <p className="text-sm text-foreground">
              If you need <span className="font-semibold">L${targetNum.toLocaleString()}</span> in {timeframe}, at today&apos;s rate you&apos;d send{" "}
              <span className="font-semibold text-primary">~${usdToSend.toFixed(0)}</span>.
            </p>
            <p className="text-xs text-muted-foreground">
              We&apos;ll alert you if the rate moves so you can send at a better time. When you can plan and hedge a bit, you&apos;re less at the mercy of the rate—and LRD feels more stable to use.
            </p>
            <Button asChild className="w-full gap-2 mt-2" size="sm">
              <Link href="/business">
                <Bell className="h-4 w-4" />
                Set rate alert
              </Link>
            </Button>
          </div>
        )}

        {targetNum > 0 && !hasResult && (
          <p className="text-xs text-muted-foreground">Enter a live rate above or refresh to see how much USD to send.</p>
        )}
      </CardContent>
    </Card>
  )
}
