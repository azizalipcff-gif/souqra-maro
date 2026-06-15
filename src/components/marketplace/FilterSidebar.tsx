"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export interface FilterState {
  category?: string
  location?: string
  rating?: number
  priceRange?: [number, number]
  sortBy?: string
}

interface FilterSidebarProps {
  categories?: string[]
  locations?: string[]
  onFilterChange?: (filters: FilterState) => void
}

export function FilterSidebar({ categories = [], locations = [], onFilterChange }: FilterSidebarProps) {
  return (
    <Card className="p-4">
      <CardContent className="p-0 space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">{category}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Locations</h3>
          <div className="space-y-2">
            {locations.map((location) => (
              <label key={location} className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">{location}</span>
              </label>
            ))}
          </div>
        </div>
        
        <Button className="w-full">Apply Filters</Button>
      </CardContent>
    </Card>
  )
}
