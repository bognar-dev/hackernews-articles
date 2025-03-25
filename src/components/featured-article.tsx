import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface FeaturedArticleProps {
  id: number
  title: string
  summary: string
  imageUrl: string
  date: string
  slug: string
}

export function FeaturedArticle({ title, summary, imageUrl, date, slug }: FeaturedArticleProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link href={`/article/${slug}`}>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="aspect-video relative">
            <Image
              src={imageUrl || "/placeholder.svg?height=400&width=600"}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="p-4 flex flex-col justify-center">
            <div className="text-sm text-muted-foreground mb-2">{date}</div>
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <p className="text-muted-foreground">{summary}</p>
          </CardContent>
        </div>
      </Link>
    </Card>
  )
}

