import Link from "next/link"
import Image from "next/image"
import { Facebook, Mail, Phone, Twitter } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InstallPromptButton } from "@/components/pwa/install-prompt-button"

export function Footer() {
  return (
    <footer id="site-footer" className="border-t border-border/60 overflow-x-hidden min-w-0 w-full">
      <div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 md:py-12 lg:py-16 max-w-[100vw] xl:max-w-[1400px] 2xl:max-w-[1600px] box-border">
        <div className="grid gap-6 sm:gap-8 md:gap-10 lg:gap-12 grid-cols-1 min-[500px]:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] text-center md:text-left min-w-0">
          <div className="space-y-4">
            <div className="flex items-start justify-center md:justify-start -mb-5">
              <div className="flex w-full max-w-[280px] sm:max-w-[320px] items-center justify-center overflow-hidden mx-auto md:mx-0 [&_img]:block">
                <Image
                  src="/icons/Logo%206.png"
                  alt="TrueRate logo"
                  width={420}
                  height={180}
                  className="h-auto w-full object-contain"
                  sizes="(max-width: 640px) 280px, 320px"
                  loading="lazy"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto md:mx-0">
              A trusted place to check rates, compare prices, and plan everyday money decisions in Liberia.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <Badge variant="outline">Built for everyday decisions</Badge>
              <Badge variant="secondary">Live data</Badge>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
              <Button asChild size="sm" className="min-h-[44px]">
                <Link href="/market">Today&apos;s Market</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="min-h-[44px]">
                <Link href="/converter">Convert Now</Link>
              </Button>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 pt-2">
              <a
                href="https://twitter.com/TrueRateLiberia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-border/60 bg-background/50 text-muted-foreground transition-colors duration-200 hover:text-foreground hover:border-border/80 hover:bg-muted/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="TrueRate Liberia on X"
              >
                <Twitter className="h-4 w-4 text-primary" />
              </a>
              <a
                href="https://facebook.com/TrueRateLiberia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-border/60 bg-background/50 text-muted-foreground transition-colors duration-200 hover:text-foreground hover:border-border/80 hover:bg-muted/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="TrueRate Liberia on Facebook"
              >
                <Facebook className="h-4 w-4 text-primary" />
              </a>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              <span className="tracking-wide uppercase text-[0.65rem] text-muted-foreground/80">
                Designed &amp; Developed by
              </span>
              <br />
              <span className="inline-flex flex-wrap items-baseline gap-x-0.5 gap-y-1 mt-1 rounded-md border border-border/50 bg-muted/30 px-2.5 py-1.5 text-sm">
                <a
                  href="https://huix-2099.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold hover:underline decoration-primary/60 underline-offset-2 transition-colors hover:text-primary/90"
                >
                  Moses J. Sackey
                </a>
                <span className="text-muted-foreground/60 select-none" aria-hidden="true">·</span>
                <a
                  href="https://huix-2099.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold hover:underline decoration-primary/60 underline-offset-2 transition-colors hover:text-primary/90"
                >
                  Victor E. Coleman
                </a>
              </span>
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider text-muted-foreground">Start Here</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/converter" className="text-muted-foreground hover:text-foreground transition-colors inline-block hover:underline underline-offset-2">
                  Convert Money
                </Link>
              </li>
              <li>
                <Link href="/market" className="text-muted-foreground hover:text-foreground transition-colors inline-block hover:underline underline-offset-2">
                  Check Live Market
                </Link>
              </li>
              <li>
                <Link href="/price-index" className="text-muted-foreground hover:text-foreground transition-colors inline-block hover:underline underline-offset-2">
                  Compare Prices
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-muted-foreground hover:text-foreground transition-colors inline-block hover:underline underline-offset-2">
                  Open Money Tools
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider text-muted-foreground">Resources</h3>
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
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider text-muted-foreground">Stay Updated</h3>
            <div className="rounded-xl border border-border/60 bg-muted/40 p-4 text-sm shadow-sm">
              <div className="font-semibold">Mobile App Access</div>
              <p className="mt-2 text-muted-foreground">
                Check rates, prices, and tools on the go when you need them.
              </p>
              <InstallPromptButton label="Request App Access" />
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Phone className="h-4 w-4 text-primary" />
                SMS: 1234 (RATE)
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:info@truerateliberia.com" className="hover:underline">info@truerateliberia.com</a>
              </div>
              <div className="text-center md:text-left">Online-only for now</div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-14 rounded-xl border border-border/60 bg-background/50 overflow-hidden min-w-0">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 px-4 sm:px-6 py-4 sm:py-5 md:py-6">
            <div className="flex flex-col items-center md:items-start gap-1.5 text-center md:text-left">
              <p className="text-sm text-muted-foreground">© 2025 TrueRate-Liberia. All rights reserved.</p>
              <p className="text-xs sm:text-sm text-muted-foreground/90">
                Powered by{" "}
                <a
                  href="https://huix-2099.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold underline-offset-2"
                >
                  HUIX-2099
                </a>{" "}
                <span className="text-muted-foreground/70">· A Liberian Future-Tech Startup</span>
              </p>
            </div>
            <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm justify-center md:justify-end" aria-label="Footer legal and utility links">
              <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-2">
                About
              </Link>
              <Link href="/community" className="text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-2">
                Community
              </Link>
              <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-2">
                Docs
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-2">
                Privacy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-2">
                Terms
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
