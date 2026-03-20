"use client"

import Link from "next/link"
import { Bell, User, Wallet } from "lucide-react"
import { useLiveRate } from "@/lib/live-rate-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth/auth-context"
import { cn } from "@/lib/utils"

/** Volatility label derived from official vs market spread when CBL rate exists */
function getVolatilityLabel(spreadPct: number | null): { label: string; variant: "stable" | "elevated" | "high" } {
  if (spreadPct == null) return { label: "—", variant: "stable" }
  if (spreadPct >= 5) return { label: "High", variant: "high" }
  if (spreadPct >= 2) return { label: "Elevated", variant: "elevated" }
  return { label: "Stable", variant: "stable" }
}

export function DiasporaLiveIntelligenceHeader() {
  const { rate: marketRate, cblRate: officialRate, loading } = useLiveRate()
  const { user } = useAuth()

  const official = officialRate != null && officialRate > 0 ? officialRate : null
  const market = marketRate
  const spreadPct =
    official != null && official > 0
      ? Number((((market - official) / official) * 100).toFixed(2))
      : null
  const volatility = getVolatilityLabel(spreadPct)

  return (
    <header
      className="w-full border-b border-border/60 bg-card shadow-[var(--shadow-institutional)]"
      role="banner"
      aria-label="Diaspora Mode live intelligence"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-14 sm:h-16 md:h-[72px] items-center justify-between gap-3 md:gap-6">
          {/* Left: Branding */}
          <div className="flex min-w-0 shrink items-center gap-3">
            <Link
              href="/diaspora"
              className="flex flex-col justify-center min-w-0"
              aria-label="Diaspora Mode home"
            >
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground truncate">
                Diaspora Mode
              </h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                Real-time Economic Access
              </p>
            </Link>
          </div>

          {/* Center: Live rate data */}
          <div className="flex flex-1 items-center justify-center min-w-0">
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8">
              <div className="flex flex-col items-center">
                <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">
                  USD/LRD Official
                </span>
                <span className="text-sm sm:text-base font-bold tabular-nums text-foreground">
                  {loading ? "—" : official != null ? `${official.toFixed(2)}` : "—"}
                </span>
              </div>
              <div className="h-8 w-px bg-border hidden sm:block" aria-hidden />
              <div className="flex flex-col items-center">
                <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">
                  USD/LRD Market
                </span>
                <span className="text-sm sm:text-base font-bold tabular-nums text-primary">
                  {loading ? "—" : `${market.toFixed(2)}`}
                </span>
              </div>
              <div className="h-8 w-px bg-border hidden sm:block" aria-hidden />
              <div className="flex flex-col items-center">
                <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">
                  Spread %
                </span>
                <span className="text-sm sm:text-base font-bold tabular-nums text-foreground">
                  {loading ? "—" : spreadPct != null ? `${spreadPct > 0 ? "+" : ""}${spreadPct}%` : "—"}
                </span>
              </div>
              <div className="h-8 w-px bg-border hidden sm:block" aria-hidden />
              <div className="flex flex-col items-center">
                <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">
                  Volatility
                </span>
                <span
                  className={cn(
                    "text-sm sm:text-base font-semibold tabular-nums",
                    volatility.variant === "stable" && "text-emerald-600 dark:text-emerald-400",
                    volatility.variant === "elevated" && "text-amber-600 dark:text-amber-400",
                    volatility.variant === "high" && "text-destructive"
                  )}
                >
                  {volatility.label}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Notifications, Profile, Balance */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Button variant="ghost" size="icon" className="rounded-full" asChild aria-label="Notifications">
              <Link href="/tools#alerts">
                <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" asChild aria-label="Profile">
              {user ? (
                <Link href="/dashboard">
                  <Avatar className="h-8 w-8 text-primary">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {user.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              ) : (
                <Link href="/auth/signin">
                  <User className="h-5 w-5 text-primary" />
                </Link>
              )}
            </Button>
            <div
              className="hidden sm:flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 min-w-[100px]"
              aria-label="Balance summary (coming soon)"
            >
              <Wallet className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs text-muted-foreground truncate">Wallet soon</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
