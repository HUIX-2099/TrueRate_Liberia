import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Skeleton className="h-8 w-48 mb-4 text-primary" />
            <Skeleton className="h-10 w-2/3 mb-3 text-primary" />
            <Skeleton className="h-5 w-1/2 text-primary" />
          </div>
        </section>
        <section className="py-10 bg-background">
          <div className="container mx-auto px-4 grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-4">
              <Skeleton className="h-6 w-64 text-primary" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-4 w-24 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6 text-primary" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-40 text-primary" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-48 mb-3 text-primary" />
                  <Skeleton className="h-4 w-32 text-primary" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-28 text-primary" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 text-primary" />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
