"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Package, AlertTriangle, Bell } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

interface ImportItem {
  id: string
  name: string
  nameKey: string
  baseUSDPrice: number
  unit: string
  icon: string
}

const importItems: ImportItem[] = [
  { id: 'rice', name: 'Rice (50kg)', nameKey: 'import.rice', baseUSDPrice: 45, unit: 'bag', icon: '🌾' },
  { id: 'cement', name: 'Cement (50kg)', nameKey: 'import.cement', baseUSDPrice: 12, unit: 'bag', icon: '🧱' },
  { id: 'fuel', name: 'Fuel/Gasoline', nameKey: 'import.fuel', baseUSDPrice: 4.5, unit: 'gallon', icon: '⛽' },
  { id: 'flour', name: 'Flour (25kg)', nameKey: 'import.flour', baseUSDPrice: 18, unit: 'bag', icon: '🌾' },
  { id: 'sugar', name: 'Sugar (50kg)', nameKey: 'import.sugar', baseUSDPrice: 35, unit: 'bag', icon: '🍬' },
  { id: 'oil', name: 'Cooking Oil (20L)', nameKey: 'import.oil', baseUSDPrice: 28, unit: 'jerrycan', icon: '🫒' },
]

export function ImportPriceAlert() {
  const { t, isMarketWomanMode } = useLanguage()
  const [currentRate, setCurrentRate] = useState<number>(198.5)
  const [predictedRate, setPredictedRate] = useState<number>(200.2)
  const [selectedItems, setSelectedItems] = useState<string[]>(['rice', 'cement', 'fuel'])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRates() {
      try {
        const [liveRes, predRes] = await Promise.all([
          fetch('/api/rates/live'),
          fetch('/api/rates/predictions?days=5')
        ])
        
        const liveData = await liveRes.json()
        const predData = await predRes.json()
        
        setCurrentRate(liveData.rate || 198.5)
        
        const predictions = predData.predictions || []
        if (predictions.length >= 5) {
          setPredictedRate(predictions[4].predictedRate)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRates()
  }, [])

  const toggleItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const calculatePrices = (item: ImportItem) => {
    const todayPrice = item.baseUSDPrice * currentRate
    const fridayPrice = item.baseUSDPrice * predictedRate
    const difference = fridayPrice - todayPrice
    const percentChange = ((predictedRate - currentRate) / currentRate) * 100
    
    return {
      todayPrice,
      fridayPrice,
      difference,
      percentChange,
      isIncreasing: difference > 0
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

  const selectedItemsData = importItems.filter(item => selectedItems.includes(item.id))
  const totalExtraCost = selectedItemsData.reduce((sum, item) => {
    const prices = calculatePrices(item)
    return sum + prices.difference
  }, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          {t('import.title')}
        </CardTitle>
        <CardDescription>
          Track how exchange rate changes affect your import costs
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Item Selector */}
        <div>
          <label className="text-sm font-medium mb-3 block">Select items to track (max 3):</label>
          <div className="flex flex-wrap gap-2">
            {importItems.map(item => (
              <Button
                key={item.id}
                variant={selectedItems.includes(item.id) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleItem(item.id)}
                disabled={!selectedItems.includes(item.id) && selectedItems.length >= 3}
                className="gap-2"
              >
                <span>{item.icon}</span>
                {item.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Rate Comparison */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
          <div>
            <div className="text-sm text-muted-foreground">Today's Rate</div>
            <div className="text-2xl font-bold">{currentRate.toFixed(2)} LRD</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Friday (Predicted)</div>
            <div className={`text-2xl font-bold ${predictedRate > currentRate ? 'text-destructive' : 'text-secondary'}`}>
              {predictedRate.toFixed(2)} LRD
            </div>
          </div>
        </div>

        {/* Price Alerts for Selected Items */}
        <div className="space-y-3">
          {selectedItemsData.map(item => {
            const prices = calculatePrices(item)
            
            return (
              <div 
                key={item.id}
                className={`p-4 rounded-lg border-2 ${
                  prices.isIncreasing ? 'border-destructive/50 bg-destructive/5' : 'border-secondary/50 bg-secondary/5'
                }`}
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
                  
                  {prices.isIncreasing ? (
                    <Badge variant="destructive" className="gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +{prices.percentChange.toFixed(1)}%
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <TrendingDown className="h-3 w-3" />
                      {prices.percentChange.toFixed(1)}%
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <div className="text-xs text-muted-foreground">{t('import.priceToday')}</div>
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
                    <div className="text-xs text-muted-foreground">{t('import.priceChange')}</div>
                    <div className={`${isMarketWomanMode ? 'text-xl' : 'text-lg'} font-bold ${prices.isIncreasing ? 'text-destructive' : 'text-secondary'}`}>
                      {prices.isIncreasing ? '+' : ''}L${prices.difference.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Total Extra Cost Alert */}
        {totalExtraCost > 0 && (
          <div className="p-4 bg-destructive/10 border-2 border-destructive rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <div>
                <div className="font-semibold text-destructive">
                  {isMarketWomanMode ? 'Warning-O!' : 'Import Cost Warning!'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t('import.alert')}
                </div>
              </div>
              <div className={`${isMarketWomanMode ? 'text-3xl' : 'text-2xl'} font-bold text-destructive ml-auto`}>
                +L${totalExtraCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
            </div>
          </div>
        )}

        {totalExtraCost < 0 && (
          <div className="p-4 bg-secondary/10 border-2 border-secondary rounded-lg">
            <div className="flex items-center gap-3">
              <TrendingDown className="h-8 w-8 text-secondary" />
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

        {/* Set Alert Button */}
        <Button className="w-full gap-2">
          <Bell className="h-4 w-4" />
          Set Price Alert for These Items
        </Button>
      </CardContent>
    </Card>
  )
}

