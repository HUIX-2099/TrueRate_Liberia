"use client"

import React, { memo, useMemo, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Activity,
  ArrowLeftRight,
  Bell,
  BellRing,
  Calculator,
  LogIn,
  MapPin,
  MapPinned,
  Menu,
  Newspaper,
  Shield,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LiveUpdateIndicator } from "@/components/live-update-indicator"
import { ThemeToggle } from "@/components/theme-toggle"
import { usePathname } from "next/navigation"
import { usePerformanceMonitor } from "@/lib/client-utils"

const HeaderComponent = () => {
  const { user } = useAuth()
  const pathname = usePathname()

  usePerformanceMonitor("Header")

  // Memoize navigation items to prevent unnecessary re-renders
  const navigationItems = useMemo(() => [
    { href: "/rates", label: "Rates" },
    { href: "/converter", label: "Converter" },
    { href: "/map", label: "Nearby" },
    { href: "/analytics", label: "Analytics" },
    { href: "/predictions", label: "Predictions" },
    { href: "/business", label: "Business" },
    { href: "/forums", label: "Forums" },
    { href: "/community", label: "Community" },
  ], [])

  // Memoize mobile menu items
  const mobileMenuItems = useMemo(() => [
    { href: "/auth/signin", label: "Sign In", icon: LogIn, description: "Access your dashboard" },
    { href: "/rates", label: "Rates", icon: TrendingUp, description: "Live USD/LRD updates" },
    { href: "/converter", label: "Converter", icon: Calculator, description: "Convert USD ↔ LRD" },
    { href: "/analytics", label: "Analytics / Charts", icon: Activity, description: "Trends and history" },
    { href: "/price-index", label: "Price Index", icon: ShoppingCart, description: "Everyday cost tracking" },
    { href: "/map", label: "Find Changers", icon: MapPin, description: "Map of local rates" },
    { href: "/liberia-market", label: "News", icon: Newspaper, description: "Liberia market updates" },
    { href: "/community", label: "Community", icon: Users, description: "Reports and reviews" },
  ], [])

  // Memoize bottom navigation items
  const bottomNavItems = useMemo(() => [
    { href: "/rates", label: "Rates", icon: TrendingUp },
    { href: "/converter", label: "Converter", icon: ArrowLeftRight },
    { href: "/map", label: "Map", icon: MapPinned },
    { href: "/tools", label: "Alerts", icon: BellRing },
  ], [])

  // Memoize user avatar initials
  const userInitials = useMemo(() =>
    user?.name
      ?.split(" ")
      ?.map((n) => n[0])
      ?.join("")
      ?.toUpperCase() || "",
    [user?.name]
  )

  // Optimized nav link component
  const NavLink = memo(({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) => (
    <Link
      href={href}
      className={`text-sm font-medium text-muted-foreground hover:text-foreground transition-colors ${className}`}
    >
      {children}
    </Link>
  ))
  NavLink.displayName = "NavLink"

  // Optimized mobile menu item component
  const MobileMenuItem = memo(({ item }: { item: typeof mobileMenuItems[0] }) => (
    <Link
      href={item.href}
      className="w-full max-w-sm rounded-xl border border-border/60 bg-background/80 px-3 py-2.5 transition-all hover:border-primary/40 hover:shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <item.icon className="h-4 w-4 text-primary" />
        </div>
        <div className="text-left">
          <div className="text-sm font-semibold text-foreground">{item.label}</div>
          <div className="text-[11px] text-muted-foreground">{item.description}</div>
        </div>
      </div>
    </Link>
  ))
  MobileMenuItem.displayName = "MobileMenuItem"

  // Optimized bottom nav item component
  const BottomNavItem = memo(({ item }: { item: typeof bottomNavItems[0] }) => {
    const isActive = pathname === item.href
    return (
      <Link
        href={item.href}
        aria-label={item.label}
        aria-current={isActive ? "page" : undefined}
        className={`flex flex-col items-center gap-1 rounded-lg py-2 min-h-[48px] transition-all ${
          isActive
            ? "text-foreground bg-muted/60 shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
        }`}
      >
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
            isActive ? "bg-primary/10 text-primary" : "bg-muted/40 text-muted-foreground"
          }`}
        >
          <item.icon className="h-5 w-5" />
        </span>
        <span className={isActive ? "font-medium" : ""}>{item.label}</span>
      </Link>
    )
  })
  BottomNavItem.displayName = "BottomNavItem"

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container mx-auto flex h-16 md:h-[72px] items-center justify-between px-4 gap-3">
          <Link href="/" className="flex items-center gap-2 min-w-0" aria-label="TrueRate Liberia home">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">TR</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-base sm:text-lg font-bold text-foreground leading-none truncate">
                TrueRate Liberia
              </span>
              <span className="text-[10px] text-muted-foreground leading-none hidden sm:block">by HUIX-2099</span>
            </div>
          </Link>

          <div className="hidden lg:flex">
            <LiveUpdateIndicator />
          </div>



        <nav className="hidden lg:flex items-center gap-6">
          {navigationItems.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
            <ThemeToggle />

          <Button variant="ghost" size="icon" className="hidden md:flex" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
          <Button asChild className="hidden lg:flex">
            <Link href="/map">Find Nearest</Link>
          </Button>
            {user ? (
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="hidden md:flex" aria-label="Open dashboard">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </Link>
            ) : (
              <Link href="/auth/signin">
                <Button className="hidden md:flex">Sign In</Button>
              </Link>
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="mt-3 space-y-4 max-h-[calc(100vh-5rem)] overflow-y-auto pr-1">
                  <div className="rounded-xl border border-border/60 bg-background/70 px-3 py-2 text-left shadow-sm">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Quick access
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Navigate rates, tools, and community updates.
                    </div>
                  </div>
                  <nav className="flex flex-col items-center text-center gap-2">
                    {mobileMenuItems.map((item) => (
                      <MobileMenuItem key={item.href} item={item} />
                    ))}
                    <Link
                      href="/report-fraud"
                      className="w-full max-w-sm rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2.5 transition-all hover:bg-destructive/10 hover:shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
                          <Shield className="h-4 w-4 text-destructive" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-semibold text-destructive">Report Fraud</div>
                          <div className="text-[11px] text-muted-foreground">Help keep the community safe</div>
                        </div>
                      </div>
                    </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur shadow-[0_-12px_30px_-24px_rgba(15,23,42,0.6)] md:hidden"
        aria-label="Primary"
      >
        <div className="mx-auto grid grid-cols-4 gap-1 px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.6rem)] text-[11px]">
          {bottomNavItems.map((item) => (
            <BottomNavItem key={item.href} item={item} />
          ))}
        </div>
      </nav>
    </>
  )
}

export const Header = memo(HeaderComponent)
