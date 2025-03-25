import { type NextRequest, NextResponse } from "next/server"
import { runScraper } from "@/lib/scraper-service"

export async function POST(request: NextRequest) {
  try {
    // Check for authorization (in a real app, you'd use a more secure method)
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    // In a real app, you'd validate this token against an environment variable or other secure storage
    if (token !== process.env.SCRAPER_API_KEY) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 })
    }

    // Run the scraper
    const result = await runScraper()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in scrape API:", error)
    return NextResponse.json({ error: "Failed to run scraper", message: error.message }, { status: 500 })
  }
}

