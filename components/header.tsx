"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bell, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LiveUpdateIndicator } from "@/components/live-update-indicator"

export function Header() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">TR</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground leading-none">TrueRate  Liberia</span>
            <span className="text-[10px] text-muted-foreground leading-none">by HUIX-2099</span>
          </div>
        </Link>

        <div className="hidden lg:flex">
          <LiveUpdateIndicator />
        </div>

        <nav className="hidden md:flex items-center gap-6">
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
            href="/tools"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Tools
          </Link>
          <Link
            href="/voice"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Voice
          </Link>
          <Link
            href="/business"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Business
          </Link>
          <Link
            href="/docs"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Docs
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          {user ? (
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="hidden md:flex">
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
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <div className="mb-2">
                  <LiveUpdateIndicator />
                </div>
                <Link href="/converter" className="text-lg font-medium hover:text-primary transition-colors">
                  Converter
                </Link>
                <Link href="/analytics" className="text-lg font-medium hover:text-primary transition-colors">
                  Analytics
                </Link>
                <Link href="/predictions" className="text-lg font-medium hover:text-primary transition-colors">
                  Predictions
                </Link>
                <Link href="/tools" className="text-lg font-medium hover:text-primary transition-colors">
                  Tools
                </Link>
                <Link href="/voice" className="text-lg font-medium hover:text-primary transition-colors">
                  Voice Assistant
                </Link>
                <Link href="/business" className="text-lg font-medium hover:text-primary transition-colors">
                  Business
                </Link>
                <Link href="/map" className="text-lg font-medium hover:text-primary transition-colors">
                  Map
                </Link>
                <Link href="/docs" className="text-lg font-medium hover:text-primary transition-colors">
                  Data Sources
                </Link>
                <Link href="/community" className="text-lg font-medium hover:text-primary transition-colors">
                  Community
                </Link>
                {user ? (
                  <Link href="/dashboard">
                    <Button className="mt-4 w-full">Dashboard</Button>
                  </Link>
                ) : (
                  <Button className="mt-4">Get Started</Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
