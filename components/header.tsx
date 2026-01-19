"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Menu, Search, TrendingUp, Calculator, MapPin } from "lucide-react"
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
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="container mx-auto flex h-14 md:h-16 items-center justify-between px-4 gap-3">
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

          <form
            className="hidden lg:flex flex-1 max-w-xs items-center gap-2 ml-5"
            role="search"
            aria-label="Search rates or items"
            onSubmit={handleSearch}
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search rates or items..."
                className="pl-9 h-9 bg-background/80 text-sm"
                aria-label="Search rates or items"
              />
            </div>
          </form>

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
                <div className="mt-4 space-y-4">
                  <form role="search" aria-label="Search rates or items" onSubmit={handleSearch}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Search rates or items..."
                        className="pl-9 h-10"
                        aria-label="Search rates or items"
                      />
                    </div>
                  </form>
                  <LiveUpdateIndicator />
                  <nav className="flex flex-col items-start text-left gap-4 mt-2 pl-2.5">
                    <Link href="/" className="text-lg font-medium hover:text-primary transition-colors">
                      Home
                    </Link>
                    <Link href="/rates" className="text-lg font-medium hover:text-primary transition-colors">
                      Rates
                    </Link>
                    <Link href="/converter" className="text-lg font-medium hover:text-primary transition-colors">
                      Converter
                    </Link>
                    <Link href="/analytics" className="text-lg font-medium hover:text-primary transition-colors">
                      Analytics / Charts
                    </Link>
                    <Link href="/tools" className="text-lg font-medium hover:text-primary transition-colors">
                      Price Index
                    </Link>
                    <Link href="/map" className="text-lg font-medium hover:text-primary transition-colors">
                      Find Changers
                    </Link>
                    <Link href="/liberia-market" className="text-lg font-medium hover:text-primary transition-colors">
                      News
                    </Link>
                    <Link href="/community" className="text-lg font-medium hover:text-primary transition-colors">
                      Community
                    </Link>
                    <Link href="/auth/signin" className="text-lg font-medium hover:text-primary transition-colors">
                      Sign In
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
