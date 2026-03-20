"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingDown, Package } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

interface ImportItem {
  id: string
  name: string
  nameKey: string
  baseUSDPrice: number
  unit: string
  icon: string
}

// Base USD prices aligned with Liberia Price Index (/api/price-index): CBL, LISGIS, market surveys
const importItems: ImportItem[] = [
  { id: 'rice', name: 'Rice (50kg)', nameKey: 'import.rice', baseUSDPrice: 21, unit: 'bag', icon: '🌾' }, // ~2× 25kg Local (11) per price-index
  { id: 'cement', name: 'Cement (50kg)', nameKey: 'import.cement', baseUSDPrice: 8.5, unit: 'bag', icon: '🧱' },
  { id: 'fuel', name: 'Fuel/Gasoline', nameKey: 'import.fuel', baseUSDPrice: 4.15, unit: 'gallon', icon: '⛽' },
]

export function ImportPriceAlert() {
  const { isMarketWomanMode } = useLanguage()
  const [currentRate, setCurrentRate] = useState<number>(198.5)
  const [homePrices, setHomePrices] = useState<Partial<Record<string, number>>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRates() {
      try {
        const [liveRes, priceRes] = await Promise.all([
          fetch('/api/rates/live'),
          fetch('/api/price-index'),
        ])

        const liveData = await liveRes.json()
        
        if (liveData.rate && typeof liveData.rate === 'number') {
          setCurrentRate(liveData.rate)
        }

        const priceData = await priceRes.json()
        if (Array.isArray(priceData?.items)) {
          const items = priceData.items as Array<{ name?: string; priceLRD?: number }>
          const rice25Local = items.find((it) => it.name?.toLowerCase().includes("25kg rice (local)"))?.priceLRD
          const cement50 = items.find((it) => it.name?.toLowerCase().includes("cement (50kg)"))?.priceLRD
          const gasGallon = items.find((it) => it.name?.toLowerCase().includes("gallon of gas"))?.priceLRD

          setHomePrices({
            rice: typeof rice25Local === "number" ? rice25Local * 2 : undefined,
            cement: typeof cement50 === "number" ? cement50 : undefined,
            fuel: typeof gasGallon === "number" ? gasGallon : undefined,
          })
        }
      } catch (error) {
        console.error('Error fetching rates:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRates()
  }, [])

  const calculatePrices = (item: ImportItem) => {
    const todayPrice = homePrices[item.id] ?? (item.baseUSDPrice * currentRate)
    const fridayPrice = todayPrice * 0.997 // Friday estimate fixed at -0.3%
    const difference = fridayPrice - todayPrice
    const percentChange = -0.3
    
    return {
      todayPrice,
      fridayPrice,
      difference,
      percentChange,
    }
  }

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-48 bg-muted rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  const selectedItemsData = importItems
  const totalExtraCost = selectedItemsData.reduce((sum, item) => {
    const prices = calculatePrices(item)
    return sum + prices.difference
  }, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          Import Price Alert
        </CardTitle>
        <CardDescription>
          Track how exchange rate changes affect your import costs
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Price Alerts for Selected Items */}
        <div className="space-y-3">
          {selectedItemsData.map(item => {
            const prices = calculatePrices(item)
            
            return (
              <div 
                key={item.id}
                className="p-4 rounded-lg border-2 border-secondary/50 bg-secondary/5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{item.icon}</span>
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Base: ${item.baseUSDPrice} USD per {item.unit}
                      </div>
                    </div>
                  </div>
                  
                  <Badge variant="secondary" className="gap-1">
                    <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                    {prices.percentChange.toFixed(1)}%
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Price Today</div>
                    <div className={`${isMarketWomanMode ? 'text-xl' : 'text-lg'} font-bold`}>
                      L${prices.todayPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Friday Price</div>
                    <div className={`${isMarketWomanMode ? 'text-xl' : 'text-lg'} font-bold`}>
                      L${prices.fridayPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">If you wait until Friday</div>
                    <div className={`${isMarketWomanMode ? 'text-xl' : 'text-lg'} font-bold text-secondary`}>
                      L$${prices.difference.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {totalExtraCost < 0 && (
          <div className="p-4 bg-muted/40 border border-border/40 border-2 border-secondary rounded-lg">
            <div className="flex items-center gap-3">
              <TrendingDown className="h-8 w-8 text-red-600 dark:text-red-400" />
              <div>
                <div className="font-semibold text-secondary">
                  {isMarketWomanMode ? 'Good News-O!' : 'Good News!'}
                </div>
                <div className="text-sm text-muted-foreground">
                  Wait until Friday to save money
                </div>
              </div>
              <div className={`${isMarketWomanMode ? 'text-3xl' : 'text-2xl'} font-bold text-secondary ml-auto`}>
                Save L${Math.abs(totalExtraCost).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}



