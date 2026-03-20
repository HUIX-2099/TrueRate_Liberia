"use client"

import { VendorCard } from "./VendorCard"
import type { Vendor } from "./types"

export interface VendorRowProps {
  vendors: Vendor[]
  onViewSupply?: (id: string) => void
  className?: string
}

export function VendorRow({ vendors, onViewSupply, className }: VendorRowProps) {
  return (
    <div className={className}>
      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        Verified suppliers
        <span className="text-[10px] font-normal text-muted-foreground">({vendors.length})</span>
      </h3>
      <div className="overflow-x-auto -mx-4 px-4 pb-2 scrollbar-thin">
        <div className="flex gap-3 min-w-max">
          {vendors.map((v) => (
            <VendorCard
              key={v.id}
              id={v.id}
              name={v.name}
              logoUrl={v.logoUrl}
              trustScore={v.trustScore}
              yearsActive={v.yearsActive}
              deliverySpeed={v.deliverySpeed}
              verified={v.verified}
              onViewSupply={onViewSupply}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
