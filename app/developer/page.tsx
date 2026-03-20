"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect, useTransition } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { TIER_LIMITS } from "@/lib/api-keys/store"
import type { ApiTier } from "@/lib/api-keys/store"
import {
  Key, Plus, Trash2, Copy, Check, ExternalLink, Code2,
  Zap, Shield, Globe, BookOpen, ChevronDown, ChevronRight,
  Terminal, AlertTriangle
} from "lucide-react"

interface ApiKey {
  id: string
  keyPrefix: string
  name: string
  tier: ApiTier
  tierLabel: string
  rateLimit: number
  requestCount: number
  active: boolean
  createdAt: string
  lastUsedAt: string | null
}

const TIER_COLORS: Record<ApiTier, string> = {
  free:       "bg-muted/40 text-muted-foreground border-border/30",
  standard:   "bg-muted/40 border border-border/40 text-secondary border-secondary/20",
  premium:    "bg-muted/40 border border-border/40 text-primary border-primary/20",
  enterprise: "bg-muted/40 border border-border/40 text-amber-600 dark:text-amber-400 border-amber-500/20",
}

const CODE_EXAMPLES: Record<string, { lang: string; code: string }> = {
  "curl": {
    lang: "bash",
    code: `curl https://truerate.app/api/rates/live \\
  -H "Authorization: Bearer tr_live_your_key_here"`,
  },
  "javascript": {
    lang: "javascript",
    code: `const res = await fetch("https://truerate.app/api/rates/live", {
  headers: { Authorization: "Bearer tr_live_your_key_here" },
})
const { rate } = await res.json()
console.log(\`USD/LRD: \${rate}\`)`,
  },
  "python": {
    lang: "python",
    code: `import requests

resp = requests.get(
    "https://truerate.app/api/rates/live",
    headers={"Authorization": "Bearer tr_live_your_key_here"},
)
print(resp.json()["rate"])`,
  },
}

