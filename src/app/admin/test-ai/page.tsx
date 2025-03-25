"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { Header } from "@/components/header"

export default function TestAIPage() {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleTest = async () => {
    if (!prompt) return

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/test-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()
      setResult(data.result)
    } catch (error) {
      console.error("Error testing AI:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Test AI Integration</h1>
          <p className="text-muted-foreground">Test the Vercel AI SDK with OpenAI</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Test AI</CardTitle>
            <CardDescription>Enter a prompt to test the AI integration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your prompt here"
                  rows={4}
                />
              </div>

              {result && (
                <div className="grid gap-2">
                  <Label>Result</Label>
                  <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">{result}</div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleTest} disabled={loading || !prompt}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Test AI"
              )}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

