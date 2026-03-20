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
      className="hidden lg:flex lg:w-52 xl:w-60 flex-col border-r border-border/40 bg-muted/20 py-5"
      aria-label="Diaspora command center navigation"
    >
      <nav className="flex flex-col gap-1 px-3" role="navigation">
        {SIDEBAR_LINKS.map(({ href, label, icon: Icon, sectionId }) => {
          const current = isDiaspora && (activeId === sectionId || (!activeId && sectionId === "marketplace"))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors min-h-[44px]",
                current
                  ? "bg-muted/40 border border-border/40 text-primary border border-primary/20"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent"
              )}
              aria-current={current ? "true" : undefined}
            >
              <Icon className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              {label}
            </Link>
          )
        })}
        <div className="mt-auto pt-4 px-3 border-t border-border/40">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent min-h-[44px]"
          >
            <Home className="h-5 w-5 shrink-0 text-primary" aria-hidden />
            Back to TrueRate
          </Link>
        </div>
      </nav>
    </aside>
  )
}
