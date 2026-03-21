"use client"

import type { ChangeEvent } from "react"
import { useState } from "react"

const CATEGORIES = ["Food", "Fuel", "Transport", "Housing", "Medicine", "Electronics", "Other"]
const LOCATIONS = ["Monrovia", "Buchanan", "Gbarnga", "Kakata", "Harbel", "Zwedru", "Other"]

export default function SubmitPricePage() {
  const [form, setForm] = useState({
    item_name: "",
    category: "Food",
    price_lrd: "",
    price_usd: "",
    market_location: "Monrovia",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.item_name || !form.price_lrd) {
      alert("Please fill in item name and LRD price at minimum.")
      return
    }
    setStatus("loading")
    const res = await fetch("/api/prices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price_lrd: parseFloat(form.price_lrd),
        price_usd: form.price_usd ? parseFloat(form.price_usd) : null,
      }),
    })
    setStatus(res.ok ? "success" : "error")
    if (res.ok) {
      setForm({ item_name: "", category: "Food", price_lrd: "", price_usd: "", market_location: "Monrovia" })
    }
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl p-8">
        <div className="mb-8">
          <p className="text-green-400 text-xs uppercase tracking-widest mb-1">TrueRate Liberia</p>
          <h1 className="text-2xl font-bold text-white">Submit Market Price</h1>
          <p className="text-zinc-500 text-sm mt-1">Help track real prices across Liberia&apos;s markets</p>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-zinc-400 text-xs uppercase tracking-widest mb-1 block">Item Name *</label>
            <input
              name="item_name"
              value={form.item_name}
              onChange={handleChange}
              placeholder="e.g. Rice (50kg bag)"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="text-zinc-400 text-xs uppercase tracking-widest mb-1 block">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-zinc-400 text-xs uppercase tracking-widest mb-1 block">Price (LRD) *</label>
              <input
                name="price_lrd"
                type="number"
                value={form.price_lrd}
                onChange={handleChange}
                placeholder="e.g. 4500"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="text-zinc-400 text-xs uppercase tracking-widest mb-1 block">Price (USD)</label>
              <input
                name="price_usd"
                type="number"
                value={form.price_usd}
                onChange={handleChange}
                placeholder="e.g. 25"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          <div>
            <label className="text-zinc-400 text-xs uppercase tracking-widest mb-1 block">Market Location</label>
            <select
              name="market_location"
              value={form.market_location}
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
            >
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={status === "loading"}
            className="w-full mt-2 bg-green-500 hover:bg-green-400 disabled:bg-zinc-700 text-black font-bold py-4 rounded-lg transition text-sm uppercase tracking-widest"
          >
            {status === "loading" ? "Submitting..." : "Submit Price"}
          </button>

          {status === "success" && (
            <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 text-green-400 text-sm text-center">
              Price submitted successfully! Thank you for contributing.
            </div>
          )}
          {status === "error" && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-400 text-sm text-center">
              Something went wrong. Please try again.
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <a href="/trfn-dashboard" className="text-zinc-500 text-xs hover:text-green-400 transition">
            ← Back to TRFN Dashboard
          </a>
          {" · "}
          <a href="/dashboard" className="text-zinc-500 text-xs hover:text-green-400 transition">
            Member dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
