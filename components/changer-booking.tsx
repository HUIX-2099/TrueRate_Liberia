"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, Clock, MapPin, Phone, DollarSign, 
  CheckCircle2, AlertCircle, Star, Shield 
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { useLanguage } from "@/lib/i18n/language-context"

interface Changer {
  id: string
  name: string
  location: string
  distance: number
  rate: number
  rating: number
  reviewCount: number
  verified: boolean
  availableCash: number
  phone: string
  openUntil: string
}

const mockChangers: Changer[] = [
  {
    id: '1',
    name: 'Duala Money Exchange',
    location: 'Duala Market, Paynesville',
    distance: 5,
    rate: 198.50,
    rating: 4.8,
    reviewCount: 124,
    verified: true,
    availableCash: 15000,
    phone: '+231-555-0101',
    openUntil: '6:00 PM'
  },
  {
    id: '2',
    name: 'Red Light Express Bureau',
    location: 'Red Light Market',
    distance: 8,
    rate: 198.00,
    rating: 4.5,
    reviewCount: 89,
    verified: true,
    availableCash: 25000,
    phone: '+231-555-0102',
    openUntil: '7:00 PM'
  },
  {
    id: '3',
    name: 'Liberty Exchange Services',
    location: 'Broad Street, Monrovia',
    distance: 12,
    rate: 197.80,
    rating: 4.9,
    reviewCount: 256,
    verified: true,
    availableCash: 50000,
    phone: '+231-555-0103',
    openUntil: '5:00 PM'
  }
]

export function ChangerBooking() {
  const { t, isMarketWomanMode } = useLanguage()
  const [selectedChanger, setSelectedChanger] = useState<Changer | null>(null)
  const [bookingAmount, setBookingAmount] = useState('')
  const [pickupTime, setPickupTime] = useState('')
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)

  const handleBook = () => {
    // In production, this would make an API call
    setBookingConfirmed(true)
    setTimeout(() => {
      setBookingConfirmed(false)
      setBookingOpen(false)
      setSelectedChanger(null)
      setBookingAmount('')
      setPickupTime('')
    }, 3000)
  }

  const callChanger = (phone: string) => {
    window.open(`tel:${phone}`, '_self')
  }

  const amount = parseFloat(bookingAmount) || 0
  const lrdAmount = selectedChanger ? amount * selectedChanger.rate : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {t('business.booking')}
        </CardTitle>
        <CardDescription>
          {t('business.reserveCash')} - Skip the queue!
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Changer List */}
        <div className="space-y-3">
          {mockChangers.map(changer => (
            <div 
              key={changer.id}
              className={`p-4 border rounded-lg transition-colors cursor-pointer ${
                selectedChanger?.id === changer.id 
                  ? 'border-primary bg-primary/5' 
                  : 'hover:border-muted-foreground/50'
              }`}
              onClick={() => setSelectedChanger(changer)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{changer.name}</h4>
                    {changer.verified && (
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <Shield className="h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" />
                    {changer.location}
                    <span className="mx-1">•</span>
                    {changer.distance} mins away
                  </div>
                </div>
                <div className="text-right">
                  <div className={`${isMarketWomanMode ? 'text-2xl' : 'text-xl'} font-bold text-secondary`}>
                    {changer.rate.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">LRD/USD</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-secondary text-secondary" />
                    {changer.rating} ({changer.reviewCount})
                  </span>
                  <span className="flex items-center gap-1 text-secondary">
                    <DollarSign className="h-4 w-4" />
                    ${changer.availableCash.toLocaleString()} ready
                  </span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Open until {changer.openUntil}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-3">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="gap-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    callChanger(changer.phone)
                  }}
                >
                  <Phone className="h-4 w-4" />
                  Call
                </Button>
                <Dialog open={bookingOpen && selectedChanger?.id === changer.id} onOpenChange={setBookingOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      className="gap-2 flex-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedChanger(changer)
                        setBookingOpen(true)
                      }}
                    >
                      <Calendar className="h-4 w-4" />
                      Book Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    {!bookingConfirmed ? (
                      <>
                        <DialogHeader>
                          <DialogTitle>Reserve Cash at {changer.name}</DialogTitle>
                          <DialogDescription>
                            Reserve your USD and skip the queue
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                          {/* Rate Info */}
                          <div className="p-3 bg-secondary/10 rounded-lg">
                            <div className="text-sm text-muted-foreground">Guaranteed Rate</div>
                            <div className="text-2xl font-bold text-secondary">
                              {changer.rate.toFixed(2)} LRD/USD
                            </div>
                          </div>

                          {/* Amount Input */}
                          <div>
                            <label className="text-sm font-medium mb-2 block">
                              Amount (USD)
                            </label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="number"
                                placeholder="Enter amount..."
                                value={bookingAmount}
                                onChange={(e) => setBookingAmount(e.target.value)}
                                className="pl-9"
                                max={changer.availableCash}
                              />
                            </div>
                            {amount > changer.availableCash && (
                              <p className="text-sm text-destructive mt-1">
                                Maximum available: ${changer.availableCash.toLocaleString()}
                              </p>
                            )}
                            {amount > 0 && amount <= changer.availableCash && (
                              <p className="text-sm text-muted-foreground mt-1">
                                You'll receive: <span className="font-semibold text-secondary">
                                  L${lrdAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </span>
                              </p>
                            )}
                          </div>

                          {/* Pickup Time */}
                          <div>
                            <label className="text-sm font-medium mb-2 block">
                              Pickup Time
                            </label>
                            <Input
                              type="time"
                              value={pickupTime}
                              onChange={(e) => setPickupTime(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Reservation held for 2 hours
                            </p>
                          </div>

                          {/* Location */}
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-primary mt-0.5" />
                              <div>
                                <div className="font-medium">{changer.location}</div>
                                <div className="text-sm text-muted-foreground">
                                  {changer.distance} minutes from your location
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <DialogFooter>
                          <Button variant="outline" onClick={() => setBookingOpen(false)}>
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleBook}
                            disabled={!amount || amount > changer.availableCash || !pickupTime}
                          >
                            Confirm Reservation
                          </Button>
                        </DialogFooter>
                      </>
                    ) : (
                      <div className="py-8 text-center">
                        <CheckCircle2 className="h-16 w-16 text-secondary mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Booking Confirmed!</h3>
                        <p className="text-muted-foreground mb-4">
                          ${bookingAmount} reserved at {changer.name}
                        </p>
                        <div className="p-4 bg-muted/50 rounded-lg text-left">
                          <div className="text-sm space-y-2">
                            <p><strong>Rate:</strong> {changer.rate.toFixed(2)} LRD/USD</p>
                            <p><strong>You'll receive:</strong> L${lrdAmount.toLocaleString()}</p>
                            <p><strong>Pickup:</strong> {pickupTime} at {changer.location}</p>
                            <p><strong>Phone:</strong> {changer.phone}</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-4">
                          SMS confirmation sent to your phone
                        </p>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Note */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <div className="font-semibold text-sm">TrueRate Business Feature</div>
              <p className="text-xs text-muted-foreground mt-1">
                Reserve cash and lock in rates with TrueRate Business ($3-5/month).
                Reservations are guaranteed for 2 hours.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

