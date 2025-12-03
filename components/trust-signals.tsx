import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

const trustPoints = [
  "Updated every 5 minutes with real market data",
  "Over 500 verified money changers",
  "Community-driven fraud reporting system",
  "Works offline with PWA technology",
  "SMS alerts for feature phone users",
  "Endorsed by local business associations",
]

export function TrustSignals() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto bg-primary/5 border-primary/20">
          <CardContent className="pt-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-balance">Trusted by thousands of Liberians</h2>
              <p className="text-muted-foreground text-pretty">
                We're committed to transparency and helping you get fair exchange rates
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {trustPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
