"use client"

import { useMemo } from "react"
import Link from "next/link"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CartItem } from "@/lib/diaspora/types"

export type { CartItem }

export interface CartDrawerProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  items?: CartItem[]
  triggerClassName?: string
  /** Custom trigger (e.g. CartTrigger). Will be wrapped in DrawerTrigger. */
  trigger?: React.ReactNode
  children?: React.ReactNode
}

/** Groups cart items by vendor for multi-vendor display. */
function groupByVendor(items: CartItem[]): Map<string | undefined, CartItem[]> {
  const map = new Map<string | undefined, CartItem[]>()
  for (const item of items) {
    const key = item.vendorName ?? "Other"
    const list = map.get(key) ?? []
    list.push(item)
    map.set(key, list)
  }
  return map
}

export function CartDrawer({
  open,
  onOpenChange,
  items = [],
  triggerClassName,
  trigger,
  children,
}: CartDrawerProps) {
  const totalUsd = useMemo(
    () => items.reduce((s, i) => s + i.priceUsd * i.quantity, 0),
    [items]
  )
  const count = useMemo(
    () => items.reduce((s, i) => s + i.quantity, 0),
    [items]
  )
  const byVendor = useMemo(() => groupByVendor(items), [items])

  const triggerContent =
    children ??
    (trigger != null ? (
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
    ) : (
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("gap-2 min-h-[44px]", triggerClassName)}
          aria-label={`Open cart (${count} items)`}
        >
          <ShoppingCart className="h-4 w-4 text-primary" />
          Cart {count > 0 ? `(${count})` : ""}
        </Button>
      </DrawerTrigger>
    ))

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
      {triggerContent}
      <DrawerContent
        className="max-h-[85vh] rounded-t-3xl border-t border-border/40 shadow-[0_-4px_24px_-4px_rgb(0_0_0_/0.08)]"
        aria-describedby="cart-drawer-desc"
      >
        <DrawerHeader className="pb-3 border-b border-border/30">
          <DrawerTitle className="text-lg font-semibold">Cart</DrawerTitle>
          <DrawerDescription id="cart-drawer-desc" className="text-sm text-muted-foreground">
            Add your family&apos;s delivery address at checkout. All prices in USD.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-muted-foreground mb-4">Your cart is empty.</p>
              <p className="text-xs text-muted-foreground max-w-xs">Browse the marketplace to send supplies to family in Liberia.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {Array.from(byVendor.entries()).map(([vendorName, vendorItems]) => (
                <div key={vendorName ?? "other"}>
                  {vendorName !== "Other" && (
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      {vendorName}
                    </p>
                  )}
                  <ul className="space-y-2">
                    {vendorItems.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center gap-4 rounded-xl bg-muted/20 p-3 text-sm"
                      >
                        <div className="h-12 w-12 shrink-0 rounded-lg bg-muted/50 flex items-center justify-center">
                          <ShoppingCart className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
                        </div>
                        <div className="text-right tabular-nums shrink-0">
                          <p className="font-semibold">${(item.priceUsd * item.quantity).toFixed(2)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
        <DrawerFooter className="border-t border-border/30 pt-4 gap-3">
          <div className="flex items-center justify-between text-base font-semibold">
            <span>Subtotal</span>
            <span className="tabular-nums">${totalUsd.toFixed(2)} USD</span>
          </div>
          <Button className="w-full min-h-[48px] rounded-xl font-semibold text-base" disabled={items.length === 0} asChild={items.length > 0}>
            {items.length > 0 ? (
              <Link href="/diaspora/marketplace/checkout">Proceed to checkout</Link>
            ) : (
              <span>Proceed to checkout</span>
            )}
          </Button>
          <DrawerClose asChild>
            <Button variant="ghost" className="w-full min-h-[44px] rounded-xl">
              Continue shopping
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
