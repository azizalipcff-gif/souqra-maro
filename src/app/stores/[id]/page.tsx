"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Star, MapPin, Shield, Phone, MessageCircle, Heart, Share2,
  ShoppingBag, Wrench, Grid, List, Filter 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Avatar } from "@/components/ui/avatar"

export default function StorePage() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState<"products" | "services">("products")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isFollowing, setIsFollowing] = useState(false)

  // Mock store data - in production, this would be fetched from API
  const store = {
    id: params.id,
    name: "Moroccan Crafts",
    description: "Premium handcrafted Moroccan products made by skilled artisans. We specialize in leather goods, textiles, ceramics, and traditional Moroccan crafts. Each piece is unique and tells a story of Moroccan heritage.",
    logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    banner: "https://images.unsplash.com/photo-1596424947237-79a922668a9e?w=1200",
    location: "Casablanca",
    rating: 4.9,
    reviews: 234,
    followers: 1250,
    verified: true,
    since: "2019",
    whatsapp: "+212600000000",
    phone: "+212522000000",
    website: "https://moroccancrafts.ma",
    socialMedia: {
      facebook: "https://facebook.com/moroccancrafts",
      instagram: "https://instagram.com/moroccancrafts",
    },
  }

  const products = [
    {
      id: 1,
      title: "Premium Leather Bag",
      price: 1200,
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400",
      rating: 4.8,
      reviews: 45,
    },
    {
      id: 2,
      title: "Handwoven Berber Rug",
      price: 3500,
      image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=400",
      rating: 4.9,
      reviews: 78,
    },
    {
      id: 3,
      title: "Argan Oil Set",
      price: 450,
      image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400",
      rating: 4.7,
      reviews: 123,
    },
    {
      id: 4,
      title: "Ceramic Vase",
      price: 680,
      image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400",
      rating: 4.6,
      reviews: 56,
    },
    {
      id: 5,
      title: "Leather Wallet",
      price: 320,
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400",
      rating: 4.7,
      reviews: 67,
    },
    {
      id: 6,
      title: "Traditional Tea Set",
      price: 890,
      image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400",
      rating: 4.8,
      reviews: 34,
    },
  ]

  const services = [
    {
      id: 1,
      title: "Custom Leather Craft",
      description: "Custom leather goods made to order",
      price: "Starting from 500 MAD",
      rating: 4.9,
      reviews: 89,
    },
    {
      id: 2,
      title: "Product Restoration",
      description: "Professional restoration of leather and textile items",
      price: "Starting from 200 MAD",
      rating: 4.8,
      reviews: 45,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      
      {/* Store Banner */}
      <div className="relative h-64 md:h-80">
        <img
          src={store.banner}
          alt={store.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        {/* Store Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl shadow-2xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative">
              <Avatar
                src={store.logo}
                alt={store.name}
                className="w-24 h-24 md:w-32 md:h-32 border-4 border-gold"
              />
              {store.verified && (
                <Badge className="absolute -bottom-2 -right-2" variant="success">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-3xl font-bold mb-1">{store.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-gold text-gold" />
                      <span className="font-semibold">{store.rating}</span>
                      <span>({store.reviews} reviews)</span>
                    </div>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {store.location}
                    </span>
                    <span>•</span>
                    <span>Since {store.since}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={isFollowing ? "gold" : "outline"}
                    onClick={() => setIsFollowing(!isFollowing)}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isFollowing ? "fill-current" : ""}`} />
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{store.description}</p>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Followers:</span>
                  <span className="font-semibold">{store.followers}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Products:</span>
                  <span className="font-semibold">{products.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Services:</span>
                  <span className="font-semibold">{services.length}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <Button
            variant={activeTab === "products" ? "default" : "ghost"}
            onClick={() => setActiveTab("products")}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Products ({products.length})
          </Button>
          <Button
            variant={activeTab === "services" ? "default" : "ghost"}
            onClick={() => setActiveTab("services")}
          >
            <Wrench className="h-4 w-4 mr-2" />
            Services ({services.length})
          </Button>
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Products</h2>
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
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

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
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg line-clamp-1">{product.title}</CardTitle>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Star className="h-3 w-3 fill-gold text-gold" />
                          {product.rating} ({product.reviews})
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <p className="text-2xl font-bold text-royal-blue">
                          {product.price} MAD
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">View Details</Button>
                      </CardFooter>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Services</h2>
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
                    <Card className="hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-gold h-full">
                      <CardHeader>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                          <Star className="h-4 w-4 fill-gold text-gold" />
                          {service.rating} ({service.reviews})
                        </div>
                        <CardTitle className="text-xl">{service.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4">{service.description}</p>
                        <p className="text-royal-blue font-bold">{service.price}</p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" variant="gold">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Store Reviews */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Store Reviews ({store.reviews})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b pb-6 last:border-0">
                <div className="flex items-start gap-4">
                  <Avatar src={`https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100`} alt="User" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Customer {i}</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className="h-4 w-4 fill-gold text-gold" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600">
                      Excellent store with amazing products! Fast shipping and great customer service.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
