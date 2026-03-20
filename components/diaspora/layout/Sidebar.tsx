"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Store, LineChart, TrendingUp, Send, ShieldCheck, Home } from "lucide-react"
import { cn } from "@/lib/utils"

const SIDEBAR_LINKS = [
  { href: "/diaspora#marketplace", label: "Marketplace", icon: Store, sectionId: "marketplace" },
  { href: "/diaspora#intelligence", label: "Intelligence", icon: LineChart, sectionId: "intelligence" },
  { href: "/diaspora#investment", label: "Investment", icon: TrendingUp, sectionId: "investment" },
  { href: "/diaspora#remittance", label: "Remittance", icon: Send, sectionId: "remittance" },
  { href: "/diaspora#trust", label: "Trust", icon: ShieldCheck, sectionId: "trust" },
] as const

/** Desktop-only sidebar navigation. */
export function Sidebar() {
  const pathname = usePathname()
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    queueMicrotask(() => setActiveId(window.location.hash.slice(1) || "marketplace"))
    const handler = () => setActiveId(window.location.hash.slice(1) || "marketplace")
    window.addEventListener("hashchange", handler)
    return () => window.removeEventListener("hashchange", handler)
  }, [])

  const isDiaspora = pathname === "/diaspora"

  return (
    <aside
      className="hidden lg:flex lg:w-52 xl:w-60 flex-col border-r border-border/20 bg-muted/5 py-6"
      aria-label="Diaspora command center navigation"
    >
      <div className="px-5 mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Navigation</p>
      </div>
      <nav className="flex flex-col gap-1 px-3" role="navigation">
        {SIDEBAR_LINKS.map(({ href, label, icon: Icon, sectionId }) => {
          const current = isDiaspora && (activeId === sectionId || (!activeId && sectionId === "marketplace"))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all min-h-[44px]",
                current
                  ? "bg-muted/40 border border-border/40 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              )}
              aria-current={current ? "true" : undefined}
            >
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                current ? "bg-primary/15" : "bg-muted/30"
              )}>
                <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              </div>
              {label}
            </Link>
          )
        })}
        <div className="mt-6 pt-4 border-t border-border/20">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/40 hover:text-foreground min-h-[44px]"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/30">
              <Home className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            </div>
            Back to TrueRate
          </Link>
        </div>
      </nav>
    </aside>
  )
}
