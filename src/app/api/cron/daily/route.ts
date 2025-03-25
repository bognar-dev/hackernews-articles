import { type NextRequest, NextResponse } from "next/server"
import { runScraper } from "@/lib/scraper-service"

// This route will be called by a cron job (e.g., Vercel Cron)
export async function GET(request: NextRequest) {
  try {
    // Verify the request is from the cron job
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    // In a real app, you'd validate this token against an environment variable
    if (token !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 })
    }

    // Run the scraper
    const result = await runScraper()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in daily cron job:", error)
    return NextResponse.json({ error: "Failed to run daily job", message: error.message }, { status: 500 })
  }
}

