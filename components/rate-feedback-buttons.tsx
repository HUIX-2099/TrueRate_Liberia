"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ThumbsUp, Flag, Check, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export interface RateFeedbackButtonsProps {
  /** Current displayed rate (optional, sent with feedback) */
  rate?: number
  /** Optional location context (e.g. for map) */
  location?: string
  /** Compact layout */
  compact?: boolean
  className?: string
}

export function RateFeedbackButtons({
  rate,
  location: locationContext,
  compact = false,
  className = "",
}: RateFeedbackButtonsProps) {
  const [submitted, setSubmitted] = useState<"confirm" | "flag" | null>(null)
  const [loading, setLoading] = useState(false)
  const [wrongRateOpen, setWrongRateOpen] = useState(false)
  const [wrongRateMessage, setWrongRateMessage] = useState("")
  const [wrongRateSubmitting, setWrongRateSubmitting] = useState(false)
  const { toast } = useToast()

  const sendFeedback = async (type: "confirm" | "flag", message?: string) => {
    if (submitted && type === "confirm") return
    setLoading(true)
    try {
      const res = await fetch("/api/rates/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          rate: rate ?? undefined,
          message: message ?? undefined,
          location: locationContext ?? undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? "Failed")
      if (type === "flag") setSubmitted("flag")
      else setSubmitted("confirm")
      toast({
        title: type === "confirm" ? "Thanks for confirming this rate" : "Thanks, we received your report",
        description:
          type === "confirm"
            ? "Your confirmation helps others trust the rate."
            : "Your report helps protect others from bad rates. We'll review it.",
      })
    } catch {
      toast({
        title: "We couldn't send that",
        description: "Please try again in a moment.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const submitWrongRate = async () => {
    setWrongRateSubmitting(true)
    try {
      await sendFeedback("flag", wrongRateMessage.trim() || undefined)
      setWrongRateMessage("")
      setWrongRateOpen(false)
    } finally {
      setWrongRateSubmitting(false)
    }
  }

  const wrongRateDialog = (
    <Dialog open={wrongRateOpen} onOpenChange={setWrongRateOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
        >
          Is this rate wrong?
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            Report wrong rate
          </DialogTitle>
          <DialogDescription>
            Report wrong or unfair rates so others don&apos;t get cheated. Tell us what rate you saw—your report is anonymous and helps keep the system fair.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {rate != null && (
            <div className="text-sm">
              <span className="text-muted-foreground">Current rate shown: </span>
              <span className="font-mono font-medium">{rate.toFixed(2)} LRD/USD</span>
            </div>
          )}
          {locationContext && (
            <div className="text-sm text-muted-foreground">Location: {locationContext}</div>
          )}
          <div className="space-y-2">
            <Label htmlFor="wrong-rate-message">What rate did you see? (optional)</Label>
            <Textarea
              id="wrong-rate-message"
              placeholder="e.g. 195 LRD at XYZ changer, or describe the issue"
              value={wrongRateMessage}
              onChange={(e) => setWrongRateMessage(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setWrongRateOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submitWrongRate} disabled={wrongRateSubmitting}>
            {wrongRateSubmitting ? "Sending…" : "Send report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  if (compact) {
    return (
      <TooltipProvider>
        <div className={`flex flex-wrap items-center gap-2 ${className}`}>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 p-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={submitted === "confirm" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-7 w-7 rounded-full shrink-0 text-primary"
                  onClick={() => sendFeedback("confirm")}
                  disabled={loading || submitted === "confirm"}
                  aria-label="Confirm this rate"
                >
                  {submitted === "confirm" ? (
                    <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                  ) : (
                    <ThumbsUp className="h-3.5 w-3.5 text-primary" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Confirm this rate</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={submitted === "flag" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-7 w-7 rounded-full shrink-0 hover: hover:bg-destructive/10 text-primary"
                  onClick={() => sendFeedback("flag")}
                  disabled={loading || submitted === "flag"}
                  aria-label="Flag incorrect rate"
                >
                  <Flag className="h-3.5 w-3.5 text-primary" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Flag incorrect rate</TooltipContent>
            </Tooltip>
          </div>
          {wrongRateDialog}
        </div>
      </TooltipProvider>
    )
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-xs text-muted-foreground">Rate accurate?</span>
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 h-8 text-xs"
        onClick={() => sendFeedback("confirm")}
        disabled={loading || submitted === "confirm"}
      >
        {submitted === "confirm" ? <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" /> : <ThumbsUp className="h-3.5 w-3.5 text-primary" />}
        {submitted === "confirm" ? "Confirmed" : "Confirm"}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 h-8 text-xs text-muted-foreground hover:text-destructive"
        onClick={() => sendFeedback("flag")}
        disabled={loading || submitted === "flag"}
      >
        <Flag className="h-3.5 w-3.5 text-primary" />
        Flag issue
      </Button>
      {wrongRateDialog}
    </div>
  )
}
