"use client"

import { useEffect } from "react"

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!("serviceWorker" in navigator)) return

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" })
        // Optionally listen for updates
        reg.onupdatefound = () => {
          const installing = reg.installing
          if (!installing) return
          installing.onstatechange = () => {
            // states: installing -> installed -> activating -> activated
          }
        }
      } catch (err) {
        // silent fail
      }
    }

    // Delay a bit so it doesn't block first paint
    const id = window.setTimeout(register, 1000)
    return () => window.clearTimeout(id)
  }, [])

  return null
}
