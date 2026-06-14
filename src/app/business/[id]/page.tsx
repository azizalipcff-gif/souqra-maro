"use client"

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ProductCard } from '@/components/marketplace/ProductCard'
import { BusinessCard } from '@/components/marketplace/BusinessCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Phone, Mail, Globe, Star, Building2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

// Mock data - will be replaced with Supabase data
const mockBusiness = {
  id: '1',
  name: 'Casa Electronics',
  description: 'Premium electronics and gadgets store in Casablanca. We offer the latest smartphones, laptops, tablets, and accessories from top brands. Our team of experts is ready to help you find the perfect device for your needs.',
  logo: '',
  cover: '',
  category: 'Technology',
  city: 'Casablanca',
  phone: '+212 522 123 456',
  whatsapp: '+212 522 123 456',
  email: 'info@casaelectronics.ma',
  website: 'https://casaelectronics.ma',
  instagram: 'https://instagram.com/casaelectronics',
  facebook: 'https://facebook.com/casaelectronics',
  rating: 4.8,
  reviewsCount: 234,
  verified: true,
  views: 12500,
}

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
    name: 'Smartphone Case',
    description: 'Durable protective case with wireless charging',
    price: 150,
    images: [''],
    category: 'Technology',
    location: 'Casablanca',
    rating: 4.3,
    reviewsCount: 23,
    condition: 'new',
    sellerName: 'Casa Electronics',
  },
  {
    id: '3',
    name: 'Laptop Stand',
    description: 'Ergonomic aluminum laptop stand',
    price: 299,
    images: [''],
    category: 'Technology',
    location: 'Casablanca',
    rating: 4.7,
    reviewsCount: 67,
    condition: 'new',
    sellerName: 'Casa Electronics',
  },
]

const mockRelatedBusinesses = [
  {
    id: '2',
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
    id: '3',
    name: 'Mobile World',
    description: 'Mobile phones and accessories',
    logo: '',
    cover: '',
    category: 'Technology',
    city: 'Rabat',
    rating: 4.5,
    reviewsCount: 98,
    verified: false,
  },
]

export default function BusinessDetailPage() {
  const params = useParams()
  const id = params.id as string

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      
      {/* Cover Image */}
      {mockBusiness.cover ? (
        <div className="h-64 bg-gradient-to-br from-blue-500 to-blue-600 relative">
          <img
            src={mockBusiness.cover}
            alt={mockBusiness.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-64 bg-gradient-to-br from-blue-500 to-blue-600" />
      )}

      {/* Business Info */}
      <section className="container mx-auto px-4 -mt-20">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo */}
            <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {mockBusiness.logo ? (
                <img src={mockBusiness.logo} alt={mockBusiness.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="h-16 w-16 text-white" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-3xl font-bold text-gray-900">{mockBusiness.name}</h1>
                    {mockBusiness.verified && (
                      <span className="text-blue-500 text-xl">✓</span>
                    )}
                  </div>
                  <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {mockBusiness.category}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">{mockBusiness.rating.toFixed(1)}</span>
                  <span className="text-gray-500">({mockBusiness.reviewsCount} reviews)</span>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{mockBusiness.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{mockBusiness.city}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{mockBusiness.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{mockBusiness.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Globe className="h-4 w-4" />
                  <span className="truncate">{mockBusiness.views} views</span>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button size="lg" className="flex-1">
                  <Phone className="mr-2 h-5 w-5" />
                  Call Now
                </Button>
                <Button size="lg" variant="outline" className="flex-1">
                  <Mail className="mr-2 h-5 w-5" />
                  Message
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>

        {/* Related Businesses */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Businesses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockRelatedBusinesses.map((business) => (
              <BusinessCard key={business.id} {...business} />
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="mb-8">
          <Link href="/businesses">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Businesses
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
