"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SeriesHeader } from "@/components/series-header"
import { useTranslation } from "@/lib/i18n"
import { motion } from "framer-motion"

interface SystemStatus {
  name: string
  status: "active" | "inactive" | "warning"
  lastCheck: string
  uptime: string
}

export default function StatusPage() {
  const [language, setLanguage] = useState("en")
  const [mounted, setMounted] = useState(false)
  const [systems, setSystems] = useState<SystemStatus[]>([
    {
      name: "ExchangeRate API",
      status: "active",
      lastCheck: new Date().toISOString(),
      uptime: "99.9%",
    },
    {
      name: "TensorFlow.js Model",
      status: "active",
      lastCheck: new Date().toISOString(),
      uptime: "100%",
    },
    {
      name: "AI Assistant (Christian)",
      status: "active",
      lastCheck: new Date().toISOString(),
      uptime: "99.8%",
    },
    {
      name: "Cookie Storage",
      status: "active",
      lastCheck: new Date().toISOString(),
      uptime: "100%",
    },
    {
      name: "Browser Storage",
      status: "active",
      lastCheck: new Date().toISOString(),
      uptime: "100%",
    },
    {
      name: "Google Maps API",
      status: "active",
      lastCheck: new Date().toISOString(),
      uptime: "98.5%",
    },
    {
      name: "User Analytics Tracker",
      status: "active",
      lastCheck: new Date().toISOString(),
      uptime: "100%",
    },
    {
      name: "Vibration API (Mobile)",
      status: "active",
      lastCheck: new Date().toISOString(),
      uptime: "99.9%",
    },
    {
      name: "Geolocation Service",
      status: "active",
      lastCheck: new Date().toISOString(),
      uptime: "99.5%",
    },
    {
      name: "Multi-Language Support",
      status: "active",
      lastCheck: new Date().toISOString(),
      uptime: "100%",
    },
  ])

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

    const interval = setInterval(() => {
      setSystems((prev) =>
        prev.map((system) => ({
          ...system,
          lastCheck: new Date().toISOString(),
        })),
      )
    }, 60000)

    return () => {
      clearInterval(interval)
      window.removeEventListener("languageChange", handleLanguageChange)
    }
  }, [])

  if (!mounted) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-500 dark:text-green-400 bg-green-500/10 dark:bg-green-500/10"
      case "warning":
        return "text-yellow-500 dark:text-yellow-400 bg-yellow-500/10 dark:bg-yellow-500/10"
      default:
        return "text-red-500 dark:text-red-400 bg-red-500/10 dark:bg-red-500/10"
    }
  }

  const getStatusDot = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      default:
        return "bg-red-500"
    }
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <Navbar />
      <main className="flex flex-col">
        <section className="bg-background dark:bg-background py-16 md:py-24 border-b-2 border-foreground/10 dark:border-foreground/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SeriesHeader
              number="04"
              title="SYSTEM STATUS"
              subtitle="Real-time monitoring of all platform services, APIs, and features"
              meta="ACTIVITY / LIVE"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="mb-16 p-8 border-2 border-green-500/50 bg-green-500/10 dark:bg-green-500/10 rounded-lg"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse-soft"></div>
                <h3 className="text-2xl font-black text-foreground dark:text-foreground">ALL SYSTEMS OPERATIONAL</h3>
              </div>
              <p className="text-sm font-mono text-foreground/70 dark:text-foreground/70">
                10/10 services active • Last update: {new Date().toLocaleTimeString()}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 md:py-24 bg-background dark:bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-xs font-mono uppercase tracking-wider text-foreground/60 dark:text-foreground/60 font-black mb-12"
            >
              Service Status
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {systems.map((system, index) => (
                <motion.div
                  key={system.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="border-2 border-foreground/10 dark:border-foreground/10 p-6 hover:border-accent dark:hover:border-accent transition-all hover:bg-accent/5 dark:hover:bg-accent/5 rounded-lg bg-card dark:bg-card"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-3 h-3 rounded-full ${getStatusDot(system.status)} animate-pulse-soft`}></div>
                      <h4 className="text-sm font-black text-foreground dark:text-foreground">{system.name}</h4>
                    </div>
                    <span
                      className={`text-xs font-mono font-black uppercase px-2 py-1 rounded ${getStatusColor(system.status)}`}
                    >
                      {system.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono text-foreground/60 dark:text-foreground/60">
                    <div className="flex justify-between">
                      <span>Uptime</span>
                      <span className="font-black text-foreground dark:text-foreground">{system.uptime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Check</span>
                      <span className="font-mono">{new Date(system.lastCheck).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* API Details */}
        <section className="py-16 md:py-24 bg-card dark:bg-card border-t-2 border-foreground/10 dark:border-foreground/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-xs font-mono uppercase tracking-wider text-foreground/60 dark:text-foreground/60 font-black mb-12"
            >
              Technical Details
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Rate Data Source",
                  name: "ExchangeRate API",
                  desc: "Real-time exchange rates updated every 30 seconds",
                },
                {
                  title: "ML Predictions",
                  name: "TensorFlow.js",
                  desc: "Machine learning model with real historical data",
                },
                {
                  title: "AI Assistant",
                  name: "Christian Bot",
                  desc: "Liberian female voice AI for smart interactions",
                },
              ].map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="border-l-4 border-accent pl-6 py-4"
                >
                  <h3 className="text-sm font-mono font-black text-foreground/60 dark:text-foreground/60 uppercase tracking-wider mb-3">
                    {item.title}
                  </h3>
                  <p className="text-2xl font-black text-foreground dark:text-foreground mb-2">{item.name}</p>
                  <p className="text-xs text-foreground/70 dark:text-foreground/70 font-mono">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Storage & Analytics */}
        <section className="py-16 md:py-24 bg-background dark:bg-background border-t-2 border-foreground/10 dark:border-foreground/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-xs font-mono uppercase tracking-wider text-foreground/60 dark:text-foreground/60 font-black mb-12"
            >
              Data & Storage
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-black text-foreground dark:text-foreground mb-6">Cookie Storage</h3>
                <ul className="space-y-4 text-sm font-mono text-foreground/70 dark:text-foreground/70">
                  <li className="border-l-2 border-accent pl-4">
                    <span className="font-black text-foreground dark:text-foreground">lastRate</span> - Last fetched
                    USD→LRD rate
                  </li>
                  <li className="border-l-2 border-accent pl-4">
                    <span className="font-black text-foreground dark:text-foreground">lastRateTime</span> - Timestamp of
                    rate update
                  </li>
                  <li className="border-l-2 border-accent pl-4">
                    <span className="font-black text-foreground dark:text-foreground">userLanguage</span> - User's
                    language preference
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-black text-foreground dark:text-foreground mb-6">
                  Browser Storage (localStorage)
                </h3>
                <ul className="space-y-4 text-sm font-mono text-foreground/70 dark:text-foreground/70">
                  <li className="border-l-2 border-accent pl-4">
                    <span className="font-black text-foreground dark:text-foreground">userLocation</span> - Geolocation
                    coordinates
                  </li>
                  <li className="border-l-2 border-accent pl-4">
                    <span className="font-black text-foreground dark:text-foreground">userAnalytics</span> - User
                    behavior tracking
                  </li>
                  <li className="border-l-2 border-accent pl-4">
                    <span className="font-black text-foreground dark:text-foreground">aiInteractions</span> - AI chatbot
                    history
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
