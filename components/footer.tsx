import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">TR</span>
              </div>
              <span className="text-lg font-bold">TrueRate Liberia</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Liberia's most accurate platform for real-time currency exchange rates and AI-powered predictions.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              A product by{" "}
              <a
                href="https://huix-2099.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-semibold"
              >
                HUIX-2099
              </a>
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Tools</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/converter" className="text-muted-foreground hover:text-foreground transition-colors">
                  Currency Converter
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="text-muted-foreground hover:text-foreground transition-colors">
                  Rate Analytics
                </Link>
              </li>
              <li>
                <Link href="/predictions" className="text-muted-foreground hover:text-foreground transition-colors">
                  AI Predictions
                </Link>
              </li>
              <li>
                <Link href="/map" className="text-muted-foreground hover:text-foreground transition-colors">
                  Interactive Map
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/community" className="text-muted-foreground hover:text-foreground transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/report-fraud" className="text-muted-foreground hover:text-foreground transition-colors">
                  Report Fraud
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
                  Data Sources
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>SMS: 1234 (RATE)</li>
              <li>Email: info@truerate.lr</li>
              <li>Monrovia, Liberia</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-sm text-muted-foreground">© 2025 TrueRate-Liberia. All rights reserved.</p>
            <p className="text-xs text-muted-foreground">
              Built by{" "}
              <a
                href="https://huix-2099.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-semibold"
              >
                HUIX-2099
              </a>{" "}
              • A Liberian Future-Tech Startup
            </p>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
