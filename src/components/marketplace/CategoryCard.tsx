import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

interface CategoryCardProps {
  id: string
  name: string
  slug: string
  image?: string
  icon?: string
  count?: number
}

export function CategoryCard({
  id,
  name,
  slug,
  image,
  icon,
  count = 0,
}: CategoryCardProps) {
  return (
    <Link href={`/categories/${slug}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full border border-gray-100">
        <div className="h-36 bg-gradient-to-br from-blue-500 to-blue-600 relative overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl">{icon || '📦'}</span>
            </div>
          )}
        </div>
        <CardContent className="p-5">
          <h3 className="font-semibold text-gray-900 mb-1 text-base">{name}</h3>
          {count > 0 && (
            <p className="text-sm text-gray-500">{count.toLocaleString()} listings</p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
