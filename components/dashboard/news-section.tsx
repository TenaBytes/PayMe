import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Newspaper, ExternalLink } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface NewsSectionProps {
  news: any[]
}

export function NewsSection({ news }: NewsSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          Latest News
        </CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/news">
            View All
            <ExternalLink className="h-3 w-3 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {news.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No news available</p>
        ) : (
          <div className="space-y-4">
            {news.map((article) => (
              <div key={article.id} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <h3 className="font-semibold mb-2">{article.title}</h3>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {article.excerpt || article.content.substring(0, 150) + "..."}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
