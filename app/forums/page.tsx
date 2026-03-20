import { Suspense } from "react"
import { ForumsContent } from "./forums-content"
import { ForumsFallback } from "./forums-fallback"

export default function ForumsPage() {
  return (
    <Suspense fallback={<ForumsFallback />}>
      <ForumsContent />
    </Suspense>
  )
}
