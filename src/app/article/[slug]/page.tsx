import { Header } from "@/components/header"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase"

interface ArticlePageProps {
  params: {
    slug: string
  }
}

export const revalidate = 3600 // Revalidate every hour

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = params

  // Extract the filtered post ID from the slug
  const filteredPostId = Number.parseInt(slug.split("-")[0], 10)

  if (isNaN(filteredPostId)) {
    notFound()
  }

  // Fetch the article data
  const supabase = createServerSupabaseClient()
  const { data: post, error } = await supabase
    .from("filtered_posts")
    .select(`
      id,
      rank,
      filter_date,
      hn_posts (
        id,
        hn_id,
        title,
        url,
        score,
        by,
        time,
        descendants
      ),
      summaries (
        id,
        title,
        summary,
        image_prompt,
        image_url
      )
    `)
    .eq("id", filteredPostId)
    .single()

  if (error || !post) {
    notFound()
  }

  // Format the date for display
  const date = new Date(post.filter_date)
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const title = post.summaries?.[0]?.title || post.hn_posts.title
  const summary = post.summaries?.[0]?.summary || "No summary available"
  const imageUrl = post.summaries?.[0]?.image_url || "/placeholder.svg?height=600&width=1200"
  const hnUrl = `https://news.ycombinator.com/item?id=${post.hn_posts.hn_id}`
  const originalUrl = post.hn_posts.url

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <article className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="text-sm text-muted-foreground mb-2">{formattedDate}</div>
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
          </div>

          <div className="aspect-video relative mb-8">
            <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover rounded-lg" priority />
          </div>

          <div className="prose dark:prose-invert max-w-none mb-8">
            {summary.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 border-t pt-6">
            <Link href={hnUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
              <div className="bg-primary text-primary-foreground text-center py-2 px-4 rounded-md hover:bg-primary/90 transition-colors">
                View Hacker News Discussion
              </div>
            </Link>

            {originalUrl && (
              <Link href={originalUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                <div className="bg-secondary text-secondary-foreground text-center py-2 px-4 rounded-md hover:bg-secondary/90 transition-colors">
                  Read Original Article
                </div>
              </Link>
            )}
          </div>
        </article>
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} The Daily Bin. All rights reserved.</p>
          <p className="mt-2">Powered by Hacker News, Vercel AI SDK, and Supabase.</p>
        </div>
      </footer>
    </div>
  )
}

