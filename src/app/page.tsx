"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Search, ShoppingBag, Wrench, Store, Star, TrendingUp, ArrowRight, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useState, useEffect, useCallback } from "react"

interface FeaturedBusiness {
  id: string
  business_name: string
  city?: string | null
  category?: string | null
  description?: string | null
  logo_url?: string | null
  cover_url?: string | null
}

export default function Home() {
  const [featuredBusinesses, setFeaturedBusinesses] = useState<FeaturedBusiness[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadFeaturedBusinesses = useCallback(async () => {
    try {
      const response = await fetch('/api/businesses/public?limit=8')
      const { businesses } = await response.json()

      if (businesses) {
        setFeaturedBusinesses(businesses)
      }
    } catch (error) {
      console.error('Error loading featured businesses:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFeaturedBusinesses()
  }, [loadFeaturedBusinesses])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-royal-blue/10 via-transparent to-gold/10" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block mb-6"
            >
              <Badge variant="gold" className="text-sm px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Morocco's #1 Marketplace
              </Badge>
            </motion.div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-royal-blue via-purple-600 to-gold bg-clip-text text-transparent">
              Discover Morocco's Best
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Buy, sell, and discover premium products and services from trusted Moroccan sellers and businesses.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/marketplace">
                <Button size="lg" className="w-full sm:w-auto">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Browse Marketplace
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Wrench className="mr-2 h-5 w-5" />
                  Find Services
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              <input
                type="search"
                placeholder="Search for products, services, or businesses..."
                className="w-full h-16 pl-14 pr-4 rounded-2xl border-2 border-gray-200 focus:border-royal-blue focus:ring-4 focus:ring-royal-blue/20 text-lg transition-all shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="py-20 bg-gradient-to-b from-transparent via-blue-50/50 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-center mb-12"
          >
            <div>
              <h2 className="text-4xl font-bold mb-2 text-royal-blue">Featured Businesses</h2>
              <p className="text-gray-600">Discover top-rated businesses from across Morocco</p>
            </div>
            <Link href="/marketplace">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-royal-blue" />
            </div>
          ) : featuredBusinesses.length === 0 ? (
            <div className="text-center py-12">
              <Store className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No featured businesses yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredBusinesses.map((business, index) => {
                return (
                  <motion.div
                    key={business.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                  >
                    <Link href={`/business/${business.id}`}>
                      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-gold">
                        <div className="relative h-48 overflow-hidden">
                          {business.logo_url || business.cover_url ? (
                            <img
                              src={business.logo_url || business.cover_url || undefined}
                              alt={business.business_name}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-royal-blue to-purple-600 flex items-center justify-center">
                              <Store className="h-12 w-12 text-white/50" />
                            </div>
                          )}
                        </div>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg line-clamp-1">{business.business_name}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{business.city}</span>
                            <span>•</span>
                            <span>{business.category}</span>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <p className="text-sm text-gray-600 line-clamp-2">{business.description}</p>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full" variant="outline">
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-royal-blue to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Store className="h-16 w-16 mx-auto mb-6 text-gold" />
            <h2 className="text-4xl font-bold mb-4">Start Selling Today</h2>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of Moroccan sellers and businesses. Create your store and reach millions of customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/about">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-royal-blue">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
