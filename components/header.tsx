"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Activity,
  Bell,
  Calculator,
  LogIn,
  MapPin,
  Menu,
  Newspaper,
  Search,
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
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

export function Header() {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()
    const query = searchTerm.trim()
    if (!query) return
    router.push(`/converter?q=${encodeURIComponent(query)}`)
  }

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
            <Link
              href="/rates"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Rates
            </Link>
            <Link
              href="/converter"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Converter
            </Link>
          <Link
            href="/map"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Nearby
          </Link>
            <Link
              href="/analytics"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Analytics
            </Link>
            <Link
              href="/predictions"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Predictions
            </Link>
            <Link
              href="/business"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Business
            </Link>
            <Link
              href="/forums"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Forums
            </Link>
            <Link
              href="/community"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Community
            </Link>
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
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
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
                <div className="mt-4 space-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">
                  <form role="search" aria-label="Search rates or items" onSubmit={handleSearch} className="flex justify-center">
                    <div className="relative w-full max-w-xs">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Search rates or items..."
                        className="pl-9 h-9 text-sm"
                        aria-label="Search rates or items"
                      />
                    </div>
                  </form>
                  <div className="flex justify-center">
                    <LiveUpdateIndicator />
                  </div>
                  <nav className="flex flex-col items-center text-center gap-3 mt-2">
                    <Link
                      href="/auth/signin"
                      className="w-full max-w-sm rounded-xl border border-border/60 px-3 py-2.5 sm:px-4 sm:py-3 transition-all hover:border-primary/40 hover:shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                          <LogIn className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm sm:text-base font-semibold text-foreground">Sign In</div>
                          <div className="text-[11px] sm:text-xs text-muted-foreground">Access your dashboard</div>
                        </div>
                      </div>
                    </Link>
                    <Link
                      href="/rates"
                      className="w-full max-w-sm rounded-xl border border-border/60 px-3 py-2.5 sm:px-4 sm:py-3 transition-all hover:border-primary/40 hover:shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                          <TrendingUp className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm sm:text-base font-semibold text-foreground">Rates</div>
                          <div className="text-[11px] sm:text-xs text-muted-foreground">Live USD/LRD updates</div>
                        </div>
                      </div>
                    </Link>
                    <Link
                      href="/converter"
                      className="w-full max-w-sm rounded-xl border border-border/60 px-3 py-2.5 sm:px-4 sm:py-3 transition-all hover:border-primary/40 hover:shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                          <Calculator className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm sm:text-base font-semibold text-foreground">Converter</div>
                          <div className="text-[11px] sm:text-xs text-muted-foreground">Convert USD ↔ LRD</div>
                        </div>
                      </div>
                    </Link>
                    <Link
                      href="/analytics"
                      className="w-full max-w-sm rounded-xl border border-border/60 px-3 py-2.5 sm:px-4 sm:py-3 transition-all hover:border-primary/40 hover:shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                          <Activity className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm sm:text-base font-semibold text-foreground">Analytics / Charts</div>
                          <div className="text-[11px] sm:text-xs text-muted-foreground">Trends and history</div>
                        </div>
                      </div>
                    </Link>
                    <Link
                      href="/price-index"
                      className="w-full max-w-sm rounded-xl border border-border/60 px-3 py-2.5 sm:px-4 sm:py-3 transition-all hover:border-primary/40 hover:shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                          <ShoppingCart className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm sm:text-base font-semibold text-foreground">Price Index</div>
                          <div className="text-[11px] sm:text-xs text-muted-foreground">Everyday cost tracking</div>
                        </div>
                      </div>
                    </Link>
                    <Link
                      href="/map"
                      className="w-full max-w-sm rounded-xl border border-border/60 px-3 py-2.5 sm:px-4 sm:py-3 transition-all hover:border-primary/40 hover:shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm sm:text-base font-semibold text-foreground">Find Changers</div>
                          <div className="text-[11px] sm:text-xs text-muted-foreground">Map of local rates</div>
                        </div>
                      </div>
                    </Link>
                    <Link
                      href="/liberia-market"
                      className="w-full max-w-sm rounded-xl border border-border/60 px-3 py-2.5 sm:px-4 sm:py-3 transition-all hover:border-primary/40 hover:shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                          <Newspaper className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm sm:text-base font-semibold text-foreground">News</div>
                          <div className="text-[11px] sm:text-xs text-muted-foreground">Liberia market updates</div>
                        </div>
                      </div>
                    </Link>
                    <Link
                      href="/community"
                      className="w-full max-w-sm rounded-xl border border-border/60 px-3 py-2.5 sm:px-4 sm:py-3 transition-all hover:border-primary/40 hover:shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm sm:text-base font-semibold text-foreground">Community</div>
                          <div className="text-[11px] sm:text-xs text-muted-foreground">Reports and reviews</div>
                        </div>
                      </div>
                    </Link>
                    <Link
                      href="/report-fraud"
                      className="w-full max-w-sm rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2.5 sm:px-4 sm:py-3 transition-all hover:bg-destructive/10 hover:shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
                          <Shield className="h-5 w-5 text-destructive" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm sm:text-base font-semibold text-destructive">Report Fraud</div>
                          <div className="text-[11px] sm:text-xs text-muted-foreground">Help keep the community safe</div>
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
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-background/90 backdrop-blur md:hidden"
        aria-label="Primary"
      >
        <div className="mx-auto grid grid-cols-4 gap-1 px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] text-[11px]">
          <Link
            href="/rates"
            aria-label="Rates"
            aria-current={pathname === "/rates" ? "page" : undefined}
            className={`flex flex-col items-center gap-1 rounded-md py-2 min-h-[44px] transition-colors ${
              pathname === "/rates" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <TrendingUp className="h-5 w-5" />
            Rates
          </Link>
          <Link
            href="/converter"
            aria-label="Converter"
            aria-current={pathname === "/converter" ? "page" : undefined}
            className={`flex flex-col items-center gap-1 rounded-md py-2 min-h-[44px] transition-colors ${
              pathname === "/converter" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calculator className="h-5 w-5" />
            Converter
          </Link>
          <Link
            href="/map"
            aria-label="Map"
            aria-current={pathname === "/map" ? "page" : undefined}
            className={`flex flex-col items-center gap-1 rounded-md py-2 min-h-[44px] transition-colors ${
              pathname === "/map" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MapPin className="h-5 w-5" />
            Map
          </Link>
          <Link
            href="/tools"
            aria-label="Alerts"
            aria-current={pathname === "/tools" ? "page" : undefined}
            className={`flex flex-col items-center gap-1 rounded-md py-2 min-h-[44px] transition-colors ${
              pathname === "/tools" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bell className="h-5 w-5" />
            Alerts
          </Link>
        </div>
      </nav>
    </>
  )
}
