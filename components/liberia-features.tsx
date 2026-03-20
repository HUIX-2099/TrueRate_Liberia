"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Bell,
  Smartphone,
  Calculator,
  ShoppingCart,
  Truck,
  Building,
  BrickWall,
  Construction,
  Fuel,
  Flame,
  Wheat,
  Newspaper,
  Clock,
  MapPin,
  DollarSign,
  Droplet,
  ArrowRight,
  CheckCircle2,
  Send,
  Fish,
  Egg,
  Beef,
  Candy,
  UtensilsCrossed,
  Sparkles,
  Battery,
  Bug,
  Package,
  Paintbrush,
  Carrot,
  Apple,
  Leaf,
  Milk,
  RefreshCw,
  Search,
  Download,
  Link2,
  BarChart2,
  ArrowUpDown,
  X,
} from "lucide-react"

interface PriceItem {
  name: string
  icon: React.ReactNode
  priceUSD: number
  priceLRD: number
  change: number
  category: string
}

interface NewsItem {
  title: string
  source: string
  time: string
  impact: "positive" | "negative" | "neutral"
  summary: string
  url: string
}

// Essential goods only (homepage): staple food, fuel, one build item, one household
const ESSENTIAL_PRICE_NAMES = new Set([
  "25kg Rice (Thai)",
  "25kg Rice (Local)",
  "Palm Oil (gallon)",
  "Eggs (tray)",
  "Gallon of Gas",
  "Gallon of Diesel",
  "Cooking Gas (14kg)",
  "Cement (50kg)",
])

// Names that are part of the Liberia Price Index basket (COL, market risk, affordability)
const INDEX_BASKET_NAMES = new Set([
  "Rice",
  "Palm Oil",
  "Cement",
  "Fuel",
  "Gas",
  "Sugar",
])
function isIndexBasketItem(name: string): boolean {
  return [...INDEX_BASKET_NAMES].some((b) => name.toLowerCase().includes(b.toLowerCase()))
}

export interface PriceIndexProps {
  rate: number
  variant?: "full" | "essential"
  /** Show category tabs (All, Food, Fuel, etc.) and all items by category */
  showCategoryTabs?: boolean
  /** Show search input to filter by item name */
  showSearch?: boolean
  /** Show Export CSV button */
  showExport?: boolean
  /** Show manual refresh button */
  showRefresh?: boolean
  /** Highlight items that are in the index basket (COL & risk metrics) */
  highlightBasketItems?: boolean
  /** Show link to Market Intelligence page */
  showMarketIntelligenceLink?: boolean
  /** Show only essential basket items */
  essentialOnly?: boolean
}

