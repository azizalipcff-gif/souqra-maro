"use client"

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SearchBar } from '@/components/marketplace/SearchBar'
import { BusinessCard } from '@/components/marketplace/BusinessCard'
import { ProductCard } from '@/components/marketplace/ProductCard'
import { FilterSidebar, FilterState } from '@/components/marketplace/FilterSidebar'
import { Button } from '@/components/ui/button'

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
]

const mockProducts = [
  {
    id: '1',
    name: 'Wireless Headphones Pro',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 899,
    images: [''],
    category: 'Technology',
    location: 'Casablanca',
    rating: 4.6,
    reviewsCount: 45,
    condition: 'new',
    sellerName: 'Casa Electronics',
  },
  {
    id: '2',
    name: 'Traditional Moroccan Rug',
    description: 'Hand-woven Berber rug from Atlas Mountains',
    price: 2500,
    images: [''],
    category: 'Shopping',
    location: 'Marrakech',
    rating: 4.9,
    reviewsCount: 78,
    condition: 'new',
    sellerName: 'Atlas Crafts',
  },
  {
    id: '3',
    name: 'Smartphone Case',
    description: 'Durable protective case with wireless charging',
    price: 150,
    images: [''],
    category: 'Technology',
    location: 'Rabat',
    rating: 4.3,
    reviewsCount: 23,
    condition: 'new',
    sellerName: 'Mobile World',
  },
  {
    id: '4',
    name: 'Vintage Camera',
    description: 'Classic film camera in excellent condition',
    price: 1200,
    images: [''],
    category: 'Technology',
    location: 'Casablanca',
    rating: 4.8,
    reviewsCount: 34,
    condition: 'used',
    sellerName: 'Photo Studio',
  },
]

const categories = ['Technology', 'Restaurants', 'Shopping', 'Health', 'Services', 'Education']
const locations = ['Casablanca', 'Marrakech', 'Rabat', 'Fes', 'Tangier', 'Agadir']

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [activeTab, setActiveTab] = useState('all')
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 10000],
    sortBy: 'newest',
  })

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  // Filter results based on query and filters (mock logic)
  const filteredBusinesses = mockBusinesses.filter((business) => {
    if (query && !business.name.toLowerCase().includes(query.toLowerCase())) return false
    if (filters.category && business.category !== filters.category) return false
    if (filters.location && business.city !== filters.location) return false
    return true
  })

  const filteredProducts = mockProducts.filter((product) => {
    if (query && !product.name.toLowerCase().includes(query.toLowerCase())) return false
    if (filters.category && product.category !== filters.category) return false
    if (filters.location && product.location !== filters.location) return false
    if (filters.priceRange) {
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) return false
    }
    if (filters.condition && product.condition !== filters.condition) return false
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Search Results</h1>
          <p className="text-blue-100 mb-6">
            {query ? `Showing results for "${query}"` : 'Search for businesses and products'}
          </p>
          <SearchBar 
            placeholder="Search businesses, products, services..." 
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
              {/* Tab Buttons */}
              <div className="flex gap-2 mb-6">
                <Button
                  variant={activeTab === 'all' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('all')}
                >
                  All ({filteredBusinesses.length + filteredProducts.length})
                </Button>
                <Button
                  variant={activeTab === 'businesses' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('businesses')}
                >
                  Businesses ({filteredBusinesses.length})
                </Button>
                <Button
                  variant={activeTab === 'products' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('products')}
                >
                  Products ({filteredProducts.length})
                </Button>
              </div>

              {activeTab === 'all' && (
                <div className="space-y-8">
                  {filteredBusinesses.length > 0 && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Businesses</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBusinesses.map((business) => (
                          <BusinessCard key={business.id} {...business} />
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredProducts.length > 0 && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Products</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((product) => (
                          <ProductCard key={product.id} {...product} />
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredBusinesses.length === 0 && filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-600 text-lg">No results found</p>
                      <p className="text-gray-500 mt-2">Try adjusting your filters or search terms</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'businesses' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBusinesses.map((business) => (
                    <BusinessCard key={business.id} {...business} />
                  ))}
                  {filteredBusinesses.length === 0 && (
                    <div className="text-center py-12 col-span-3">
                      <p className="text-gray-600 text-lg">No businesses found</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'products' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className="text-center py-12 col-span-3">
                      <p className="text-gray-600 text-lg">No products found</p>
                    </div>
                  )}
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

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white flex items-center justify-center">Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}
