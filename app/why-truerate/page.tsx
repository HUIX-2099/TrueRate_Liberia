"use client"

import { motion } from "framer-motion"
import { CheckCircle, TrendingUp, Users, Shield, Zap, Globe } from "lucide-react"
import Link from "next/link"

export default function WhyTrueRate() {
  const features = [
    {
      icon: CheckCircle,
      title: "100% Real Data",
      description:
        "Unlike ChatGPT (which hallucinates), TrueRate uses live APIs from Central Bank of Liberia, Wise, and ExchangeRate.host.",
      why: "ChatGPT has no real-time data. Google shows multiple sources but no verification.",
    },
    {
      icon: Users,
      title: "Community Verified",
      description: "Money changers and traders submit street rates with photo proof. Community moderates for accuracy.",
      why: "ChatGPT is generic. TrueRate is crowdsourced truth from Monrovia's markets.",
    },
    {
      icon: TrendingUp,
      title: "AI Predictions + Market Analysis",
      description:
        "3 independent algorithms predict rates + analyze inflation, CBL policy, USD liquidity in real-time.",
      why: "ChatGPT guesses. TrueRate uses volatility modeling and technical analysis.",
    },
    {
      icon: Shield,
      title: "Trust & Accountability",
      description: "Rate changers get verified badges. Fraud alerts. User ratings. Full transparency on data sources.",
      why: "Google shows ads. ChatGPT shows nothing reliable. TrueRate shows verified sources + credentials.",
    },
    {
      icon: Zap,
      title: "Instant OS Notifications",
      description: "Get rate change alerts on PC, mobile, smartwatch. Haptic feedback. Never miss a profitable moment.",
      why: "ChatGPT won't notify you. Google Search requires manual checking.",
    },
    {
      icon: Globe,
      title: "Offline + Multilingual",
      description:
        "Works offline with last-known rates (PWA). Supports Krio, Bassa, Pella, Loma, Krahn. SMS alerts for non-smartphone users.",
      why: "ChatGPT needs internet always. Google doesn't have Liberian languages.",
    },
  ]

  const differentiators = [
    {
      category: "Data Quality",
      truerate: "Live APIs + Crowdsourced + Verified",
      chatgpt: "Training data cutoff (stale)",
      google: "Aggregated (no Liberia-specific rates)",
    },
    {
      category: "Real-time Updates",
      truerate: "Every 15-30 seconds",
      chatgpt: "No real-time data",
      google: "Depends on source",
    },
    {
      category: "Predictions",
      truerate: "3 algorithms + volatility modeling",
      chatgpt: "Guesses based on patterns",
      google: "None",
    },
    {
      category: "Trust/Verification",
      truerate: "Badges, reviews, fraud alerts",
      chatgpt: "No accountability",
      google: "Unknown sources",
    },
    {
      category: "Liberian Languages",
      truerate: "Krio, Bassa, Pella, Loma, Krahn",
      chatgpt: "Not optimized for Liberian",
      google: "Not supported",
    },
    {
      category: "Offline Access",
      truerate: "PWA + SMS alerts",
      chatgpt: "Always online",
      google: "Usually online",
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl sm:text-6xl font-black mb-4">Why TrueRate?</h1>
          <p className="text-lg sm:text-xl text-foreground/70 max-w-3xl mx-auto">
            Better than ChatGPT. More reliable than Google. Built for Liberians. By Liberians.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="border border-foreground/10 rounded-lg p-6 bg-card hover:border-foreground/20 transition"
            >
              <feature.icon className="w-8 h-8 mb-4 text-orange-500" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-foreground/70 mb-4">{feature.description}</p>
              <p className="text-sm font-mono text-orange-500 bg-orange-500/10 p-2 rounded">
                <strong>vs ChatGPT/Google:</strong> {feature.why}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Head-to-Head Comparison</h2>
          <div className="overflow-x-auto border border-foreground/10 rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-foreground/10 bg-foreground/5">
                  <th className="px-6 py-3 text-left font-bold">Feature</th>
                  <th className="px-6 py-3 text-left font-bold text-orange-500">TrueRate</th>
                  <th className="px-6 py-3 text-left font-bold">ChatGPT</th>
                  <th className="px-6 py-3 text-left font-bold">Google Search</th>
                </tr>
              </thead>
              <tbody>
                {differentiators.map((row, i) => (
                  <tr key={i} className="border-b border-foreground/5 hover:bg-foreground/2 transition">
                    <td className="px-6 py-4 font-mono text-foreground/70">{row.category}</td>
                    <td className="px-6 py-4 text-green-400 font-bold">{row.truerate}</td>
                    <td className="px-6 py-4 text-red-400">{row.chatgpt}</td>
                    <td className="px-6 py-4 text-yellow-400">{row.google}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block border border-orange-500/30 rounded-lg p-8 bg-orange-500/5">
            <h3 className="text-2xl font-bold mb-4">Perfect for:</h3>
            <div className="grid sm:grid-cols-3 gap-4 mb-6 text-foreground/80">
              <div>Money Changers & Traders</div>
              <div>Banks & Fintech Partners</div>
              <div>Regular Liberians</div>
            </div>
            <Link
              href="/"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded font-bold transition"
            >
              Start Using TrueRate
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
