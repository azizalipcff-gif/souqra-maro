import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Star, Heart } from 'lucide-react'

interface ProductCardProps {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category?: string
  location: string
  rating?: number
  reviewsCount?: number
  condition?: string
  sellerName?: string
  isFavorite?: boolean
}

export function ProductCard({
  id,
  name,
  description,
  price,
  images,
  category,
  location,
  rating = 0,
  reviewsCount = 0,
  condition = 'new',
  sellerName,
  isFavorite = false,
}: ProductCardProps) {
  const mainImage = images[0] || '/placeholder-product.jpg'

  return (
    <Link href={`/products/${id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full border border-gray-100">
        <div className="h-48 bg-gray-100 relative overflow-hidden">
          <img
            src={mainImage}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {condition === 'new' && (
            <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-sm">
              New
            </span>
          )}
          <button
            className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
            onClick={(e) => {
              e.preventDefault()
              // TODO: Toggle favorite
            }}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </button>
        </div>
        <CardContent className="p-5">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 text-base">{name}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">{description}</p>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-xl font-bold text-blue-600">
              {price.toLocaleString()} MAD
            </span>
            {rating > 0 && (
              <div className="flex items-center gap-1.5 text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{rating.toFixed(1)}</span>
                <span className="text-gray-400">({reviewsCount})</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{location}</span>
            </div>
            {category && (
              <span className="text-xs bg-gray-100 px-2.5 py-1 rounded-full font-medium">
                {category}
              </span>
            )}
          </div>
          
          {sellerName && (
            <div className="mt-3 text-sm text-gray-500">
              by <span className="font-medium text-gray-700">{sellerName}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
