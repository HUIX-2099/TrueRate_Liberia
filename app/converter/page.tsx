import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CurrencyConverter } from "@/components/currency-converter"
import { Card, CardContent } from "@/components/ui/card"
import { LiveRates } from "@/components/live-rates"

export default function ConverterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Quick Currency Converter</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Calculate exchange amounts instantly with real-time rates from 100+ trusted sources
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-16">
            <CurrencyConverter />
          </div>

          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Current Live Rates</h2>
            <LiveRates />
          </div>

          <div className="mt-12 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">About Our Rates</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Our converter uses real-time data aggregated from over 100 sources including:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>International financial data APIs</li>
                    <li>Verified money changers across Monrovia</li>
                    <li>Licensed financial institutions</li>
                    <li>Community-reported rates (verified)</li>
                  </ul>
                  <p className="mt-4">
                    Rates are updated every minute and validated through our AI verification system.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
