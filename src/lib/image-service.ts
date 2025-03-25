import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function generateImageDescription(
  prompt: string
): Promise<string> {
  const enhancedPrompt = `
    Create a detailed description for an image based on this concept: "${prompt}"
    
    The description should be suitable for an AI image generator and should create a newspaper-style 
    illustration that represents the concept. Include details about style, composition, colors, and mood.
    
    Make it visually interesting and suitable for a tech news website.
    
    Return ONLY the description, nothing else.
  `;

  try {
    const { text } = await generateText({
      model: google("gemini-2.0-flash-exp"),
      prompt: enhancedPrompt,
    });

    return text.trim();
  } catch (error) {
    console.error("Error generating image description:", error);
    return `A minimalist illustration representing ${prompt} in a newspaper style`;
  }
}

export async function generateImage(prompt: string): Promise<string | null> {
  // For now, we'll return a placeholder image URL
  // In a real implementation, you would call an image generation API
  // and then upload the result to Vercel Blob

  // The height and width can be adjusted as needed
  const height = 400;
  const width = 600;

  // Encode the prompt in the URL to make each image unique
  const encodedPrompt = encodeURIComponent(prompt);
  const placeholderUrl = `/placeholder.svg?height=${height}&width=${width}&text=${encodedPrompt}`;

  // In a real implementation with an image generation API, you would:
  // 1. Call the API with the prompt
  // 2. Get the image binary data
  // 3. Upload to Vercel Blob
  // 4. Return the Blob URL

  // Example of how you would upload to Vercel Blob:
  // const imageBlob = await fetchImageFromGenerationAPI(prompt);
  // const { url } = await put(`images/${Date.now()}.png`, imageBlob, {
  //   access: 'public',
  // });
  // return url;

  return placeholderUrl;
}
