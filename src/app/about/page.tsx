import { Header } from "@/components/header"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">About {">"}_ The Compiler</h1>

          <div className="prose dark:prose-invert max-w-none">
            <p>
              {">"}_ The Compiler is a personal news aggregator that curates discussions from Hacker News using AI. Instead of
              summarizing the original articles, it focuses on the valuable insights and perspectives shared in the
              community discussions.
            </p>

            <h2>How It Works</h2>

            <p>Every day, {">"}_ The Compiler fetches the top posts from Hacker News and uses AI to:</p>

            <ol>
              <li>Filter the most interesting discussions based on engagement and content</li>
              <li>Summarize the discussions in a newspaper style</li>
              <li>Generate visual prompts for images that represent the content</li>
              <li>Present everything in an easy-to-read format</li>
            </ol>

            <p>
              The goal is to provide a curated digest of the most insightful discussions happening in the tech
              community, saving you time while keeping you informed.
            </p>

            <h2>Technology Stack</h2>

            <p>{">"}_ The Compiler is built with:</p>

            <ul>
              <li>Next.js for the frontend and API routes</li>
              <li>Vercel AI SDK for AI processing</li>
              <li>Supabase for database storage</li>
              <li>Vercel for hosting and scheduled jobs</li>
            </ul>

            <h2>Credits</h2>

            <p>
              This project was inspired by the concept of &quot;git scrapers&quot; popularized by Simon Willison. It uses the
              Hacker News API provided by Y Combinator and the Algolia API.
            </p>

            <p>
              All summaries are generated by AI and should be treated as interpretations rather than direct quotes.
              Links to the original discussions and articles are always provided.
            </p>
          </div>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {">"}_ The Compiler. All rights reserved.</p>
          <p className="mt-2">Powered by Hacker News, Vercel AI SDK, and Supabase.</p>
        </div>
      </footer>
    </div>
  )
}

