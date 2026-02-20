import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

const trustPoints = [
  "Indicative market (street) rates with update timestamps",
  "Transparent sources and update frequency disclosures",
  "Report bad rates and fraud so others don't get cheated; safety guidance for users",
  "Works offline with PWA technology",
  "SMS alerts for feature phone users",
  "Independent, informational platform (not a bank or money transfer service)",
]

export function TrustSignals() {
  return (
    <section className="py-10 sm:py-14 md:py-24 bg-background overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 max-w-[100vw] xl:max-w-none">
        <Card className="max-w-5xl mx-auto border-border/60 bg-primary/5 shadow-sm rounded-xl sm:rounded-2xl overflow-hidden">
          <CardContent className="pt-6 sm:pt-8 px-4 sm:px-6 pb-6 sm:pb-8">
            <div className="text-center mb-8 space-y-2">
              <Badge variant="outline" className="mx-auto w-fit">Trust & transparency</Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance">
                Trusted by thousands of Liberians
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground text-pretty">
                We’re committed to transparency and fair exchange rates.
              </p>
            </div>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
              {trustPoints.map((point, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/80 px-4 py-3.5 text-left transition-colors hover:border-primary/20"
                >
                  <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-foreground leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
