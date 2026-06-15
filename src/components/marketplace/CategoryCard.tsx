"use client"

import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface CategoryCardProps {
  id: string
  name: string
  slug: string
  icon?: string
  count: number
}

export function CategoryCard({ id, name, slug, icon, count }: CategoryCardProps) {
  return (
    <Link href={`/categories/${slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer text-center">
        <CardContent className="p-6">
          <div className="text-4xl mb-2">{icon}</div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-sm text-gray-500">{count} listings</p>
        </CardContent>
      </Card>
    </Link>
  )
}
