"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, Grid, List, Trash2, ShoppingBag, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function FavoritesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filter, setFilter] = useState<"all" | "products" | "services">("all")

  const favorites = [
    {
      id: 1,
      type: "product",
      title: "Premium Moroccan Leather Bag",
      price: 1200,
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400",
      rating: 4.8,
      location: "Casablanca",
      seller: "Moroccan Crafts",
      addedAt: "2024-01-15",
    },
    {
      id: 2,
      type: "service",
      title: "Home Electronics Repair",
      description: "Professional repair services for all home electronics",
      rating: 4.9,
      location: "Casablanca",
      provider: "TechFix Morocco",
      addedAt: "2024-01-12",
    },
    {
      id: 3,
      type: "product",
      title: "Handwoven Berber Rug",
      price: 3500,
      image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=400",
      rating: 4.9,
      location: "Marrakech",
      seller: "Atlas Weavers",
      addedAt: "2024-01-10",
    },
    {
      id: 4,
      type: "product",
      title: "Argan Oil Set",
      price: 450,
      image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400",
      rating: 4.7,
      location: "Agadir",
      seller: "Beauty Morocco",
      addedAt: "2024-01-08",
    },
    {
      id: 5,
      type: "service",
      title: "Professional Photography",
      description: "Expert photography services for events and portraits",
      rating: 4.8,
      location: "Rabat",
      provider: "Studio Morocco",
      addedAt: "2024-01-05",
    },
  ]

  const filteredFavorites = favorites.filter(
    (item) => filter === "all" || item.type === filter
  )

  const removeFavorite = (id: number) => {
    // Handle remove logic here
    console.log("Remove favorite:", id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
              <p className="text-gray-600">
                {favorites.length} items saved
              </p>
            </div>
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

          {/* Filter Tabs */}
          <div className="flex gap-4 mb-8 border-b">
            <Button
              variant={filter === "all" ? "default" : "ghost"}
              onClick={() => setFilter("all")}
            >
              All ({favorites.length})
            </Button>
            <Button
              variant={filter === "products" ? "default" : "ghost"}
              onClick={() => setFilter("products")}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Products ({favorites.filter((f) => f.type === "product").length})
            </Button>
            <Button
              variant={filter === "services" ? "default" : "ghost"}
              onClick={() => setFilter("services")}
            >
              <Wrench className="h-4 w-4 mr-2" />
              Services ({favorites.filter((f) => f.type === "service").length})
            </Button>
          </div>

          {filteredFavorites.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Heart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
                <p className="text-gray-600 mb-6">Start adding items to your favorites</p>
                <Link href="/marketplace">
                  <Button size="lg">
                    Browse Marketplace
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {filteredFavorites.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                >
                  {item.type === "product" ? (
                    <Link href={`/products/${item.id}`}>
                      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-gold h-full">
                        <div className="relative">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-48 object-cover"
                          />
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              removeFavorite(item.id)
                            }}
                            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                          >
                            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                          </button>
                        </div>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg line-clamp-1">{item.title}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{item.location}</span>
                            <span>•</span>
                            <span>by {item.seller}</span>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <p className="text-2xl font-bold text-royal-blue">
                            {item.price} MAD
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full">View Details</Button>
                        </CardFooter>
                      </Card>
                    </Link>
                  ) : (
                    <Link href={`/services/${item.id}`}>
                      <Card className="hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-gold h-full">
                        <CardHeader>
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="secondary">Service</Badge>
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                removeFavorite(item.id)
                              }}
                              className="p-1 hover:bg-red-50 rounded transition-colors"
                            >
                              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                            </button>
                          </div>
                          <CardTitle className="text-xl">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <span className="font-semibold">{item.rating}</span>
                              <span>★</span>
                            </div>
                            <span className="text-sm text-gray-500">{item.location}</span>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full" variant="gold">
                            Contact Provider
                          </Button>
                        </CardFooter>
                      </Card>
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
