"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AlertCircle } from "lucide-react"

export default function MapPage() {
  const [mapScript, setMapScript] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!window.google) {
        const script = document.createElement("script")
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDummyKey`
        script.async = true
        script.defer = true
        document.head.appendChild(script)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <Navbar />
      <main className="flex flex-col">
        <section className="bg-background dark:bg-background py-8 sm:py-12 border-b border-foreground/10 dark:border-foreground/10">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <h1 className="text-5xl font-black text-foreground dark:text-foreground mb-2 tracking-tight">
              LIBERIA EXCHANGE MAP
            </h1>
            <p className="text-xs font-mono text-foreground/60 dark:text-foreground/60 uppercase tracking-wider">
              Money Changer Locations & Local Rates
            </p>
          </div>
        </section>

        <section className="bg-background dark:bg-background py-8 sm:py-12 border-b border-foreground/10 dark:border-foreground/10">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="border-2 border-foreground/20 dark:border-foreground/20 p-8 bg-card dark:bg-card h-96 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-foreground/60 dark:text-foreground/60" />
                <p className="text-sm font-mono text-foreground/70 dark:text-foreground/70 mb-2">Map Integration</p>
                <p className="text-xs font-mono text-foreground/60 dark:text-foreground/60">
                  Monrovia & Regional Money Changer Locations
                </p>
                <p className="text-xs font-mono text-foreground/50 dark:text-foreground/50 mt-4">
                  Add Google Maps API key in app/map/page.tsx to display locations
                </p>
              </div>
            </div>

            {/* Major Cities */}
            <div className="mt-12">
              <h2 className="text-2xl font-black text-foreground dark:text-foreground mb-8 tracking-tight">
                MAJOR EXCHANGE CENTERS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { city: "Monrovia (Downtown)", coords: "6.3155°N, 10.8073°W", changers: "120+" },
                  { city: "Congo Town", coords: "6.3000°N, 10.8200°W", changers: "45+" },
                  { city: "Paynesville", coords: "6.3500°N, 10.7800°W", changers: "38+" },
                ].map((location) => (
                  <div
                    key={location.city}
                    className="border-l-4 border-accent pl-6 py-4 rounded-lg bg-card dark:bg-card p-4"
                  >
                    <h3 className="text-sm font-mono font-bold text-foreground dark:text-foreground mb-2">
                      {location.city}
                    </h3>
                    <p className="text-xs font-mono text-foreground/70 dark:text-foreground/70 mb-3">
                      {location.coords}
                    </p>
                    <p className="text-lg font-black text-foreground dark:text-foreground">
                      {location.changers} Changers
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
