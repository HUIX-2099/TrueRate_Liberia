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

type PriceRow = {
  id: string | number
  item_name: string
  price_lrd: number
  price_usd: number | null
}

type NewsArticle = {
  title: string
  url: string
  source?: { name?: string }
  publishedAt: string
}

type CryptoRow = Record<string, { usd?: number; usd_24h_change?: number }>

function normalizeNews(data: unknown): NewsArticle[] {
  if (Array.isArray(data)) {
    return (data as NewsArticle[]).map((n) => ({
      title: n.title ?? "Untitled",
      url: n.url ?? "#",
      source: typeof n.source === "object" && n.source ? n.source : { name: "News" },
      publishedAt: n.publishedAt ?? "",
    }))
  }
  if (
    data &&
    typeof data === "object" &&
    "items" in data &&
    Array.isArray((data as { items: unknown }).items)
  ) {
    const items = (data as {
      items: Array<{ title?: string; url?: string; source?: string; time?: string }>
    }).items
    return items.map((n) => ({
      title: n.title ?? "Untitled",
      url: n.url ?? "#",
      source: { name: typeof n.source === "string" ? n.source : "News" },
      publishedAt: n.time ?? "",
    }))
  }
  return []
}

export default function TrfnDashboardPage() {
  const [currentRate, setCurrentRate] = useState<number | null>(null)
  const [history, setHistory] = useState<RateHistoryRow[]>([])
  const [prices, setPrices] = useState<PriceRow[]>([])
  const [news, setNews] = useState<NewsArticle[]>([])
  const [crypto, setCrypto] = useState<CryptoRow | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/rates").then(async (r) => r.json()),
      fetch("/api/prices").then(async (r) => r.json()),
      fetch("/api/news").then(async (r) => normalizeNews(await r.json())),
      fetch("/api/crypto").then(async (r) => r.json()),
    ])
      .then(([rates, priceData, newsData, cryptoData]) => {
        setCurrentRate(rates.current ?? null)
        setHistory(rates.history?.reverse() || [])
        setPrices(Array.isArray(priceData) ? priceData : [])
        setNews(newsData)
        setCrypto(cryptoData)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <div className="bg-zinc-900 border-b border-zinc-700 px-6 py-2 flex gap-8 text-sm overflow-x-auto whitespace-nowrap">
        <span className="text-green-400">
          USD/LRD <strong>{currentRate?.toFixed(2) ?? "..."}</strong>
        </span>
        <span className="text-blue-400">
          EUR/LRD <strong>~{((currentRate ?? 0) * 1.08).toFixed(2)}</strong>
        </span>
        <span className="text-yellow-400">
          GBP/LRD <strong>~{((currentRate ?? 0) * 1.27).toFixed(2)}</strong>
        </span>
        <span className="text-orange-400">
          BTC <strong>${crypto?.bitcoin?.usd?.toLocaleString() ?? "..."}</strong>
        </span>
        <span className="text-purple-400">
          ETH <strong>${crypto?.ethereum?.usd?.toLocaleString() ?? "..."}</strong>
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

        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6">
          <h2 className="text-zinc-400 text-xs uppercase tracking-widest mb-4">Crypto Markets</h2>
          {[
            { id: "bitcoin", label: "Bitcoin", symbol: "BTC", color: "text-orange-400" },
            { id: "ethereum", label: "Ethereum", symbol: "ETH", color: "text-purple-400" },
            { id: "tether", label: "Tether", symbol: "USDT", color: "text-green-400" },
          ].map((coin) => (
            <div
              key={coin.id}
              className="flex justify-between items-center py-3 border-b border-zinc-800 last:border-0"
            >
              <div>
                <p className={`font-bold ${coin.color}`}>{coin.symbol}</p>
                <p className="text-zinc-500 text-xs">{coin.label}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">
                  ${crypto?.[coin.id]?.usd?.toLocaleString() ?? "..."}
                </p>
                <p
                  className={`text-xs ${(crypto?.[coin.id]?.usd_24h_change ?? 0) >= 0 ? "text-green-400" : "text-red-400"}`}
                >
                  {crypto?.[coin.id]?.usd_24h_change?.toFixed(2) ?? "0"}%
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6">
          <h2 className="text-zinc-400 text-xs uppercase tracking-widest mb-4">Liberia Price Index</h2>
          {prices.length === 0 ? (
            <p className="text-zinc-500 text-sm">No price data yet. Submit prices to populate.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-zinc-500 text-xs">
                  <th className="text-left pb-2">Item</th>
                  <th className="text-right pb-2">LRD</th>
                  <th className="text-right pb-2">USD</th>
                </tr>
              </thead>
              <tbody>
                {prices.slice(0, 6).map((p) => (
                  <tr key={String(p.id)} className="border-t border-zinc-800">
                    <td className="py-2 text-white">{p.item_name}</td>
                    <td className="py-2 text-right text-yellow-400">L${p.price_lrd}</td>
                    <td className="py-2 text-right text-green-400">
                      ${p.price_usd != null ? p.price_usd : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6">
          <h2 className="text-zinc-400 text-xs uppercase tracking-widest mb-4">Market News</h2>
          <div className="flex flex-col gap-4">
            {news.slice(0, 4).map((article, i) => (
              <a
                key={`${article.url}-${i}`}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-zinc-800 pb-3 last:border-0 hover:opacity-80 transition"
              >
                <p className="text-white text-sm font-semibold leading-snug line-clamp-2">
                  {article.title}
                </p>
                <p className="text-zinc-500 text-xs mt-1">
                  {article.source?.name} ·{" "}
                  {article.publishedAt
                    ? new Date(article.publishedAt).toLocaleDateString()
                    : "—"}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