export default function DeveloperPortalPage() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyTier, setNewKeyTier] = useState<ApiTier>("free")
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [codeTab, setCodeTab] = useState<keyof typeof CODE_EXAMPLES>("curl")
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    fetch("/api/developer/keys")
      .then((r) => r.json())
      .then((d) => setKeys(d.keys ?? []))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = () => {
    if (!newKeyName.trim()) return
    startTransition(async () => {
      const res = await fetch("/api/developer/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName.trim(), tier: newKeyTier }),
      })
      const data = await res.json()
      if (data.key) {
        setCreatedKey(data.key)
        setKeys((prev) => [{ ...data, createdAt: data.createdAt, lastUsedAt: null }, ...prev])
        setShowCreate(false)
        setNewKeyName("")
        setNewKeyTier("free")
      }
    })
  }

  const handleRevoke = (id: string) => {
    startTransition(async () => {
      await fetch(`/api/developer/keys/${id}`, { method: "DELETE" })
      setKeys((prev) => prev.filter((k) => k.id !== id))
    })
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">

        {/* Hero */}
        <section className="relative py-16 sm:py-24 border-b border-border/30 md:border-border/40 md:bg-background">
          <div className="absolute inset-0 pointer-events-none opacity-70 md:hidden" aria-hidden />
          <div className="pointer-events-none absolute -top-24 left-0 w-full h-[500px] bg-[radial-gradient(ellipse_60%_40%_at_30%_50%,hsl(var(--primary)/0.08),transparent_70%)]" />
          <div className="container relative mx-auto max-w-5xl px-4 sm:px-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="rounded-lg bg-muted/40 border border-border/40 p-2">
                <Code2 className="h-5 w-5 text-primary" />
              </span>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Developer Portal</p>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground mb-4">
              TrueRate <span className="text-primary">Public API</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed mb-8">
              Embed live USD/LRD rates, market intelligence, and Liberian financial data into your apps.
              RESTful JSON, no SDKs required.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <a href="#keys"><Key className="h-4 w-4 mr-2 text-primary" />Get an API key</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/api/developer/openapi" target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2 text-primary" />OpenAPI spec
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Feature cards */}
        <section className="py-14 border-b border-border/40">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6">
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { icon: Zap, title: "Real-time rates", body: "Live USD/LRD from CBL + street market. Updated every 5 minutes.", color: "text-primary" },
                { icon: Shield, title: "Tiered access", body: "Free tier for basic rates. Upgrade for predictions, webhooks & analytics.", color: "text-secondary" },
                { icon: Globe, title: "Liberia-first data", body: "County-level investment, NLP news sentiment, and mobile money support.", color: "text-[hsl(var(--chart-4))]" },
              ].map(({ icon: Icon, title, body, color }) => (
                <div key={title} className="rounded-2xl border border-border/40 bg-card p-6 flex flex-col gap-3">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-muted/30", color)}>
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Code examples */}
        <section className="py-14 border-b border-border/40">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Quick start</p>
            <h2 className="text-2xl font-black text-foreground mb-8">Three lines to live rates</h2>
            <div className="rounded-2xl border border-border/40 bg-card shadow-sm">
              {/* Tab bar */}
              <div className="flex border-b border-border/40">
                {Object.keys(CODE_EXAMPLES).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setCodeTab(tab)}
                    className={cn(
                      "px-4 py-3 text-sm font-medium transition-colors capitalize",
                      codeTab === tab
                        ? "border-b-2 border-primary text-primary bg-primary/5"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              {/* Code block */}
              <div className="relative bg-muted/20">
                <pre className="p-6 text-sm font-mono text-foreground overflow-x-auto leading-relaxed whitespace-pre">
                  {CODE_EXAMPLES[codeTab].code}
                </pre>
                <button
                  onClick={() => handleCopy(CODE_EXAMPLES[codeTab].code)}
                  className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50 hover:bg-muted border border-border/40 transition-colors"
                  aria-label="Copy code"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" /> : <Copy className="h-3.5 w-3.5 text-primary" />}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Tier comparison */}
        <section className="py-14 border-b border-border/40">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Pricing</p>
            <h2 className="text-2xl font-black text-foreground mb-8">Tiers</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(Object.entries(TIER_LIMITS) as [ApiTier, typeof TIER_LIMITS[ApiTier]][]).map(([tier, info]) => (
                <div
                  key={tier}
                  className={cn(
                    "rounded-2xl border p-6 flex flex-col gap-3",
                    tier === "premium" ? "border-primary/30 bg-primary/5 shadow-md" : "border-border/40 bg-card"
                  )}
                >
                  <span className={cn("self-start rounded-lg border px-2 py-0.5 text-[10px] font-black uppercase tracking-widest", TIER_COLORS[tier])}>
                    {info.label}
                  </span>
                  <p className="text-3xl font-black tabular-nums text-foreground">{info.rpm.toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">req / min</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{info.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* API Key management */}
        <section id="keys" className="py-14 scroll-mt-20">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6">
            <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
              <div>
                <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">API keys</p>
                <h2 className="text-2xl font-black text-foreground">Your keys</h2>
              </div>
              <Button onClick={() => setShowCreate(true)} disabled={showCreate}>
                <Plus className="h-4 w-4 mr-2 text-primary" />
                New key
              </Button>
            </div>

            {/* One-time key display */}
            {createdKey && (
              <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 flex flex-col sm:flex-row sm:items-center gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground mb-1">Copy your key now — it won&apos;t be shown again.</p>
                  <code className="text-sm font-mono text-foreground break-all">{createdKey}</code>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleCopy(createdKey)} className="shrink-0">
                  {copied ? <Check className="h-4 w-4 mr-1 text-green-600 dark:text-green-400" /> : <Copy className="h-4 w-4 mr-1 text-primary" />}
                  Copy
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setCreatedKey(null)} className="shrink-0">
                  Dismiss
                </Button>
              </div>
            )}

            {/* Create form */}
            {showCreate && (
              <div className="mb-6 rounded-2xl border border-border/40 bg-card p-6">
                <h3 className="font-bold text-foreground mb-4">Create new API key</h3>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground mb-1.5 block uppercase tracking-widest">Key name</label>
                    <input
                      type="text"
                      placeholder="e.g. My dashboard"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      className="w-full rounded-xl border border-border/50 bg-muted/20 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground mb-1.5 block uppercase tracking-widest">Tier</label>
                    <select
                      value={newKeyTier}
                      onChange={(e) => setNewKeyTier(e.target.value as ApiTier)}
                      className="w-full rounded-xl border border-border/50 bg-muted/20 px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {Object.entries(TIER_LIMITS).map(([tier, info]) => (
                        <option key={tier} value={tier}>{info.label} — {info.rpm} req/min</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleCreate} disabled={!newKeyName.trim() || isPending}>
                    {isPending ? "Creating…" : "Create key"}
                  </Button>
                  <Button variant="ghost" onClick={() => { setShowCreate(false); setNewKeyName("") }}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Keys list */}
            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="rounded-2xl border border-border/30 bg-card/50 p-5 animate-pulse h-20" />
                ))}
              </div>
            ) : keys.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/40 bg-muted/5 p-10 text-center">
                <Key className="h-8 w-8 /30 mx-auto mb-3 text-primary" />
                <p className="text-sm text-muted-foreground">No API keys yet. Create one above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {keys.map((key) => (
                  <div key={key.id} className="rounded-2xl border border-border/30 bg-card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-bold text-foreground truncate">{key.name}</span>
                        <span className={cn("rounded-md border px-2 py-0.5 text-[10px] font-black uppercase tracking-widest", TIER_COLORS[key.tier])}>
                          {key.tierLabel}
                        </span>
                        {!key.active && (
                          <span className="rounded-md border border-destructive/30 bg-muted/40 border-border/40 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-destructive">
                            Revoked
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <code className="text-xs font-mono text-muted-foreground">{key.keyPrefix}…</code>
                        <span className="text-[10px] text-muted-foreground">{key.rateLimit} req/min</span>
                        <span className="text-[10px] text-muted-foreground">{key.requestCount.toLocaleString()} requests</span>
                        {key.lastUsedAt && (
                          <span className="text-[10px] text-muted-foreground">
                            Last used {new Date(key.lastUsedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    {key.active && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevoke(key.id)}
                        className="text-destructive hover:text-destructive hover:bg-muted/40 border border-border/40 shrink-0"
                      >
                        <Trash2 className="h-4 w-4 mr-1 text-primary" />
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Endpoint reference summary */}
        <section className="py-14 border-t border-border/40 bg-muted/5">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Reference</p>
            <h2 className="text-2xl font-black text-foreground mb-8">Endpoints</h2>
            <div className="overflow-x-auto rounded-2xl border border-border/40 bg-card shadow-sm">
              <table className="w-full text-sm" aria-label="API endpoint reference">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/10">
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Method</th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Endpoint</th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Description</th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Min tier</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { method: "GET", path: "/api/rates/live", desc: "Live USD/LRD rate", tier: "Free" },
                    { method: "GET", path: "/api/rates/history", desc: "Historical rates", tier: "Free" },
                    { method: "GET", path: "/api/rates/predictions", desc: "ML ensemble forecast", tier: "Standard" },
                    { method: "GET", path: "/api/liberia-market-news", desc: "News + sentiment", tier: "Free" },
                    { method: "GET", path: "/api/invest/opportunities", desc: "Investment opportunities", tier: "Free" },
                    { method: "GET", path: "/api/forums/threads", desc: "Community threads", tier: "Free" },
                    { method: "GET", path: "/api/developer/openapi", desc: "OpenAPI 3.1 spec", tier: "—" },
                  ].map((row) => (
                    <tr key={row.path} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                      <td className="p-4">
                        <span className="rounded-md bg-muted/40 border border-border/40 text-primary text-[10px] font-black px-2 py-1 uppercase">
                          {row.method}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-xs text-foreground">{row.path}</td>
                      <td className="p-4 text-muted-foreground">{row.desc}</td>
                      <td className="p-4 text-muted-foreground text-xs font-medium">{row.tier}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
