import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Star, Building2 } from 'lucide-react'

interface BusinessCardProps {
  id: string
  name: string
  description: string
  logo?: string
  cover?: string
  category: string
  city: string
  rating?: number
  reviewsCount?: number
  verified?: boolean
}

export function BusinessCard({
  id,
  name,
  description,
  logo,
  cover,
  category,
  city,
  rating = 0,
  reviewsCount = 0,
  verified = false,
}: BusinessCardProps) {
  return (
    <Link href={`/business/${id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full border border-gray-100">
        {cover && (
          <div className="h-36 bg-gradient-to-br from-blue-500 to-blue-600 relative overflow-hidden">
            <img
              src={cover}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}
        <CardContent className="p-5">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-md">
              {logo ? (
                <img src={logo} alt={name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="h-8 w-8 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 truncate text-base">{name}</h3>
                {verified && (
                  <span className="text-blue-500 text-sm">✓</span>
                )}
              </div>
              <span className="text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full font-medium">
                {category}
              </span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
            {description}
          </p>
          
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{city}</span>
            </div>
            {rating > 0 && (
              <div className="flex items-center gap-1.5 text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{rating.toFixed(1)}</span>
                <span className="text-gray-400">({reviewsCount})</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
