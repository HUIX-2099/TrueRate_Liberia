import { Skeleton } from "@/components/ui/skeleton"

export default function DiasporaLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-background" aria-busy="true" aria-label="Loading diaspora">
      <div className="flex-1 py-8 px-4 sm:px-6 max-w-6xl mx-auto w-full space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 text-primary" />
          <Skeleton className="h-5 w-3/4 max-w-md text-primary" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  )
}
