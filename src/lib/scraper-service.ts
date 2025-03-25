import { fetchTopStories, fetchItems, fetchAllComments } from "./hn-api";
import {
  saveHNPost,
  saveHNComments,
  saveFilteredPost,
  saveSummary,
} from "./db-service";
import {
  filterPosts,
  generateSummary,
  generateImagePrompt,
} from "./ai-service";
import { generateImageDescription, generateImage } from "./image-service";

export async function runScraper() {
  try {
    console.log("Starting Hacker News scraper...");

    // Step 1: Fetch top stories from Hacker News
    console.log("Fetching top stories...");
    const topStoryIds = await fetchTopStories(50);
    const topStories = await fetchItems(topStoryIds);

    // Step 2: Save the posts to the database
    console.log("Saving posts to database...");
    for (const story of topStories) {
      await saveHNPost(story);
    }

    // Step 3: Filter the posts using AI
    console.log("Filtering posts...");
    const filteredPosts = await filterPosts(topStories, 30);

    // Step 4: Process each filtered post
    console.log("Processing filtered posts...");
    const today = new Date();

    for (let i = 0; i < filteredPosts.length; i++) {
      const post = filteredPosts[i];
      console.log(
        `Processing post ${i + 1}/${filteredPosts.length}: ${post.title}`
      );

      // Step 4.1: Save as a filtered post
      const hnPostResult = await saveHNPost(post);
      const hnPostId = hnPostResult.id;
      const filteredPostResult = await saveFilteredPost(hnPostId, i + 1, today);
      const filteredPostId = filteredPostResult.id;

      // Step 4.2: Fetch and save comments
      console.log(`Fetching comments for post ${post.id}...`);
      const comments = await fetchAllComments(post.id);
      await saveHNComments(comments, post.id);

      // Step 4.3: Generate summary
      console.log(`Generating summary for post ${post.id}...`);
      const { title, summary } = await generateSummary({ post, comments });

      // Step 4.4: Generate image prompt
      console.log(`Generating image prompt for post ${post.id}...`);
      const imagePrompt = await generateImagePrompt(title);

      // Step 4.5: Generate image description and image
      console.log(`Generating image for post ${post.id}...`);
      const imageDescription = await generateImageDescription(imagePrompt);
      const imageUrl = await generateImage(imageDescription);

      // Step 4.6: Save summary and image info
      console.log(`Saving summary for post ${post.id}...`);
      await saveSummary(filteredPostId, title, summary, imagePrompt, imageUrl);
    }

    console.log("Scraper completed successfully!");
    return { success: true, message: "Scraper completed successfully" };
  } catch (error) {
    console.error("Error running scraper:", error);
    return { success: false, message: `Scraper failed: ${error.message}` };
  }
}
