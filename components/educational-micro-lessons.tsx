"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Lightbulb, ChevronRight } from "lucide-react"

const tips = [
  {
    id: 1,
    title: "Why rates fluctuate",
    content:
      "Exchange rates change based on supply and demand. When more people want USD, its value increases. Economic stability, inflation, and government policies all affect rates.",
    category: "basics",
  },
  {
    id: 2,
    title: "How to spot fake USD",
    content:
      "Real USD bills have a watermark, security thread, color-shifting ink, and raised printing you can feel. Always check multiple features. Never accept bills that feel too smooth or have blurry printing.",
    category: "safety",
  },
  {
    id: 3,
    title: "Best time to exchange",
    content:
      "Mid-week (Tuesday-Thursday) typically has more stable rates. Avoid exchanging during holidays or major economic announcements. Monitor trends for 2-3 days before large exchanges.",
    category: "tips",
  },
  {
    id: 4,
    title: "Hidden fees to watch for",
    content:
      "Some services advertise 'no fees' but offer poor exchange rates. Always compare the total amount you'll receive, not just the advertised fee. Calculate the effective rate including all costs.",
    category: "tips",
  },
  {
    id: 5,
    title: "Mobile money vs cash",
    content:
      "Mobile money is convenient but often has higher fees and worse rates than cash exchange. For small urgent transfers, use mobile money. For larger amounts, cash exchange is usually better.",
    category: "tips",
  },
]

export function EducationalMicroLessons() {
  const [currentTip, setCurrentTip] = useState(0)
  const [dismissed, setDismissed] = useState(false)
  const [visited, setVisited] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Show popup after 10 seconds on first visit
    if (typeof window !== 'undefined') {
      try {
        const hasVisited = localStorage.getItem("truerate-tips-shown")
        if (!hasVisited) {
          const timer = setTimeout(() => {
            setVisited(true)
          }, 10000)
          return () => clearTimeout(timer)
        }
      } catch (e) {
        // Ignore localStorage errors
      }
    }
  }, [])

  useEffect(() => {
    // Rotate tips every 30 seconds
    if (visited && !dismissed) {
      const interval = setInterval(() => {
        setCurrentTip((prev) => (prev + 1) % tips.length)
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [visited, dismissed])

  const handleDismiss = () => {
    setDismissed(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem("truerate-tips-shown", "true")
    }
  }

  const handleNext = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length)
  }

  if (!mounted || !visited || dismissed) return null

  const tip = tips[currentTip]

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-5">
      <Card className="border-primary shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-sm">{tip.title}</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1" onClick={handleDismiss}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{tip.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {tips.map((_, i) => (
                    <div key={i} className={`h-1 w-6 rounded-full ${i === currentTip ? "bg-primary" : "bg-muted"}`} />
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleNext}>
                  Next Tip
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
