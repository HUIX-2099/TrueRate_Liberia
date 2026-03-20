"use client"

import { cn } from "@/lib/utils"
import { CheckCircle2, Circle, Clock, Package, Truck, Home, XCircle } from "lucide-react"

export type OrderStatus = "DRAFT" | "PENDING_PAYMENT" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "DISPUTED" | "REFUNDED"

interface TimelineStep {
  status: OrderStatus
  label: string
  icon: React.ElementType
  description: string
}

const TIMELINE_STEPS: TimelineStep[] = [
  { status: "PENDING_PAYMENT", label: "Order Placed", icon: Clock, description: "Your order has been created and is awaiting payment." },
  { status: "PAID", label: "Payment Confirmed", icon: CheckCircle2, description: "Payment received. Your order is being prepared." },
  { status: "PROCESSING", label: "Processing", icon: Package, description: "Vendor is preparing your items for delivery." },
  { status: "SHIPPED", label: "Out for Delivery", icon: Truck, description: "Your order is on its way to the recipient." },
  { status: "DELIVERED", label: "Delivered", icon: Home, description: "Your order has been delivered successfully." },
]

const STATUS_ORDER: Record<OrderStatus, number> = {
  DRAFT: -1,
  PENDING_PAYMENT: 0,
  PAID: 1,
  PROCESSING: 2,
  SHIPPED: 3,
  DELIVERED: 4,
  CANCELLED: -2,
  DISPUTED: -2,
  REFUNDED: -2,
}

interface OrderTimelineProps {
  status: OrderStatus
  createdAt?: string
  paidAt?: string
  className?: string
}

export function OrderTimeline({ status, createdAt, className }: OrderTimelineProps) {
  const currentIndex = STATUS_ORDER[status] ?? 0
  const isCancelled = status === "CANCELLED" || status === "DISPUTED" || status === "REFUNDED"

  if (isCancelled) {
    return (
      <div className={cn("flex items-center gap-3 p-4 rounded-2xl bg-destructive/5 border border-destructive/20", className)}>
        <XCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
        <div>
          <p className="font-bold text-sm text-destructive">Order {status.toLowerCase().replace("_", " ")}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Contact support if you need assistance.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-1", className)} role="list" aria-label="Order status timeline">
      {TIMELINE_STEPS.map((step, idx) => {
        const isCompleted = idx < currentIndex
        const isCurrent = idx === currentIndex
        const Icon = step.icon

        return (
          <div key={step.status} role="listitem" className="flex gap-4">
            {/* Icon column */}
            <div className="flex flex-col items-center">
              <div className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                isCompleted ? "bg-primary border-primary text-primary-foreground"
                  : isCurrent ? "bg-muted/40 border border-border/40 border-primary text-primary"
                  : "bg-muted/30 border-border/40 text-muted-foreground/40"
              )}>
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" aria-hidden />
                ) : (
                  <Icon className="h-4 w-4 text-primary" aria-hidden />
                )}
              </div>
              {idx < TIMELINE_STEPS.length - 1 && (
                <div className={cn(
                  "w-0.5 flex-1 min-h-[24px] transition-colors duration-300",
                  isCompleted ? "bg-primary" : "bg-border/40"
                )} />
              )}
            </div>

            {/* Content */}
            <div className={cn("pb-4 flex-1", idx === TIMELINE_STEPS.length - 1 && "pb-0")}>
              <p className={cn(
                "font-bold text-sm",
                isCompleted ? "text-primary" : isCurrent ? "text-foreground" : "text-muted-foreground/50"
              )}>
                {step.label}
                {isCurrent && (
                  <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary bg-muted/40 border border-border/40 px-2 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    Current
                  </span>
                )}
              </p>
              <p className={cn(
                "text-xs mt-0.5",
                isCurrent ? "text-muted-foreground" : "text-muted-foreground/40"
              )}>
                {step.description}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
