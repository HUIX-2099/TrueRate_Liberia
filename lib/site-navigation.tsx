"use client"

import type { LucideIcon } from "lucide-react"
import {
  ArrowLeftRight,
  BellRing,
  BarChart3,
  Briefcase,
  Calculator,
  House,
  LayoutDashboard,
  LogIn,
  ShoppingCart,
  Users,
  ShieldAlert,
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
  { href: "/", label: "Home", icon: House, description: "Start here and choose what you need right now" },
  { href: "/market", label: "Live Market", icon: LayoutDashboard, description: "See live USD/LRD, buy/sell spread, and market context" },
  { href: "/business", label: "Business", icon: Briefcase, description: "Free tools for importers and exporters to plan with confidence" },
  { href: "/converter", label: "Convert", icon: Calculator, description: "Convert USD and LRD with the latest live rate" },
  { href: "/price-index", label: "Compare Prices", icon: ShoppingCart, description: "Check if everyday prices are fair before you buy" },
  { href: "/tools", label: "Money Tools", icon: BellRing, description: "Budget, remittance, inflation, and planning support" },
  { href: "/community", label: "Community", icon: Users, description: "Join discussions and share local price updates" },
  { href: "/report-fraud", label: "Report Fraud", icon: ShieldAlert, description: "Flag suspicious rates and keep others safe" },
]

export const MOBILE_MENU_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: LayoutDashboard, description: "Start here and choose what you need" },
  { href: "/market", label: "Live Market", icon: LayoutDashboard, description: "Live rates, spread, and market signal" },
  { href: "/business", label: "Business", icon: Briefcase, description: "Free tools for business planning" },
  { href: "/converter", label: "Convert", icon: Calculator, description: "Quick USD/LRD conversion" },
  { href: "/price-index", label: "Compare Prices", icon: ShoppingCart, description: "Check if a price is fair" },
  { href: "/tools", label: "Money Tools", icon: BellRing, description: "Budget, alerts, and planning tools" },
  { href: "/auth/signin", label: "Sign In", icon: LogIn, description: "Access your saved tools and dashboard" },
]

export const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  { href: "/market", label: "Market", icon: LayoutDashboard },
  { href: "/converter", label: "Converter", icon: ArrowLeftRight },
  { href: "/price-index", label: "Prices", icon: BarChart3 },
  { href: "/tools", label: "Tools", icon: BellRing },
]
