"use client"

import { useEffect, useRef, useState } from "react"
import { useLiveRate } from "@/lib/live-rate-context"

const NOTIFICATION_CLIENT_ID_KEY = "truerate-notification-client-id"
const ALERT_COOLDOWN_MS = 5 * 60 * 1000 // 5 minutes between same-threshold alerts

function getOrCreateClientId(): string {
  if (typeof window === "undefined") return "anonymous"
  let id = localStorage.getItem(NOTIFICATION_CLIENT_ID_KEY)
  if (!id) {
    id = "c-" + Math.random().toString(36).slice(2) + "-" + Date.now().toString(36)
    localStorage.setItem(NOTIFICATION_CLIENT_ID_KEY, id)
  }
  return id
}

interface Prefs {
  rateAbove?: number | null
  rateBelow?: number | null
  moveUpPct?: number | null
  moveDownPct?: number | null
}

function showRateNotification(title: string, body: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return
  if (Notification.permission !== "granted") return
  try {
    new Notification(title, {
      body,
      icon: "/icons/Logo%206.png",
      tag: "truerate-rate-alert",
    })
  } catch {
    // ignore
  }
}

function getAlertKey(type: "above" | "below" | "moveUp" | "moveDown", value: number): string {
  return `truerate-alert-${type}-${value}`
}

function wasNotifiedRecently(key: string): boolean {
  if (typeof window === "undefined") return true
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return false
    const t = Number(raw)
    return Number.isFinite(t) && Date.now() - t < ALERT_COOLDOWN_MS
  } catch {
    return false
  }
}

function markNotified(key: string) {
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(key, Date.now().toString())
  } catch {
    // ignore
  }
}

function clearNotified(key: string) {
  if (typeof window === "undefined") return
  try {
    sessionStorage.removeItem(key)
  } catch {
    // ignore
  }
}

/**
 * Listens to live rate and shows a browser push notification when the rate
 * crosses user-configured thresholds (above, below, or moved by X%).
 * Only runs when Notification.permission is granted and prefs have at least one threshold.
 */
export function RateThresholdAlertListener() {
  const { rate } = useLiveRate()
  const [prefs, setPrefs] = useState<Prefs | null>(null)
  const prevRateRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window) || Notification.permission !== "granted") {
      return
    }

    let cancelled = false

    const fetchPrefs = async () => {
      const clientId = getOrCreateClientId()
      try {
        const res = await fetch("/api/notifications/preferences", {
          headers: { "x-notification-client-id": clientId },
        })
        const data = await res.json()
        if (cancelled || !res.ok) return
        const p = data.prefs as
          | {
              rate_above?: number | null
              rate_below?: number | null
              move_up_pct?: number | null
              move_down_pct?: number | null
            }
          | null
          | undefined
        setPrefs({
          rateAbove: p?.rate_above != null ? Number(p.rate_above) : null,
          rateBelow: p?.rate_below != null ? Number(p.rate_below) : null,
          moveUpPct: p?.move_up_pct != null ? Number(p.move_up_pct) : null,
          moveDownPct: p?.move_down_pct != null ? Number(p.move_down_pct) : null,
        })
      } catch {
        // ignore
      }
    }

    fetchPrefs()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window) || Notification.permission !== "granted") {
      return
    }

    if (!prefs) return

    const hasThreshold =
      (prefs.rateAbove != null && prefs.rateAbove > 0) ||
      (prefs.rateBelow != null && prefs.rateBelow > 0) ||
      (prefs.moveUpPct != null && prefs.moveUpPct > 0) ||
      (prefs.moveDownPct != null && prefs.moveDownPct > 0)
    if (!hasThreshold) return

    const prevRate = prevRateRef.current
    const isFirstRate = prevRate === null

    // Rate went above threshold
    if (prefs.rateAbove != null && prefs.rateAbove > 0 && rate >= prefs.rateAbove) {
      const key = getAlertKey("above", prefs.rateAbove)
      if (!wasNotifiedRecently(key)) {
        showRateNotification(
          "TrueRate – Rate alert",
          `USD/LRD rate is now ${rate.toFixed(2)} LRD (at or above your target ${prefs.rateAbove}).`
        )
        markNotified(key)
      }
    } else if (prefs.rateAbove != null && prefs.rateAbove > 0 && rate < prefs.rateAbove) {
      clearNotified(getAlertKey("above", prefs.rateAbove))
    }

    // Rate went below threshold
    if (prefs.rateBelow != null && prefs.rateBelow > 0 && rate <= prefs.rateBelow) {
      const key = getAlertKey("below", prefs.rateBelow)
      if (!wasNotifiedRecently(key)) {
        showRateNotification(
          "TrueRate – Rate alert",
          `USD/LRD rate is now ${rate.toFixed(2)} LRD (at or below your target ${prefs.rateBelow}).`
        )
        markNotified(key)
      }
    } else if (prefs.rateBelow != null && prefs.rateBelow > 0 && rate > prefs.rateBelow) {
      clearNotified(getAlertKey("below", prefs.rateBelow))
    }

    // Rate moved up by X%
    if (!isFirstRate && prevRate != null && prevRate > 0 && prefs.moveUpPct != null && prefs.moveUpPct > 0) {
      const pct = ((rate - prevRate) / prevRate) * 100
      if (pct >= prefs.moveUpPct) {
        const key = getAlertKey("moveUp", prefs.moveUpPct)
        if (!wasNotifiedRecently(key)) {
          showRateNotification(
            "TrueRate – Rate up",
            `USD/LRD rate is up ${pct.toFixed(1)}% to ${rate.toFixed(2)} LRD (was ${prevRate.toFixed(2)}).`
          )
          markNotified(key)
        }
      }
    }

    // Rate moved down by X%
    if (!isFirstRate && prevRate != null && prevRate > 0 && prefs.moveDownPct != null && prefs.moveDownPct > 0) {
      const pct = ((prevRate - rate) / prevRate) * 100
      if (pct >= prefs.moveDownPct) {
        const key = getAlertKey("moveDown", prefs.moveDownPct)
        if (!wasNotifiedRecently(key)) {
          showRateNotification(
            "TrueRate – Rate down",
            `USD/LRD rate is down ${pct.toFixed(1)}% to ${rate.toFixed(2)} LRD (was ${prevRate.toFixed(2)}).`
          )
          markNotified(key)
        }
      }
    }

    prevRateRef.current = rate
  }, [rate, prefs])

  return null
}
