"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Suspense, useEffect, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, PerspectiveCamera, Html } from "@react-three/drei"
import { MapPin, TrendingUp, TrendingDown } from "lucide-react"

interface LocationRate {
  id: string
  name: string
  county: string
  position: [number, number, number]
  rate: number
  trend: string
  verified: boolean
}

function RateMarker({ location }: { location: LocationRate }) {
  const [hovered, setHovered] = useState(false)

  return (
    <group position={location.position}>
      <mesh onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color={location.verified ? "#10b981" : "#f59e0b"}
          emissive={hovered ? "#ffffff" : "#000000"}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
        <meshStandardMaterial color={location.verified ? "#10b981" : "#f59e0b"} />
      </mesh>
      {hovered && (
        <Html position={[0, 0.8, 0]} center>
          <div className="bg-card border border-border rounded-lg shadow-lg p-3 min-w-[200px]">
            <div className="text-sm font-semibold mb-1">{location.name}</div>
            <div className="text-xs text-muted-foreground mb-2">{location.county}</div>
            <div className="text-lg font-bold text-primary">{location.rate.toFixed(2)} LRD</div>
            <div className="flex items-center gap-1 text-xs mt-1">
              {location.trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-secondary" />
              ) : (
                <TrendingDown className="h-3 w-3 text-destructive" />
              )}
              <span className={location.trend === "up" ? "text-secondary" : "text-destructive"}>
                {location.trend === "up" ? "Rising" : "Falling"}
              </span>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

function LiberiaMap3D({ locations }: { locations: LocationRate[] }) {
  return (
    <group>
      {/* Simplified Liberia shape */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[8, 4]} />
        <meshStandardMaterial color="#1e40af" opacity={0.3} transparent />
      </mesh>

      {/* Border outline */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[3.9, 4, 64]} />
        <meshBasicMaterial color="#3b82f6" />
      </mesh>

      {/* Rate markers */}
      {locations.map((location) => (
        <RateMarker key={location.id} location={location} />
      ))}
    </group>
  )
}

function Map3DScene({ locations }: { locations: LocationRate[] }) {
  return (
    <Canvas shadows className="h-full w-full">
      <PerspectiveCamera makeDefault position={[0, 8, 8]} fov={50} />
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2}
      />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      <Suspense fallback={null}>
        <LiberiaMap3D locations={locations} />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  )
}

export default function MapPage() {
  const [locations, setLocations] = useState<LocationRate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLocations() {
      try {
        const response = await fetch("/api/rates/live")
        const data = await response.json()

        const mappedLocations: LocationRate[] = [
          {
            id: "1",
            name: data.changers[0]?.name || "Monrovia Central",
            county: "Montserrado",
            position: [0, 0, 0],
            rate: data.changers[0]?.buyRate || data.averageRate || 180,
            trend: data.changers[0]?.trend || "up",
            verified: data.changers[0]?.verified !== false,
          },
          {
            id: "2",
            name: data.changers[1]?.name || "Sinkor",
            county: "Montserrado",
            position: [1.5, 0, -0.5],
            rate: data.changers[1]?.buyRate || data.averageRate || 180,
            trend: data.changers[1]?.trend || "up",
            verified: data.changers[1]?.verified !== false,
          },
          {
            id: "3",
            name: data.changers[2]?.name || "Paynesville",
            county: "Montserrado",
            position: [2, 0, 0.5],
            rate: data.changers[2]?.buyRate || data.averageRate || 180,
            trend: data.changers[2]?.trend || "down",
            verified: data.changers[2]?.verified !== false,
          },
          {
            id: "4",
            name: "Buchanan",
            county: "Grand Bassa",
            position: [-2, 0, -1.5],
            rate: (data.averageRate || 180) - 1,
            trend: "up",
            verified: true,
          },
          {
            id: "5",
            name: "Gbarnga",
            county: "Bong",
            position: [-1, 0, 2],
            rate: (data.averageRate || 180) - 2.5,
            trend: "down",
            verified: true,
          },
          {
            id: "6",
            name: "Harper",
            county: "Maryland",
            position: [-3.5, 0, -2],
            rate: (data.averageRate || 180) - 3.5,
            trend: "up",
            verified: true,
          },
        ]

        setLocations(mappedLocations)
      } catch (error) {
        console.error("[v0] Error fetching map data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLocations()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-4">Interactive Map</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Exchange Rates Across Liberia</h1>
              <p className="text-lg text-muted-foreground text-pretty">
                Explore live exchange rates from different counties and cities. Hover over locations to see details.
              </p>
            </div>
          </div>
        </section>

        {/* 3D Map */}
        <section className="py-8 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <Card className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">Live Rate Map</CardTitle>
                      <CardDescription>Drag to rotate • Scroll to zoom • Click markers for details</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-secondary" />
                        <span className="text-xs">Verified</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-accent" />
                        <span className="text-xs">Unverified</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {loading ? (
                    <div className="h-[600px] flex items-center justify-center bg-muted/30">
                      <div className="text-center">
                        <div className="text-lg font-medium mb-2">Loading map...</div>
                        <div className="text-sm text-muted-foreground">Fetching live rates</div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-[600px] bg-gradient-to-b from-sky-100 to-background dark:from-sky-950 dark:to-background">
                      <Map3DScene locations={locations} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Location List */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Rates by Location</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {locations.map((location) => (
                  <Card key={location.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {location.name}
                          </CardTitle>
                          <CardDescription>{location.county} County</CardDescription>
                        </div>
                        {location.verified && (
                          <Badge variant="secondary" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">{location.rate.toFixed(2)}</span>
                        <span className="text-sm text-muted-foreground">LRD</span>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        {location.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-secondary" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            location.trend === "up" ? "text-secondary" : "text-destructive"
                          }`}
                        >
                          {location.trend === "up" ? "Rising" : "Falling"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Map Legend */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>How to Use the Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Navigation</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Drag to rotate the map</li>
                        <li>• Scroll to zoom in/out</li>
                        <li>• Hover over markers for rate details</li>
                        <li>• Click and drag to pan</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Markers</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Green markers = Verified changers</li>
                        <li>• Orange markers = Community reported</li>
                        <li>• Larger markers = Major cities</li>
                        <li>• Height indicates rate volume</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
