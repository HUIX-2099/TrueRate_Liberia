"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function DigestSubscribe() {
  const [email, setEmail] = useState("")
  const [frequency, setFrequency] = useState<"weekly" | "daily">("weekly")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes("@")) {
      setStatus("error")
      setMessage("Please enter a valid email.")
      return
    }
    setStatus("loading")
    setMessage("")
    try {
      const res = await fetch("/api/digest/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), frequency }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus("success")
        setMessage("You’re subscribed. We’ll send the next digest to " + email.trim() + ".")
      } else {
        setStatus("error")
        setMessage(data?.error ?? "Subscription failed.")
      }
    } catch {
      setStatus("error")
      setMessage("Something went wrong. Try again.")
    }
  }

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Mail className="h-4 w-4 text-primary" />
          SME & Business Digest
        </CardTitle>
        <CardDescription>
          Weekly or daily email: exchange rate, price index (this week vs last week), and market risk. One short summary.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === "success" ? (
          <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
            {message}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                className="flex-1"
                aria-label="Email for digest"
              />
              <Select value={frequency} onValueChange={(v: "weekly" | "daily") => setFrequency(v)} disabled={status === "loading"}>
                <SelectTrigger className="w-full sm:w-[120px]" aria-label="Digest frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={status === "loading"} className="w-full sm:w-auto">
              {status === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2 text-primary" />
                  Subscribing…
                </>
              ) : (
                "Subscribe"
              )}
            </Button>
            {status === "error" && message && (
              <p className="text-sm text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                {message}
              </p>
            )}
          </form>
        )}
      </CardContent>
    </Card>
  )
}
