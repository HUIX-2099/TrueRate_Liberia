import { NextResponse } from "next/server"
import { runDueJobs, runJobById } from "@/lib/scheduler"

export const dynamic = "force-dynamic"
export const revalidate = 0

/**
 * GET/POST /api/cron/sync
 * Cron endpoint for data sync. Secured by CRON_SECRET (Authorization: Bearer <secret> or x-cron-secret header).
 * Query: job=<id> to run a single job; otherwise runs all due jobs.
 */
async function handleSync(request: Request) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = request.headers.get("authorization")
    const bearer = auth?.startsWith("Bearer ") ? auth.slice(7).trim() : null
    const headerSecret = request.headers.get("x-cron-secret")
    const provided = bearer ?? headerSecret
    if (provided !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  const url = new URL(request.url)
  const singleJobId = url.searchParams.get("job")

  if (singleJobId) {
    const entry = await runJobById(singleJobId)
    if (!entry) {
      return NextResponse.json({ error: "Job not found", jobId: singleJobId }, { status: 404 })
    }
    return NextResponse.json({
      jobId: entry.jobId,
      jobName: entry.jobName,
      run: entry,
      timestamp: new Date().toISOString(),
    })
  }

  const { ran, skipped, summary } = await runDueJobs()
  return NextResponse.json({
    ran: ran.length,
    skipped,
    summary,
    runs: ran.map((r) => ({
      id: r.id,
      jobId: r.jobId,
      jobName: r.jobName,
      status: r.status,
      durationMs: r.durationMs,
      recordsCount: r.recordsCount,
      error: r.error,
    })),
    timestamp: new Date().toISOString(),
  })
}

export const GET = handleSync
export const POST = handleSync
