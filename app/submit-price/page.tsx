"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/layout/page-container"

const CATEGORIES = ["Food", "Fuel", "Transport", "Housing", "Medicine", "Electronics", "Other"]
const LOCATIONS = ["Monrovia", "Buchanan", "Gbarnga", "Kakata", "Harbel", "Zwedru", "Other"]

export default function SubmitPrice() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin?redirect=/submit")
    }
  }, [user, loading, router])

  const [form, setForm] = useState({
    item_name: "",
    category: "Food",
    price_lrd: "",
    price_usd: "",
    market_location: "Monrovia",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      setForm({
        item_name: "",
        category: "Food",
        price_lrd: "",
        price_usd: "",
        market_location: "Monrovia",
      })
    }
  }

  if (loading || !user) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Checking authentication...</p>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-background text-foreground pb-20 md:pb-0" role="main">
        <PageContainer maxWidth="2xl" className="py-10 md:py-16">
          <div className="mb-8">
            <p className="text-green-600 dark:text-green-400 text-xs uppercase tracking-widest mb-1">
              TrueRate Liberia
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Submit Market Price</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Help track real prices across Liberia&apos;s markets
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <div className="flex flex-col gap-5">
              <div>
                <label className="text-muted-foreground text-xs uppercase tracking-widest mb-1.5 block">
                  Item Name *
                </label>
                <input
                  name="item_name"
                  value={form.item_name}
                  onChange={handleChange}
                  placeholder="e.g. Rice (50kg bag)"
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="text-muted-foreground text-xs uppercase tracking-widest mb-1.5 block">
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
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
                  <label className="text-muted-foreground text-xs uppercase tracking-widest mb-1.5 block">
                    Price (LRD) *
                  </label>
                  <input
                    name="price_lrd"
                    type="number"
                    value={form.price_lrd}
                    onChange={handleChange}
                    placeholder="e.g. 4500"
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground text-xs uppercase tracking-widest mb-1.5 block">
                    Price (USD)
                  </label>
                  <input
                    name="price_usd"
                    type="number"
                    value={form.price_usd}
                    onChange={handleChange}
                    placeholder="e.g. 25"
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-muted-foreground text-xs uppercase tracking-widest mb-1.5 block">
                  Market Location
                </label>
                <select
                  name="market_location"
                  value={form.market_location}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
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
                className="w-full mt-2 bg-green-600 hover:bg-green-500 disabled:bg-muted text-white font-bold py-4 rounded-lg transition text-sm uppercase tracking-widest"
              >
                {status === "loading" ? "Submitting..." : "Submit Price"}
              </button>

              {status === "success" && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-green-700 dark:text-green-400 text-sm text-center">
                  ✅ Price submitted successfully! Thank you for contributing.
                </div>
              )}
              {status === "error" && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400 text-sm text-center">
                  ❌ Something went wrong. Please try again.
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <a
              href="/trfn-dashboard"
              className="text-muted-foreground text-xs hover:text-green-600 dark:hover:text-green-400 transition"
            >
              ← Back to Dashboard
            </a>
          </div>
        </PageContainer>
      </main>
      <Footer />
    </>
  )
}
