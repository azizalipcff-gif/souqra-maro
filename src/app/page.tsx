"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Search, ShoppingBag, Wrench, Store, Star, TrendingUp, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductCardSkeleton } from "@/components/ui/loading-skeleton"

const featuredProducts = [
  {
    id: 1,
    title: "Premium Moroccan Leather Bag",
    price: 1200,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400",
    category: "Fashion",
    rating: 4.8,
    location: "Casablanca",
  },
  {
    id: 2,
    title: "Handwoven Berber Rug",
    price: 3500,
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=400",
    category: "Home Decor",
    rating: 4.9,
    location: "Marrakech",
  },
  {
    id: 3,
    title: "Argan Oil Set",
    price: 450,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400",
    category: "Beauty",
    rating: 4.7,
    location: "Agadir",
  },
  {
    id: 4,
    title: "Traditional Tagine Pot",
    price: 680,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356f36?w=400",
    category: "Kitchen",
    rating: 4.6,
    location: "Fes",
  },
]

const featuredServices = [
  {
    id: 1,
    title: "Home Electronics Repair",
    category: "Electronics",
    rating: 4.8,
    reviews: 156,
    location: "Casablanca",
    whatsapp: "+212600000000",
  },
  {
    id: 2,
    title: "Professional Photography",
    category: "Creative",
    rating: 4.9,
    reviews: 89,
    location: "Rabat",
    whatsapp: "+212600000000",
  },
  {
    id: 3,
    title: "Web Development",
    category: "Technology",
    rating: 4.7,
    reviews: 234,
    location: "Tangier",
    whatsapp: "+212600000000",
  },
]

const categories = [
  { name: "Electronics", icon: "📱", count: 1250 },
  { name: "Fashion", icon: "👗", count: 890 },
  { name: "Home & Garden", icon: "🏠", count: 650 },
  { name: "Vehicles", icon: "🚗", count: 420 },
  { name: "Services", icon: "🔧", count: 780 },
  { name: "Beauty", icon: "💄", count: 340 },
]

export default function Home() {
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

      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-royal-blue">Browse Categories</h2>
            <p className="text-gray-600 text-lg">Explore our wide range of categories</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Link href="/categories">
                  <Card className="text-center p-6 cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-gold">
                    <CardContent className="p-0">
                      <div className="text-4xl mb-3">{category.icon}</div>
                      <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                      <p className="text-xs text-gray-500">{category.count} items</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-b from-transparent via-blue-50/50 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-center mb-12"
          >
            <div>
              <h2 className="text-4xl font-bold mb-2 text-royal-blue">Featured Products</h2>
              <p className="text-gray-600">Handpicked items from top sellers</p>
            </div>
            <Link href="/marketplace">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Link href={`/products/${product.id}`}>
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-gold">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 right-3" variant="gold">
                        Featured
                      </Badge>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg line-clamp-1">{product.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{product.location}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-gold text-gold" />
                          {product.rating}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="text-2xl font-bold text-royal-blue">
                        {product.price} MAD
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant="outline">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-center mb-12"
          >
            <div>
              <h2 className="text-4xl font-bold mb-2 text-royal-blue">Top Services</h2>
              <p className="text-gray-600">Professional services from trusted providers</p>
            </div>
            <Link href="/services">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Link href={`/services/${service.id}`}>
                  <Card className="hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-gold">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary">{service.category}</Badge>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-gold text-gold" />
                          <span className="font-semibold">{service.rating}</span>
                          <span className="text-gray-500">({service.reviews})</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-gray-500 mb-4">
                        <span className="text-sm">{service.location}</span>
                      </div>
                      <Button className="w-full" variant="gold">
                        Contact via WhatsApp
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
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
              <Link href="/auth/register">
                <Button size="lg" variant="gold" className="w-full sm:w-auto">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Become a Seller
                </Button>
              </Link>
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
