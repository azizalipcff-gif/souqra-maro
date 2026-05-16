"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, SlidersHorizontal, Grid, List, Heart, MapPin, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

const products = [
  {
    id: 1,
    title: "Premium Moroccan Leather Bag",
    price: 1200,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400",
    category: "Fashion",
    rating: 4.8,
    reviews: 45,
    location: "Casablanca",
    condition: "new",
    featured: true,
  },
  {
    id: 2,
    title: "Handwoven Berber Rug",
    price: 3500,
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=400",
    category: "Home Decor",
    rating: 4.9,
    reviews: 78,
    location: "Marrakech",
    condition: "new",
    featured: true,
  },
  {
    id: 3,
    title: "Argan Oil Set",
    price: 450,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400",
    category: "Beauty",
    rating: 4.7,
    reviews: 123,
    location: "Agadir",
    condition: "new",
    featured: false,
  },
  {
    id: 4,
    title: "Traditional Tagine Pot",
    price: 680,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356f36?w=400",
    category: "Kitchen",
    rating: 4.6,
    reviews: 56,
    location: "Fes",
    condition: "new",
    featured: false,
  },
  {
    id: 5,
    title: "Moroccan Tea Set",
    price: 890,
    image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400",
    category: "Home Decor",
    rating: 4.8,
    reviews: 34,
    location: "Casablanca",
    condition: "new",
    featured: false,
  },
  {
    id: 6,
    title: "Vintage Brass Lantern",
    price: 520,
    image: "https://images.unsplash.com/photo-1513506003011-3b03c801b5f4?w=400",
    category: "Home Decor",
    rating: 4.5,
    reviews: 28,
    location: "Marrakech",
    condition: "used",
    featured: false,
  },
  {
    id: 7,
    title: "Leather Wallet",
    price: 320,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400",
    category: "Fashion",
    rating: 4.7,
    reviews: 67,
    location: "Tangier",
    condition: "new",
    featured: false,
  },
  {
    id: 8,
    title: "Ceramic Vase Set",
    price: 450,
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400",
    category: "Home Decor",
    rating: 4.6,
    reviews: 41,
    location: "Safi",
    condition: "new",
    featured: false,
  },
]

const categories = [
  "All Categories",
  "Electronics",
  "Fashion",
  "Home & Garden",
  "Vehicles",
  "Beauty",
  "Sports",
  "Books",
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

const conditions = ["All", "New", "Used"]

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedLocation, setSelectedLocation] = useState("All Morocco")
  const [selectedCondition, setSelectedCondition] = useState("All")
  const [priceRange, setPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
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
            <h1 className="text-4xl font-bold mb-4">Marketplace</h1>
            <p className="text-xl text-white/90">Discover amazing products from sellers across Morocco</p>
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
                placeholder="Search products..."
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
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
                <label className="text-sm font-medium mb-2 block">Condition</label>
                <Select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                >
                  {conditions.map((cond) => (
                    <option key={cond} value={cond}>
                      {cond}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Price Range</label>
                <Select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                >
                  <option value="all">All Prices</option>
                  <option value="0-500">Under 500 MAD</option>
                  <option value="500-1000">500 - 1000 MAD</option>
                  <option value="1000-2000">1000 - 2000 MAD</option>
                  <option value="2000+">2000+ MAD</option>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Highest Rated</option>
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
              Showing <span className="font-semibold text-royal-blue">{products.length}</span> products
            </p>
            <Button variant="outline" size="sm">
              Clear Filters
            </Button>
          </div>

          {/* Products Grid */}
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <Link href={`/products/${product.id}`}>
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-gold h-full">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                      {product.featured && (
                        <Badge className="absolute top-3 right-3" variant="gold">
                          Featured
                        </Badge>
                      )}
                      <Badge
                        className="absolute top-3 left-3"
                        variant={product.condition === "new" ? "success" : "secondary"}
                      >
                        {product.condition}
                      </Badge>
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{product.title}</CardTitle>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {product.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-gold text-gold" />
                          {product.rating}
                          <span className="text-xs">({product.reviews})</span>
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="text-2xl font-bold text-royal-blue">
                        {product.price} MAD
                      </p>
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
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12 gap-2">
            <Button variant="outline" disabled>
              Previous
            </Button>
            <Button variant="default">1</Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">Next</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
