"use client"

import { Navbar } from "@/components/navbar"
import { RateDisplay } from "@/components/rate-display"
import { RateChart } from "@/components/rate-chart"
import { SourceDocumentation } from "@/components/source-documentation"
import { MarketAnalysis } from "@/components/market-analysis"
import { Footer } from "@/components/footer"
import { HeroDeviceMonitor } from "@/components/hero-device-monitor"
import { motion } from "framer-motion"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-background dark:bg-background transition-colors duration-300">
      <Navbar />
      <main className="flex flex-col">
        <section className="bg-background dark:bg-background py-12 md:py-20 lg:py-28 border-b border-foreground/10 dark:border-foreground/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12 md:mb-16"
            >
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-foreground dark:text-white tracking-tighter mb-4 leading-tight">
                Live Exchange <br className="hidden sm:block" /> Rate Monitor
              </h1>
              <p className="text-sm sm:text-base font-mono text-foreground/60 dark:text-white/70 uppercase tracking-widest max-w-2xl">
                Real-time USD to LRD conversion powered by AI predictions
              </p>
            </motion.div>

            {/* Device Monitor Hero Component */}
            <HeroDeviceMonitor />
          </div>
        </section>

        <section className="bg-background dark:bg-background py-16 md:py-24 border-b border-foreground/10 dark:border-foreground/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-black text-foreground dark:text-white mb-12 text-center">
              Powerful Features
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Predict */}
              <Link href="/predict">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-black/5 dark:bg-white/5 border border-foreground/10 dark:border-white/10 rounded-lg p-6 cursor-pointer hover:border-orange-500 dark:hover:border-orange-400 transition"
                >
                  <h3 className="text-lg font-bold text-foreground dark:text-white mb-2">Rate Prediction</h3>
                  <p className="text-sm text-foreground/60 dark:text-white/70">
                    AI-powered forecasts 30 days ahead with confidence scoring
                  </p>
                </motion.div>
              </Link>

              {/* Convert */}
              <Link href="/convert">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-black/5 dark:bg-white/5 border border-foreground/10 dark:border-white/10 rounded-lg p-6 cursor-pointer hover:border-orange-500 dark:hover:border-orange-400 transition"
                >
                  <h3 className="text-lg font-bold text-foreground dark:text-white mb-2">Converter</h3>
                  <p className="text-sm text-foreground/60 dark:text-white/70">
                    Real-time currency conversion with live rates
                  </p>
                </motion.div>
              </Link>

              {/* Map */}
              <Link href="/map">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-black/5 dark:bg-white/5 border border-foreground/10 dark:border-white/10 rounded-lg p-6 cursor-pointer hover:border-orange-500 dark:hover:border-orange-400 transition"
                >
                  <h3 className="text-lg font-bold text-foreground dark:text-white mb-2">Exchange Map</h3>
                  <p className="text-sm text-foreground/60 dark:text-white/70">
                    Find money changers near you with live rates
                  </p>
                </motion.div>
              </Link>

              {/* Leaderboard */}
              <Link href="/leaderboard">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-black/5 dark:bg-white/5 border border-foreground/10 dark:border-white/10 rounded-lg p-6 cursor-pointer hover:border-orange-500 dark:hover:border-orange-400 transition"
                >
                  <h3 className="text-lg font-bold text-foreground dark:text-white mb-2">Leaderboard</h3>
                  <p className="text-sm text-foreground/60 dark:text-white/70">See top rate gurus and earn rewards</p>
                </motion.div>
              </Link>
            </div>

            {/* CTA Button */}
            <div className="mt-12 text-center">
              <Link href="/why-truerate">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 text-white font-bold rounded-lg hover:shadow-lg transition"
                >
                  Why Choose TrueRate?
                </motion.button>
              </Link>
            </div>
          </div>
        </section>

        <RateDisplay />
        <RateChart />
        <SourceDocumentation />
        <MarketAnalysis />
      </main>
      <Footer />
    </div>
  )
}
