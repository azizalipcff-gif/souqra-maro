"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Star, MapPin, Phone, MessageCircle, Clock, CheckCircle, 
  Shield, ChevronLeft, ChevronRight, Heart, Share2 
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

export default function ServiceDetailsPage() {
  const params = useParams()
  const [isFavorite, setIsFavorite] = useState(false)

  // Mock service data - in production, this would be fetched from API
  const service = {
    id: params.id,
    title: "Home Electronics Repair",
    description: "Professional repair services for all home electronics including TVs, refrigerators, washing machines, air conditioners, and more. Our certified technicians provide fast, reliable service with warranty on all repairs. We offer both in-home and workshop service options.",
    category: "Electronics",
    rating: 4.8,
    reviews: 156,
    location: "Casablanca",
    whatsapp: "+212600000000",
    phone: "+212522000000",
    email: "repair@electronics.ma",
    website: "https://electronics-repair.ma",
    verified: true,
    featured: true,
    responseTime: "1 hour",
    availability: "Mon-Sat 9AM-7PM",
    images: [
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800",
      "https://images.unsplash.com/photo-1563770095-39d468f95c42?w=800",
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800",
    ],
    provider: {
      id: 1,
      name: "TechFix Morocco",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      rating: 4.9,
      reviews: 234,
      verified: true,
      since: "2019",
    },
    services: [
      "TV Repair",
      "Refrigerator Repair",
      "Washing Machine Repair",
      "Air Conditioning Service",
      "Microwave Repair",
      "Small Appliance Repair",
    ],
  }

  const reviews = [
    {
      id: 1,
      user: "Mohammed A.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
      rating: 5,
      date: "2024-01-20",
      comment: "Excellent service! They fixed my refrigerator the same day. Very professional and affordable.",
    },
    {
      id: 2,
      user: "Samira B.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      rating: 5,
      date: "2024-01-15",
      comment: "Quick response time via WhatsApp. The technician was knowledgeable and explained everything clearly.",
    },
    {
      id: 3,
      user: "Karim M.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      rating: 4,
      date: "2024-01-10",
      comment: "Good service overall. Slight delay in appointment but quality work was done.",
    },
  ]

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Hi, I'm interested in your service: ${service.title}`)
    window.open(`https://wa.me/${service.whatsapp.replace(/\D/g, '')}?text=${message}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-royal-blue">Home</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-royal-blue">Services</Link>
          <span>/</span>
          <Link href="/services?category=electronics" className="hover:text-royal-blue">Electronics</Link>
          <span>/</span>
          <span className="text-royal-blue font-medium">{service.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Service Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-4"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-gold/20">
              <img
                src={service.images[0]}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              {service.featured && (
                <Badge className="absolute top-4 right-4" variant="gold">
                  Featured
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {service.images.slice(1).map((image, index) => (
                <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`${service.title} ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Service Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <Badge variant="outline" className="mb-3">
                {service.category}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{service.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-gold text-gold" />
                  <span className="font-semibold">{service.rating}</span>
                  <span>({service.reviews} reviews)</span>
                </div>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {service.location}
                </span>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed">{service.description}</p>

            {/* Quick Actions */}
            <Card className="border-2 border-gold/20">
              <CardContent className="p-6 space-y-4">
                <Button 
                  className="w-full" 
                  size="lg" 
                  variant="gold"
                  onClick={handleWhatsAppClick}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contact via WhatsApp
                </Button>
                <Button className="w-full" size="lg" variant="outline">
                  <Phone className="mr-2 h-5 w-5" />
                  Call Now
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant={isFavorite ? "gold" : "outline"}
                    className="flex-1"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-royal-blue" />
                  <div>
                    <p className="font-medium">Response Time</p>
                    <p className="text-sm text-gray-600">{service.responseTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-royal-blue" />
                  <div>
                    <p className="font-medium">Availability</p>
                    <p className="text-sm text-gray-600">{service.availability}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-royal-blue" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-gray-600">{service.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-royal-blue" />
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-sm text-gray-600">{service.whatsapp}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Provider Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar src={service.provider.avatar} alt={service.provider.name} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{service.provider.name}</span>
                        {service.provider.verified && (
                          <Shield className="h-4 w-4 text-gold" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Star className="h-3 w-3 fill-gold text-gold" />
                        {service.provider.rating} ({service.provider.reviews} reviews)
                      </div>
                      <p className="text-xs text-gray-500">Member since {service.provider.since}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Services Offered */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Services Offered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {service.services.map((item, index) => (
                <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-blue-50">
                  <CheckCircle className="h-5 w-5 text-royal-blue" />
                  <span className="font-medium">{item}</span>
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
                    placeholder="Share your experience with this service..."
                    className="mt-2"
                  />
                </div>
                <Button>Submit Review</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Services */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Related Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="hover:shadow-xl transition-shadow cursor-pointer">
                <div className="aspect-video rounded-t-lg overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400`}
                    alt="Related service"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Related Service {i}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                    <Star className="h-3 w-3 fill-gold text-gold" />
                    4.7 (89 reviews)
                  </div>
                  <p className="text-sm text-gray-600">Casablanca</p>
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
