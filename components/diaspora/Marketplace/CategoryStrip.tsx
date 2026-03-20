"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight, HardHat, UtensilsCrossed, Home, Fuel, LayoutGrid } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CategoryItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: "all", label: "All", icon: LayoutGrid },
  { id: "construction", label: "Construction", icon: HardHat },
  { id: "food-groceries", label: "Food & Groceries", icon: UtensilsCrossed },
  { id: "household", label: "Household", icon: Home },
  { id: "fuel", label: "Fuel", icon: Fuel },
]

export interface CategoryStripProps {
  categories?: CategoryItem[]
  activeId?: string
  onSelect?: (id: string) => void
  className?: string
}

export function CategoryStrip({
  categories = DEFAULT_CATEGORIES,
  activeId = "all",
  onSelect,
  className,
}: CategoryStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return
    const step = 120
    scrollRef.current.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" })
  }

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="hidden sm:flex shrink-0 items-center justify-center w-10 h-10 rounded-full border border-border/25 bg-card/80 text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors min-h-[44px] min-w-[44px] shadow-sm"
          aria-label="Scroll categories left"
        >
          <ChevronLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none scroll-smooth py-2 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {categories.map((cat) => {
            const Icon = cat.icon
            const isActive = activeId === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelect?.(cat.id)}
                className={cn(
                  "flex flex-col items-center gap-2 shrink-0 min-w-[72px] sm:min-w-[80px] rounded-xl p-3 transition-all duration-200 min-h-[44px] active:scale-[0.97]",
                  isActive
                    ? "bg-foreground text-background shadow-[var(--shadow-ecommerce)] ring-2 ring-primary/30 scale-[1.02]"
                    : "bg-muted/30 text-muted-foreground hover:bg-muted/55 hover:text-foreground hover:shadow-sm"
                )}
                aria-pressed={isActive}
                aria-label={`Category: ${cat.label}`}
              >
                <span
                  className={cn(
                    "flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-lg transition-colors",
                    isActive ? "bg-white/20 text-primary-foreground" : "bg-background/60 text-current"
                  )}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </span>
                <span className="text-[10px] sm:text-xs font-medium text-center leading-tight line-clamp-2">
                  {cat.label}
                </span>
              </button>
            )
          })}
        </div>
        <button
          type="button"
          onClick={() => scroll("right")}
          className="hidden sm:flex shrink-0 items-center justify-center w-10 h-10 rounded-full border border-border/25 bg-card/80 text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors min-h-[44px] min-w-[44px] shadow-sm"
          aria-label="Scroll categories right"
        >
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}
