"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Activity, TrendingUp, Shield } from "lucide-react"
import Link from "next/link"

export function MarketIntelligenceHero() {
    return (
        <section className="dark relative overflow-hidden bg-background py-16 sm:py-24 border-b border-border/30 md:border-0">
            <div className="absolute inset-0 opacity-70 pointer-events-none md:hidden z-0" aria-hidden />
            {/* Background Ambient Orbs */}
            <div className="absolute top-0 -left-20 h-[500px] w-[500px] rounded-full bg-muted/40 border border-border/40 blur-[120px]" />
            <div className="absolute bottom-0 -right-20 h-[400px] w-[400px] rounded-full bg-muted/40 border border-border/40 blur-[100px]" />

            <div className="container relative z-10 mx-auto px-4">
                <div className="max-w-3xl">
                    <div className="animate-content-in stagger-1">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary mb-6">
                            <Activity className="h-3 w-3 text-primary" />
                            Live Economic Indicators
                        </div>
                    </div>

                    <h1 className="animate-content-in stagger-2 text-4xl font-black tracking-tight text-foreground sm:text-6xl mb-6">
                        Market <span className="hero-headline-gradient">Intelligence.</span>
                        <br />
                        Data-Driven <span className="text-muted-foreground/50">Stability.</span>
                    </h1>

                    <p className="animate-content-in stagger-3 text-lg text-muted-foreground mb-10 leading-relaxed max-w-2xl">
                        Real-time monitoring of commercial flows, commodity price stability, and economic risk indicators for the Liberian market.
                    </p>

                    <div className="animate-content-in stagger-4 flex flex-wrap gap-4 mb-12">
                        <Button size="lg" className="rounded-2xl gap-2 min-h-[56px] px-8 font-bold shadow-xl shadow-primary/20 transition-institutional" asChild>
                            <Link href="#metrics">
                                View Key Metrics
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="rounded-2xl gap-2 min-h-[56px] px-8 font-bold transition-institutional" asChild>
                            <Link href="#charts">
                                Analysis Charts
                            </Link>
                        </Button>
                    </div>

                    {/* Micro stats bar */}
                    <div className="animate-content-in stagger-5 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-border/30">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center text-primary">
                                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Price Index</p>
                                <p className="text-sm font-bold text-foreground">Stability Monitored</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center text-primary">
                                <Activity className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Sync Status</p>
                                <p className="text-sm font-bold text-foreground">Real-time Data</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-[hsl(var(--chart-4)/0.1)] flex items-center justify-center text-[hsl(var(--chart-4))]">
                                <Shield className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Risk Assessment</p>
                                <p className="text-sm font-bold text-foreground">Active Vigilance</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative gradient bridge */}
            <div className="absolute bottom-0 left-0 right-0 h-px" />
        </section>
    )
}
