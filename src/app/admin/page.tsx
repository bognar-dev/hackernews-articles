import { Header } from "@/components/header"
import { OpenExternalDashboard } from "@/components/open-external-dashboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your Daily Bin application</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Seed Database</CardTitle>
              <CardDescription>Populate the database with initial Hacker News data</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This will fetch top stories from Hacker News, process them using AI, and store the results in the
                database.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/admin/seed" className="w-full">
                <Button className="w-full">Go to Seed Page</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>View Database</CardTitle>
              <CardDescription>Open Supabase dashboard to view and manage data</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Access your Supabase dashboard to view tables, run queries, and manage your data.
              </p>
            </CardContent>
            <CardFooter>
              <OpenExternalDashboard integration="supabase" />
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trigger Scraper</CardTitle>
              <CardDescription>Manually run the Hacker News scraper</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This will run the scraper to fetch and process the latest Hacker News stories.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/admin/seed" className="w-full">
                <Button className="w-full">Run Scraper</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} The Compiler. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

