"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, SlidersHorizontal, Grid, List, Heart, MapPin, Star, Loader2, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { getSupabase } from "@/lib/supabase/client"

const MOROCCAN_CITIES = [
  "All Morocco",
  "Casablanca",
  "Rabat",
  "Tangier",
  "Marrakech",
  "Agadir",
  "Fes",
  "Oujda",
  "Kenitra",
  "Tetouan",
  "Safi",
  "Meknes",
]

const CATEGORIES = [
  "All Categories",
  "Electronics",
  "Fashion",
  "Home & Garden",
  "Vehicles",
  "Beauty",
  "Sports",
  "Books",
  "Services",
  "Other",
]

export default function MarketplacePage() {
  interface MarketplaceBusiness {
    id: string
    business_name: string
    category: string
    city: string
    description?: string
    cover_url?: string | null
    logo_url?: string | null
  }

  const [businesses, setBusinesses] = useState<MarketplaceBusiness[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedLocation, setSelectedLocation] = useState("All Morocco")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  const loadBusinesses = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/businesses/public?limit=100')
      const { businesses } = await response.json()

      if (businesses) {
        // Filter on client side for now
        let filtered: MarketplaceBusiness[] = businesses

        if (selectedCategory !== "All Categories") {
          filtered = filtered.filter((b) => b.category === selectedCategory)
        }

        if (selectedLocation !== "All Morocco") {
          filtered = filtered.filter((b) => b.city === selectedLocation)
        }

        if (searchQuery) {
          filtered = filtered.filter((b) =>
            b.business_name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        }
        
        setBusinesses(filtered)
      }
    } catch (error) {
      console.error('Error loading businesses:', error)
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, selectedCategory, selectedLocation])

  useEffect(() => {
    loadBusinesses()
  }, [loadBusinesses])

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
            <h1 className="text-4xl font-bold mb-4">Marketplace</h1>
            <p className="text-xl text-white/90">Discover amazing businesses from across Morocco</p>
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
                placeholder="Search businesses..."
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

            {/* View Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filters Panel */}
          <motion.div
            initial={false}
            animate={{ height: showFilters ? "auto" : 0, opacity: showFilters ? 1 : 0 }}
            className="overflow-hidden lg:block"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <Select
                  value={selectedLocation}
                  onValueChange={(value) => setSelectedLocation(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOROCCAN_CITIES.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("All Categories")
                    setSelectedLocation("All Morocco")
                  }}
                >
                  Clear Filters
                </Button>
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
              Showing <span className="font-semibold text-royal-blue">{businesses.length}</span> businesses
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-royal-blue" />
            </div>
          ) : businesses.length === 0 ? (
            <div className="text-center py-12">
              <Store className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No businesses found</p>
            </div>
          ) : (
            <>
              {/* Businesses Grid */}
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "flex flex-col gap-4"
                }
              >
                {businesses.map((business, index) => {
                  return (
                    <motion.div
                      key={business.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -5 }}
                    >
                      <Link href={`/business/${business.id}`}>
                        <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-300 h-full">
                          <div className="relative h-48 overflow-hidden">
                            {business.cover_url ? (
                              <img
                                src={business.cover_url}
                                alt={business.business_name}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
                                <Store className="h-12 w-12 text-white/50" />
                              </div>
                            )}
                          </div>
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-3 mb-2">
                              {business.logo_url ? (
                                <img
                                  src={business.logo_url}
                                  alt={business.business_name}
                                  className="w-12 h-12 object-contain rounded-lg border border-gray-200"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
                                  <Store className="h-6 w-6 text-white/50" />
                                </div>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {business.category}
                              </Badge>
                            </div>
                            <CardTitle className="text-lg line-clamp-2">{business.business_name}</CardTitle>
                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {business.city}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-3">
                            <p className="text-sm text-gray-600 line-clamp-2">{business.description}</p>
                          </CardContent>
                          <CardFooter className="flex gap-2">
                            <Button className="flex-1">View Details</Button>
                            <Button variant="outline" size="icon">
                              <Heart className="h-4 w-4" />
                            </Button>
                          </CardFooter>
                        </Card>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
