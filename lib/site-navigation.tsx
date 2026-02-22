"use client"

import type { LucideIcon } from "lucide-react"
import {
  Activity,
  ArrowLeftRight,
  BarChart3,
  BellRing,
  Calculator,
  Crown,
  LayoutDashboard,
  LogIn,
  MapPin,
  MapPinned,
  MessageSquare,
  Newspaper,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react"

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  description: string
}

export interface BottomNavItem {
  href: string
  label: string
  icon: LucideIcon
}

/**
 * Single source of truth for site navigation. Used by the header so server and
 * client always render the same list and avoid hydration mismatch.
 */
export const NAVIGATION_ITEMS: NavItem[] = [
  { href: "/converter", label: "Converter", icon: Calculator, description: "Convert currencies" },
  { href: "/market-intelligence", label: "Market Intelligence", icon: LayoutDashboard, description: "Commodity prices, risk, COL" },
  { href: "/price-index", label: "Price Index", icon: BarChart3, description: "Essential goods & services" },
  { href: "/analytics", label: "Analytics", icon: Activity, description: "Market insights" },
  { href: "/predictions", label: "AI Forecasts", icon: Crown, description: "ML predictions" },
  { href: "/business", label: "Business", icon: ShoppingCart, description: "Enterprise tools" },
  { href: "/forums", label: "Forums", icon: MessageSquare, description: "Community discussions" },
]

export const MOBILE_MENU_ITEMS: NavItem[] = [
  { href: "/auth/signin", label: "Sign In", icon: LogIn, description: "Access your dashboard" },
  { href: "/converter", label: "Converter", icon: Calculator, description: "Convert USD ↔ LRD" },
  { href: "/market-intelligence", label: "Market Intelligence", icon: LayoutDashboard, description: "Commodity, risk, COL dashboard" },
  { href: "/analytics", label: "Analytics / Charts", icon: Activity, description: "Trends and history" },
  { href: "/price-index", label: "Price Index", icon: ShoppingCart, description: "Everyday cost tracking" },
  { href: "/map", label: "Find Changers", icon: MapPin, description: "Map of local rates" },
  { href: "/liberia-market", label: "News", icon: Newspaper, description: "Liberia market updates" },
  { href: "/community", label: "Community", icon: Users, description: "Reports and reviews" },
]

export const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  { href: "/rates", label: "Rates", icon: TrendingUp },
  { href: "/converter", label: "Converter", icon: ArrowLeftRight },
  { href: "/price-index", label: "Prices", icon: BarChart3 },
  { href: "/map", label: "Map", icon: MapPinned },
  { href: "/tools", label: "Alerts", icon: BellRing },
]
