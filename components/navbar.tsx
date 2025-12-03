"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { MapPin, Smartphone, Menu, X } from "lucide-react"
import { LanguageSelector } from "./language-selector"
import { ThemeToggle } from "./theme-toggle"
import { useTranslation } from "@/lib/i18n"

export function Navbar() {
  const [time, setTime] = useState<string>("")
  const [location, setLocation] = useState<string>("")
  const [device, setDevice] = useState<string>("")
  const [showLocation, setShowLocation] = useState(false)
  const [language, setLanguage] = useState("en")
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const t = useTranslation(language)

  useEffect(() => {
    setMounted(true)
    const handleLanguageChange = (event: Event) => {
      const customEvent = event as CustomEvent
      setLanguage(customEvent.detail.language)
    }

    window.addEventListener("languageChange", handleLanguageChange)

    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)

    const ua = navigator.userAgent
    if (/Mobile|Android|iPhone/.test(ua)) {
      setDevice("MOBILE")
    } else if (/Tablet|iPad/.test(ua)) {
      setDevice("TABLET")
    } else {
      setDevice("DESKTOP")
    }

    const savedLocation = localStorage.getItem("userLocation")
    if (savedLocation) {
      setLocation(savedLocation)
    }

    trackUserBehavior()

    return () => {
      clearInterval(interval)
      window.removeEventListener("languageChange", handleLanguageChange)
    }
  }, [])

  const trackUserBehavior = () => {
    const analytics = {
      timestamp: new Date().toISOString(),
      device,
      page: typeof window !== "undefined" ? window.location.pathname : "",
      userAgent: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
    }

    const events = JSON.parse(localStorage.getItem("userAnalytics") || "[]")
    events.push(analytics)
    if (events.length > 100) events.shift()
    localStorage.setItem("userAnalytics", JSON.stringify(events))
  }

  const toggleLocation = () => {
    if (!showLocation && !location) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords
          const locString = `${latitude.toFixed(2)},${longitude.toFixed(2)}`
          setLocation(locString)
          localStorage.setItem("userLocation", locString)
          setShowLocation(true)
        })
      }
    } else {
      setShowLocation(!showLocation)
    }
  }

  if (!mounted) return null

  return (
    <>
      <nav className="bg-background border-b border-black/10 dark:border-white/10 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="text-lg sm:text-xl font-black tracking-tight text-black dark:text-white hover:text-black/80 dark:hover:text-white/80 whitespace-nowrap transition-colors"
            >
              TRUERATE
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <span className="text-xs font-mono text-white/70 dark:text-white">{t.nav.liberia}</span>
              <Link
                href="/"
                className="text-xs font-mono text-white/70 dark:text-white hover:text-white dark:hover:text-white transition"
              >
                {t.nav.rates}
              </Link>
              <Link
                href="/predict"
                className="text-xs font-mono text-white/70 dark:text-white hover:text-white dark:hover:text-white transition"
              >
                {t.nav.predict}
              </Link>
              <Link
                href="/convert"
                className="text-xs font-mono text-white/70 dark:text-white hover:text-white dark:hover:text-white transition"
              >
                {t.nav.convert}
              </Link>
              <Link
                href="/map"
                className="text-xs font-mono text-white/70 dark:text-white hover:text-white dark:hover:text-white transition"
              >
                {t.nav.map}
              </Link>
              <Link
                href="/status"
                className="text-xs font-mono text-white/70 dark:text-white hover:text-white dark:hover:text-white transition"
              >
                {t.nav.status || "STATUS"}
              </Link>
              <Link
                href="/why-truerate"
                className="text-xs font-mono text-white/70 dark:text-white hover:text-white dark:hover:text-white transition"
              >
                Why Us
              </Link>
              <Link
                href="/leaderboard"
                className="text-xs font-mono text-white/70 dark:text-white hover:text-white dark:hover:text-white transition"
              >
                Leaderboard
              </Link>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Desktop Time and Device - Hidden on mobile */}
              <div className="hidden sm:flex items-center gap-4">
                <div className="text-xs font-mono text-white/70 dark:text-white border-l border-black/20 dark:border-white/20 pl-4">
                  {time}
                </div>
                <button
                  onClick={toggleLocation}
                  className="text-xs font-mono text-white/70 dark:text-white hover:text-white dark:hover:text-white transition flex items-center gap-1"
                  title="Toggle location"
                >
                  <MapPin className="w-3 h-3" />
                </button>
                <div className="text-xs font-mono text-white/70 dark:text-white flex items-center gap-1">
                  <Smartphone className="w-3 h-3" />
                  <span className="hidden lg:inline">{device}</span>
                </div>
              </div>

              {/* Language Selector */}
              <div className="hidden sm:block">
                <LanguageSelector onLanguageChange={(lang) => setLanguage(lang)} />
              </div>

              {/* Theme Toggle Button */}
              <ThemeToggle />

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white/70 dark:text-white hover:text-white dark:hover:text-white"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t border-black/10 dark:border-white/10 mt-4 pt-4 space-y-3">
              <Link
                href="/"
                className="block text-xs font-mono text-white/70 dark:text-white hover:text-white dark:hover:text-white transition py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.rates}
              </Link>
              <Link
                href="/predict"
                className="block text-xs font-mono text-white/70 dark:text-white hover:text-white dark:hover:text-white transition py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.predict}
              </Link>
              <Link
                href="/convert"
                className="block text-xs font-mono text-white/70 dark:text-white hover:text-white dark:hover:text-white transition py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.convert}
              </Link>
              <Link
                href="/map"
                className="block text-xs font-mono text-white/70 dark:text-white hover:text-white dark:hover:text-white transition py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.map}
              </Link>
              <Link
                href="/status"
                className="block text-xs font-mono text-white/70 dark:text-white hover:text-white dark:hover:text-white transition py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.status || "STATUS"}
              </Link>
              <Link
                href="/why-truerate"
                className="block text-xs font-mono text-white/70 dark:text-white hover:text-white dark:hover:text-white transition py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Why Us
              </Link>
              <Link
                href="/leaderboard"
                className="block text-xs font-mono text-white/70 dark:text-white hover:text-white dark:hover:text-white transition py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Leaderboard
              </Link>
              <div className="pt-3 border-t border-black/10 dark:border-white/10 space-y-3">
                <div className="text-xs font-mono text-white/70 dark:text-white">{time}</div>
                <button
                  onClick={toggleLocation}
                  className="text-xs font-mono text-white/70 dark:text-white hover:text-white dark:hover:text-white transition flex items-center gap-1 w-full py-2"
                >
                  <MapPin className="w-3 h-3" />
                  <span>{showLocation ? "Hide" : "Show"} Location</span>
                </button>
                <div className="text-xs font-mono text-white/70 dark:text-white">Device: {device}</div>
                <div className="pt-2 border-t border-black/10 dark:border-white/10">
                  <LanguageSelector
                    onLanguageChange={(lang) => {
                      setLanguage(lang)
                      setMobileMenuOpen(false)
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {showLocation && location && (
        <div className="border-b border-black/10 dark:border-white/10 bg-black/2 dark:bg-white/2 px-4 sm:px-6 lg:px-8 py-2 text-xs font-mono text-white/70 dark:text-white overflow-x-auto">
          Location: {location}
        </div>
      )}
    </>
  )
}
