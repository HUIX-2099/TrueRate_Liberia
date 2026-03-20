"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

declare global {
  interface Window {
    __trueratePwaPrompt?: BeforeInstallPromptEvent | null
  }
}

export function InstallPromptButton({ label = "Request App Access" }: { label?: string }) {
  const { toast } = useToast()
  const [available, setAvailable] = useState(false)

  useEffect(() => {
    const updateAvailability = () => {
      setAvailable(Boolean(window.__trueratePwaPrompt))
    }

    updateAvailability()
    window.addEventListener("truerate:pwa-available", updateAvailability)
    window.addEventListener("appinstalled", updateAvailability)
    return () => {
      window.removeEventListener("truerate:pwa-available", updateAvailability)
      window.removeEventListener("appinstalled", updateAvailability)
    }
  }, [])

  const handleClick = async () => {
    const promptEvent = window.__trueratePwaPrompt
    if (!promptEvent) {
      toast({
        title: "Install not available",
        description: "Use your browser menu (e.g. Add to Home Screen / Install app) when you see the option, or try again later.",
        variant: "default",
      })
      return
    }

    try {
      await promptEvent.prompt()
      const { outcome } = await promptEvent.userChoice
      window.__trueratePwaPrompt = null
      setAvailable(false)
      if (outcome === "accepted") {
        toast({
          title: "App installing",
          description: "TrueRate is being added to your device. Open it from your home screen when ready.",
        })
      }
    } catch (e) {
      toast({
        title: "Install failed",
        description: "Something went wrong. Try from your browser menu instead.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="mt-3 space-y-2">
      {available ? (
        <>
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={handleClick}
            aria-label={label}
          >
            {label}
          </Button>
          <p className="text-xs text-muted-foreground">
            Opens your browser&apos;s Add to Home Screen dialog.
          </p>
        </>
      ) : (
        <p className="text-xs text-muted-foreground">
          Add to Home Screen: use your browser menu (e.g. Share → Add to Home Screen) when the option appears.
        </p>
      )}
    </div>
  )
}
