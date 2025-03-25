import { createServerSupabaseClient } from "./supabase"
import type { HNItem } from "./hn-api"

// Convert HN timestamp (Unix seconds) to JavaScript Date
const hnTimestampToDate = (timestamp: number) => new Date(timestamp * 1000)

export async function saveHNPost(post: HNItem) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("hn_posts")
    .upsert(
      {
        hn_id: post.id,
        title: post.title || "",
        url: post.url || null,
        score: post.score || 0,
        by: post.by,
        time: hnTimestampToDate(post.time),
        descendants: post.descendants || 0,
      },
      { onConflict: "hn_id" },
    )
    .select("id")
    .single()

  if (error) {
    console.error("Error saving HN post:", error)
    throw error
  }

  return data
}

export async function saveHNComments(comments: HNItem[], postId: number) {
  if (comments.length === 0) return

  const supabase = createServerSupabaseClient()

  // Get the post ID from the database
  const { data: postData } = await supabase.from("hn_posts").select("id").eq("hn_id", postId).single()

  if (!postData) {
    throw new Error(`Post with HN ID ${postId} not found in database`)
  }

  // Prepare comments for insertion
  const commentsToInsert = comments.map((comment) => ({
    hn_id: comment.id,
    hn_post_id: postData.id,
    parent_id: comment.parent !== postId ? comment.parent : null,
    by: comment.by,
    text: comment.text || null,
    time: hnTimestampToDate(comment.time),
  }))

  // Insert in batches to avoid hitting limits
  const batchSize = 100
  for (let i = 0; i < commentsToInsert.length; i += batchSize) {
    const batch = commentsToInsert.slice(i, i + batchSize)
    const { error } = await supabase.from("hn_comments").upsert(batch, { onConflict: "hn_id" })

    if (error) {
      console.error("Error saving HN comments:", error)
      throw error
    }
  }
}

export async function saveFilteredPost(hnPostId: number, rank: number, filterDate: Date) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("filtered_posts")
    .upsert(
      {
        hn_post_id: hnPostId,
        rank,
        filter_date: filterDate.toISOString().split("T")[0],
      },
      { onConflict: "filter_date, rank" },
    )
    .select("id")
    .single()

  if (error) {
    console.error("Error saving filtered post:", error)
    throw error
  }

  return data
}

export async function saveSummary(
  filteredPostId: number,
  title: string,
  summary: string,
  imagePrompt: string,
  imageUrl?: string,
) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("summaries")
    .upsert(
      {
        filtered_post_id: filteredPostId,
        title,
        summary,
        image_prompt: imagePrompt,
        image_url: imageUrl,
      },
      { onConflict: "filtered_post_id" },
    )
    .select()
    .single()

  if (error) {
    console.error("Error saving summary:", error)
    throw error
  }

  return data
}

export async function getLatestFilteredPosts(date?: Date) {
  const supabase = createServerSupabaseClient()
  const filterDate = date ? date.toISOString().split("T")[0] : new Date().toISOString().split("T")[0]

  const { data, error } = await supabase
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
    .eq("filter_date", filterDate)
    .order("rank")

  if (error) {
    console.error("Error fetching filtered posts:", error)
    throw error
  }

  return data
}

export async function getPostComments(hnPostId: number) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("hn_comments").select("*").eq("hn_post_id", hnPostId).order("time")

  if (error) {
    console.error("Error fetching comments:", error)
    throw error
  }

  return data
}

export async function getFilteredPostsByDate(startDate: Date, endDate: Date) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
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
    .gte("filter_date", startDate.toISOString().split("T")[0])
    .lte("filter_date", endDate.toISOString().split("T")[0])
    .order("filter_date", { ascending: false })
    .order("rank")

  if (error) {
    console.error("Error fetching filtered posts by date range:", error)
    throw error
  }

  return data
}

