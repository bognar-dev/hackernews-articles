import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface ArticleCardProps {
  id: number
  title: string
  summary: string
  imageUrl: string
  date: string
  slug: string
}

export function ArticleCard({ id, title, summary, imageUrl, date, slug }: ArticleCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link href={`/article/${slug}`}>
        <div className="aspect-video relative">
          <Image src={imageUrl || "/placeholder.svg?height=400&width=600"} alt={title} fill className="object-cover" />
        </div>
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground mb-2">{date}</div>
          <h3 className="text-xl font-bold mb-2 line-clamp-2">{title}</h3>
          <p className="text-muted-foreground line-clamp-3">{summary}</p>
        </CardContent>
      </Link>
    </Card>
  )
}

