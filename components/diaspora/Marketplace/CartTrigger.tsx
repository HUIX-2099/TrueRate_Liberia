"use client"

import { forwardRef } from "react"
import { ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CartTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  itemCount: number
  totalUsd: number
}

/** eCommerce-style cart button: icon + count badge + total. Use as trigger for CartDrawer (with asChild). */
export const CartTrigger = forwardRef<HTMLButtonElement, CartTriggerProps>(
  ({ itemCount, totalUsd, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex items-center gap-3 rounded-full border border-border/40 bg-card px-4 py-2.5 min-h-[44px] hover:bg-muted/40 hover:border-primary/25 transition-all duration-200 shadow-[var(--shadow-ecommerce)]",
          itemCount > 0 && "ring-2 ring-primary/20 shadow-md",
          className
        )}
        aria-label={`Cart: ${itemCount} items, $${totalUsd.toFixed(2)}`}
        {...props}
      >
        <span className="relative inline-flex">
          <ShoppingBag className="h-5 w-5 text-primary" aria-hidden />
          {itemCount > 0 && (
            <span
              className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground px-1"
              aria-hidden
            >
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          )}
        </span>
        <span className="text-sm font-semibold tabular-nums text-foreground hidden sm:inline">
          ${totalUsd.toFixed(2)}
        </span>
      </button>
    )
  }
)
CartTrigger.displayName = "CartTrigger"
