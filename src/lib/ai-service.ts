import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import type { HNItem } from "./hn-api"

// Type for the filtered post with comments
interface PostWithComments {
  post: HNItem
  comments: HNItem[]
}

// Filter the posts to get the most interesting ones
export async function filterPosts(posts: HNItem[], limit = 10): Promise<HNItem[]> {
  // Prepare the posts data for the prompt
  const postsData = posts.map((post) => ({
    id: post.id,
    title: post.title,
    url: post.url,
    score: post.score,
    by: post.by,
    descendants: post.descendants,
  }))

  const prompt = `
    You are a personal news curator. Below is a list of Hacker News posts:
    
    ${JSON.stringify(postsData, null, 2)}
    
    Select the ${limit} most interesting and insightful posts based on these criteria:
    
    - Prefer posts that spark thoughtful discussions
    - Avoid posts about job listings, hiring, or career advice
    - Avoid posts that require deep technical expertise to appreciate
    - Prefer posts about technology trends, programming languages, tools, and interesting projects
    - Prefer posts with educational value or that teach something new
    - Prefer posts with high engagement (comments and score)
    
    Return ONLY a JSON array of post IDs in order of interest, with the most interesting first. 
    Format: [id1, id2, id3, ...]
  `

  try {
    const { text } = await generateText({
      model: google("gemini-flash-2"),
      prompt,
    })

    // Parse the response to get the filtered post IDs
    const filteredIds = JSON.parse(text)

    // Map the IDs back to the original posts
    const idToPostMap = new Map(posts.map((post) => [post.id, post]))
    return filteredIds.map((id) => idToPostMap.get(id)).filter(Boolean)
  } catch (error) {
    console.error("Error filtering posts:", error)
    // Fallback to simple sorting by score if AI filtering fails
    return [...posts].sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, limit)
  }
}

// Generate a summary of the post and its comments
export async function generateSummary(postWithComments: PostWithComments): Promise<{ title: string; summary: string }> {
  const { post, comments } = postWithComments

  // Prepare the comments text, limiting to avoid token limits
  const commentsText = comments
    .slice(0, 50) // Limit to top 50 comments
    .map((comment) => `${comment.by}: ${comment.text}`)
    .join("\n\n")

  const prompt = `
    You are a journalist writing for a tech newspaper. Summarize the following Hacker News discussion in the style of the New York Times.
    
    ARTICLE TITLE: ${post.title}
    ARTICLE URL: ${post.url || "No URL provided"}
    POSTED BY: ${post.by}
    
    COMMENTS:
    ${commentsText}
    
    Write a concise, informative summary of the discussion (not the original article). 
    Focus on the key insights, interesting perspectives, and main points of disagreement.
    Create a catchy, newspaper-style headline for your summary.
    
    Format your response as:
    
    HEADLINE: [Your headline here]
    
    [Your summary here - about 3-4 paragraphs]
  `

  try {
    const { text } = await generateText({
      model: google("gemini-flash-2"),
      prompt,
    })

    // Parse the response to extract the headline and summary
    const headlineMatch = text.match(/HEADLINE:\s*(.*?)(?:\n|$)/)
    const headline = headlineMatch ? headlineMatch[1].trim() : `Discussion: ${post.title}`

    // Extract the summary (everything after the headline)
    const summary = text.replace(/HEADLINE:\s*(.*?)(?:\n|$)/, "").trim()

    return { title: headline, summary }
  } catch (error) {
    console.error("Error generating summary:", error)
    return {
      title: `Discussion: ${post.title}`,
      summary: "Unable to generate summary. Please check the original discussion.",
    }
  }
}

// Generate an image prompt based on the title
export async function generateImagePrompt(title: string): Promise<string> {
  const prompt = `
    You are a visual prompt engineer. Given the following article title, create a short, descriptive phrase 
    that could be used to generate an image that represents the article's content.
    
    ARTICLE TITLE: ${title}
    
    The phrase should be concise (3-6 words), visually descriptive, and capture the essence of the article.
    It should work well as an image generation prompt.
    
    Return ONLY the phrase, nothing else.
  `

  try {
    const { text } = await generateText({
      model: google("gemini-flash-2"),
      prompt,
    })

    return text.trim()
  } catch (error) {
    console.error("Error generating image prompt:", error)
    return "tech discussion visualization"
  }
}

