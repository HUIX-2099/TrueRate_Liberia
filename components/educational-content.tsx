"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { BookOpen, TrendingUp, Shield, AlertCircle, Lightbulb } from "lucide-react"

const lessons = [
  {
    category: "Basics",
    icon: BookOpen,
    color: "text-primary",
    items: [
      {
        title: "What is an exchange rate?",
        content:
          "An exchange rate is the price of one currency in terms of another. For example, if the USD/LRD rate is 185.50, it means 1 US Dollar can be exchanged for 185.50 Liberian Dollars. Exchange rates change based on supply and demand in the market.",
        duration: "2 min read",
      },
      {
        title: "Understanding buy and sell rates",
        content:
          "Money changers quote two rates: the buy rate (what they'll pay you for USD) and the sell rate (what they'll charge you for USD). The difference is called the 'spread' - this is how changers make their profit. Always compare both rates when choosing a changer.",
        duration: "3 min read",
      },
      {
        title: "Best time to exchange money",
        content:
          "Exchange rates fluctuate throughout the day. Generally, mid-week (Tuesday-Thursday) tends to have more stable rates. Avoid exchanging money during major holidays or economic announcements when volatility is higher. Monitor trends over a few days before large exchanges.",
        duration: "3 min read",
      },
    ],
  },
  {
    category: "Safety",
    icon: Shield,
    color: "text-secondary",
    items: [
      {
        title: "How to spot fake US dollars",
        content:
          "Check for these security features: watermark portrait visible from both sides, security thread that glows under UV light, color-shifting ink on the denomination number, microprinting, and raised printing you can feel. Never accept bills that feel too smooth, have blurry printing, or lack these features.",
        duration: "4 min read",
      },
      {
        title: "Red flags when exchanging money",
        content:
          "Be wary of changers who: offer rates significantly better than market average, operate without a fixed location, pressure you to exchange quickly, count money suspiciously fast, or refuse to provide receipts. Always verify the changer is licensed and has good community reviews.",
        duration: "3 min read",
      },
      {
        title: "What to do if scammed",
        content:
          "If you suspect fraud: stop the transaction immediately, don't leave the location, call the police, take photos if safe to do so, and report the incident on TrueRate-Liberia. Keep all evidence including receipts and bills. File a police report within 24 hours.",
        duration: "3 min read",
      },
    ],
  },
  {
    category: "Market Insights",
    icon: TrendingUp,
    color: "text-accent-foreground",
    items: [
      {
        title: "Why rates fluctuate",
        content:
          "Exchange rates change due to inflation, interest rates, government policies, foreign investment, trade balance, and global economic events. When Liberia imports more than it exports, demand for USD increases, making LRD weaker. Political stability and government policies also play major roles.",
        duration: "4 min read",
      },
      {
        title: "Impact of inflation on your money",
        content:
          "Inflation reduces purchasing power over time. If inflation is 5% annually and you hold 1000 LRD, it will only buy about 950 LRD worth of goods next year. This is why many Liberians prefer holding USD for savings, though this creates additional demand pressure on exchange rates.",
        duration: "4 min read",
      },
      {
        title: "Understanding street vs official rates",
        content:
          "The 'street rate' from money changers often differs from official banking rates. Street rates reflect real market supply and demand, while official rates may be controlled. Most everyday transactions use street rates, which is why TrueRate-Liberia focuses on actual market prices.",
        duration: "3 min read",
      },
    ],
  },
  {
    category: "Smart Tips",
    icon: Lightbulb,
    color: "text-chart-1",
    items: [
      {
        title: "Calculating total exchange costs",
        content:
          "The posted rate isn't your final cost. Factor in: the spread between buy/sell rates, any commission fees, convenience charges, and transportation costs. A slightly worse rate at a nearby trusted changer may be better than traveling far for a marginally better rate.",
        duration: "3 min read",
      },
      {
        title: "Using mobile money vs cash exchange",
        content:
          "Mobile money transfers (Lonestar MTN, Orange) offer convenience but often have higher fees and worse rates than cash exchange. Compare the total cost including fees. Mobile money is best for small amounts or urgent transfers, while cash exchange is better for larger amounts.",
        duration: "3 min read",
      },
      {
        title: "Planning your budget with rate changes",
        content:
          "If you earn in LRD but need to buy imported goods priced in USD, track the exchange rate trends. When LRD strengthens (rate drops), it's a good time to make purchases. Budget a 5-10% buffer for rate fluctuations in your monthly planning.",
        duration: "4 min read",
      },
    ],
  },
]

export function EducationalContent() {
  return (
    <div className="space-y-8">
      {lessons.map((category, idx) => (
        <Card key={idx}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted`}>
                <category.icon className={`h-5 w-5 ${category.color}`} />
              </div>
              <div>
                <CardTitle>{category.category}</CardTitle>
                <CardDescription>{category.items.length} lessons</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {category.items.map((lesson, lessonIdx) => (
                <AccordionItem key={lessonIdx} value={`item-${idx}-${lessonIdx}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center justify-between w-full pr-4">
                      <span className="font-medium">{lesson.title}</span>
                      <Badge variant="secondary" className="text-xs">
                        {lesson.duration}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-muted-foreground leading-relaxed pt-2">{lesson.content}</div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ))}

      <Card className="bg-accent/10 border-accent/30">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <AlertCircle className="h-5 w-5 text-accent-foreground flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Have a question?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Can't find what you're looking for? Send us your question via SMS to 1234 or email
                info@truerate-liberia.com. We'll add it to our educational content to help the entire community.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
