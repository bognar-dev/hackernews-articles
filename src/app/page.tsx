import { ArticleCard } from "@/components/article-card"
import { FeaturedArticle } from "@/components/featured-article"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { getLatestFilteredPosts } from "@/lib/db-service"
import Link from "next/link"

export const revalidate = 3600 // Revalidate every hour

export default async function Home() {
  const posts = await getLatestFilteredPosts()

  // Format the date for display
  const today = new Date()
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Check if we have any posts
  const hasPosts = posts && posts.length > 0

  // Prepare the posts for display if we have any
  const formattedPosts = hasPosts
    ? posts.map((post) => ({
      id: post.id,
      title: post.summaries?.[0]?.title || post.hn_posts.title,
      summary: post.summaries?.[0]?.summary || "No summary available",
      imageUrl: post.summaries?.[0]?.image_url || null,
      date: formattedDate,
      slug: `${post.id}-${post.hn_posts.hn_id}`,
    }))
    : []

  // Split into featured and regular posts if we have any
  const featuredPost = hasPosts ? formattedPosts[0] : null
  const regularPosts = hasPosts ? formattedPosts.slice(1) : []

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Today&apos;s Digest</h1>
          <p className="text-muted-foreground">{formattedDate}</p>
        </div>

        {!hasPosts ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">No articles yet</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              It looks like there are no articles available yet. You can seed the database with initial data to get
              started.
            </p>
            <Link href="/admin/seed">
              <Button size="lg">Seed Database</Button>
            </Link>
          </div>
        ) : (
          <>
            {featuredPost && (
              <section className="mb-12">
                <FeaturedArticle {...featuredPost} />
              </section>
            )}

            <section>
              <h2 className="text-2xl font-bold mb-6">More Stories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularPosts.map((post) => (
                  <ArticleCard key={post.id} {...post} />
                ))}
              </div>
            </section>
          </>
        )}
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

