import { Skeleton } from "@/components/ui/skeleton"

export default function RootLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-background min-w-0" aria-busy="true" aria-label="Loading">
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95">
        <div className="w-full min-w-0 px-4 sm:px-6 flex h-14 sm:h-16 items-center justify-between max-w-screen-xl mx-auto">
          <Skeleton className="h-10 w-24 sm:w-32 rounded-lg shrink-0 text-primary" />
          <div className="flex gap-2">
            <Skeleton className="h-11 w-24 rounded-full shrink-0 text-primary" />
            <Skeleton className="h-11 w-11 rounded-lg shrink-0 text-primary" />
          </div>
        </div>
      </header>
      <main className="flex-1 py-8 sm:py-12 overflow-x-hidden">
        <div className="w-full min-w-0 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
          <div className="space-y-4 text-center">
            <Skeleton className="h-8 sm:h-10 w-3/4 max-w-xs mx-auto rounded text-primary" />
            <Skeleton className="h-4 w-full max-w-md mx-auto rounded" />
          </div>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-36 sm:h-40 rounded-xl min-h-[144px]" />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
