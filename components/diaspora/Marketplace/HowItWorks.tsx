"use client"

import { ShoppingBag, MapPin, Truck } from "lucide-react"
import { cn } from "@/lib/utils"

const STEPS = [
  {
    icon: ShoppingBag,
    title: "Shop in USD",
    description: "Browse and add items to your cart. Pay in dollars from anywhere.",
  },
  {
    icon: MapPin,
    title: "Add family's address",
    description: "Enter your family's delivery address in Liberia at checkout.",
  },
  {
    icon: Truck,
    title: "We deliver to them",
    description: "Verified vendors ship to Monrovia and beyond. Track your order.",
  },
]

export interface HowItWorksProps {
  /** Compact single row (e.g. for panel) vs default card style */
  variant?: "default" | "compact"
  className?: string
}

export function HowItWorks({ variant = "default", className }: HowItWorksProps) {
  if (variant === "compact") {
    return (
      <div
        className={`grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 ${className ?? ""}`}
        aria-label="How sending to family works"
      >
        {STEPS.map((step, i) => (
          <div
            key={step.title}
            className="flex items-start gap-3 rounded-xl bg-muted/20 px-4 py-3.5"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted/40 border border-border/40 text-primary font-semibold text-xs">
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="font-medium text-foreground text-sm">{step.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/40 bg-card px-6 py-7 sm:px-8 sm:py-8 shadow-sm",
        className
      )}
      aria-label="How sending to family works"
    >
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
        How it works
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-4">
        {STEPS.map((step, i) => {
          const StepIcon = step.icon
          return (
            <div key={step.title} className="relative">
              <div className="relative z-[1] flex items-start gap-4 rounded-xl bg-background/70 p-4 border border-border/35 shadow-sm transition-colors duration-300 hover:border-border/80">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-primary border border-border/40 bg-muted/30">
                  <StepIcon className="h-5 w-5 text-primary" aria-hidden />
                </div>
                <div className="min-w-0 pt-0.5">
                  <p className="flex items-center gap-2 font-semibold text-foreground text-sm">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                      {i + 1}
                    </span>
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
