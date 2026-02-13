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
        title: "Install not available yet",
        description: "Try again from your browser menu when prompted.",
      })
      return
    }

    await promptEvent.prompt()
    await promptEvent.userChoice
    window.__trueratePwaPrompt = null
    setAvailable(false)
  }

  return (
    <Button
      size="sm"
      variant="outline"
      className="mt-3 w-full"
      onClick={handleClick}
      aria-label={label}
    >
      {label}
    </Button>
  )
}
