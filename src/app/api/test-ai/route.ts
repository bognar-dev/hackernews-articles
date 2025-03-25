import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const { text } = await generateText({
      model: google("gemini-2.0-flash-exp"),
      prompt,
    });

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("Error in test-ai API:", error);
    return NextResponse.json(
      { error: "Failed to process prompt", message: error.message },
      { status: 500 }
    );
  }
}
