"use client"

import { useEffect, useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Bell, TrendingUp, TrendingDown, Mail, Smartphone, CheckCircle2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface AlertPrefs {
  rateAbove?: number | null
  rateBelow?: number | null
  moveUpPct?: number | null
  moveDownPct?: number | null
  digest: "none" | "daily" | "weekly"
  digestEmail?: string
}

const CLIENT_ID_KEY = "truerate-notification-client-id"

function getClientId(): string {
  try {
    let id = localStorage.getItem(CLIENT_ID_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(CLIENT_ID_KEY, id)
    }
    return id
  } catch {
    return "anonymous"
  }
}

export function AlertPreferences({ className }: { className?: string }) {
  const { toast } = useToast()
  const [prefs, setPrefs] = useState<AlertPrefs>({ digest: "none" })
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const clientId = getClientId()
    fetch("/api/notifications/preferences", {
      headers: { "x-notification-client-id": clientId },
    })
      .then((r) => r.json())
      .then((data) => {
        const p = data.prefs as
          | {
              rate_above?: number | null
              rate_below?: number | null
              move_up_pct?: number | null
              move_down_pct?: number | null
              digest?: string
              digest_email?: string | null
            }
          | null
          | undefined
        setPrefs({
          rateAbove: p?.rate_above ?? null,
          rateBelow: p?.rate_below ?? null,
          moveUpPct: p?.move_up_pct ?? null,
          moveDownPct: p?.move_down_pct ?? null,
          digest: (p?.digest as AlertPrefs["digest"]) ?? "none",
          digestEmail: p?.digest_email ?? "",
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const save = () => {
    startTransition(async () => {
      const clientId = getClientId()
      try {
        const res = await fetch("/api/notifications/preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-notification-client-id": clientId },
          body: JSON.stringify(prefs),
        })
        if (res.ok) {
          setSaved(true)
          setTimeout(() => setSaved(false), 3000)
          toast({ title: "Alert preferences saved", description: "You'll be notified based on your thresholds." })

          // Also subscribe to digest if email provided
          if (prefs.digest !== "none" && prefs.digestEmail?.includes("@")) {
            await fetch("/api/digest/subscribe", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: prefs.digestEmail, frequency: prefs.digest }),
            })
          }
        }
      } catch {
        toast({ title: "We couldn't save your settings", description: "Please try again in a moment.", variant: "destructive" })
      }
    })
  }

  if (loading) {
    return (
      <Card className={cn("rounded-2xl border-border/40", className)}>
        <CardContent className="p-8 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("rounded-2xl border-border/40 bg-card", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Alert Preferences
        </CardTitle>
        <CardDescription>Get notified when the USD/LRD rate hits your thresholds.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        {/* Rate thresholds */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              Alert if rate rises above
            </Label>
            <div className="relative">
              <Input
                type="number"
                min="100"
                max="500"
                step="0.5"
                placeholder="e.g. 190"
                value={prefs.rateAbove ?? ""}
                onChange={(e) => setPrefs((p) => ({ ...p, rateAbove: e.target.value ? Number(e.target.value) : null }))}
                className="h-11 rounded-xl pr-16 text-sm"
                aria-label="Alert rate above threshold"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">LRD/$</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <TrendingDown className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
              Alert if rate falls below
            </Label>
            <div className="relative">
              <Input
                type="number"
                min="100"
                max="500"
                step="0.5"
                placeholder="e.g. 180"
                value={prefs.rateBelow ?? ""}
                onChange={(e) => setPrefs((p) => ({ ...p, rateBelow: e.target.value ? Number(e.target.value) : null }))}
                className="h-11 rounded-xl pr-16 text-sm"
                aria-label="Alert rate below threshold"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">LRD/$</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Move up alert (%)
            </Label>
            <div className="relative">
              <Input
                type="number"
                min="0"
                max="50"
                step="0.5"
                placeholder="e.g. 2"
                value={prefs.moveUpPct ?? ""}
                onChange={(e) => setPrefs((p) => ({ ...p, moveUpPct: e.target.value ? Number(e.target.value) : null }))}
                className="h-11 rounded-xl pr-8 text-sm"
                aria-label="Alert on upward move percentage"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">%</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Move down alert (%)
            </Label>
            <div className="relative">
              <Input
                type="number"
                min="0"
                max="50"
                step="0.5"
                placeholder="e.g. 2"
                value={prefs.moveDownPct ?? ""}
                onChange={(e) => setPrefs((p) => ({ ...p, moveDownPct: e.target.value ? Number(e.target.value) : null }))}
                className="h-11 rounded-xl pr-8 text-sm"
                aria-label="Alert on downward move percentage"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">%</span>
            </div>
          </div>
        </div>

        {/* Email digest */}
        <div className="space-y-3 pt-2 border-t border-border/40">
          <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <Mail className="h-3.5 w-3.5 text-primary" />
            Market Digest Email
          </Label>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              type="email"
              placeholder="you@example.com"
              value={prefs.digestEmail ?? ""}
              onChange={(e) => setPrefs((p) => ({ ...p, digestEmail: e.target.value }))}
              className="h-11 rounded-xl text-sm"
              aria-label="Email for market digest"
            />
            <Select
              value={prefs.digest}
              onValueChange={(v) => setPrefs((p) => ({ ...p, digest: v as AlertPrefs["digest"] }))}
            >
              <SelectTrigger className="h-11 rounded-xl" aria-label="Digest frequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No digest</SelectItem>
                <SelectItem value="daily">Daily digest</SelectItem>
                <SelectItem value="weekly">Weekly digest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={save}
          disabled={isPending}
          className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-xs gap-2"
        >
          {isPending ? (
            <><Loader2 className="h-4 w-4 animate-spin text-primary" /> Saving…</>
          ) : saved ? (
            <><CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" /> Saved</>
          ) : (
            <><Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" /> Save Alert Preferences</>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
