import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages"
const ANTHROPIC_MODEL = "claude-sonnet-4-20250514"

export async function POST() {
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY
  const notionDatabaseId = process.env.NOTION_DATABASE_ID
  const notionToken = process.env.NOTION_TOKEN

  if (!anthropicApiKey || !notionDatabaseId || !notionToken) {
    return NextResponse.json(
      {
        error: "Missing required environment variables",
        required: ["ANTHROPIC_API_KEY", "NOTION_DATABASE_ID", "NOTION_TOKEN"],
      },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `Query my Notion database ${notionDatabaseId} and list all entries.`,
          },
        ],
        mcp_servers: [
          {
            type: "url",
            url: "https://mcp.notion.com/sse",
            name: "notion-mcp",
            authorization_token: `Bearer ${notionToken}`,
          },
        ],
      }),
      cache: "no-store",
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Anthropic request failed",
          status: response.status,
          details: data,
        },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      {
        error: "Failed to contact Anthropic API",
        details: message,
      },
      { status: 500 }
    )
  }
}
