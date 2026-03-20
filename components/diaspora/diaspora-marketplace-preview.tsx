"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Store,
  ShieldCheck,
  Package,
  Fuel,
  Home,
  UtensilsCrossed,
  HardHat,
} from "lucide-react"

const CATEGORIES = [
  { name: "Construction", icon: HardHat, items: "Cement, zinc, tiles, paint, rebar" },
  { name: "Food & Groceries", icon: UtensilsCrossed, items: "Rice, oil, canned goods" },
  { name: "Household", icon: Home, items: "Appliances, furniture" },
  { name: "Fuel Vouchers", icon: Fuel, items: "Gasoline & diesel" },
]

export function DiasporaMarketplacePreview() {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-card shadow-[var(--shadow-institutional)] overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center">
            <Store className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-primary">Diaspora Marketplace</CardTitle>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                TrueRate Direct
              </Badge>
            </div>
            <CardDescription>
              Purchase construction materials, household goods, groceries, and fuel for delivery in Liberia
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/30 p-3"
            >
              <div className="h-10 w-10 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center shrink-0">
                <cat.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm">{cat.name}</p>
                <p className="text-xs text-muted-foreground truncate">{cat.items}</p>
              </div>
            </div>
          ))}
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
            Verified vendors · Store name, location, WhatsApp & phone, business registration
          </li>
          <li className="flex items-center gap-2">
            <Package className="h-4 w-4 shrink-0 text-primary" />
            Multi-vendor cart · Live USD→LRD conversion · Transparent fees · Delivery tracking
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}
