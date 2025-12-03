"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Star, Phone, Clock, CheckCircle, Search, MessageSquare } from "lucide-react"

const changers = [
  {
    id: 1,
    name: "Liberty Exchange Bureau",
    location: "Broad Street, Monrovia",
    address: "123 Broad Street, Central Monrovia",
    phone: "+231-77-123-4567",
    hours: "Mon-Sat: 8am-6pm",
    rating: 4.8,
    reviews: 245,
    verified: true,
    buyRate: 184.5,
    sellRate: 186.5,
    services: ["Cash Exchange", "Wire Transfer", "Mobile Money"],
    badges: ["Verified", "Top Rated"],
  },
  {
    id: 2,
    name: "First Atlantic Money Exchange",
    location: "Sinkor, Monrovia",
    address: "456 Tubman Boulevard, Sinkor",
    phone: "+231-77-234-5678",
    hours: "Mon-Fri: 9am-5pm, Sat: 9am-2pm",
    rating: 4.9,
    reviews: 312,
    verified: true,
    buyRate: 184.0,
    sellRate: 187.0,
    services: ["Cash Exchange", "Business Accounts", "Wire Transfer"],
    badges: ["Verified", "Best Rate"],
  },
  {
    id: 3,
    name: "Capital Exchange Services",
    location: "Carey Street, Monrovia",
    address: "789 Carey Street, Monrovia",
    phone: "+231-77-345-6789",
    hours: "Mon-Sat: 8am-7pm",
    rating: 4.7,
    reviews: 189,
    verified: true,
    buyRate: 183.5,
    sellRate: 187.5,
    services: ["Cash Exchange", "Mobile Money"],
    badges: ["Verified"],
  },
  {
    id: 4,
    name: "Quick Cash Bureau",
    location: "Red Light, Monrovia",
    address: "321 Paynesville Road, Red Light",
    phone: "+231-77-456-7890",
    hours: "Mon-Sun: 7am-8pm",
    rating: 4.6,
    reviews: 156,
    verified: false,
    buyRate: 184.2,
    sellRate: 186.8,
    services: ["Cash Exchange", "Mobile Money", "Airtime"],
    badges: [],
  },
  {
    id: 5,
    name: "Gbarnga Money Exchange",
    location: "Gbarnga, Bong County",
    address: "Main Street, Gbarnga City",
    phone: "+231-77-567-8901",
    hours: "Mon-Sat: 8am-6pm",
    rating: 4.5,
    reviews: 98,
    verified: true,
    buyRate: 183.0,
    sellRate: 188.0,
    services: ["Cash Exchange", "Mobile Money"],
    badges: ["Verified"],
  },
]

export function ChangerDirectory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedChanger, setSelectedChanger] = useState<number | null>(null)

  const filteredChangers = changers.filter(
    (changer) =>
      changer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      changer.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>Found {filteredChangers.length} money changers</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {filteredChangers.map((changer) => (
          <Card
            key={changer.id}
            className={`hover:shadow-lg transition-all cursor-pointer ${
              selectedChanger === changer.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedChanger(selectedChanger === changer.id ? null : changer.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <CardTitle className="text-lg">{changer.name}</CardTitle>
                    {changer.verified && <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />}
                  </div>
                  <CardDescription className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">{changer.location}</span>
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-secondary text-secondary" />
                    <span className="text-sm font-semibold">{changer.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{changer.reviews} reviews</span>
                </div>
              </div>

              {changer.badges.length > 0 && (
                <div className="flex gap-2 flex-wrap pt-2">
                  {changer.badges.map((badge, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted p-3 space-y-1">
                  <div className="text-xs text-muted-foreground">Buy Rate</div>
                  <div className="text-lg font-bold text-foreground">{changer.buyRate}</div>
                </div>
                <div className="rounded-lg bg-muted p-3 space-y-1">
                  <div className="text-xs text-muted-foreground">Sell Rate</div>
                  <div className="text-lg font-bold text-foreground">{changer.sellRate}</div>
                </div>
              </div>

              {selectedChanger === changer.id && (
                <div className="space-y-3 pt-3 border-t border-border animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{changer.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-foreground">{changer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-foreground">{changer.hours}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">Services</div>
                    <div className="flex flex-wrap gap-2">
                      {changer.services.map((service, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
