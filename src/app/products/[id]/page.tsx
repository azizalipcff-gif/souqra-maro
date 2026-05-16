"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Heart, Share2, Star, MapPin, Shield, Truck, RefreshCw, 
  MessageCircle, ChevronLeft, ChevronRight, Minus, Plus 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Avatar } from "@/components/ui/avatar"

export default function ProductDetailsPage() {
  const params = useParams()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  // Mock product data - in production, this would be fetched from API
  const product = {
    id: params.id,
    title: "Premium Moroccan Leather Bag",
    description: "Handcrafted premium leather bag made by skilled artisans in Morocco. Features genuine leather, adjustable strap, and multiple compartments for everyday use. Perfect for work, travel, or casual outings.",
    price: 1200,
    originalPrice: 1500,
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800",
    ],
    category: "Fashion",
    condition: "new",
    stock: 15,
    rating: 4.8,
    reviews: 45,
    location: "Casablanca",
    views: 1234,
    featured: true,
    seller: {
      id: 1,
      name: "Moroccan Crafts",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      rating: 4.9,
      reviews: 234,
      verified: true,
    },
    specifications: {
      material: "Genuine Leather",
      dimensions: "30cm x 25cm x 10cm",
      weight: "0.8kg",
      color: "Brown",
      brand: "Moroccan Heritage",
    },
  }

  const reviews = [
    {
      id: 1,
      user: "Ahmed M.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
      rating: 5,
      date: "2024-01-15",
      comment: "Amazing quality! The leather is genuine and the craftsmanship is excellent. Highly recommended!",
    },
    {
      id: 2,
      user: "Fatima Z.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      rating: 4,
      date: "2024-01-10",
      comment: "Beautiful bag, exactly as described. Shipping was fast and packaging was secure.",
    },
    {
      id: 3,
      user: "Youssef K.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      rating: 5,
      date: "2024-01-05",
      comment: "Perfect size for daily use. The leather smell is wonderful and it's very durable.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-royal-blue">Home</Link>
          <span>/</span>
          <Link href="/marketplace" className="hover:text-royal-blue">Marketplace</Link>
          <span>/</span>
          <Link href="/marketplace?category=fashion" className="hover:text-royal-blue">Fashion</Link>
          <span>/</span>
          <span className="text-royal-blue font-medium">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-gold/20">
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {product.featured && (
                <Badge className="absolute top-4 right-4" variant="gold">
                  Featured
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? "border-gold" : "border-gray-200"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <Badge variant="outline" className="mb-3">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-gold text-gold" />
                  <span className="font-semibold">{product.rating}</span>
                  <span>({product.reviews} reviews)</span>
                </div>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {product.location}
                </span>
                <span>•</span>
                <span>{product.views} views</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-royal-blue">{product.price} MAD</span>
              {product.originalPrice > product.price && (
                <span className="text-xl text-gray-400 line-through">{product.originalPrice} MAD</span>
              )}
              <Badge variant="success">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </Badge>
            </div>

            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <Label>Quantity:</Label>
              <div className="flex items-center border-2 border-gray-200 rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 font-semibold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-gray-500">
                {product.stock} items available
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button size="lg" className="flex-1">
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant={isFavorite ? "gold" : "outline"}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
              </Button>
              <Button size="lg" variant="outline">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar src={product.seller.avatar} alt={product.seller.name} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{product.seller.name}</span>
                        {product.seller.verified && (
                          <Shield className="h-4 w-4 text-gold" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Star className="h-3 w-3 fill-gold text-gold" />
                        {product.seller.rating} ({product.seller.reviews} reviews)
                      </div>
                    </div>
                  </div>
                  <Link href={`/stores/${product.seller.id}`}>
                    <Button variant="outline" size="sm">
                      View Store
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-blue-50">
                <Truck className="h-6 w-6 mx-auto mb-2 text-royal-blue" />
                <p className="text-sm font-medium">Fast Delivery</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-blue-50">
                <Shield className="h-6 w-6 mx-auto mb-2 text-royal-blue" />
                <p className="text-sm font-medium">Secure Payment</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-blue-50">
                <RefreshCw className="h-6 w-6 mx-auto mb-2 text-royal-blue" />
                <p className="text-sm font-medium">Easy Returns</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Specifications */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b">
                  <span className="text-gray-600 capitalize">{key}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Reviews ({reviews.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-0">
                <div className="flex items-start gap-4">
                  <Avatar src={review.avatar} alt={review.user} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-semibold">{review.user}</span>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "fill-gold text-gold" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Review Form */}
            <div className="pt-6">
              <h3 className="font-semibold mb-4">Write a Review</h3>
              <div className="space-y-4">
                <div>
                  <Label>Rating</Label>
                  <div className="flex gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <button key={i}>
                        <Star className="h-6 w-6 text-gray-300 hover:text-gold transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="review">Your Review</Label>
                  <Textarea
                    id="review"
                    placeholder="Share your experience with this product..."
                    className="mt-2"
                  />
                </div>
                <Button>Submit Review</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Products */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="hover:shadow-xl transition-shadow cursor-pointer">
                <div className="aspect-square rounded-t-lg overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-154${i}8036328-c9fa89d128fa?w=400`}
                    alt="Related product"
                    className="w-full h-full object-cover hover:scale-110 transition-transform"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-1">Related Product {i}</h3>
                  <p className="text-royal-blue font-bold">{800 + i * 100} MAD</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
