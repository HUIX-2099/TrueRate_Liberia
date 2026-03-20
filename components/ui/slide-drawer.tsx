"use client"

import * as React from "react"
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
import { cn } from "@/lib/utils"

export interface SlideDrawerProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  direction?: "top" | "bottom" | "left" | "right"
  triggerClassName?: string
  contentClassName?: string
}

/** Reusable slide-in drawer (e.g. cart, filters). Uses design-system spacing and elevation. */
export function SlideDrawer({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  direction = "bottom",
  triggerClassName,
  contentClassName,
}: SlideDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={direction}>
      {trigger != null && (
        <DrawerTrigger asChild className={triggerClassName}>
          {trigger}
        </DrawerTrigger>
      )}
      <DrawerContent
        className={cn(
          "max-h-[85vh] rounded-t-2xl border-t shadow-[var(--shadow-institutional-raised)]",
          contentClassName
        )}
      >
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description != null && (
            <DrawerDescription>{description}</DrawerDescription>
          )}
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-4 pb-4">{children}</div>
        {footer != null && <DrawerFooter>{footer}</DrawerFooter>}
      </DrawerContent>
    </Drawer>
  )
}
