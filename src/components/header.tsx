import Link from "next/link"
import { ModeToggle } from "./mode-toggle"

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-2xl font-bold tracking-tighter">
            The Daily Bin
          </Link>
          <p className="text-sm text-muted-foreground hidden md:block">Your AI-curated Hacker News digest</p>
        </div>
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex space-x-4">
            <Link href="/archive" className="text-sm font-medium hover:underline">
              Archive
            </Link>
            <Link href="/about" className="text-sm font-medium hover:underline">
              About
            </Link>
          </nav>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

