"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

/** Show button from Trust & transparency section through footer (either in view) */
const SECTION_IDS = ["trust-transparency", "site-footer"]
const SCROLL_THRESHOLD_PX = 400

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as Element[]

    if (elements.length > 0) {
      const intersecting = new Set<Element>()
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) intersecting.add(entry.target)
            else intersecting.delete(entry.target)
          }
          setVisible(intersecting.size > 0)
        },
        { rootMargin: "0px", threshold: 0 }
      )
      elements.forEach((el) => observer.observe(el))
      return () => observer.disconnect()
    }

    const check = () => {
      const nearBottom =
        typeof window !== "undefined" &&
        window.scrollY + window.innerHeight >
          document.documentElement.scrollHeight - SCROLL_THRESHOLD_PX
      setVisible(nearBottom)
    }
    check()
    window.addEventListener("scroll", check, { passive: true })
    return () => window.removeEventListener("scroll", check)
  }, [pathname])

  const scrollToHeader = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!visible) return null

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={scrollToHeader}
      aria-label="Scroll to top"
      className="fixed right-4 z-30 min-h-[44px] min-w-[44px] h-11 w-11 rounded-full border-border/80 bg-background/95 shadow-md backdrop-blur-sm bottom-[calc(4.5rem+env(safe-area-inset-bottom))] md:bottom-8 md:right-6 md:h-11 md:w-11 text-primary"
    >
      <ChevronUp className="h-5 w-5 md:h-5 md:w-5 text-muted-foreground" />
    </Button>
  )
}
