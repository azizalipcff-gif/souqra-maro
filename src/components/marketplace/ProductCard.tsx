"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, Heart } from "lucide-react"
import Link from "next/link"

interface ProductCardProps {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  location: string
  rating: number
  reviewsCount: number
}

export function ProductCard({ id, name, description, price, images, category, location, rating, reviewsCount }: ProductCardProps) {
  return (
    <Link href={`/products/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {images[0] && (
          <div className="h-40 bg-gradient-to-r from-green-500 to-teal-500" />
        )}
        <CardContent className="p-4">
          <h3 className="font-semibold truncate">{name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-bold text-blue-600">{price} MAD</span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{rating}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
            <span>{category}</span>
            <span>{location}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
