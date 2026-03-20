"use client"

import { cn } from "@/lib/utils"
import { LiveHeader } from "./LiveHeader"
import { Sidebar } from "./Sidebar"
import { MobileBottomNav } from "./MobileBottomNav"

export interface DashboardShellProps {
  /** Main content (Marketplace, Intelligence, Investment, Remittance, Trust sections) */
  children: React.ReactNode
  /** Optional right insights panel (desktop only) */
  rightPanel?: React.ReactNode
  className?: string
}

export function DashboardShell({ children, rightPanel, className }: DashboardShellProps) {
  return (
    <div
      className={cn(
        "min-h-screen flex flex-col w-full min-w-0 diaspora-dashboard",
        className
      )}
    >
      <LiveHeader />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main
          className="flex-1 min-w-0 overflow-x-hidden pb-24 lg:pb-0 diaspora-main"
          role="main"
          id="diaspora-main"
        >
          <div className="flex flex-col lg:flex-row gap-0">
            <div className="flex-1 min-w-0 p-5 sm:p-6 md:p-8 lg:p-10">
              {children}
            </div>
            {rightPanel != null && (
              <aside
                className="hidden lg:block w-72 xl:w-80 shrink-0 border-l border-border/20 bg-muted/5 px-5 py-8 overflow-y-auto"
                aria-label="Insights panel"
              >
                <div className="rounded-2xl border border-border/30 bg-card shadow-sm p-5 sticky top-24">
                  {rightPanel}
                </div>
              </aside>
            )}
          </div>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}
