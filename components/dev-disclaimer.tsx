"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function DevDisclaimer() {
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      try {
        const hasSeenDisclaimer = localStorage.getItem("truerate-disclaimer-seen")
        if (!hasSeenDisclaimer) {
          setIsVisible(true)
        }
      } catch (e) {
        // Ignore localStorage errors
      }
    }
  }, [])

  const handleClose = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("truerate-disclaimer-seen", "true")
    }
    setIsVisible(false)
  }

  if (!mounted || !isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <Card className="max-w-lg w-full p-6 space-y-4 border-2 border-yellow-500/50 shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
            </div>
            <h2 className="text-xl font-bold">Disclaimer</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">TrueRate Liberia</strong> is an independent initiative of{" "}
            <a
              href="https://huix-2099.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              HUIX-2099
            </a>
            , a Liberian technology company.
          </p>

          <p>
            TrueRate is currently pursuing designation as a{" "}
            <strong className="text-foreground">Central Bank Market Intelligence Partner</strong>. No such designation or
            official endorsement has been granted by the Central Bank of Liberia.
          </p>

          <p>
            The platform aggregates exchange rate data from publicly available sources, including Liberian government
            institutions, licensed foreign exchange dealers, and international APIs, and provides AI-generated predictions
            for informational purposes only.
          </p>

          <p>
            Exchange rates displayed on this platform are indicative and subject to change. Users are advised to
            independently verify rates with their selected financial institution or money changer before conducting any
            transaction.
          </p>

          <p>
            TrueRate Liberia accepts no liability for financial decisions or transactions made based on the information
            provided.
          </p>

          <p className="text-xs text-muted-foreground pt-2 border-t border-border/50">
            Designed and developed by <strong className="text-foreground">Moses J. Sackey</strong>,{" "}
            <strong className="text-foreground">Victor E. Coleman</strong>
            <br />
            Powered by{" "}
            <a
              href="https://huix-2099.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              HUIX-2099
            </a>
          </p>
        </div>

        <Button onClick={handleClose} className="w-full">
          I Acknowledge
        </Button>
      </Card>
    </div>
  )
}
