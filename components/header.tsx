"use client"

import React, { memo, useMemo, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Activity,
  ArrowLeftRight,
  BellRing,
  Calculator,
  Crown,
  LogIn,
  MapPin,
  MapPinned,
  Menu,
  MessageSquare,
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
    { href: "/converter", label: "Converter", icon: Calculator, description: "Convert currencies" },
    { href: "/analytics", label: "Analytics", icon: Activity, description: "Market insights" },
    { href: "/predictions", label: "AI Forecasts", icon: Crown, description: "ML predictions" },
    { href: "/business", label: "Business", icon: ShoppingCart, description: "Enterprise tools" },
    { href: "/forums", label: "Forums", icon: MessageSquare, description: "Community discussions" },
    { href: "/community", label: "Community", icon: Users, description: "Rate reports & badges" },
  ], [])

  // Memoize mobile menu items
  const mobileMenuItems = useMemo(() => [
    { href: "/auth/signin", label: "Sign In", icon: LogIn, description: "Access your dashboard" },
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

  // Enhanced nav link component with icons and active states
  const NavLink = memo(({ item }: { item: typeof navigationItems[0] }) => {
    const isActive = pathname === item.href

    return (
      <Link
        href={item.href}
        className={`group relative flex items-center gap-2 px-2 lg:px-2.5 xl:px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all duration-200 shrink-0 ${
          isActive
            ? "bg-primary/10 text-primary shadow-sm border border-primary/20"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent"
        }`}
        title={item.description}
      >
        <item.icon className={`h-4 w-4 transition-colors ${
          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
        }`} />
        <span className={isActive ? "font-semibold" : ""}>{item.label}</span>

        {/* Active indicator */}
        {isActive && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
        )}
      </Link>
    )
  })
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
        className={`relative flex flex-col items-center justify-center gap-1 rounded-xl py-2 px-1 min-h-[44px] transition-all duration-200 ease-out ${
          isActive
            ? "text-primary"
            : "text-muted-foreground active:scale-95"
        }`}
      >
        <span
          className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
            isActive ? "bg-primary/15 text-primary" : "hover:bg-muted/60"
          }`}
        >
          <item.icon className={`h-[22px] w-[22px] ${isActive ? "drop-shadow-sm" : ""}`} />
          {isActive && (
            <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
          )}
        </span>
        <span className={`text-[10px] font-medium tracking-wide ${isActive ? "text-primary" : "text-muted-foreground"}`}>
          {item.label}
        </span>
      </Link>
    )
  })
  BottomNavItem.displayName = "BottomNavItem"

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container mx-auto flex h-14 sm:h-16 md:h-[72px] items-center justify-between px-3 sm:px-4 gap-2 sm:gap-3 max-w-[100vw]">
          <Link href="/" className="flex items-center min-w-0" aria-label="TrueRate Liberia home">
            <div className="flex h-[108px] w-[138px] sm:h-[116px] sm:w-[154px] md:h-[116px] md:w-[170px] items-center justify-center overflow-hidden">
              <Image
                src="/truerate-logo.png"
                alt="TrueRate logo"
                width={150}
                height={150}
                className="h-full w-full object-contain"
                priority
              />
            </div>
          </Link>




        <nav className="hidden lg:flex items-center max-w-[60vw] xl:max-w-none">
          <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-muted/30 border border-border/40 backdrop-blur-sm overflow-x-auto">
            {navigationItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
        </nav>

        <div className="flex items-center gap-2">
            <ThemeToggle />

          <Button
            asChild
            className="hidden lg:flex gap-2 rounded-full px-4 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/map">
              <MapPin className="h-4 w-4" />
              Find Nearest
            </Link>
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
                <Button
                  variant="outline"
                  className="hidden md:flex rounded-full px-4 border-primary/30 text-primary hover:bg-primary/10"
                >
                  Sign In
                </Button>
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
        className="fixed bottom-0 left-0 right-0 z-40 flex justify-center px-4 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] md:hidden pointer-events-none"
        aria-label="Primary"
      >
        <div className="pointer-events-auto mx-auto w-full max-w-[min(380px,calc(100vw-1.5rem))] rounded-2xl border border-border/80 bg-background/98 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.12),0_2px_8px_-2px_rgba(0,0,0,0.06)] backdrop-blur-xl">
          <div className="mx-auto grid grid-cols-4 gap-1 p-2">
            {bottomNavItems.map((item) => (
              <BottomNavItem key={item.href} item={item} />
            ))}
          </div>
        </div>
      </nav>
    </>
  )
}

export const Header = memo(HeaderComponent)
