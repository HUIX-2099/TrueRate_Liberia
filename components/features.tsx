import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, Shield, Users, TrendingUp, MessageSquare, Award } from "lucide-react"

const features = [
  {
    icon: Smartphone,
    title: "SMS Rate Alerts",
    description: "Get daily rate updates via SMS, even without a smartphone. Text RATE to 1234 to subscribe.",
  },
  {
    icon: Shield,
    title: "Fraud Protection",
    description: "Report bad rates and fraud so others don't get cheated. See warnings about fraudulent changers. When people trust the system, LRD is taken seriously.",
  },
  {
    icon: Users,
    title: "Community Reports",
    description: "Submit and verify street rates with photo proof. Crowdsourced accuracy.",
  },
  {
    icon: TrendingUp,
    title: "Rate History & Charts",
    description: "Track exchange rate trends over time. Make informed decisions about when to exchange.",
  },
  {
    icon: MessageSquare,
    title: "Changer Reviews",
    description: "Rate and review money changers. Help others find trustworthy service providers.",
  },
  {
    icon: Award,
    title: "Verified Changers",
    description: "Find officially verified and community-trusted exchange bureaus with badges.",
  },
]

export function Features() {
  return (
    <section className="py-10 sm:py-14 md:py-24 bg-muted/30 overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-[100vw]">
        <div className="text-center mb-8 sm:mb-12 space-y-2">
          <Badge variant="outline" className="mx-auto w-fit">Safety tools</Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance">
            Everything you need to exchange safely
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Built for Liberians, by Liberians. Access rates offline, report fraud, and stay informed.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border/60 bg-background/70 shadow-sm rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/10"
            >
              <CardHeader className="text-center md:text-left">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 mb-4 mx-auto md:mx-0">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-base sm:text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center md:text-left">
                <CardDescription className="text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
