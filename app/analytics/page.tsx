"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AlertTriangle, CheckCircle } from "lucide-react"
import { analyzeUserBehavior, checkFraudRisk, type UserEvent, type FraudPattern } from "@/lib/analytics"

export default function AnalyticsPage() {
  const [events, setEvents] = useState<UserEvent[]>([])
  const [patterns, setPatterns] = useState<FraudPattern | null>(null)
  const [fraudRisk, setFraudRisk] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const analytics = JSON.parse(localStorage.getItem("userAnalytics") || "[]")
    const analyzed = analyzeUserBehavior(analytics)
    const isFraud = checkFraudRisk(analyzed)

    setEvents(analytics)
    setPatterns(analyzed)
    setFraudRisk(isFraud)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <p className="font-mono text-foreground/60">Loading analytics...</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <Navbar />
      <main className="flex flex-col">
        <section className="bg-background dark:bg-background py-8 sm:py-12 border-b border-foreground/10 dark:border-foreground/10">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <h1 className="text-5xl font-black text-foreground dark:text-foreground mb-2 tracking-tight">
              YOUR ACTIVITY
            </h1>
            <p className="text-xs font-mono text-foreground/60 dark:text-foreground/60 uppercase tracking-wider">
              User Behavior Analysis & Fraud Detection
            </p>
          </div>
        </section>

        {/* Fraud Risk Alert */}
        <section className="bg-background dark:bg-background py-8 sm:py-12 border-b border-foreground/10 dark:border-foreground/10">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div
              className={`border-2 p-6 rounded-lg transition-all ${fraudRisk ? "border-red-500/50 bg-red-500/10 dark:bg-red-950/20" : "border-green-500/50 bg-green-500/10 dark:bg-green-950/20"}`}
            >
              <div className="flex items-start gap-4">
                {fraudRisk ? (
                  <AlertTriangle className="w-6 h-6 text-red-500 dark:text-red-400 flex-shrink-0 mt-1" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-green-500 dark:text-green-400 flex-shrink-0 mt-1" />
                )}
                <div>
                  <h2 className="font-mono font-bold text-lg text-foreground dark:text-foreground mb-2">
                    {fraudRisk ? "SUSPICIOUS ACTIVITY DETECTED" : "ACTIVITY NORMAL"}
                  </h2>
                  <p
                    className={`text-sm font-mono ${fraudRisk ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
                  >
                    {fraudRisk
                      ? "We've detected unusual patterns in your account activity. Review details below."
                      : "Your account activity appears normal and secure."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Risk Factors */}
        {patterns && (
          <section className="bg-background dark:bg-background py-8 sm:py-12 border-b border-foreground/10 dark:border-foreground/10">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
              <h2 className="text-2xl font-black text-foreground dark:text-foreground mb-8 tracking-tight">
                RISK ANALYSIS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: "unusualAccessPattern", label: "Unusual Access Pattern" },
                  { key: "multipleDevicesShortTime", label: "Multiple Devices (Short Time)" },
                  { key: "impossibleLocationTravel", label: "Impossible Location Travel" },
                  { key: "unknownGeolocation", label: "Unknown Geolocation" },
                  { key: "abnormalActivityTime", label: "Abnormal Activity Time" },
                ].map(({ key, label }) => {
                  const risk = patterns[key as keyof FraudPattern]
                  return (
                    <div
                      key={key}
                      className={`border-l-4 pl-6 py-4 rounded transition-all ${
                        risk
                          ? "border-red-500/50 bg-red-500/10 dark:bg-red-950/20"
                          : "border-green-500/50 bg-green-500/10 dark:bg-green-950/20"
                      }`}
                    >
                      <p className="text-sm font-mono font-bold text-foreground dark:text-foreground mb-2">{label}</p>
                      <p
                        className={`text-xs font-mono ${risk ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
                      >
                        {risk ? "RISK DETECTED" : "NORMAL"}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Activity Log */}
        <section className="bg-background dark:bg-background py-8 sm:py-12 border-b border-foreground/10 dark:border-foreground/10">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <h2 className="text-2xl font-black text-foreground dark:text-foreground mb-8 tracking-tight">
              ACTIVITY LOG ({events.length})
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {events
                .slice()
                .reverse()
                .map((event, idx) => (
                  <div
                    key={idx}
                    className="border border-foreground/10 dark:border-foreground/10 p-4 text-xs font-mono rounded-lg bg-card dark:bg-card"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-bold text-foreground dark:text-foreground">{event.device}</span>
                      <span className="text-foreground/60 dark:text-foreground/60">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-foreground/70 dark:text-foreground/70">{event.page || "HOME"}</p>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
