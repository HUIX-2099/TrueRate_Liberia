"use client"

import React, { memo, useMemo, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  ArrowLeftRight,
  BellRing,
  Menu,
  Shield,
} from "lucide-react"
import { NAVIGATION_ITEMS, MOBILE_MENU_ITEMS, BOTTOM_NAV_ITEMS } from "@/lib/site-navigation"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LiveUpdateIndicator } from "@/components/live-update-indicator"
import { ThemeToggle } from "@/components/theme-toggle"
import { CrisisAlertBanner } from "@/components/crisis/CrisisAlertBanner"
import { usePathname } from "next/navigation"
import { usePerformanceMonitor } from "@/lib/client-utils"

const HeaderComponent = () => {
  const { user } = useAuth()
  const pathname = usePathname()

  usePerformanceMonitor("Header")

  const navigationItems = NAVIGATION_ITEMS
  const mobileMenuItems = MOBILE_MENU_ITEMS
  const bottomNavItems = BOTTOM_NAV_ITEMS

  // Memoize user avatar initials
  const userInitials = useMemo(() =>
    user?.name
      ?.split(" ")
      ?.map((n) => n[0])
      ?.join("")
      ?.toUpperCase() || "",
    [user?.name]
  )

  const isPathActive = useCallback((href: string) => {
    const path = pathname.replace(/\/$/, "") || "/"
    const base = href.replace(/\/$/, "") || "/"
    return path === base
  }, [pathname])

  const currentPageLabel = useMemo(() => {
    const exact =
      [...navigationItems, ...mobileMenuItems].find((item) => item.href === pathname)?.label
    if (exact) return exact
    if (pathname.startsWith("/community")) return "Community"
    if (pathname.startsWith("/report-fraud")) return "Report Fraud"
    if (pathname.startsWith("/predictions")) return "Rate Outlook"
    if (pathname.startsWith("/auth")) return "Account"
    return "Home"
  }, [mobileMenuItems, navigationItems, pathname])

  // Enhanced nav link component with icons and active states
  const NavLink = memo(({ item }: { item: typeof navigationItems[0] }) => {
    const isActive = isPathActive(item.href)

    return (
      <Link
        href={item.href}
        className={`group relative flex items-center gap-2 px-2 lg:px-2.5 xl:px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors duration-200 shrink-0 ${ isActive ? "bg-muted/40 border border-border/50 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent" }`}
        title={item.description}
      >
        <item.icon className={`h-4 w-4 transition-colors ${ isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground" }`} />
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
  const MobileMenuItem = memo(({ item }: { item: typeof mobileMenuItems[0] }) => {
    const isActive = isPathActive(item.href)
    return (
      <Link
        href={item.href}
        className={`w-full rounded-xl border px-3 py-2.5 transition-colors duration-200 flex items-center gap-3 ${ isActive ? "border-primary/40 bg-primary/5 shadow-sm" : "border-border/50 bg-muted/30 hover:border-border/70 hover:bg-muted/50" }`}
      >
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isActive ? "bg-primary/15" : "bg-background/80"}`}>
          <item.icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <div className={`text-sm font-semibold ${isActive ? "text-primary" : "text-foreground"}`}>{item.label}</div>
          <div className="text-[11px] text-muted-foreground truncate">{item.description}</div>
        </div>
      </Link>
    )
  })
  MobileMenuItem.displayName = "MobileMenuItem"

  // Optimized bottom nav item component
  const BottomNavItem = memo(({ item }: { item: typeof bottomNavItems[0] }) => {
    const isActive = isPathActive(item.href)
    return (
      <Link
        href={item.href}
        aria-label={item.label}
        aria-current={isActive ? "page" : undefined}
        className={`relative flex flex-col items-center justify-center gap-0.5 rounded-lg py-2 px-1 min-h-[44px] min-w-0 transition-colors duration-200 ease-out ${ isActive ? "text-primary" : "text-muted-foreground" }`}
      >
        <span
          className={`relative flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center shrink-0 rounded-full transition-colors ${ isActive ? "bg-primary/15 text-primary" : "hover:bg-muted/60" }`}
        >
          <item.icon className={`h-[16px] w-[16px] sm:h-[18px] sm:w-[18px] ${isActive ? "drop-shadow-sm" : ""}`} />
          {isActive && (
            <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full bg-primary" />
          )}
        </span>
        <span className={`text-[8px] sm:text-[9px] font-medium tracking-wide leading-tight truncate w-full text-center ${isActive ? "text-primary" : "text-muted-foreground"}`}>
          {item.label}
        </span>
      </Link>
    )
  })
  BottomNavItem.displayName = "BottomNavItem"

  return (
    <>
      <CrisisAlertBanner />
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 supports-[backdrop-filter]:bg-background/80 shadow-sm min-w-0">
        <div className="w-full mx-auto flex h-14 sm:h-16 lg:h-[72px] items-center justify-between gap-2 sm:gap-3 px-3 sm:px-6 md:px-8 lg:px-10 max-w-[100vw] xl:max-w-[1400px] 2xl:max-w-[1600px] min-w-0">
          <Link href="/" className="flex items-center min-w-0 shrink-0" aria-label="TrueRate Liberia home">
            <div className="flex h-11 w-[124px] min-[360px]:h-12 min-[360px]:w-[136px] sm:h-11 sm:w-[132px] md:h-12 md:w-[150px] lg:h-14 lg:w-[170px] items-center justify-center overflow-hidden">
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

          <nav className="hidden lg:flex flex-col items-start gap-1.5 max-w-[60vw] xl:max-w-none min-w-0" aria-label="Primary">
            <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-muted/30 border border-border/40 overflow-x-auto">
              {navigationItems.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </div>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            {user ? (
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="hidden md:flex" aria-label="Open dashboard">
                  <Avatar className="h-8 w-8 text-primary">
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
                  className="hidden md:flex rounded-full px-4 border-primary/30 text-primary hover:bg-primary/10 min-h-[44px]"
                >
                  Sign In
                </Button>
              </Link>
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden min-h-[44px] min-w-[44px]" aria-label="Open menu">
                  <Menu className="h-5 w-5 text-muted-foreground" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="flex flex-col p-0 w-[min(100vw-1rem,320px)] sm:max-w-[320px] border-l border-border/60"
              >
                <SheetHeader className="border-b border-border/60 pl-4 pr-14 py-4 text-left space-y-0">
                  <SheetTitle className="text-base sm:text-lg font-semibold">Start Here</SheetTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Pick what you need right now</p>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 space-y-2">
                  <div className="rounded-xl border border-border/50 bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
                    Current page: <span className="font-semibold text-foreground">{currentPageLabel}</span>
                  </div>
                  {user && (
                    <div className="rounded-xl border border-border/50 bg-muted/30 px-3 py-3 flex items-center gap-3 mb-2">
                      <Avatar className="h-10 w-10 shrink-0 text-primary">
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-foreground truncate">{user.name ?? "Account"}</div>
                        <Link href="/dashboard" className="text-xs text-primary font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">Go to dashboard →</Link>
                      </div>
                    </div>
                  )}
                  <nav className="flex flex-col gap-2" aria-label="Quick access">
                    {mobileMenuItems.map((item) => (
                      <MobileMenuItem key={item.href} item={item} />
                    ))}
                    <Link
                      href="/report-fraud"
                      className="w-full rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-3 transition-colors duration-200 flex items-center gap-3 hover:bg-destructive/10 hover:border-destructive/40 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/40 border border-border/40">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <div className="text-sm font-semibold text-destructive">Report Fraud</div>
                        <div className="text-xs text-muted-foreground">Help keep the community safe</div>
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
        className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-2 sm:px-4 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden pointer-events-none isolate [transform:translateZ(0)]"
        aria-label="Bottom navigation"
      >
        <div className="pointer-events-auto w-full max-w-[min(420px,calc(100vw-1rem))] min-w-0 rounded-xl border border-border/70 bg-background/98 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.1)]">
          <div className="grid grid-cols-4 gap-1 p-2 sm:p-2">
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
