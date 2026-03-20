import { Skeleton } from "@/components/ui/skeleton"

export default function ConverterLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-background" aria-busy="true" aria-label="Loading converter">
      <div className="flex-1 py-8 px-4 sm:px-6 max-w-4xl mx-auto w-full space-y-6">
        <Skeleton className="h-10 w-64 text-primary" />
        <div className="grid gap-6 sm:grid-cols-2">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
        <Skeleton className="h-12 w-full max-w-xs" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
