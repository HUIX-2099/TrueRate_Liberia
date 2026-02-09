import Link from "next/link"
import Image from "next/image"
import { Facebook, Mail, Phone, Twitter } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InstallPromptButton } from "@/components/pwa/install-prompt-button"

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr_1fr_1fr] text-center md:text-left">
          <div className="space-y-3">
            <div className="flex items-center justify-center md:justify-start">
              <div className="flex h-12 w-12 sm:h-[70px] sm:w-[70px] items-center justify-center overflow-hidden">
                <Image
                  src="/logos/Logo%201.png"
                  alt="TrueRate logo"
                  width={70}
                  height={70}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Liberia's most accurate platform for real-time currency exchange rates and AI-powered predictions.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <Badge variant="outline">Live USD/LRD</Badge>
              <Badge variant="secondary">Verified changers</Badge>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
              <Button asChild size="sm">
                <Link href="/map">Find Nearest</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/converter">Convert Now</Link>
              </Button>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
              <a
                href="https://twitter.com/TrueRateLiberia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="TrueRate Liberia on X"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com/TrueRateLiberia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="TrueRate Liberia on Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
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

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Stay Updated</h3>
            <div className="rounded-xl border border-border/60 bg-background/70 p-4 text-sm">
              <div className="font-semibold">Mobile App Access</div>
              <p className="mt-2 text-muted-foreground">
                Request access to the mobile experience for faster, on-the-go rates.
              </p>
              <InstallPromptButton label="Request App Access" />
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Phone className="h-4 w-4" />
                SMS: 1234 (RATE)
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Mail className="h-4 w-4" />
                info@truerate.lr
              </div>
              <div className="text-center md:text-left">Online-only for now</div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
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
          <div className="flex gap-6 text-sm justify-center md:justify-end">
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
