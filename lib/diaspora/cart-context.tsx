"use client"

import React, { createContext, useCallback, useContext, useMemo, useState } from "react"
import type { CartItem } from "./types"

const STORAGE_KEY = "truerate-diaspora-cart"

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore
  }
}

interface CartContextValue {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "id"> & { id?: string }) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  totalUsd: number
  itemCount: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function DiasporaCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart)

  const persist = useCallback((next: CartItem[]) => {
    setItems(next)
    saveCart(next)
  }, [])

  const addItem = useCallback(
    (item: Omit<CartItem, "id"> & { id?: string }) => {
      const id = item.id ?? item.productId ?? `cart-${item.productId}-${Date.now()}`
      const newItem: CartItem = {
        id,
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        priceUsd: item.priceUsd,
        vendorId: item.vendorId,
        vendorName: item.vendorName,
        category: item.category,
      }
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === newItem.productId)
        let next: CartItem[]
        if (existing) {
          next = prev.map((i) =>
            i.productId === newItem.productId
              ? { ...i, quantity: i.quantity + newItem.quantity }
              : i
          )
        } else {
          next = [...prev, newItem]
        }
        saveCart(next)
        return next
      })
    },
    []
  )

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        const next = prev.filter((i) => i.productId !== productId)
        saveCart(next)
        return next
      }
      const next = prev.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      )
      saveCart(next)
      return next
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.productId !== productId)
      saveCart(next)
      return next
    })
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    saveCart([])
  }, [])

  const totalUsd = useMemo(
    () => items.reduce((s, i) => s + i.priceUsd * i.quantity, 0),
    [items]
  )
  const itemCount = useMemo(
    () => items.reduce((s, i) => s + i.quantity, 0),
    [items]
  )

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      totalUsd,
      itemCount,
    }),
    [items, addItem, updateQuantity, removeItem, clearCart, totalUsd, itemCount]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useDiasporaCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error("useDiasporaCart must be used within DiasporaCartProvider")
  }
  return ctx
}

export function useDiasporaCartOptional(): CartContextValue | null {
  return useContext(CartContext)
}
