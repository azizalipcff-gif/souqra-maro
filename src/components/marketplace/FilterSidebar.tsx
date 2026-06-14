"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'

interface FilterSidebarProps {
  categories?: string[]
  locations?: string[]
  onFilterChange?: (filters: FilterState) => void
}

export interface FilterState {
  category?: string
  location?: string
  priceRange: [number, number]
  condition?: string
  sortBy: string
}

export function FilterSidebar({ categories = [], locations = [], onFilterChange }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 10000],
    sortBy: 'newest',
  })

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFilterChange?.(updated)
  }

  const clearFilters = () => {
    const cleared: FilterState = {
      priceRange: [0, 10000],
      sortBy: 'newest',
    }
    setFilters(cleared)
    onFilterChange?.(cleared)
  }

  return (
    <Card className="h-fit sticky top-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Filters</CardTitle>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div className="space-y-2">
          <Label>Category</Label>
          <select
            className="w-full p-2 border rounded-md"
            value={filters.category || ''}
            onChange={(e) => handleFilterChange({ category: e.target.value || undefined })}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div className="space-y-2">
          <Label>Location</Label>
          <select
            className="w-full p-2 border rounded-md"
            value={filters.location || ''}
            onChange={(e) => handleFilterChange({ location: e.target.value || undefined })}
          >
            <option value="">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label>Price Range (MAD)</Label>
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.priceRange[0]}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0
                handleFilterChange({ priceRange: [value, filters.priceRange[1]] })
              }}
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.priceRange[1]}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 10000
                handleFilterChange({ priceRange: [filters.priceRange[0], value] })
              }}
            />
          </div>
        </div>

        {/* Condition */}
        <div className="space-y-2">
          <Label>Condition</Label>
          <select
            className="w-full p-2 border rounded-md"
            value={filters.condition || ''}
            onChange={(e) => handleFilterChange({ condition: e.target.value || undefined })}
          >
            <option value="">All Conditions</option>
            <option value="new">New</option>
            <option value="used">Used</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label>Sort By</Label>
          <select
            className="w-full p-2 border rounded-md"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
          >
            <option value="newest">Newest</option>
            <option value="popular">Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </CardContent>
    </Card>
  )
}
