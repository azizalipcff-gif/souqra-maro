import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { 
  UtensilsCrossed, 
  Coffee, 
  Building, 
  Sparkles, 
  Wrench, 
  Monitor, 
  Home, 
  Dumbbell, 
  GraduationCap, 
  HeartPulse, 
  Wrench as WrenchIcon,
  ArrowRight
} from "lucide-react"

const categories = [
  {
    slug: "restaurants",
    title: "Restaurants",
    description: "Discover the best dining experiences in Morocco",
    icon: UtensilsCrossed,
    count: 120,
    color: "from-orange-500 to-red-500"
  },
  {
    slug: "cafes",
    title: "Cafés",
    description: "Cozy coffee shops and tea houses",
    icon: Coffee,
    count: 85,
    color: "from-amber-500 to-orange-500"
  },
  {
    slug: "hotels",
    title: "Hotels",
    description: "Find your perfect stay across Morocco",
    icon: Building,
    count: 45,
    color: "from-blue-500 to-indigo-500"
  },
  {
    slug: "beauty",
    title: "Beauty",
    description: "Salons, spas, and wellness centers",
    icon: Sparkles,
    count: 92,
    color: "from-pink-500 to-rose-500"
  },
  {
    slug: "mechanics",
    title: "Mechanics",
    description: "Auto repair and maintenance services",
    icon: Wrench,
    count: 67,
    color: "from-gray-500 to-slate-500"
  },
  {
    slug: "electronics",
    title: "Electronics",
    description: "Tech stores and repair services",
    icon: Monitor,
    count: 54,
    color: "from-cyan-500 to-blue-500"
  },
  {
    slug: "real-estate",
    title: "Real Estate",
    description: "Properties for sale and rent",
    icon: Home,
    count: 38,
    color: "from-emerald-500 to-green-500"
  },
  {
    slug: "fitness",
    title: "Fitness",
    description: "Gyms, yoga studios, and personal trainers",
    icon: Dumbbell,
    count: 41,
    color: "from-violet-500 to-purple-500"
  },
  {
    slug: "education",
    title: "Education",
    description: "Schools, tutors, and learning centers",
    icon: GraduationCap,
    count: 73,
    color: "from-yellow-500 to-amber-500"
  },
  {
    slug: "healthcare",
    title: "Healthcare",
    description: "Clinics, pharmacies, and medical services",
    icon: HeartPulse,
    count: 89,
    color: "from-red-500 to-pink-500"
  },
  {
    slug: "local-services",
    title: "Local Services",
    description: "Plumbers, electricians, and home services",
    icon: WrenchIcon,
    count: 156,
    color: "from-teal-500 to-cyan-500"
  }
]

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Browse Categories
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Explore businesses across Morocco by category
            </p>
            <p className="text-gray-500">
              {categories.reduce((sum, cat) => sum + cat.count, 0)}+ businesses listed
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Link 
                  key={category.slug} 
                  href={`/categories/${category.slug}`}
                  className="group"
                >
                  <Card className="h-full border-2 border-gray-100 hover:border-blue-300 transition-all duration-300 hover:shadow-xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {category.count} businesses
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