// Market Price Index
export function PriceIndex({
  rate,
  variant = "full",
  showCategoryTabs = false,
  showSearch = false,
  showExport = false,
  showRefresh = false,
  highlightBasketItems = false,
  showMarketIntelligenceLink = false,
  essentialOnly = false,
}: PriceIndexProps) {
  const prices: PriceItem[] = [
    { name: "25kg Rice (Thai)", icon: <Wheat className="h-4 w-4 text-primary" />, priceUSD: 10.5, priceLRD: 1938.206, change: -5, category: "food" },
    { name: "25kg Rice (Local)", icon: <Wheat className="h-4 w-4 text-primary" />, priceUSD: 11, priceLRD: 2030.501, change: -4.5, category: "food" },
    { name: "Palm Oil (gallon)", icon: <Droplet className="h-4 w-4 text-primary" />, priceUSD: 5.69, priceLRD: 1050, change: -1.5, category: "food" },
    { name: "Sugar (1kg)", icon: <Candy className="h-4 w-4 text-primary" />, priceUSD: 1.2, priceLRD: 1.2 * rate, change: 0.5, category: "food" },
    { name: "Flour (25kg)", icon: <Wheat className="h-4 w-4 text-primary" />, priceUSD: 12, priceLRD: 12 * rate, change: 1.2, category: "food" },
    { name: "Bread (loaf)", icon: <UtensilsCrossed className="h-4 w-4 text-primary" />, priceUSD: 0.9, priceLRD: 0.9 * rate, change: -0.3, category: "food" },
    { name: "Chicken (1kg)", icon: <Beef className="h-4 w-4 text-primary" />, priceUSD: 3.5, priceLRD: 3.5 * rate, change: 2, category: "food" },
    { name: "Fish (1kg)", icon: <Fish className="h-4 w-4 text-primary" />, priceUSD: 4, priceLRD: 4 * rate, change: 1, category: "food" },
    { name: "Eggs (tray)", icon: <Egg className="h-4 w-4 text-primary" />, priceUSD: 2.2, priceLRD: 406.1, change: 0.8, category: "food" },
    { name: "Onions (1kg)", icon: <UtensilsCrossed className="h-4 w-4 text-primary" />, priceUSD: 1, priceLRD: 1 * rate, change: -0.5, category: "food" },
    { name: "Cassava (kg)", icon: <UtensilsCrossed className="h-4 w-4 text-primary" />, priceUSD: 0.4, priceLRD: 0.4 * rate, change: 0.2, category: "food" },
    { name: "Tomato (1kg)", icon: <Carrot className="h-4 w-4 text-primary" />, priceUSD: 1.2, priceLRD: 1.2 * rate, change: 0.3, category: "food" },
    { name: "Pepper (1kg)", icon: <Carrot className="h-4 w-4 text-primary" />, priceUSD: 1.5, priceLRD: 1.5 * rate, change: 0.2, category: "food" },
    { name: "Plantain (bunch)", icon: <Apple className="h-4 w-4 text-primary" />, priceUSD: 1.8, priceLRD: 1.8 * rate, change: 0.5, category: "food" },
    { name: "Beans (1kg)", icon: <Wheat className="h-4 w-4 text-primary" />, priceUSD: 2, priceLRD: 2 * rate, change: 0.5, category: "food" },
    { name: "Beef (1kg)", icon: <Beef className="h-4 w-4 text-primary" />, priceUSD: 5, priceLRD: 5 * rate, change: 1.5, category: "food" },
    { name: "Milk (1L)", icon: <Milk className="h-4 w-4 text-primary" />, priceUSD: 2.5, priceLRD: 2.5 * rate, change: 0.3, category: "food" },
    { name: "Potato (1kg)", icon: <Carrot className="h-4 w-4 text-primary" />, priceUSD: 1, priceLRD: 1 * rate, change: -0.2, category: "food" },
    { name: "Stock Cubes (pack)", icon: <Package className="h-4 w-4 text-primary" />, priceUSD: 0.8, priceLRD: 0.8 * rate, change: 0.1, category: "food" },
    { name: "Spaghetti (500g)", icon: <Wheat className="h-4 w-4 text-primary" />, priceUSD: 1, priceLRD: 1 * rate, change: 0.2, category: "food" },
    { name: "Sardines (tin)", icon: <Fish className="h-4 w-4 text-primary" />, priceUSD: 1.2, priceLRD: 1.2 * rate, change: 0.3, category: "food" },
    { name: "Greens (bundle)", icon: <Leaf className="h-4 w-4 text-primary" />, priceUSD: 0.5, priceLRD: 0.5 * rate, change: 0.2, category: "food" },
    { name: "Sweet Potato (kg)", icon: <Carrot className="h-4 w-4 text-primary" />, priceUSD: 0.5, priceLRD: 0.5 * rate, change: 0.1, category: "food" },
    { name: "Gallon of Gas", icon: <Fuel className="h-4 w-4 text-primary" />, priceUSD: 4.15, priceLRD: 766.053, change: -0.5, category: "fuel" },
    { name: "Gallon of Diesel", icon: <Fuel className="h-4 w-4 text-primary" />, priceUSD: 4.45, priceLRD: 821.43, change: 0.2, category: "fuel" },
    { name: "Kerosene (gallon)", icon: <Fuel className="h-4 w-4 text-primary" />, priceUSD: 2.8, priceLRD: 2.8 * rate, change: 0.5, category: "fuel" },
    { name: "Cooking Gas (14kg)", icon: <Flame className="h-4 w-4 text-primary" />, priceUSD: 21, priceLRD: 3876.411, change: 0.5, category: "fuel" },
    { name: "Charcoal (bag)", icon: <Flame className="h-4 w-4 text-primary" />, priceUSD: 8, priceLRD: 8 * rate, change: 1.5, category: "fuel" },
    { name: "Cement (50kg)", icon: <BrickWall className="h-4 w-4 text-primary" />, priceUSD: 8.5, priceLRD: 1569.024, change: 1, category: "construction" },
    { name: "Steel Rods (bundle)", icon: <Construction className="h-4 w-4 text-primary" />, priceUSD: 385, priceLRD: 385 * rate, change: 2, category: "construction" },
    { name: "Nails (1kg)", icon: <Construction className="h-4 w-4 text-primary" />, priceUSD: 2.5, priceLRD: 2.5 * rate, change: 0.5, category: "construction" },
    { name: "Paint (gallon)", icon: <Paintbrush className="h-4 w-4 text-primary" />, priceUSD: 25, priceLRD: 25 * rate, change: 1, category: "construction" },
    { name: "Plywood (sheet)", icon: <Package className="h-4 w-4 text-primary" />, priceUSD: 35, priceLRD: 35 * rate, change: 1.5, category: "construction" },
    { name: "Sand (bag)", icon: <BrickWall className="h-4 w-4 text-primary" />, priceUSD: 3, priceLRD: 3 * rate, change: 0.5, category: "construction" },
    { name: "Roofing Sheet (zinc)", icon: <Construction className="h-4 w-4 text-primary" />, priceUSD: 28, priceLRD: 28 * rate, change: 2, category: "construction" },
    { name: "Binding Wire (roll)", icon: <Construction className="h-4 w-4 text-primary" />, priceUSD: 18, priceLRD: 18 * rate, change: 0.8, category: "construction" },
    { name: "Door (standard)", icon: <Building className="h-4 w-4 text-primary" />, priceUSD: 85, priceLRD: 85 * rate, change: 1, category: "construction" },
    { name: "Window (standard)", icon: <Building className="h-4 w-4 text-primary" />, priceUSD: 55, priceLRD: 55 * rate, change: 0.5, category: "construction" },
    { name: "Paint Brush", icon: <Paintbrush className="h-4 w-4 text-primary" />, priceUSD: 2, priceLRD: 2 * rate, change: 0, category: "construction" },
    { name: "Gravel (bag)", icon: <BrickWall className="h-4 w-4 text-primary" />, priceUSD: 4, priceLRD: 4 * rate, change: 0.5, category: "construction" },
    { name: "Laundry Soap (bar)", icon: <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />, priceUSD: 0.5, priceLRD: 0.5 * rate, change: 0, category: "household" },
    { name: "Salt (1kg)", icon: <Droplet className="h-4 w-4 text-primary" />, priceUSD: 0.6, priceLRD: 0.6 * rate, change: -0.2, category: "household" },
    { name: "Toilet Soap (bar)", icon: <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />, priceUSD: 0.4, priceLRD: 0.4 * rate, change: 0.2, category: "household" },
    { name: "Toothpaste (tube)", icon: <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />, priceUSD: 1.5, priceLRD: 1.5 * rate, change: 0.5, category: "household" },
    { name: "Matches (box)", icon: <Flame className="h-4 w-4 text-primary" />, priceUSD: 0.15, priceLRD: 0.15 * rate, change: 0, category: "household" },
    { name: "Candles (pack)", icon: <Flame className="h-4 w-4 text-primary" />, priceUSD: 0.8, priceLRD: 0.8 * rate, change: 0.3, category: "household" },
    { name: "Mosquito Coil (pack)", icon: <Bug className="h-4 w-4 text-primary" />, priceUSD: 1, priceLRD: 1 * rate, change: 0.2, category: "household" },
    { name: "Bleach (bottle)", icon: <Droplet className="h-4 w-4 text-primary" />, priceUSD: 1.2, priceLRD: 1.2 * rate, change: 0, category: "household" },
    { name: "Washing Powder (1kg)", icon: <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />, priceUSD: 2.5, priceLRD: 2.5 * rate, change: 0.5, category: "household" },
    { name: "Toilet Paper (roll)", icon: <Package className="h-4 w-4 text-primary" />, priceUSD: 0.7, priceLRD: 0.7 * rate, change: 0.1, category: "household" },
    { name: "Sanitary Pads (pack)", icon: <Package className="h-4 w-4 text-primary" />, priceUSD: 2, priceLRD: 2 * rate, change: 0.5, category: "household" },
    { name: "Batteries (pack of 4)", icon: <Battery className="h-4 w-4 text-primary" />, priceUSD: 1.5, priceLRD: 1.5 * rate, change: 0.3, category: "household" },
    { name: "Plastic Bucket", icon: <Package className="h-4 w-4 text-primary" />, priceUSD: 3, priceLRD: 3 * rate, change: 0.5, category: "household" },
  ]

  const [items, setItems] = useState<PriceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updatedLabel, setUpdatedLabel] = useState<string>("Updated Today")
  const [sourceLabel, setSourceLabel] = useState<string>("")
  const [filter, setFilter] = useState("food")
  const [selectedGood, setSelectedGood] = useState<string>("")
  const [categoryTab, setCategoryTab] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)
  const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "price-asc" | "price-desc" | "change-asc" | "change-desc">("name-asc")
  const [updatedAtIso, setUpdatedAtIso] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const fetchPriceIndex = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/price-index")
        if (!res.ok) return
        const data = await res.json()
        if (!isMounted || !Array.isArray(data?.items)) return

        const iconMap: Record<string, React.ReactNode> = {
          wheat: <Wheat className="h-4 w-4 text-primary" />,
          fuel: <Fuel className="h-4 w-4 text-primary" />,
          cement: <BrickWall className="h-4 w-4 text-primary" />,
          steel: <Construction className="h-4 w-4 text-primary" />,
          oil: <Droplet className="h-4 w-4 text-primary" />,
          gas: <Flame className="h-4 w-4 text-primary" />,
          paint: <Paintbrush className="h-4 w-4 text-primary" />,
          plywood: <Package className="h-4 w-4 text-primary" />,
          sand: <BrickWall className="h-4 w-4 text-primary" />,
          door: <Building className="h-4 w-4 text-primary" />,
          "roofing-sheet": <Construction className="h-4 w-4 text-primary" />,
          "binding-wire": <Construction className="h-4 w-4 text-primary" />,
          "paint-brush": <Paintbrush className="h-4 w-4 text-primary" />,
          gravel: <BrickWall className="h-4 w-4 text-primary" />,
          sugar: <Candy className="h-4 w-4 text-primary" />,
          bread: <UtensilsCrossed className="h-4 w-4 text-primary" />,
          chicken: <Beef className="h-4 w-4 text-primary" />,
          fish: <Fish className="h-4 w-4 text-primary" />,
          egg: <Egg className="h-4 w-4 text-primary" />,
          food: <UtensilsCrossed className="h-4 w-4 text-primary" />,
          tomato: <Carrot className="h-4 w-4 text-primary" />,
          pepper: <Carrot className="h-4 w-4 text-primary" />,
          plantain: <Apple className="h-4 w-4 text-primary" />,
          beef: <Beef className="h-4 w-4 text-primary" />,
          milk: <Milk className="h-4 w-4 text-primary" />,
          potato: <Carrot className="h-4 w-4 text-primary" />,
          greens: <Leaf className="h-4 w-4 text-primary" />,
          "stock-cubes": <Package className="h-4 w-4 text-primary" />,
          spaghetti: <Wheat className="h-4 w-4 text-primary" />,
          sardines: <Fish className="h-4 w-4 text-primary" />,
          "sweet-potato": <Carrot className="h-4 w-4 text-primary" />,
          charcoal: <Flame className="h-4 w-4 text-primary" />,
          soap: <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
          salt: <Droplet className="h-4 w-4 text-primary" />,
          toothpaste: <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
          matches: <Flame className="h-4 w-4 text-primary" />,
          candles: <Flame className="h-4 w-4 text-primary" />,
          mosquito: <Bug className="h-4 w-4 text-primary" />,
          bleach: <Droplet className="h-4 w-4 text-primary" />,
          "toilet-paper": <Package className="h-4 w-4 text-primary" />,
          sanitary: <Package className="h-4 w-4 text-primary" />,
          batteries: <Battery className="h-4 w-4 text-primary" />,
          bucket: <Package className="h-4 w-4 text-primary" />,
        }

        const mapped = data.items.map((item: any) => ({
          name: item.name,
          category: item.category,
          change: item.change,
          priceUSD: Number(item.priceUSD),
          priceLRD: Number(item.priceLRD),
          icon: iconMap[item.icon] ?? <ShoppingCart className="h-4 w-4 text-primary" />,
        }))

        setItems(mapped)
        if (typeof data?.updatedAt === "string") {
          setUpdatedAtIso(data.updatedAt)
          const date = new Date(data.updatedAt)
          setUpdatedLabel(
            Number.isNaN(date.getTime())
              ? "Updated Recently"
              : date.toLocaleTimeString ? `Updated ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
              : `Updated ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
          )
        } else {
          setUpdatedAtIso(null)
        }
        if (Array.isArray(data?.sources) && data.sources.length) {
          setSourceLabel(data.sources[0])
        }
      } catch {
        if (isMounted) {
          setItems(prices)
          setUpdatedLabel("Updated Recently")
          setSourceLabel("Fallback")
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchPriceIndex()
    const id = window.setInterval(fetchPriceIndex, 60 * 1000) // Auto-update every minute
    return () => {
      isMounted = false
      window.clearInterval(id)
    }
  }, [refreshKey])

  const filteredItems = items.filter((p) => p.category === filter)
  const filteredPrices =
    variant === "essential"
      ? filteredItems.filter((p) => ESSENTIAL_PRICE_NAMES.has(p.name))
      : filteredItems

  const searchFiltered =
    showSearch && searchQuery.trim()
      ? (list: PriceItem[]) =>
          list.filter((p) => p.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
      : (list: PriceItem[]) => list
  const tabFiltered =
    showCategoryTabs && categoryTab !== "all"
      ? (list: PriceItem[]) => list.filter((p) => p.category === categoryTab)
      : (list: PriceItem[]) => list

  const displayPricesRaw =
    variant === "full" && showCategoryTabs
      ? searchFiltered(tabFiltered(items))
      : variant === "full"
        ? selectedGood !== ""
          ? items.filter((p) => p.name === selectedGood)
          : searchFiltered(
              showCategoryTabs ? tabFiltered(items) : items.filter((p) => ESSENTIAL_PRICE_NAMES.has(p.name)),
            )
        : searchFiltered(filteredPrices)

  const displayPrices = useMemo(() => {
    const list = [...displayPricesRaw]
    if (sortBy === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name))
    else if (sortBy === "name-desc") list.sort((a, b) => b.name.localeCompare(a.name))
    else if (sortBy === "price-asc") list.sort((a, b) => a.priceLRD - b.priceLRD)
    else if (sortBy === "price-desc") list.sort((a, b) => b.priceLRD - a.priceLRD)
    else if (sortBy === "change-asc") list.sort((a, b) => a.change - b.change)
    else if (sortBy === "change-desc") list.sort((a, b) => b.change - a.change)
    return list
  }, [displayPricesRaw, sortBy])

  const categoryLabels: Record<string, string> = {
    food: "Food",
    fuel: "Fuel",
    construction: "Build",
    household: "Household",
    transport: "Transport",
  }

  return (
    <TooltipProvider delayDuration={300}>
    <Card className="border-border/50 shadow-sm bg-card">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/40 border border-border/40 shrink-0">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg">Liberia Price Index</CardTitle>
              <CardDescription className="mt-0.5">
                Prices in LRD • Source:{" "}
                <a
                  href="https://lisgis.gov.lr/pricestats.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  LISGIS
                </a>
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-[10px] sm:text-xs">{updatedLabel}</Badge>
            <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 text-[10px] sm:text-xs">
              <span className="relative flex h-1.5 w-1.5 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
              </span>
              Live
            </Badge>
            {showRefresh && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5"
                onClick={() => setRefreshKey((k) => k + 1)}
                disabled={loading}
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            )}
            {showExport && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5"
                onClick={() => {
                  const headers = "Item,Category,Price (LRD),Price (USD),Change (%)\n"
                  const rows = displayPrices
                    .map(
                      (p) =>
                        `"${p.name.replace(/"/g, '""')}",${p.category},${p.priceLRD.toFixed(2)},${p.priceUSD.toFixed(2)},${p.change}%`,
                    )
                    .join("\n")
                  const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = `liberia-price-index-${new Date().toISOString().slice(0, 10)}.csv`
                  a.click()
                  URL.revokeObjectURL(url)
                }}
              >
                <Download className="h-3.5 w-3.5 text-primary" />
                Export CSV
              </Button>
            )}
          </div>
        </div>
        {sourceLabel && (
          <div className="sr-only">Source: {sourceLabel}</div>
        )}
      </CardHeader>
      <CardContent>
        {showSearch && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-0 sm:min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-primary" />
              <Input
                type="search"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9"
                aria-label="Search price index items"
              />
              {searchQuery.trim() && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-primary"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              )}
            </div>
          </div>
        )}
        {showCategoryTabs && (
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <Tabs value={categoryTab} onValueChange={setCategoryTab} className="w-full sm:w-auto">
              <TabsList className="flex flex-wrap h-auto gap-1 p-1">
                <TabsTrigger value="all" className="text-xs gap-1.5 px-3">
                  <ShoppingCart className="h-3 w-3 text-primary" />
                  All
                </TabsTrigger>
                <TabsTrigger value="food" className="text-xs gap-1.5 px-3">
                  <Wheat className="h-3 w-3 text-primary" />
                  Food
                </TabsTrigger>
                <TabsTrigger value="fuel" className="text-xs gap-1.5 px-3">
                  <Fuel className="h-3 w-3 text-primary" />
                  Fuel
                </TabsTrigger>
                <TabsTrigger value="construction" className="text-xs gap-1.5 px-3">
                  <Construction className="h-3 w-3 text-primary" />
                  Build
                </TabsTrigger>
                <TabsTrigger value="household" className="text-xs gap-1.5 px-3">
                  <Sparkles className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                  Home
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Select value={sortBy} onValueChange={(v: typeof sortBy) => setSortBy(v)}>
              <SelectTrigger className="w-full sm:w-[180px] h-9 gap-1.5" aria-label="Sort by">
                <ArrowUpDown className="h-3.5 w-3.5 text-primary" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name A–Z</SelectItem>
                <SelectItem value="name-desc">Name Z–A</SelectItem>
                <SelectItem value="price-asc">Price low → high</SelectItem>
                <SelectItem value="price-desc">Price high → low</SelectItem>
                <SelectItem value="change-asc">Change % low → high</SelectItem>
                <SelectItem value="change-desc">Change % high → low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        {variant === "full" && !showCategoryTabs && (
          <>
            <div className="mb-4">
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Select goods</label>
              <Select value={selectedGood} onValueChange={setSelectedGood}>
                <SelectTrigger className="w-full max-w-sm">
                  <SelectValue placeholder="Select goods" />
                </SelectTrigger>
                <SelectContent>
                  {(["food", "fuel", "construction", "household"] as const).map((cat) => (
                    <SelectGroup key={cat}>
                      <SelectLabel>{categoryLabels[cat]}</SelectLabel>
                      {items
                        .filter((p) => p.category === cat)
                        .map((item) => (
                          <SelectItem key={item.name} value={item.name}>
                            {item.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedGood === "" && (
              <p className="text-xs text-muted-foreground mb-4">Essential commodities only — select a good above for more.</p>
            )}
          </>
        )}
        {variant === "essential" && (
          <p className="text-xs text-muted-foreground mb-4">Essential goods only — see full index for all items.</p>
        )}
        {showCategoryTabs && displayPrices.length > 0 && (
          <p className="text-xs text-muted-foreground mb-2" aria-live="polite">
            Showing {displayPrices.length} item{displayPrices.length !== 1 ? "s" : ""}
          </p>
        )}
        {!loading && displayPrices.length > 0 && displayPrices.every((p) => p.change === 0) && (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-primary">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-600 dark:text-green-400" />
            <span>All prices stable this period — no changes recorded since last update.</span>
          </div>
        )}
        <div className="max-h-[min(60vh,560px)] overflow-y-auto overflow-x-hidden pr-1 -mr-1 space-y-1.5 min-w-0 scrollbar-thin">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`price-skeleton-${index}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/40 p-3 sm:p-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-3 w-32 rounded bg-muted animate-pulse" />
                      <div className="h-2 w-20 rounded bg-muted animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="h-3 w-20 rounded bg-muted animate-pulse" />
                    <div className="h-2 w-12 rounded bg-muted animate-pulse" />
                  </div>
                </div>
              ))
            : displayPrices.length === 0
              ? (
                <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                  {searchQuery.trim() ? "No items match your search." : "No items in this category."}
                </div>
              )
              : displayPrices.map((item) => {
                const catColor =
                  item.category === "food" ? "bg-muted/40 border border-border/40 text-emerald-600 dark:text-emerald-400" :
                  item.category === "fuel" ? "bg-muted/40 border border-border/40 text-amber-600 dark:text-amber-400" :
                  item.category === "construction" ? "bg-muted/40 border border-border/40 text-blue-600 dark:text-blue-400" :
                  item.category === "household" ? "bg-muted/40 border border-border/40 text-purple-600 dark:text-purple-400" :
                  "bg-muted text-muted-foreground"
                return (
                <div
                  key={item.name}
                  className={`flex items-center justify-between gap-3 rounded-xl border p-3 sm:p-4 transition-all hover:bg-muted/60 hover:shadow-sm ${ highlightBasketItems && isIndexBasketItem(item.name) ? "border-primary/30 bg-primary/5" : "border-border/40 bg-card" }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${catColor}`}>
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm sm:text-base truncate">{item.name}</span>
                        {highlightBasketItems && isIndexBasketItem(item.name) && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 cursor-help">Index basket</Badge>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-[240px] text-xs">
                              Used for cost of living, market risk, and affordability metrics. Same basket across the platform.
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        ≈ ${item.priceUSD.toFixed(2)} USD
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-sm sm:text-base tabular-nums">L${item.priceLRD.toLocaleString()}</div>
                    {item.change === 0 ? (
                      <span className="text-[10px] sm:text-[11px] text-muted-foreground/60 font-medium">Stable</span>
                    ) : (
                      <div className={`text-[11px] sm:text-xs flex items-center gap-1 justify-end font-medium ${ item.change > 0 ? "text-red-500" : "text-green-500" }`}>
                        {item.change > 0 ? <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" /> : <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />}
                        {item.change > 0 ? "+" : ""}{item.change}%
                      </div>
                    )}
                  </div>
                </div>
                )
              })}
        </div>
        {variant === "essential" && (
          <div className="mt-4 pt-4 border-t border-border/60">
            <Link
              href="/price-index"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              View full Price Index <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            </Link>
          </div>
        )}
        {showMarketIntelligenceLink && (
          <div className="mt-4 pt-4 border-t border-border/60">
            <Link
              href="/market-intelligence"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <BarChart2 className="h-4 w-4 text-primary" />
              Market Intelligence — cost of living, market risk, affordability
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
    </TooltipProvider>
  )
}

// Import/Export Calculator
export function ImportCalculator({ rate }: { rate: number }) {
  const [importValue, setImportValue] = useState("1000")
  const [importTax, setImportTax] = useState("10")
  const [markup, setMarkup] = useState("25")

  const numImport = parseFloat(importValue) || 0
  const numTax = parseFloat(importTax) || 0
  const numMarkup = parseFloat(markup) || 0

  const importCostUSD = numImport
  const taxAmountUSD = (numImport * numTax) / 100
  const totalCostUSD = importCostUSD + taxAmountUSD
  const totalCostLRD = totalCostUSD * rate
  const sellPriceLRD = totalCostLRD * (1 + numMarkup / 100)
  const profitLRD = sellPriceLRD - totalCostLRD

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Import Calculator
        </CardTitle>
        <CardDescription>Calculate your total import costs and profits</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-2">
            <label className="text-xs font-medium">Import Value (USD)</label>
            <Input 
              type="number" 
              value={importValue}
              onChange={(e) => setImportValue(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium">Import Tax (%)</label>
            <Input 
              type="number" 
              value={importTax}
              onChange={(e) => setImportTax(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium">Markup (%)</label>
            <Input 
              type="number" 
              value={markup}
              onChange={(e) => setMarkup(e.target.value)}
              className="h-10"
            />
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Import Cost</span>
            <span>${importCostUSD.toLocaleString()} USD</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">+ Import Tax ({importTax}%)</span>
            <span>${taxAmountUSD.toLocaleString()} USD</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">= Total Cost</span>
            <span className="font-medium">${totalCostUSD.toLocaleString()} USD</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">In LRD (@ {rate.toFixed(2)})</span>
            <span className="font-medium">{totalCostLRD.toLocaleString()} LRD</span>
          </div>
          <div className="pt-3 border-t space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Sell Price (+ {markup}%)</span>
              <span className="text-lg font-bold text-primary">{sellPriceLRD.toLocaleString()} LRD</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Profit</span>
              <span className="text-green-500 font-medium">+{profitLRD.toLocaleString()} LRD</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// SMS Alert Signup
export function SMSAlertSignup() {
  const [phone, setPhone] = useState("")
  const [targetRate, setTargetRate] = useState("195")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (phone.length >= 10) {
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-primary" />
          SMS Rate Alerts
        </CardTitle>
        <CardDescription>Get alerts when rate hits your target - no internet needed!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-xs font-medium">Phone Number</label>
            <Input 
              type="tel" 
              placeholder="077 XXX XXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium">Alert When Rate Reaches</label>
            <Input 
              type="number" 
              value={targetRate}
              onChange={(e) => setTargetRate(e.target.value)}
              className="h-10"
            />
          </div>
        </div>
        <Button className="w-full gap-2" onClick={handleSubmit} disabled={submitted}>
          {submitted ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              Alert Set!
            </>
          ) : (
            <>
              <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              Set SMS Alert
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          SMS alerts cost 1 LRD per message. Standard rates apply.
        </p>
      </CardContent>
    </Card>
  )
}

  // Market News Feed
  const news: NewsItem[] = [
    {
      title: "CBL Announces New Foreign Exchange Measures",
      source: "Front Page Africa",
      time: "2 hours ago",
      impact: "neutral",
      summary: "The Central Bank of Liberia has announced new measures to stabilize the foreign exchange market...",
      url: "https://frontpageafricaonline.com/",
    },
    {
      title: "Remittance Inflows Increase 12% in Q4",
      source: "Daily Observer",
      time: "5 hours ago",
      impact: "positive",
      summary: "Diaspora remittances to Liberia have increased by 12% compared to the previous quarter...",
      url: "https://www.liberianobserver.com/",
    },
    {
      title: "Rubber Export Season Begins",
      source: "New Dawn",
      time: "1 day ago",
      impact: "positive",
      summary: "The rubber export season has officially begun, expected to bring in significant foreign currency...",
      url: "https://thenewdawnliberia.com/",
    },
    {
      title: "Fuel Prices May Rise Next Month",
      source: "The Inquirer",
      time: "1 day ago",
      impact: "negative",
      summary: "LPRC warns that global oil prices may lead to fuel price increases in Liberia...",
      url: "https://inquirernewspaper.com/",
    },
  ]

export function MarketNews() {
  const [items, setItems] = useState<NewsItem[]>(news)

  useEffect(() => {
    let isMounted = true
    const loadNews = async () => {
      try {
        const res = await fetch("/api/liberia-market-news", { cache: "no-store" })
        if (res.ok) {
          const data = await res.json()
          if (isMounted && Array.isArray(data?.items) && data.items.length) {
            setItems(data.items.map((i: { title: string; source: string; time: string; summary: string; url: string; impact?: "positive" | "negative" | "neutral" }) => ({
              ...i,
              impact: (i.impact ?? "neutral") as "positive" | "negative" | "neutral",
            })))
            return
          }
        }
        const fallbackRes = await fetch("/api/news", { cache: "no-store" })
        if (fallbackRes.ok) {
          const data = await fallbackRes.json()
          if (isMounted && Array.isArray(data?.items) && data.items.length) {
            setItems(data.items.map((i: { title: string; source: string; time: string; summary: string; url: string }) => ({
              ...i,
              impact: "neutral" as const,
            })))
          }
        }
      } catch {
        // Keep fallback content
      }
    }

    loadNews()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-primary" />
              Liberia Market News
            </CardTitle>
            <CardDescription>Key headlines impacting FX rates</CardDescription>
          </div>
          <Badge variant="outline">Updated daily</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-5 sm:pb-6">
        <div className="space-y-3">
          {items.slice(0, 5).map((item, i) => (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-border/60 bg-muted/40 p-4 transition-all hover:shadow-sm hover:border-primary/30"
              aria-label={`Read: ${item.title}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-1 h-2 w-2 rounded-full ${ item.impact === "positive" ? "bg-green-500" : item.impact === "negative" ? "bg-red-500" : "bg-yellow-500" }`}
                />
                <div className="min-w-0 flex-1 space-y-2">
                  <h4 className="text-sm sm:text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">{item.summary}</p>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center rounded-full border border-border/60 px-2 py-0.5 uppercase tracking-wide">
                      {item.source}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-border/60 px-2 py-0.5">
                      <Clock className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      {item.time}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4 text-sm border-0 bg-background/70 rounded-none" asChild>
          <Link href="/liberia-market" aria-label="View all Liberia market news">
            View All News →
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

// Inflation Tracker
export function InflationTracker() {
  const monthlyData = [
    { month: "Jul", rate: 8.2 },
    { month: "Aug", rate: 8.5 },
    { month: "Sep", rate: 8.1 },
    { month: "Oct", rate: 7.8 },
    { month: "Nov", rate: 7.5 },
    { month: "Dec", rate: 7.2 },
  ]

  const [liveInflation, setLiveInflation] = useState<number | null>(null)
  const [liveMoM, setLiveMoM] = useState<number | null>(null)
  const [lastMonthLabel, setLastMonthLabel] = useState<string>("")
  const [updatedLabel, setUpdatedLabel] = useState<string>("")
  const [sourceLabel, setSourceLabel] = useState<string>("")

  useEffect(() => {
    let isMounted = true
    const fetchInflation = async () => {
      try {
        const res = await fetch("/api/liberia-cpi")
        if (!res.ok) return
        const data = await res.json()
        if (!isMounted) return
        if (typeof data?.inflationYoY === "number") setLiveInflation(data.inflationYoY)
        if (typeof data?.inflationMoM === "number") setLiveMoM(data.inflationMoM)
        if (typeof data?.lastMonth === "string") setLastMonthLabel(data.lastMonth)
        if (typeof data?.updatedAt === "string") {
          const date = new Date(data.updatedAt)
          setUpdatedLabel(
            Number.isNaN(date.getTime()) ? "Recently" : date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          )
        }
        if (typeof data?.source === "string") setSourceLabel(data.source)
      } catch {
        // keep fallback data
      }
    }

    fetchInflation()
    const id = window.setInterval(fetchInflation, 6 * 60 * 60 * 1000)
    return () => {
      isMounted = false
      window.clearInterval(id)
    }
  }, [])

  const fallbackInflation = monthlyData[monthlyData.length - 1].rate
  const currentInflation = liveInflation ?? fallbackInflation
  const previousInflation = monthlyData[monthlyData.length - 2].rate
  const fallbackChange = currentInflation - previousInflation
  const change = liveMoM ?? fallbackChange

  return (
    <Card className="border-border/50 shadow-sm bg-card">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${change < 0 ? "bg-muted/40 border border-border/40" : change > 0 ? "bg-muted/40 border border-border/40" : "bg-muted/40 border border-border/40"}`}>
              {change < 0 ? <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" /> : <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />}
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg">Inflation Rate</CardTitle>
              <CardDescription className="mt-0.5">
                Year-over-year CPI • Source:{" "}
                <a
                  href="https://lisgis.gov.lr/pricestats.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  LISGIS
                </a>
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 text-[10px]">
              <span className="relative flex h-1.5 w-1.5 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
              </span>
              Live
            </Badge>
            <span className="text-xs text-muted-foreground">{lastMonthLabel || "Latest"}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pb-5 sm:pb-6">
        <div className="grid gap-3 sm:grid-cols-[1.2fr_1fr]">
          <div className={`rounded-xl border p-4 ${change < 0 ? "border-green-500/20 bg-green-500/5" : change > 0 ? "border-red-500/20 bg-red-500/5" : "border-border/60 bg-muted/40"}`}>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Inflation</div>
            <div className="text-3xl sm:text-4xl font-bold mt-1.5 tabular-nums">{currentInflation.toFixed(1)}%</div>
            <div className={`mt-2 inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-2.5 py-1 ${ change < 0 ? "text-green-600 dark:text-green-400 bg-muted/40 border border-border/40" : "text-red-500 bg-muted/40 border border-border/40" }`}>
              {change < 0 ? <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" /> : <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />}
              {change > 0 ? "+" : ""}{change.toFixed(1)}% from last month
            </div>
            {updatedLabel && (
              <div className="mt-3 text-[11px] text-muted-foreground">
                Updated {updatedLabel}{sourceLabel ? ` • ${sourceLabel}` : ""}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
            <div className="text-xs text-muted-foreground mb-2">Last 6 months</div>
            <div className="space-y-2">
              {monthlyData.map((item, i) => (
                <div key={item.month} className="flex items-center gap-3">
                  <span className="text-[11px] text-muted-foreground w-8">{item.month}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${ i === monthlyData.length - 1 ? "bg-primary" : "bg-primary/50" }`}
                      style={{ width: `${(item.rate / 12) * 100}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-medium w-10 text-right">{item.rate}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 p-3.5 text-xs text-muted-foreground space-y-1.5">
          <p className="font-semibold text-foreground flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            What this means
          </p>
          {change < 0 ? (
            <p>Inflation is <span className="text-green-600 dark:text-green-400 font-medium">declining</span> — purchasing power is improving and the LRD is gaining stability.</p>
          ) : change > 0 ? (
            <p>Inflation is <span className="text-red-500 font-medium">rising</span> — the cost of goods is increasing. Budget accordingly and watch for rate changes.</p>
          ) : (
            <p>Inflation is <span className="font-medium text-foreground">holding steady</span> — prices remain stable for now. Lower inflation supports a more stable LRD.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Quick Rate Share
export function QuickRateShare({ rate }: { rate: number }) {
  const shareText = `USD/LRD Exchange Rate: ${rate.toFixed(2)} LRD per 1 USD\n\nCheck live rates on TrueRate-Liberia`

  const shareViaWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank")
  }

  const shareViaSMS = () => {
    window.open(`sms:?body=${encodeURIComponent(shareText)}`, "_blank")
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-sm text-muted-foreground">Current Rate</div>
            <div className="text-2xl font-bold">{rate.toFixed(2)} LRD/USD</div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={shareViaWhatsApp} className="flex-1 sm:flex-initial">
              Share via WhatsApp
            </Button>
            <Button size="sm" variant="outline" onClick={shareViaSMS}>
              <Send className="h-4 w-4 text-primary" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}








