import { NextResponse } from "next/server"
import { buildSmeDigestContent } from "@/lib/digest/build-sme-digest"
import { getServerApiBaseUrl } from "@/lib/api/server-base-url"

export const dynamic = "force-dynamic"
export const revalidate = 0

/**
 * GET /api/digest/sme
 * Returns SME digest content (rate, price index, risk) as JSON.
 * Query: format=html to get only the email HTML body.
 */
export async function GET(request: Request) {
  try {
    const baseUrl = getServerApiBaseUrl().replace(/\/$/, "")
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format")

    const { data, subject, html, text } = await buildSmeDigestContent(baseUrl)

    if (format === "html") {
      return new NextResponse(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      })
    }

    return NextResponse.json({
      data,
      subject,
      html,
      text,
    })
  } catch (error) {
    console.error("[Digest SME]", error)
    return NextResponse.json(
      {
        error: "Digest build failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
