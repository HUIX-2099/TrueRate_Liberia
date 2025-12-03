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
    description: "Report scams and see warnings about fraudulent changers. Community-driven safety.",
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
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Everything you need to exchange safely</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Built for Liberians, by Liberians. Access rates offline, report fraud, and stay informed.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="border-border">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
