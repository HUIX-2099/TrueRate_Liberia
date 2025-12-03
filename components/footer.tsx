"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <footer className="bg-gradient-to-b from-black/50 to-black dark:from-orange-950/30 dark:to-black border-t border-orange-500/30 dark:border-orange-500/40 py-16 sm:py-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12 pb-12 border-b border-orange-500/20 dark:border-orange-500/30">
          {/* Brand */}
          <div>
            <h4 className="text-lg font-black bg-gradient-to-r from-orange-400 to-orange-600 dark:from-orange-300 dark:to-orange-500 bg-clip-text text-transparent mb-4">
              TRUERATE
            </h4>
            <p className="text-sm text-white/80 dark:text-white/90 leading-relaxed">
              Real-time USD ↔ LRD exchange rates for Liberia's economy. 100% accurate. No lies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-orange-400 dark:text-orange-300 mb-4">
              Navigation
            </h5>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-white/80 dark:text-white/90 hover:text-orange-400 dark:hover:text-orange-300 transition"
                >
                  Current Rates
                </Link>
              </li>
              <li>
                <Link
                  href="/predict"
                  className="text-white/80 dark:text-white/90 hover:text-orange-400 dark:hover:text-orange-300 transition"
                >
                  Rate Prediction
                </Link>
              </li>
              <li>
                <Link
                  href="/convert"
                  className="text-white/80 dark:text-white/90 hover:text-orange-400 dark:hover:text-orange-300 transition"
                >
                  Converter
                </Link>
              </li>
              <li>
                <Link
                  href="/map"
                  className="text-white/80 dark:text-white/90 hover:text-orange-400 dark:hover:text-orange-300 transition"
                >
                  Exchange Map
                </Link>
              </li>
              <li>
                <Link
                  href="/status"
                  className="text-white/80 dark:text-white/90 hover:text-orange-400 dark:hover:text-orange-300 transition"
                >
                  System Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-orange-400 dark:text-orange-300 mb-4">
              Features
            </h5>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/why-truerate"
                  className="text-white/80 dark:text-white/90 hover:text-orange-400 dark:hover:text-orange-300 transition"
                >
                  Why TrueRate
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard"
                  className="text-white/80 dark:text-white/90 hover:text-orange-400 dark:hover:text-orange-300 transition"
                >
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  href="/#analytics"
                  className="text-white/80 dark:text-white/90 hover:text-orange-400 dark:hover:text-orange-300 transition"
                >
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Data Sources */}
          <div>
            <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-orange-400 dark:text-orange-300 mb-4">
              Sources
            </h5>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://exchangerate-api.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 dark:text-white/90 hover:text-orange-400 dark:hover:text-orange-300 transition"
                >
                  ExchangeRate API
                </a>
              </li>
              <li>
                <a
                  href="https://wise.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 dark:text-white/90 hover:text-orange-400 dark:hover:text-orange-300 transition"
                >
                  Wise
                </a>
              </li>
              <li>
                <a
                  href="https://cbl.org.lr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 dark:text-white/90 hover:text-orange-400 dark:hover:text-orange-300 transition"
                >
                  Central Bank of Liberia
                </a>
              </li>
            </ul>
          </div>

          {/* Status */}
          <div>
            <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-orange-400 dark:text-orange-300 mb-4">
              Status
            </h5>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 dark:bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-white/80 dark:text-white/90">APIs Active</span>
              </div>
              <p className="text-xs font-mono text-white/70 dark:text-white/80">Updates: 30s intervals</p>
              <p className="text-xs font-mono text-white/70 dark:text-white/80">Last updated: Live</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 text-sm">
          <p className="text-white/70 dark:text-white/80">© {currentYear} TrueRate Liberia. All rights reserved.</p>
          <p className="text-xs font-mono text-orange-400/80 dark:text-orange-300/80 uppercase tracking-wider">
            100% TRANSPARENT • NON-COMMERCIAL • REAL DATA • NO LIES
          </p>
        </div>
      </div>
    </footer>
  )
}
