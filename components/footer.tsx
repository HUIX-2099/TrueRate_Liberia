import Link from "next/link"
import Image from "next/image"
import { Facebook, Mail, Phone, Twitter } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InstallPromptButton } from "@/components/pwa/install-prompt-button"

export function Footer() {
  return (
    <footer id="site-footer" className="border-t border-border/60 bg-muted/30 backdrop-blur-sm overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-10 sm:py-14 md:py-16 max-w-[100vw] xl:max-w-none">
        <div className="grid gap-8 sm:gap-10 md:gap-12 lg:gap-14 grid-cols-1 lg:grid-cols-[1.3fr_1fr_1fr_1fr] text-center md:text-left">
          <div className="space-y-4">
            <div className="flex items-start justify-center md:justify-start">
              <div className="flex w-full max-w-[300px] sm:max-w-[340px] items-center justify-center overflow-hidden mx-auto md:mx-0">
                <Image
                  src="/icons/Logo%206.png"
                  alt="TrueRate logo"
                  width={420}
                  height={180}
                  className="h-auto w-full object-contain"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto md:mx-0">
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
            <div className="flex items-center justify-center md:justify-start gap-2 pt-1">
              <a
                href="https://twitter.com/TrueRateLiberia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/50 text-muted-foreground transition-all duration-200 hover:text-foreground hover:border-primary/30 hover:bg-primary/5 hover:scale-105"
                aria-label="TrueRate Liberia on X"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com/TrueRateLiberia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/50 text-muted-foreground transition-all duration-200 hover:text-foreground hover:border-primary/30 hover:bg-primary/5 hover:scale-105"
                aria-label="TrueRate Liberia on Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Designed and Developed by
              <br />
              <span className="text-sm font-medium text-foreground inline-block">
                <a
                  href="https://huix-2099.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold"
                >
                  Moses J. Sackey
                </a>
                <span className="text-muted-foreground/80 mx-1"> · </span>
                <a
                  href="https://huix-2099.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold"
                >
                  Victor E. Coleman
                </a>
              </span>
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground tracking-tight">Tools</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/converter" className="text-muted-foreground hover:text-foreground transition-colors inline-block hover:underline underline-offset-2">
                  Currency Converter
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="text-muted-foreground hover:text-foreground transition-colors inline-block hover:underline underline-offset-2">
                  Rate Analytics
                </Link>
              </li>
              <li>
                <Link href="/predictions" className="text-muted-foreground hover:text-foreground transition-colors inline-block hover:underline underline-offset-2">
                  AI Predictions
                </Link>
              </li>
              <li>
                <Link href="/map" className="text-muted-foreground hover:text-foreground transition-colors inline-block hover:underline underline-offset-2">
                  Interactive Map
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-muted-foreground hover:text-foreground transition-colors inline-block hover:underline underline-offset-2">
                  System Status
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground tracking-tight">Resources</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/community" className="text-muted-foreground hover:text-foreground transition-colors inline-block hover:underline underline-offset-2">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/report-fraud" className="text-muted-foreground hover:text-foreground transition-colors inline-block hover:underline underline-offset-2">
                  Report Fraud
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors inline-block hover:underline underline-offset-2">
                  Data Sources
                </Link>
              </li>
              <li>
                <Link href="/docs#embed" className="text-muted-foreground hover:text-foreground transition-colors inline-block hover:underline underline-offset-2">
                  Embed Widget
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors inline-block hover:underline underline-offset-2">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground tracking-tight">Stay Updated</h3>
            <div className="rounded-2xl border border-border/60 bg-background/80 backdrop-blur-sm p-4 text-sm shadow-sm">
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

        <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-border/60 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-5">
          <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
            <p className="text-sm text-muted-foreground">© 2025 TrueRate-Liberia. All rights reserved.</p>
            <p className="text-xs text-muted-foreground/90">
              Powered by{" "}
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
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-2">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-2">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
