"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { X, Lightbulb, ChevronRight } from "lucide-react"

const tips = [
  {
    id: 1,
    title: "Why use TrueRate",
    content:
      "Because every Liberian dollar counts. TrueRate helps you compare rates, follow trends, and avoid “too-good-to-be-true” offers—so you exchange with more confidence and fewer surprises.",
    category: "truerate",
    cta: { label: "Open Market", href: "/market" },
  },
  {
    id: 2,
    title: "Don’t lose money to spread",
    content:
      "Always ask for both the buy and sell rate. A “no fee” offer can still be expensive if the spread is wide. Compare the effective rate before you exchange.",
    category: "rates",
    cta: { label: "Compare rates", href: "/market" },
  },
  {
    id: 3,
    title: "Budget with a rate buffer",
    content:
      "If you earn in LRD but pay USD-priced costs (rent, school, imports), set aside a 5–10% buffer. Small daily moves can add up over a month.",
    category: "budget",
    cta: { label: "Use Converter", href: "/converter" },
  },
  {
    id: 4,
    title: "Track prices, not just rates",
    content:
      "A stable exchange rate doesn’t always mean stable costs. Watch price trends for essentials so your household budget stays realistic.",
    category: "prices",
    cta: { label: "See Price Index", href: "/price-index" },
  },
  {
    id: 5,
    title: "Use tools before you pay",
    content:
      "Before sending money or buying USD, quickly convert, estimate total cost, and sanity-check the rate against the market. Small checks prevent big losses.",
    category: "tools",
    cta: { label: "Explore Tools", href: "/tools" },
  },
]

export function EducationalMicroLessons() {
  const [currentTip, setCurrentTip] = useState(0)
  const [dismissed, setDismissed] = useState(false)
  const [visited, setVisited] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional hydration pattern
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
  const cta = tip.cta as undefined | { label: string; href: string }

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
                <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 text-primary" onClick={handleDismiss}>
                  <X className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{tip.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {tips.map((_, i) => (
                    <div key={i} className={`h-1 w-6 rounded-full ${i === currentTip ? "bg-primary" : "bg-muted"}`} />
                  ))}
                </div>
                {cta ? (
                  <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
                    <Link href={cta.href}>
                      {cta.label}
                      <ChevronRight className="h-3 w-3 ml-1 text-muted-foreground" />
                    </Link>
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleNext}>
                    Next Tip
                    <ChevronRight className="h-3 w-3 ml-1 text-muted-foreground" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
