"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function DevDisclaimer() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasSeenDisclaimer = localStorage.getItem("truerate-disclaimer-seen")
    if (!hasSeenDisclaimer) {
      setIsVisible(true)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem("truerate-disclaimer-seen", "true")
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <Card className="max-w-lg w-full p-6 space-y-4 border-2 border-yellow-500/50 shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
            </div>
            <h2 className="text-xl font-bold">Development Notice</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">TrueRate-Liberia</strong> is an independent development project by{" "}
            <a
              href="https://huix-2099.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              HUIX-2099
            </a>
            , a Liberian tech startup.
          </p>

          <p>
            This platform is <strong className="text-foreground">not affiliated with</strong> the Central Bank of
            Liberia or any government institution.
          </p>

          <p>
            We aggregate data from multiple international currency APIs and community reports to provide accurate,
            real-time USD/LRD exchange rates for informational purposes.
          </p>

          <div className="mt-4 p-3 rounded-lg bg-muted">
            <p className="text-xs text-foreground">
              <strong>Note:</strong> Exchange rates are for reference only. Always verify rates with your chosen money
              changer before transactions.
            </p>
          </div>
        </div>

        <Button onClick={handleClose} className="w-full">
          I Understand
        </Button>
      </Card>
    </div>
  )
}
