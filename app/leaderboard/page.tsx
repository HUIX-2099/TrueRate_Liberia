"use client"

import { motion } from "framer-motion"
import { Trophy, Star, TrendingUp, Award } from "lucide-react"
import { useEffect, useState } from "react"

interface LeaderboardEntry {
  rank: number
  username: string
  points: number
  level: string
  submissions: number
  accuracy: number
  trustScore: number
  badges: string[]
}

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([])
  const [timeframe, setTimeframe] = useState<"week" | "month" | "all">("month")

  useEffect(() => {
    // Mock data - in production, fetch from backend
    const mockLeaders: LeaderboardEntry[] = [
      {
        rank: 1,
        username: "MMA_Trader_24",
        points: 2850,
        level: "Platinum",
        submissions: 45,
        accuracy: 97.8,
        trustScore: 98.5,
        badges: ["Rate Guru", "Master Predictor", "Frequent Observer"],
      },
      {
        rank: 2,
        username: "JennyConey_Monrovia",
        points: 2340,
        level: "Gold",
        submissions: 38,
        accuracy: 96.2,
        trustScore: 95.8,
        badges: ["Accurate Reporter", "Contributor"],
      },
      {
        rank: 3,
        username: "FX_Analyst_LR",
        points: 2100,
        level: "Gold",
        submissions: 32,
        accuracy: 94.5,
        trustScore: 93.2,
        badges: ["Contributor"],
      },
      {
        rank: 4,
        username: "CashFlow_Sanda",
        points: 1950,
        level: "Silver",
        submissions: 28,
        accuracy: 93.1,
        trustScore: 91.5,
        badges: [],
      },
      {
        rank: 5,
        username: "RateWatcher_LIB",
        points: 1750,
        level: "Silver",
        submissions: 25,
        accuracy: 91.8,
        trustScore: 89.2,
        badges: [],
      },
    ]
    setLeaders(mockLeaders)
  }, [timeframe])

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-orange-500" />
            <h1 className="text-4xl sm:text-5xl font-black">Rate Guru Leaderboard</h1>
          </div>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Top community rate reporters. Rewarded with points, badges, and airtime. Submit accurate rates and climb the
            ranks!
          </p>
        </motion.div>

        {/* Timeframe Toggle */}
        <div className="flex justify-center gap-3 mb-12">
          {(["week", "month", "all"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-6 py-2 rounded font-bold transition ${
                timeframe === tf ? "bg-orange-500 text-white" : "border border-foreground/20 hover:border-foreground/40"
              }`}
            >
              {tf === "week" ? "This Week" : tf === "month" ? "This Month" : "All Time"}
            </button>
          ))}
        </div>

        {/* Leaderboard */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-4">
          {leaders.map((leader, i) => (
            <motion.div
              key={leader.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`border rounded-lg p-6 ${
                i < 3
                  ? "border-orange-500/30 bg-orange-500/5"
                  : "border-foreground/10 bg-card hover:border-foreground/20"
              } transition`}
            >
              <div className="flex items-center gap-6">
                {/* Rank */}
                <div className="flex items-center justify-center w-12 h-12">
                  {i < 3 ? (
                    <div className="text-2xl font-black">{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</div>
                  ) : (
                    <span className="text-lg font-bold text-foreground/60">{leader.rank}</span>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">{leader.username}</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {leader.badges.map((badge) => (
                      <span
                        key={badge}
                        className="text-xs font-mono bg-orange-500/20 text-orange-400 px-2 py-1 rounded"
                      >
                        ⭐ {badge}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-6 text-sm text-foreground/70 flex-wrap">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {leader.submissions} submissions
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {leader.accuracy.toFixed(1)}% accuracy
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      {leader.trustScore.toFixed(0)} trust score
                    </span>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right">
                  <div className="text-3xl font-black text-orange-500 mb-1">{leader.points.toLocaleString()}</div>
                  <div className="text-xs font-mono text-foreground/60">{leader.level}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* How to Join */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 border border-orange-500/20 rounded-lg p-8 bg-orange-500/5"
        >
          <h2 className="text-2xl font-bold mb-4">How to Join the Leaderboard</h2>
          <ol className="space-y-3 text-foreground/80">
            <li>
              <strong>1. Report a Rate:</strong> Submit the USD↔LRD rate you observed (with photo proof if possible)
            </li>
            <li>
              <strong>2. Earn Points:</strong> 10 points per submission + 5× accuracy multiplier + streak bonuses
            </li>
            <li>
              <strong>3. Get Badges:</strong> "Contributor", "Accurate Reporter", "Rate Guru", "Master Predictor"
            </li>
            <li>
              <strong>4. Claim Rewards:</strong> Top 10 ranked users get monthly airtime bonuses + recognition
            </li>
          </ol>
        </motion.div>
      </div>
    </div>
  )
}
