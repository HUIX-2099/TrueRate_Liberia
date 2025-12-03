"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, Volume2, PlayCircle, StopCircle, PhoneCall, Info } from "lucide-react"
import { useState, useEffect } from "react"

export default function VoiceAssistantPage() {
  const [currentRate, setCurrentRate] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    fetch("/api/rates/live")
      .then((res) => res.json())
      .then((data) => {
        if (data.rate && typeof data.rate === "number") {
          setCurrentRate(data.rate)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error("[v0] Error fetching rate:", err)
        setLoading(false)
      })
  }, [])

  const speakRate = () => {
    if ("speechSynthesis" in window && currentRate) {
      setPlaying(true)
      const utterance = new SpeechSynthesisUtterance(
        `Today's exchange rate is 1 U.S. Dollar equals ${currentRate.toFixed(2)} Liberian Dollars.`,
      )
      utterance.lang = "en-US"
      utterance.onend = () => setPlaying(false)
      window.speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setPlaying(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Volume2 className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Voice Assistant</h1>
              <p className="text-lg text-muted-foreground text-pretty">
                Listen to today's exchange rates - perfect for users who prefer audio information
              </p>
            </div>
          </div>
        </section>

        <section className="py-8 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Audio Player */}
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="text-center space-y-6">
                    <div className="inline-block">
                      {loading || !currentRate ? (
                        <div className="text-xl font-semibold">Loading rate...</div>
                      ) : (
                        <div>
                          <div className="text-sm text-muted-foreground mb-2">Current Exchange Rate</div>
                          <div className="text-5xl font-bold text-primary">1 USD = {currentRate.toFixed(2)} LRD</div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center gap-4">
                      {!playing ? (
                        <Button size="lg" onClick={speakRate} disabled={loading || !currentRate}>
                          <PlayCircle className="h-5 w-5 mr-2" />
                          Play Audio Rate
                        </Button>
                      ) : (
                        <Button size="lg" variant="destructive" onClick={stopSpeaking}>
                          <StopCircle className="h-5 w-5 mr-2" />
                          Stop
                        </Button>
                      )}
                    </div>

                    <Badge variant="secondary" className="text-sm">
                      <Volume2 className="h-3 w-3 mr-1" />
                      Audio updates every minute
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* IVR Phone Service */}
              <Card className="mb-6 border-secondary">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center">
                      <Phone className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <CardTitle>Call for Today's Rate</CardTitle>
                      <CardDescription>IVR phone service available 24/7</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-6 bg-secondary/10 rounded-lg text-center">
                      <div className="text-sm text-muted-foreground mb-2">Toll-Free Number</div>
                      <div className="text-3xl font-bold text-secondary">1-800-TRUE-RATE</div>
                      <div className="text-sm text-muted-foreground mt-1">(1-800-8783-7283)</div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm">Phone Menu Options:</h3>
                      <div className="grid md:grid-cols-2 gap-2">
                        {[
                          "Press 1: Hear today's USD/LRD rate",
                          "Press 2: Hear yesterday's rate",
                          "Press 3: Weekly rate trend",
                          "Press 4: Find nearby money changers",
                          "Press 5: Report fraud or scam",
                          "Press 0: Speak to support",
                        ].map((option, i) => (
                          <div key={i} className="text-sm p-2 bg-muted rounded">
                            {option}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full" size="lg">
                      <PhoneCall className="h-5 w-5 mr-2" />
                      Call Now
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Language Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Available Languages</CardTitle>
                  <CardDescription>Choose your preferred language for audio rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-3">
                    {[
                      { name: "English", code: "EN" },
                      { name: "Kpelle", code: "KP" },
                      { name: "Bassa", code: "BA" },
                      { name: "Gio", code: "GI" },
                      { name: "Mano", code: "MA" },
                      { name: "Kru", code: "KR" },
                    ].map((lang) => (
                      <Button key={lang.code} variant="outline" className="justify-start bg-transparent">
                        <Badge variant="secondary" className="mr-2">
                          {lang.code}
                        </Badge>
                        {lang.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Info Card */}
              <Card className="mt-6 bg-accent/10 border-accent/30">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <Info className="h-5 w-5 text-accent-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">For Low-Literacy Users</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        This voice service is designed to help everyone access exchange rate information, regardless of
                        reading ability. Share this number with family and friends who prefer audio information.
                      </p>
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
