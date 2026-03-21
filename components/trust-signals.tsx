import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { PageSection } from "@/components/layout/page-section"
import { SectionHeader } from "@/components/layout/section-header"
import { PageContainer } from "@/components/layout/page-container"
import { CheckCircle } from "lucide-react"

const trustPoints = [
  "Live market data—rates, prices, and trends—with clear timestamps and sources",
  "Transparent sources and update frequency so you know what you're seeing",
  "Report bad rates and fraud; community safety so others don't get cheated",
  "Works offline with PWA support when connectivity is spotty",
  "SMS alerts for feature phones so everyone can stay informed",
  "Independent market-information platform (not a bank or money transfer service)",
]

export function TrustSignals() {
  return (
    <PageSection id="trust-transparency" ariaLabelledBy="trust-heading">
      <PageContainer maxWidth="5xl" className="min-w-0">
        <Card className="border-border/60 bg-primary/5 rounded-xl sm:rounded-2xl min-w-0">
          <CardContent className="pt-6 sm:pt-8 md:pt-10 px-4 sm:px-6 md:px-8 pb-6 sm:pb-8 md:pb-10">
            <SectionHeader
              id="trust-heading"
              badge={<Badge variant="outline" className="mx-auto w-fit text-[11px] sm:text-xs">Trust & transparency</Badge>}
              title="Trusted by people across Liberia"
              description="Clear sources, practical tools, and transparent updates you can check for yourself."
            />
            <div className="grid gap-3 sm:gap-6 grid-cols-1 md:grid-cols-2 min-w-0 [&>*]:min-w-0">
              {trustPoints.map((point, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg sm:rounded-xl border border-border/60 bg-muted/20 px-3 py-3 sm:px-4 sm:py-3.5 text-left transition-colors hover:border-border/80 min-w-0"
                >
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5 text-green-600 dark:text-green-400" />
                  <span className="text-xs sm:text-base text-foreground leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    </PageSection>
  )
}

export default TrustSignals
