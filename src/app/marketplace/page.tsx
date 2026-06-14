"use client"

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SearchBar } from '@/components/marketplace/SearchBar'
import { BusinessCard } from '@/components/marketplace/BusinessCard'
import { ProductCard } from '@/components/marketplace/ProductCard'
import { CategoryCard } from '@/components/marketplace/CategoryCard'
import { Button } from '@/components/ui/button'
import { Building2, ShoppingBag, TrendingUp, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'

// Mock data - will be replaced with Supabase data
const mockCategories = [
  { id: '1', name: 'Restaurants', slug: 'restaurants', icon: '🍽️', count: 150 },
  { id: '2', name: 'Shopping', slug: 'shopping', icon: '🛍️', count: 320 },
  { id: '3', name: 'Services', slug: 'services', icon: '🔧', count: 200 },
  { id: '4', name: 'Health', slug: 'health', icon: '🏥', count: 85 },
  { id: '5', name: 'Education', slug: 'education', icon: '📚', count: 120 },
  { id: '6', name: 'Technology', slug: 'technology', icon: '💻', count: 95 },
]

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

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">Discover Morocco's Best Businesses</h1>
            <p className="text-xl mb-10 text-blue-100 leading-relaxed">
              Find local businesses, products, and services across Morocco
            </p>
            <SearchBar 
              placeholder="Search businesses, products, services..." 
              className="max-w-2xl mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">5,000+</div>
              <div className="text-gray-600 font-medium">Businesses</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">25,000+</div>
              <div className="text-gray-600 font-medium">Products</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">50+</div>
              <div className="text-gray-600 font-medium">Cities</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">100K+</div>
              <div className="text-gray-600 font-medium">Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse Categories</h2>
              <p className="text-gray-600">Explore businesses by category</p>
            </div>
            <Link href="/categories">
              <Button variant="outline" className="hover:bg-blue-50 hover:border-blue-300 transition-colors">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {mockCategories.map((category) => (
              <CategoryCard key={category.id} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Businesses</h2>
              <p className="text-gray-600">Top-rated businesses across Morocco</p>
            </div>
            <Link href="/businesses">
              <Button variant="outline" className="hover:bg-blue-50 hover:border-blue-300 transition-colors">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockBusinesses.map((business) => (
              <BusinessCard key={business.id} {...business} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
              <p className="text-gray-600">Discover trending products from local sellers</p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="hover:bg-blue-50 hover:border-blue-300 transition-colors">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">Start Your Business Today</h2>
            <p className="text-xl mb-10 text-blue-100 leading-relaxed">
              Join thousands of businesses already on Souqora Morocco
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 transition-colors font-semibold px-8">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/businesses">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 transition-colors font-semibold px-8">
                  Explore Businesses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
