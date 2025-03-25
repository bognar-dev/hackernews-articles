import { ArticleCard } from "@/components/article-card"
import { Header } from "@/components/header"
import { getFilteredPostsByDate } from "@/lib/db-service"

export const revalidate = 3600 // Revalidate every hour

export default async function ArchivePage() {
  // Get posts from the last 7 days
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 7)

  const posts = await getFilteredPostsByDate(startDate, endDate)

  // Group posts by date
  const postsByDate = posts.reduce((acc, post) => {
    const date = post.filter_date
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(post)
    return acc
  }, {})

  // Sort dates in descending order
  const sortedDates = Object.keys(postsByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Archive</h1>
          <p className="text-muted-foreground">Browse past articles</p>
        </div>

        {sortedDates.map((date) => {
          const formattedDate = new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })

          const formattedPosts = postsByDate[date].map((post) => ({
            id: post.id,
            title: post.summaries?.[0]?.title || post.hn_posts.title,
            summary: post.summaries?.[0]?.summary || "No summary available",
            imageUrl: post.summaries?.[0]?.image_url || null,
            date: formattedDate,
            slug: `${post.id}-${post.hn_posts.hn_id}`,
          }))

          return (
            <section key={date} className="mb-12">
              <h2 className="text-2xl font-bold mb-6">{formattedDate}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formattedPosts.map((post) => (
                  <ArticleCard key={post.id} {...post} />
                ))}
              </div>
            </section>
          )
        })}
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

