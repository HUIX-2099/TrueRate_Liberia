"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Building2, 
  ChevronRight, 
  ShieldCheck, 
  FileText, 
  UserCheck,
  ArrowRight,
  CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"

const MINISTRIES = [
  {
    id: "moci",
    name: "Ministry of Commerce & Industry",
    description: "Business registration and import/export permits.",
    icon: <Building2 className="h-5 w-5 text-primary" />
  },
  {
    id: "mfa",
    name: "Ministry of Foreign Affairs",
    description: "Investment incentives and diplomatic clearance.",
    icon: <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
  },
  {
    id: "mof",
    name: "Ministry of Finance & Development Planning",
    description: "Tax compliance and fiscal incentive certificates.",
    icon: <FileText className="h-5 w-5 text-primary" />
  },
  {
    id: "nic",
    name: "National Investment Commission (NIC)",
    description: "Primary gateway for large-scale foreign investment.",
    icon: <UserCheck className="h-5 w-5 text-primary" />
  }
]

export function MinistryRegistrationForm() {
  const [step, setStep] = useState(1)
  const [selectedMinistries, setSelectedMinistries] = useState<string[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)

  const toggleMinistry = (id: string) => {
    setSelectedMinistries(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <Card className="rounded-[2.5rem] border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl p-12 text-center overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)] pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)] animate-bounce">
            <CheckCircle2 className="h-10 w-10 text-white text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-black text-foreground tracking-tight">Registration Initiated</h3>
            <p className="text-muted-foreground font-medium max-w-md mx-auto">
              Your preliminary investor profile has been sent to the selected ministries. Our compliance team will contact you within 48 hours.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsSubmitted(false)}
            className="rounded-2xl px-8 h-12 font-bold uppercase tracking-widest border-emerald-500/20 hover:bg-muted/40 border border-border/40"
          >
            Back to Dashboard
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="rounded-[2.5rem] border-border/40 bg-card shadow-[0_30px_60px_rgba(0,0,0,0.05)] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[600px]">
        {/* Sidebar Info */}
        <div className="lg:col-span-2 bg-slate-900 p-8 lg:p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(59,130,246,0.2),transparent_70%)] pointer-events-none" />
          <div className="relative z-10 h-full flex flex-col">
            <div className="mb-12">
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-6 uppercase tracking-[0.3em] font-black text-[10px] px-3 py-1 rounded-full">
                Institutional Access
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-8 leading-[1.1]">
                Investor <span className="text-foreground">Pre-Registration</span>
              </h2>
              <p className="text-white/50 text-lg font-medium leading-relaxed max-w-sm">
                Unlock exclusive investment opportunities and institutional incentives by registering with the relevant Liberian regulatory bodies.
              </p>
            </div>

            <div className="space-y-10 mt-auto">
              <div className="group flex gap-6 items-start">
                <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-muted/40 border-border/40 group-hover:border-blue-500/20 transition-all duration-500">
                  <span className="font-black text-xl text-blue-400">01</span>
                </div>
                <div className="pt-1">
                  <p className="font-black text-lg mb-1 uppercase tracking-wider">Select Ministries</p>
                  <p className="text-sm text-white/30 font-medium leading-relaxed">Identify and choose the regulatory bodies specific to your investment sector.</p>
                </div>
              </div>
              <div className="group flex gap-6 items-start">
                <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-muted/40 border-border/40 group-hover:border-emerald-500/20 transition-all duration-500">
                  <span className="font-black text-xl text-emerald-400">02</span>
                </div>
                <div className="pt-1">
                  <p className="font-black text-lg mb-1 uppercase tracking-wider">Submit Profile</p>
                  <p className="text-sm text-white/30 font-medium leading-relaxed">Provide your institutional credentials to initiate the formal compliance process.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Area */}
        <div className="lg:col-span-3 p-8 lg:p-12 bg-background">
          <form onSubmit={handleSubmit} className="h-full flex flex-col">
            {step === 1 ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight">Select Regulatory Bodies</h3>
                  <p className="text-sm text-muted-foreground font-medium">Choose the ministries you need to register with for your investment.</p>
                </div>

                <div className="grid gap-4">
                  {MINISTRIES.map((m) => (
                    <div 
                      key={m.id}
                      onClick={() => toggleMinistry(m.id)}
                      className={cn(
                        "group cursor-pointer p-5 rounded-[1.5rem] border-2 transition-all duration-300 flex items-center gap-5",
                        selectedMinistries.includes(m.id) 
                          ? "border-primary bg-primary/5 shadow-lg" 
                          : "border-border/40 bg-muted/20 hover:border-border hover:bg-muted/40"
                      )}
                    >
                      <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-300",
                        selectedMinistries.includes(m.id)
                          ? "bg-primary text-primary-foreground scale-110 shadow-lg"
                          : "bg-background text-muted-foreground border border-border/40"
                      )}>
                        {m.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm mb-0.5">{m.name}</p>
                        <p className="text-xs text-muted-foreground font-medium truncate">{m.description}</p>
                      </div>
                      <Checkbox 
                        checked={selectedMinistries.includes(m.id)}
                        onCheckedChange={() => toggleMinistry(m.id)}
                        className="rounded-full h-6 w-6 border-2"
                      />
                    </div>
                  ))}
                </div>

                <Button 
                  type="button"
                  disabled={selectedMinistries.length === 0}
                  onClick={() => setStep(2)}
                  className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest gap-3 shadow-xl mt-4"
                >
                  Continue to Profile
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline mb-2 flex items-center gap-1"
                  >
                    ← Back to selection
                  </button>
                  <h3 className="text-2xl font-black tracking-tight">Institutional Profile</h3>
                  <p className="text-sm text-muted-foreground font-medium">Provide your details to initiate the registration process.</p>
                </div>

                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="orgName" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Organization Name</Label>
                    <Input id="orgName" placeholder="e.g. Global Capital Partners" className="h-12 rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-all" required />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contactName" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Contact Person</Label>
                      <Input id="contactName" placeholder="Full Name" className="h-12 rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-all" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Work Email</Label>
                      <Input id="email" type="email" placeholder="name@company.com" className="h-12 rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-all" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="investmentScale" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Planned Investment Scale (USD)</Label>
                    <Input id="investmentScale" placeholder="e.g. $500,000 - $1,000,000" className="h-12 rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-all" required />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-3">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                  <p className="text-[10px] text-blue-500/80 font-bold leading-relaxed uppercase tracking-wider">
                    Your data is encrypted and will only be shared with the {selectedMinistries.length} selected ministries for compliance verification.
                  </p>
                </div>

                <Button 
                  type="submit"
                  className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest gap-3 shadow-xl mt-4 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Submit Registration
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </Card>
  )
}

function Badge({ children, variant, className }: { children: React.ReactNode, variant?: string, className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      variant === "secondary" ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" : "bg-primary text-primary-foreground hover:bg-primary/80",
      className
    )}>
      {children}
    </span>
  )
}
