"use client"

import { Truck, Lock, ShieldCheck, HeadphonesIcon } from "lucide-react"

const ITEMS = [
  {
    icon: Truck,
    title: "Delivery in Liberia",
    description: "Verified vendors ship to Monrovia, Paynesville, and beyond. Track your order.",
  },
  {
    icon: Lock,
    title: "Secure payment",
    description: "Pay in USD; we convert at live TrueRate. Transparent fees, escrow-style options.",
  },
  {
    icon: ShieldCheck,
    title: "Verified vendors",
    description: "Business registration, ratings, and dispute resolution. Shop with confidence.",
  },
  {
    icon: HeadphonesIcon,
    title: "Support",
    description: "Questions? Contact vendor or TrueRate support. We're here to help.",
  },
]

export function ServiceGuarantees() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8 border-y border-border/40">
      {ITEMS.map((item) => {
        const Icon = item.icon
        return (
          <div key={item.title} className="flex gap-4">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
