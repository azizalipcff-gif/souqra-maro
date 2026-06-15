"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, MapPin } from "lucide-react"
import Link from "next/link"

interface BusinessCardProps {
  id: string
  name: string
  description: string
  logo?: string
  cover?: string
  category: string
  city: string
  rating: number
  reviewsCount: number
  verified: boolean
}

export function BusinessCard({ id, name, description, logo, cover, category, city, rating, reviewsCount, verified }: BusinessCardProps) {
  return (
    <Link href={`/business/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {cover && (
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500" />
        )}
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {logo && (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <MapPin className="h-3 w-3" />
                <span>{city}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{rating}</span>
                <span className="text-sm text-gray-500">({reviewsCount} reviews)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
