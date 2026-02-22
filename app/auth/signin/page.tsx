"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { LogIn, Lock, Mail, MapPin, ShieldCheck, TrendingUp, Loader2 } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function SignInPage() {
  const { signIn } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signIn(formData.email, formData.password)
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid email or password.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="py-10 sm:py-14 md:py-20 flex-1 flex items-center justify-center relative pb-20 md:pb-0 overflow-x-hidden px-4">
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,var(--primary)/0.08),linear-gradient(to_bottom,var(--muted)/0.4,transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)/0.04_1px,transparent_1px),linear-gradient(to_bottom,var(--border)/0.04_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-0">
          <div className="grid gap-10 md:grid-cols-2 items-center max-w-5xl mx-auto">
            {/* Left: copy */}
            <div className="space-y-6 text-center md:text-left order-2 md:order-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Secure access
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-balance leading-tight">
                <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
                  Sign in to stay ahead
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                  of the USD/LRD market
                </span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground text-pretty max-w-md md:max-w-none">
                Track verified rates, compare changers nearby, and get smarter insights—all in one dashboard.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm px-4 py-3.5 text-sm shadow-sm">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <span>Live analytics and trends</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm px-4 py-3.5 text-sm shadow-sm">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <span>Nearest changer alerts</span>
                </div>
              </div>
            </div>

            {/* Right: form card */}
            <Card className="border-border/80 shadow-xl shadow-primary/5 bg-card/95 backdrop-blur-sm rounded-2xl order-1 md:order-2 overflow-hidden">
              <CardHeader className="text-center space-y-3 pb-2 pt-8 sm:pt-10">
                <div className="flex justify-center">
                  <div className="h-14 w-14 rounded-2xl bg-primary/15 flex items-center justify-center ring-2 ring-primary/10">
                    <LogIn className="h-7 w-7 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl sm:text-3xl tracking-tight">Welcome back</CardTitle>
                <CardDescription className="text-base">
                  Sign in to access your dashboard and community features
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 sm:px-8 pb-8 sm:pb-10 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email
                    </Label>
                    <InputGroup className="h-11 rounded-xl border-border/80 bg-muted/30 dark:bg-input/20 shadow-sm">
                      <InputGroupAddon align="inline-start">
                        <InputGroupText>
                          <Mail className="size-4 text-muted-foreground" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-2"
                        required
                      />
                    </InputGroup>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium text-foreground">
                        Password
                      </Label>
                      <Link
                        href="/contact"
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <InputGroup className="h-11 rounded-xl border-border/80 bg-muted/30 dark:bg-input/20 shadow-sm">
                      <InputGroupAddon align="inline-start">
                        <InputGroupText>
                          <Lock className="size-4 text-muted-foreground" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pl-2"
                        required
                      />
                    </InputGroup>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked === true)}
                      />
                      <Label
                        htmlFor="remember"
                        className="text-sm text-muted-foreground font-normal cursor-pointer select-none"
                      >
                        Remember me
                      </Label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 rounded-xl font-semibold text-base bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-shadow"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Signing in…
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </form>

                <div className="relative pt-1">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/60" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase tracking-wider text-muted-foreground">
                    <span className="bg-card px-3">New here?</span>
                  </div>
                </div>
                <p className="text-center text-sm pt-1">
                  <span className="text-muted-foreground">Don't have an account? </span>
                  <Link href="/auth/signup" className="text-primary hover:underline font-semibold">
                    Sign up
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
