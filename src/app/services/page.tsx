"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, SlidersHorizontal, MapPin, Star, Phone, MessageCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

const services = [
  {
    id: 1,
    title: "Home Electronics Repair",
    description: "Professional repair services for all home electronics including TVs, refrigerators, washing machines, and more. Fast turnaround and warranty included.",
    category: "Electronics",
    rating: 4.8,
    reviews: 156,
    location: "Casablanca",
    whatsapp: "+212600000000",
    phone: "+212522000000",
    verified: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400",
  },
  {
    id: 2,
    title: "Professional Photography",
    description: "Expert photography services for weddings, events, portraits, and commercial projects. High-quality images with fast delivery.",
    category: "Creative",
    rating: 4.9,
    reviews: 89,
    location: "Rabat",
    whatsapp: "+212600000000",
    phone: "+212537000000",
    verified: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1554048612-387768052bf7?w=400",
  },
  {
    id: 3,
    title: "Web Development",
    description: "Custom web development services including responsive websites, e-commerce platforms, and web applications. Modern technologies and best practices.",
    category: "Technology",
    rating: 4.7,
    reviews: 234,
    location: "Tangier",
    whatsapp: "+212600000000",
    phone: "+212539000000",
    verified: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400",
  },
  {
    id: 4,
    title: "Home Cleaning Services",
    description: "Professional home cleaning services including deep cleaning, regular maintenance, and move-in/move-out cleaning. Eco-friendly products.",
    category: "Home Services",
    rating: 4.6,
    reviews: 178,
    location: "Marrakech",
    whatsapp: "+212600000000",
    phone: "+212524000000",
    verified: false,
    featured: false,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
  },
  {
    id: 5,
    title: "Car Repair & Maintenance",
    description: "Complete auto repair services including engine repair, brake service, oil changes, and general maintenance. Experienced mechanics.",
    category: "Automotive",
    rating: 4.8,
    reviews: 312,
    location: "Casablanca",
    whatsapp: "+212600000000",
    phone: "+212522000000",
    verified: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400",
  },
  {
    id: 6,
    title: "Graphic Design",
    description: "Creative graphic design services for branding, marketing materials, social media, and print. Eye-catching designs that tell your story.",
    category: "Creative",
    rating: 4.5,
    reviews: 67,
    location: "Agadir",
    whatsapp: "+212600000000",
    phone: "+212528000000",
    verified: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1626785774573-4b799314346d?w=400",
  },
]

const categories = [
  "All Categories",
  "Electronics",
  "Creative",
  "Technology",
  "Home Services",
  "Automotive",
  "Education",
  "Health",
  "Other",
]

const locations = [
  "All Morocco",
  "Casablanca",
  "Marrakech",
  "Rabat",
  "Fes",
  "Tangier",
  "Agadir",
  "Other",
]

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedLocation, setSelectedLocation] = useState("All Morocco")
  const [sortBy, setSortBy] = useState("rating")
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-royal-blue to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-4">Services</h1>
            <p className="text-xl text-white/90">Find trusted service providers across Morocco</p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white/50 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-lg"
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Filters Panel */}
          <motion.div
            initial={false}
            animate={{ height: showFilters ? "auto" : 0, opacity: showFilters ? 1 : 0 }}
            className="overflow-hidden lg:block"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <Select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="newest">Newest</option>
                </Select>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-royal-blue">{services.length}</span> services
            </p>
            <Button variant="outline" size="sm">
              Clear Filters
            </Button>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <Link href={`/services/${service.id}`}>
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-gold h-full">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                      {service.featured && (
                        <Badge className="absolute top-3 right-3" variant="gold">
                          Featured
                        </Badge>
                      )}
                      {service.verified && (
                        <Badge className="absolute top-3 left-3" variant="success">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline">{service.category}</Badge>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-gold text-gold" />
                          <span className="font-semibold">{service.rating}</span>
                          <span className="text-gray-500">({service.reviews})</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-2 text-gray-500 mb-4">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{service.location}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1" variant="gold">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          WhatsApp
                        </Button>
                        <Button variant="outline" size="icon">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12 gap-2">
            <Button variant="outline" disabled>
              Previous
            </Button>
            <Button variant="default">1</Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">Next</Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-royal-blue to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">Offer Your Services?</h2>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of service providers and reach more customers across Morocco.
            </p>
            <Link href="/auth/register">
              <Button size="lg" variant="gold" className="w-full sm:w-auto">
                Register as Service Provider
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
