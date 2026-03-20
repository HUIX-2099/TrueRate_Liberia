import { Skeleton } from "@/components/ui/skeleton"

export default function PredictionsLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-background" aria-busy="true" aria-label="Loading predictions">
      <div className="flex-1 py-8 px-4 sm:px-6 max-w-6xl mx-auto w-full space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-10 w-72 text-primary" />
          <Skeleton className="h-5 w-full max-w-lg" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    </div>
  )
}
