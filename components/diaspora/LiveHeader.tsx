"use client"

import Link from "next/link"
import { Bell, User, Wallet } from "lucide-react"
import { useLiveRate } from "@/lib/live-rate-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth/auth-context"
import { StatusBadge } from "@/components/ui/status-badge"

function getVolatilityVariant(
  spreadPct: number | null
): "stable" | "watch" | "volatile" {
  if (spreadPct == null) return "stable"
  if (spreadPct >= 5) return "volatile"
  if (spreadPct >= 2) return "watch"
  return "stable"
}

function formatLastUpdated(iso: string | undefined): string {
  if (!iso) return "—"
  try {
    const d = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffM = Math.floor(diffMs / 60000)
    if (diffM < 1) return "Just now"
    if (diffM < 60) return `${diffM}m ago`
    const diffH = Math.floor(diffM / 60)
    if (diffH < 24) return `${diffH}h ago`
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
  } catch {
    return "—"
  }
}

export function LiveHeader() {
  const { rate: marketRate, cblRate: officialRate, loading, timestamp } = useLiveRate()
  const { user } = useAuth()

  const official = officialRate != null && officialRate > 0 ? officialRate : null
  const market = marketRate
  const spreadPct =
    official != null && official > 0
      ? Number((((market - official) / official) * 100).toFixed(2))
      : null
  const volatilityVariant = getVolatilityVariant(spreadPct)

  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/98"
      role="banner"
      aria-label="Diaspora Mode live intelligence"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4">
          {/* Left: Branding */}
          <Link
            href="/diaspora"
            className="flex flex-col justify-center min-w-0 py-2 rounded-lg -mx-2 px-2 hover:bg-muted/40 transition-colors"
            aria-label="Diaspora Mode home"
          >
            <h1 className="text-sm sm:text-base font-bold tracking-tight text-foreground truncate leading-tight">
              Diaspora Mode
            </h1>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate leading-tight mt-0.5">
              Real-time Economic Access
            </p>
          </Link>

          {/* Center: Live rate data in a compact tray */}
          <div className="flex-1 flex items-center justify-center min-w-0 max-w-2xl">
            <div className="flex items-center gap-2 sm:gap-4 md:gap-5 py-2 px-3 sm:px-4 rounded-xl bg-muted/30 border border-border/30">
              <div className="flex flex-col items-center min-w-[52px] sm:min-w-[60px]">
                <span className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  Official
                </span>
                <span className="text-xs sm:text-sm font-bold tabular-nums text-foreground">
                  {loading ? "—" : official != null ? official.toFixed(2) : "—"}
                </span>
              </div>
              <div className="h-8 w-px bg-border/80 shrink-0" aria-hidden />
              <div className="flex flex-col items-center min-w-[52px] sm:min-w-[60px]">
                <span className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  Market
                </span>
                <span className="text-xs sm:text-sm font-bold tabular-nums text-primary">
                  {loading ? "—" : market.toFixed(2)}
                </span>
              </div>
              <div className="h-8 w-px bg-border/80 shrink-0 hidden sm:block" aria-hidden />
              <div className="flex flex-col items-center min-w-[44px] sm:min-w-[52px] hidden sm:flex">
                <span className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  Spread
                </span>
                <span className="text-xs sm:text-sm font-bold tabular-nums">
                  {loading ? "—" : spreadPct != null ? `${spreadPct > 0 ? "+" : ""}${spreadPct}%` : "—"}
                </span>
              </div>
              <div className="h-8 w-px bg-border/80 shrink-0 hidden md:block" aria-hidden />
              <div className="hidden md:flex items-center gap-1.5">
                <StatusBadge
                  label={
                    volatilityVariant === "stable"
                      ? "Stable"
                      : volatilityVariant === "watch"
                        ? "Watch"
                        : "Volatile"
                  }
                  variant={volatilityVariant}
                  size="sm"
                />
              </div>
              <div className="h-8 w-px bg-border/80 shrink-0 hidden lg:block" aria-hidden />
              <div className="hidden lg:flex flex-col items-center min-w-[48px]">
                <span className="text-[9px] text-muted-foreground font-medium">Updated</span>
                <span className="text-[11px] tabular-nums text-muted-foreground">
                  {formatLastUpdated(timestamp)}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-9 w-9 sm:h-10 sm:w-10 hover: text-primary"
              asChild
              aria-label="Notifications"
            >
              <Link href="/tools#alerts">
                <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-9 w-9 sm:h-10 sm:w-10 text-primary"
              asChild
              aria-label="Profile"
            >
              {user ? (
                <Link href="/dashboard">
                  <Avatar className="h-8 w-8 text-primary">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground font-medium">
                      {user.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2) || "?"}
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
              className="hidden sm:flex items-center gap-2 rounded-lg bg-muted/50 border border-border/40 px-2.5 py-1.5"
              aria-label="Balance (coming soon)"
            >
              <Wallet className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[11px] text-muted-foreground font-medium">Wallet</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
