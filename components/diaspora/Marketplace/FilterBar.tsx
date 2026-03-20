"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface FilterBarProps {
  location: string
  onLocationChange: (value: string) => void
  verifiedOnly: boolean
  onVerifiedOnlyChange: (checked: boolean) => void
  locationOptions?: { value: string; label: string }[]
}

const DEFAULT_LOCATIONS = [
  { value: "all", label: "All" },
  { value: "monrovia", label: "Monrovia" },
  { value: "paynesville", label: "Paynesville" },
]

export function FilterBar({
  location,
  onLocationChange,
  verifiedOnly,
  onVerifiedOnlyChange,
  locationOptions = DEFAULT_LOCATIONS,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 py-3 border-y border-border/25">
      <div className="flex items-center gap-2">
        <Label htmlFor="marketplace-location" className="text-xs text-muted-foreground">
          Location
        </Label>
        <Select value={location} onValueChange={onLocationChange}>
          <SelectTrigger id="marketplace-location" className="w-[140px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {locationOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="marketplace-verified"
          checked={verifiedOnly}
          onCheckedChange={onVerifiedOnlyChange}
        />
        <Label htmlFor="marketplace-verified" className="text-sm">
          Verified only
        </Label>
      </div>
    </div>
  )
}
