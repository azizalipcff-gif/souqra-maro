"use client"

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SearchBar } from '@/components/marketplace/SearchBar'
import { BusinessCard } from '@/components/marketplace/BusinessCard'
import { FilterSidebar, FilterState } from '@/components/marketplace/FilterSidebar'

// Mock data - will be replaced with Supabase data
const mockBusinesses = [
  {
    id: '1',
    name: 'Casa Electronics',
    description: 'Premium electronics and gadgets store in Casablanca',
    logo: '',
    cover: '',
    category: 'Technology',
    city: 'Casablanca',
    rating: 4.8,
    reviewsCount: 234,
    verified: true,
  },
  {
    id: '2',
    name: 'Riad Restaurant',
    description: 'Traditional Moroccan cuisine with modern twist',
    logo: '',
    cover: '',
    category: 'Restaurants',
    city: 'Marrakech',
    rating: 4.9,
    reviewsCount: 567,
    verified: true,
  },
  {
    id: '3',
    name: 'Atlas Fashion',
    description: 'Modern clothing and accessories',
    logo: '',
    cover: '',
    category: 'Shopping',
    city: 'Rabat',
    rating: 4.5,
    reviewsCount: 189,
    verified: false,
  },
  {
    id: '4',
    name: 'Health Plus Clinic',
    description: 'Comprehensive healthcare services',
    logo: '',
    cover: '',
    category: 'Health',
    city: 'Fes',
    rating: 4.7,
    reviewsCount: 312,
    verified: true,
  },
  {
    id: '5',
    name: 'Tech Solutions',
    description: 'IT services and software development',
    logo: '',
    cover: '',
    category: 'Technology',
    city: 'Casablanca',
    rating: 4.6,
    reviewsCount: 145,
    verified: true,
  },
  {
    id: '6',
    name: 'Moroccan Crafts',
    description: 'Traditional handicrafts and artisanal products',
    logo: '',
    cover: '',
    category: 'Shopping',
    city: 'Marrakech',
    rating: 4.8,
    reviewsCount: 278,
    verified: true,
  },
  {
    id: '7',
    name: 'Fitness Center',
    description: 'Modern gym with personal training',
    logo: '',
    cover: '',
    category: 'Health',
    city: 'Rabat',
    rating: 4.4,
    reviewsCount: 98,
    verified: false,
  },
  {
    id: '8',
    name: 'Digital Agency',
    description: 'Web design and digital marketing',
    logo: '',
    cover: '',
    category: 'Services',
    city: 'Casablanca',
    rating: 4.7,
    reviewsCount: 167,
    verified: true,
  },
]

const categories = ['Technology', 'Restaurants', 'Shopping', 'Health', 'Services', 'Education']
const locations = ['Casablanca', 'Marrakech', 'Rabat', 'Fes', 'Tangier', 'Agadir']

export default function BusinessesPage() {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 10000],
    sortBy: 'newest',
  })

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  // Filter businesses based on filters (mock logic)
  const filteredBusinesses = mockBusinesses.filter((business) => {
    if (filters.category && business.category !== filters.category) return false
    if (filters.location && business.city !== filters.location) return false
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Businesses</h1>
          <p className="text-blue-100 mb-6">Discover local businesses across Morocco</p>
          <SearchBar 
            placeholder="Search businesses..." 
            className="max-w-2xl"
          />
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 hidden lg:block">
              <FilterSidebar
                categories={categories}
                locations={locations}
                onFilterChange={handleFilterChange}
              />
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              <div className="mb-6">
                <p className="text-gray-600">
                  Showing {filteredBusinesses.length} businesses
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBusinesses.map((business) => (
                  <BusinessCard key={business.id} {...business} />
                ))}
              </div>

              {filteredBusinesses.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No businesses found matching your filters</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
