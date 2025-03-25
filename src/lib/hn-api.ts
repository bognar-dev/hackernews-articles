const HN_API_BASE = "https://hacker-news.firebaseio.com/v0"
const ALGOLIA_API_BASE = "https://hn.algolia.com/api/v1"

// Types for Hacker News items
export interface HNItem {
  id: number
  deleted?: boolean
  type: "job" | "story" | "comment" | "poll" | "pollopt"
  by: string
  time: number
  text?: string
  dead?: boolean
  parent?: number
  poll?: number
  kids?: number[]
  url?: string
  score?: number
  title?: string
  parts?: number[]
  descendants?: number
}

// Fetch a single item from the Hacker News API
export async function fetchItem(id: number): Promise<HNItem> {
  const response = await fetch(`${HN_API_BASE}/item/${id}.json`)
  if (!response.ok) {
    throw new Error(`Failed to fetch item ${id}: ${response.statusText}`)
  }
  return response.json()
}

// Fetch the top stories from Hacker News
export async function fetchTopStories(limit = 50): Promise<number[]> {
  const response = await fetch(`${HN_API_BASE}/topstories.json`)
  if (!response.ok) {
    throw new Error(`Failed to fetch top stories: ${response.statusText}`)
  }
  const ids = await response.json()
  return ids.slice(0, limit)
}

// Fetch multiple items in parallel
export async function fetchItems(ids: number[]): Promise<HNItem[]> {
  const promises = ids.map((id) => fetchItem(id))
  return Promise.all(promises)
}

// Fetch all comments for a story recursively
export async function fetchAllComments(storyId: number): Promise<HNItem[]> {
  const story = await fetchItem(storyId)
  if (!story.kids || story.kids.length === 0) {
    return []
  }

  const comments: HNItem[] = []
  const queue = [...story.kids]

  while (queue.length > 0) {
    const batchSize = Math.min(10, queue.length)
    const batch = queue.splice(0, batchSize)

    const batchComments = await fetchItems(batch)

    for (const comment of batchComments) {
      if (!comment.deleted && !comment.dead) {
        comments.push(comment)
        if (comment.kids && comment.kids.length > 0) {
          queue.push(...comment.kids)
        }
      }
    }
  }

  return comments
}

// Fetch top stories from Algolia (alternative API with more metadata)
export async function fetchTopStoriesFromAlgolia(limit = 50): Promise<unknown[]> {
  const response = await fetch(`${ALGOLIA_API_BASE}/search?tags=front_page&hitsPerPage=${limit}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch from Algolia: ${response.statusText}`)
  }
  const data = await response.json()
  return data.hits
}

