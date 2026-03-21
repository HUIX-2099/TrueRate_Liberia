"use client"

import { useEffect, useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

type RateHistoryRow = {
  recorded_at: string
  rate: number
}

export default function TrfnDashboardPage() {
  const [currentRate, setCurrentRate] = useState<number | null>(null)
  const [history, setHistory] = useState<RateHistoryRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/rates")
      .then((r) => r.json())
      .then((data) => {
        setCurrentRate(data.current ?? null)
        setHistory(data.history?.reverse() || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <div className="bg-zinc-900 border-b border-zinc-700 px-6 py-2 flex gap-8 text-sm overflow-x-auto">
        <span className="text-green-400">
          USD/LRD <strong>{currentRate?.toFixed(2) ?? "..."}</strong>
        </span>
        <span className="text-blue-400">
          EUR/LRD <strong>~{((currentRate ?? 0) * 1.08).toFixed(2)}</strong>
        </span>
        <span className="text-yellow-400">
          GBP/LRD <strong>~{((currentRate ?? 0) * 1.27).toFixed(2)}</strong>
        </span>
        <span className="text-purple-400">
          BTC/USD <strong>Live</strong>
        </span>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-zinc-900 border border-zinc-700 rounded-xl p-6">
          <h2 className="text-zinc-400 text-xs uppercase tracking-widest mb-1">
            USD / LRD Exchange Rate
          </h2>
          <div className="text-5xl font-bold text-green-400 mb-4">
            {loading ? "..." : currentRate?.toFixed(4)}
            <span className="text-lg text-zinc-500 ml-2">LRD</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={history}>
              <defs>
                <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="recorded_at"
                tick={{ fill: "#71717a", fontSize: 10 }}
                tickFormatter={(v) => new Date(v).toLocaleDateString()}
              />
              <YAxis tick={{ fill: "#71717a", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #3f3f46" }} />
              <Area
                type="monotone"
                dataKey="rate"
                stroke="#22c55e"
                fill="url(#rateGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-4">
          {[
            { label: "Liberia GDP", value: "$3.8B", change: "+2.1%", color: "text-green-400" },
            { label: "Inflation Rate", value: "7.8%", change: "-0.3%", color: "text-red-400" },
            { label: "CBL Rate", value: "25%", change: "0.0%", color: "text-yellow-400" },
            { label: "Oil Price (bbl)", value: "$82.4", change: "+1.2%", color: "text-blue-400" },
          ].map((item) => (
            <div key={item.label} className="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
              <p className="text-zinc-500 text-xs uppercase tracking-widest">{item.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{item.value}</p>
              <p className={`text-sm ${item.color}`}>{item.change}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
