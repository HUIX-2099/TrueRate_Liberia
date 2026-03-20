"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { House, LayoutDashboard, Store, LineChart, TrendingUp, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: House, sectionId: "home" },
  { href: "/diaspora", label: "Overview", icon: LayoutDashboard, sectionId: "overview" },
  { href: "/diaspora#marketplace", label: "Marketplace", icon: Store, sectionId: "marketplace" },
  { href: "/diaspora#intelligence", label: "Rates", icon: LineChart, sectionId: "intelligence" },
  { href: "/diaspora#investment", label: "Invest", icon: TrendingUp, sectionId: "investment" },
  { href: "/diaspora#marketplace", label: "Orders", icon: ShoppingBag, sectionId: "orders" },
] as const

/** Mobile-only bottom nav. Tabs: Home, Overview, Marketplace, Rates, Invest, Orders. */
export function MobileBottomNav() {
  const pathname = usePathname()
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    queueMicrotask(() =>
      setActiveId(window.location.hash.slice(1) || (pathname === "/diaspora" ? "overview" : ""))
    )
    const handler = () => {
      const h = window.location.hash.slice(1)
      setActiveId(h || "overview")
    }
    window.addEventListener("hashchange", handler)
    return () => window.removeEventListener("hashchange", handler)
  }, [pathname])

  const isDiaspora = pathname === "/diaspora"
  if (!isDiaspora) return null

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 mx-2 mb-2 rounded-2xl border border-border/30 bg-background/98 shadow-lg safe-area-pb"
      role="navigation"
      aria-label="Diaspora dashboard"
    >
      <div className="flex items-center justify-around gap-0.5 px-1 py-1.5 min-h-[56px]">
        {NAV_ITEMS.map(({ href, label, icon: Icon, sectionId }) => {
          const isActive =
            sectionId === "home"
              ? false
              : sectionId === "overview"
                ? activeId === "overview" || (!activeId && pathname === "/diaspora")
                : activeId === sectionId
          return (
            <Link
              key={sectionId}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 rounded-xl py-2 px-1 min-h-[44px] transition-all",
                isActive
                  ? "bg-muted/40 border border-border/40 text-primary"
                  : "text-muted-foreground hover:text-foreground active:scale-[0.97]"
              )}
              aria-label={label}
              aria-current={isActive ? "true" : undefined}
            >
              <Icon className={cn("h-5 w-5 shrink-0", isActive && "drop-shadow-sm")} aria-hidden />
              <span className={cn(
                "text-[10px] font-medium truncate w-full text-center leading-tight",
                isActive && "font-semibold"
              )}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
