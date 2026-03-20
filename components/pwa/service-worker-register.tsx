"use client"

import { useEffect } from "react"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

declare global {
  interface Window {
    __trueratePwaPrompt?: BeforeInstallPromptEvent | null
  }
}

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      window.__trueratePwaPrompt = event as BeforeInstallPromptEvent
      window.dispatchEvent(new Event("truerate:pwa-available"))
    }

    const handleAppInstalled = () => {
      window.__trueratePwaPrompt = null
      window.dispatchEvent(new Event("truerate:pwa-available"))
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    if (!("serviceWorker" in navigator)) return
    if (process.env.NODE_ENV !== "production") return

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
    return () => {
      window.clearTimeout(id)
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  return null
}
