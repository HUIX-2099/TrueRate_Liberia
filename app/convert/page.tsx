"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArrowRightLeft } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

export default function ConvertPage() {
  const [usdAmount, setUsdAmount] = useState("100")
  const [lrdAmount, setLrdAmount] = useState("0")
  const [rate, setRate] = useState(0)
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState("en")
  const [mounted, setMounted] = useState(false)
  const t = useTranslation(language)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("userLanguage") || "en"
    setLanguage(saved)

    const handleLanguageChange = (event: Event) => {
      const customEvent = event as CustomEvent
      setLanguage(customEvent.detail.language)
    }

    window.addEventListener("languageChange", handleLanguageChange)

    const fetchRate = async () => {
      try {
        setLoading(true)
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD")
        const data = await response.json()
        if (data.rates && data.rates.LRD) {
          setRate(data.rates.LRD)
          const usd = Number.parseFloat(usdAmount) || 0
          setLrdAmount((usd * data.rates.LRD).toFixed(2))
        }
      } catch (error) {
        console.error("Error fetching rate:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchRate()

    return () => window.removeEventListener("languageChange", handleLanguageChange)
  }, [usdAmount])

  const handleUsdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUsdAmount(value)
    const usd = Number.parseFloat(value) || 0
    setLrdAmount((usd * rate).toFixed(2))
  }

  const handleLrdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLrdAmount(value)
    const lrd = Number.parseFloat(value) || 0
    setUsdAmount((lrd / rate).toFixed(2))
  }

  const swap = () => {
    const temp = usdAmount
    setUsdAmount(lrdAmount)
    setLrdAmount(temp)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <Navbar />
      <main className="flex flex-col">
        <section className="bg-background dark:bg-background py-8 sm:py-12 border-b border-foreground/10 dark:border-foreground/10">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <h1 className="text-5xl font-black text-foreground dark:text-foreground mb-2 tracking-tight">
              {t.convert.title}
            </h1>
            <p className="text-xs font-mono text-foreground/60 dark:text-foreground/60 uppercase tracking-wider">
              {t.convert.subtitle}
            </p>
          </div>
        </section>

        <section className="bg-background dark:bg-background py-12 sm:py-16 border-b border-foreground/10 dark:border-foreground/10">
          <div className="max-w-2xl mx-auto px-6 sm:px-8">
            <div className="space-y-8">
              {/* USD Input */}
              <div>
                <label className="block text-xs font-mono font-bold text-foreground/60 dark:text-foreground/60 uppercase tracking-wider mb-4">
                  {t.convert.usd}
                </label>
                <input
                  type="number"
                  value={usdAmount}
                  onChange={handleUsdChange}
                  className="w-full px-6 py-4 border-2 border-foreground/20 dark:border-foreground/20 font-mono text-4xl font-bold text-foreground dark:text-foreground bg-background dark:bg-card placeholder-foreground/30 dark:placeholder-foreground/30 focus:outline-none focus:border-accent rounded-lg transition-colors"
                  placeholder="0.00"
                />
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <button
                  onClick={swap}
                  className="p-3 border-2 border-accent bg-accent text-background dark:text-background hover:bg-accent/90 transition-colors rounded-lg"
                >
                  <ArrowRightLeft className="w-5 h-5" />
                </button>
              </div>

              {/* LRD Input */}
              <div>
                <label className="block text-xs font-mono font-bold text-foreground/60 dark:text-foreground/60 uppercase tracking-wider mb-4">
                  {t.convert.lrd}
                </label>
                <input
                  type="number"
                  value={lrdAmount}
                  onChange={handleLrdChange}
                  className="w-full px-6 py-4 border-2 border-foreground/20 dark:border-foreground/20 font-mono text-4xl font-bold text-foreground dark:text-foreground bg-background dark:bg-card placeholder-foreground/30 dark:placeholder-foreground/30 focus:outline-none focus:border-accent rounded-lg transition-colors"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Exchange Rate Info */}
            <div className="mt-12 border-t-2 border-foreground/10 dark:border-foreground/10 pt-8">
              <div className="border-l-4 border-accent pl-6">
                <p className="text-xs font-mono font-bold text-foreground/60 dark:text-foreground/60 uppercase tracking-wider mb-2">
                  {t.convert.currentRate}
                </p>
                <p className="text-3xl font-black text-foreground dark:text-foreground mb-4">
                  {loading ? "Loading..." : `1 USD = ${rate.toFixed(4)} LRD`}
                </p>
                <p className="text-xs font-mono text-foreground/60 dark:text-foreground/60">
                  {t.home.lastUpdated}: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
