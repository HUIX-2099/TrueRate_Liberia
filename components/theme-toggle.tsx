"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Moon, Sun, Monitor } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Always render the same structure (DropdownMenu + Trigger + Button) so server and client
  // produce identical HTML and avoid hydration mismatch. When !mounted, button is disabled.
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={!mounted}>
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-primary" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => { setTheme("light"); window.dispatchEvent(new Event("truerate-theme-change")); }}>
          <Sun className="mr-2 h-4 w-4 text-primary" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => { setTheme("dark"); window.dispatchEvent(new Event("truerate-theme-change")); }}>
          <Moon className="mr-2 h-4 w-4 text-primary" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => { setTheme("system"); window.dispatchEvent(new Event("truerate-theme-change")); }}>
          <Monitor className="mr-2 h-4 w-4 text-primary" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Simple toggle button version (same DOM on server and client to avoid hydration mismatch)
export function ThemeToggleSimple() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    if (!mounted) return
    setTheme(theme === "dark" ? "light" : "dark")
    window.dispatchEvent(new Event("truerate-theme-change"))
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} disabled={!mounted}>
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-primary" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}








