import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, MapPin, Star, Phone, Clock } from "lucide-react"

// Mock data for category pages
const categoryData: Record<string, {
  title: string
  description: string
  businesses: Array<{
    id: string
    name: string
    city: string
    rating: number
    reviews: number
    phone: string
    hours: string
    image: string
  }>
}> = {
  restaurants: {
    title: "Restaurants",
    description: "Discover the best dining experiences in Morocco",
    businesses: [
      { id: "1", name: "Le Jardin Secret", city: "Marrakech", rating: 4.8, reviews: 234, phone: "+212 524 123 456", hours: "12:00 - 23:00", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400" },
      { id: "2", name: "La Table du Palais", city: "Fes", rating: 4.6, reviews: 189, phone: "+212 535 987 654", hours: "11:30 - 22:30", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400" },
      { id: "3", name: "Casa Blanca Grill", city: "Casablanca", rating: 4.5, reviews: 312, phone: "+212 522 456 789", hours: "11:00 - 23:00", image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400" },
    ]
  },
  cafes: {
    title: "Cafés",
    description: "Cozy coffee shops and tea houses",
    businesses: [
      { id: "1", name: "Café de la Poste", city: "Rabat", rating: 4.7, reviews: 156, phone: "+212 537 234 567", hours: "07:00 - 22:00", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400" },
      { id: "2", name: "Maison du Thé", city: "Marrakech", rating: 4.9, reviews: 287, phone: "+212 524 345 678", hours: "08:00 - 21:00", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400" },
    ]
  },
  hotels: {
    title: "Hotels",
    description: "Find your perfect stay across Morocco",
    businesses: [
      { id: "1", name: "Royal Mansour", city: "Marrakech", rating: 4.9, reviews: 423, phone: "+212 524 456 789", hours: "24/7", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400" },
      { id: "2", name: "Sofitel Casablanca", city: "Casablanca", rating: 4.7, reviews: 345, phone: "+212 522 567 890", hours: "24/7", image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400" },
    ]
  },
  beauty: {
    title: "Beauty",
    description: "Salons, spas, and wellness centers",
    businesses: [
      { id: "1", name: "Spa du Palais", city: "Marrakech", rating: 4.8, reviews: 178, phone: "+212 524 678 901", hours: "09:00 - 20:00", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400" },
      { id: "2", name: "Beauty Lounge", city: "Casablanca", rating: 4.5, reviews: 134, phone: "+212 522 789 012", hours: "10:00 - 19:00", image: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400" },
    ]
  },
  mechanics: {
    title: "Mechanics",
    description: "Auto repair and maintenance services",
    businesses: [
      { id: "1", name: "Auto Fix Pro", city: "Casablanca", rating: 4.6, reviews: 89, phone: "+212 522 890 123", hours: "08:00 - 18:00", image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400" },
      { id: "2", name: "Garage Express", city: "Rabat", rating: 4.4, reviews: 67, phone: "+212 537 901 234", hours: "09:00 - 17:00", image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400" },
    ]
  },
  electronics: {
    title: "Electronics",
    description: "Tech stores and repair services",
    businesses: [
      { id: "1", name: "Tech Zone", city: "Casablanca", rating: 4.7, reviews: 156, phone: "+212 522 012 345", hours: "09:00 - 20:00", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400" },
      { id: "2", name: "Digital World", city: "Marrakech", rating: 4.5, reviews: 98, phone: "+212 524 123 456", hours: "10:00 - 19:00", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400" },
    ]
  },
  "real-estate": {
    title: "Real Estate",
    description: "Properties for sale and rent",
    businesses: [
      { id: "1", name: "Immo Premium", city: "Casablanca", rating: 4.8, reviews: 234, phone: "+212 522 234 567", hours: "09:00 - 18:00", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400" },
      { id: "2", name: "Atlas Properties", city: "Marrakech", rating: 4.6, reviews: 178, phone: "+212 524 345 678", hours: "09:00 - 17:00", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400" },
    ]
  },
  fitness: {
    title: "Fitness",
    description: "Gyms, yoga studios, and personal trainers",
    businesses: [
      { id: "1", name: "Fit Zone Gym", city: "Casablanca", rating: 4.7, reviews: 189, phone: "+212 522 456 789", hours: "06:00 - 22:00", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400" },
      { id: "2", name: "Yoga Studio", city: "Marrakech", rating: 4.9, reviews: 145, phone: "+212 524 567 890", hours: "07:00 - 20:00", image: "https://images.unsplash.com/photo-1544367563-12123d8965cd?w=400" },
    ]
  },
  education: {
    title: "Education",
    description: "Schools, tutors, and learning centers",
    businesses: [
      { id: "1", name: "Language Center", city: "Rabat", rating: 4.8, reviews: 267, phone: "+212 537 678 901", hours: "08:00 - 18:00", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400" },
      { id: "2", name: "Math Academy", city: "Casablanca", rating: 4.6, reviews: 198, phone: "+212 522 789 012", hours: "09:00 - 17:00", image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400" },
    ]
  },
  healthcare: {
    title: "Healthcare",
    description: "Clinics, pharmacies, and medical services",
    businesses: [
      { id: "1", name: "City Clinic", city: "Casablanca", rating: 4.9, reviews: 345, phone: "+212 522 890 123", hours: "08:00 - 20:00", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400" },
      { id: "2", name: "Health Plus", city: "Rabat", rating: 4.7, reviews: 234, phone: "+212 537 901 234", hours: "09:00 - 19:00", image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400" },
    ]
  },
  "local-services": {
    title: "Local Services",
    description: "Plumbers, electricians, and home services",
    businesses: [
      { id: "1", name: "Home Fix Pro", city: "Casablanca", rating: 4.6, reviews: 156, phone: "+212 522 012 345", hours: "07:00 - 19:00", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400" },
      { id: "2", name: "Quick Services", city: "Marrakech", rating: 4.5, reviews: 123, phone: "+212 524 123 456", hours: "08:00 - 18:00", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400" },
    ]
  }
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categoryData[params.slug]

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Category Not Found</h1>
            <p className="text-gray-600 mb-8">The category you're looking for doesn't exist.</p>
            <Link href="/categories">
              <Button>Back to Categories</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-blue-400">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/categories" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {category.title}
            </h1>
            <p className="text-xl text-white/90">
              {category.description}
            </p>
            <p className="text-white/70 mt-4">
              {category.businesses.length} businesses found
            </p>
          </div>
        </div>
      </section>

      {/* Businesses Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.businesses.map((business) => (
              <Card key={business.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-gray-200">
                  <img 
                    src={business.image} 
                    alt={business.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{business.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{business.city}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{business.rating}</span>
                    <span className="text-gray-500">({business.reviews} reviews)</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{business.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{business.hours}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
