import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageSection } from "@/components/layout/page-section"
import { SectionHeader } from "@/components/layout/section-header"
import { PageContainer } from "@/components/layout/page-container"
import { ArrowUpDown, Send, PiggyBank, TrendingUp, GraduationCap, Zap } from "lucide-react"

const features = [
  {
    icon: ArrowUpDown,
    title: "Currency Converter",
    description: "Convert USD and LRD with the latest market rate, so you can confirm fair value before you pay.",
  },
  {
    icon: Send,
    title: "Remittance Calculator",
    description: "Compare fees and exchange rates across providers, so your family gets what you intended to send.",
  },
  {
    icon: PiggyBank,
    title: "Budget Planner",
    description: "Plan income and expenses in USD and LRD and see how rate shifts can affect your month.",
  },
  {
    icon: TrendingUp,
    title: "Inflation Tracker",
    description: "Follow cost-of-living changes over time and understand what prices mean for your household.",
  },
  {
    icon: GraduationCap,
    title: "Student Budget Tool",
    description: "Estimate semester costs for tuition, transport, and daily living so families can plan early.",
  },
  {
    icon: Zap,
    title: "Personal Impact Calculator",
    description: "See how rate and price changes affect transport, food, and other essentials in daily life.",
  },
]

export function Features() {
  return (
    <PageSection id="safety-tools" variant="muted" ariaLabelledBy="safety-tools-heading" className="hidden md:block">
      <PageContainer className="min-w-0">
        <SectionHeader
          id="safety-tools-heading"
          badge={<Badge variant="outline" className="mx-auto w-fit text-[11px] sm:text-xs">Safety & tools</Badge>}
          title="Practical tools for real money decisions"
          description="Built with Liberian realities in mind. Convert, track rates, report fraud, and compare prices with tools you can trust."
        />
        <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto w-full min-w-0 [&>*]:min-w-0">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/10 min-w-0"
            >
              <CardHeader className="text-center md:text-left px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-muted/40 border border-border/40 mb-3 sm:mb-4 mx-auto md:mx-0">
                  <feature.icon className="h-5 w-5 text-foreground" />
                </div>
                <CardTitle className="text-base sm:text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center md:text-left px-4 sm:px-6 pb-4 sm:pb-6">
                <CardDescription className="text-xs sm:text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageContainer>
    </PageSection>
  )
}

export default Features
