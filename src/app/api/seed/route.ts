import { type NextRequest, NextResponse } from "next/server"
import { runScraper } from "@/lib/scraper-service"

export async function GET(request: NextRequest) {
  try {
    // Check for authorization
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    if (token !== process.env.SCRAPER_API_KEY) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 })
    }

    // Run the scraper
    const result = await runScraper()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in seed API:", error)
    return NextResponse.json({ error: "Failed to seed database", message: error.message }, { status: 500 })
  }
}

