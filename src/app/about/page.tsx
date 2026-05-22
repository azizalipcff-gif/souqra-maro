import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Search, 
  PlusCircle, 
  Users, 
  Building2, 
  MapPin, 
  TrendingUp,
  ArrowRight,
  Globe,
  Heart,
  Shield,
  Zap
} from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-blue-600">SOUQORA</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Morocco's Premier Digital Marketplace Platform
            </p>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              Connecting local businesses with customers across Morocco. Discover, explore, and support local services in your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Explore Businesses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Add Your Business
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About SOUQORA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                About SOUQORA
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                SOUQORA is Morocco's leading digital marketplace platform designed to bridge the gap between local businesses and customers. Our mission is to empower local entrepreneurs while making it easier for consumers to discover and connect with quality services in their communities.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2 border-blue-100 hover:border-blue-300 transition-colors">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Globe className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Our Mission
                  </h3>
                  <p className="text-gray-600">
                    To digitize the Moroccan marketplace by providing a modern, accessible platform that helps local businesses thrive and customers find the services they need.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-blue-100 hover:border-blue-300 transition-colors">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Our Vision
                  </h3>
                  <p className="text-gray-600">
                    To become the go-to platform for discovering local businesses across Morocco, fostering economic growth and community connection through digital innovation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What We Offer
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Discover the features that make SOUQORA the perfect platform for both businesses and customers.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Search className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Discover Local Businesses
                  </h3>
                  <p className="text-gray-600">
                    Browse through a wide range of local businesses, from restaurants to service providers, all in one place.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <PlusCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Add Your Business
                  </h3>
                  <p className="text-gray-600">
                    List your business for free and reach thousands of potential customers in your area with our easy-to-use platform.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Connect with Customers
                  </h3>
                  <p className="text-gray-600">
                    Build your customer base, receive reviews, and grow your business through direct connections with local consumers.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Impact
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                See how SOUQORA is making a difference in the Moroccan marketplace.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-gradient-to-br from-blue-600 to-blue-400 text-white border-0">
                <CardContent className="p-8 text-center">
                  <Building2 className="h-12 w-12 mx-auto mb-4 opacity-90" />
                  <div className="text-5xl font-bold mb-2">500+</div>
                  <p className="text-lg opacity-90">Businesses Listed</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-600 to-blue-400 text-white border-0">
                <CardContent className="p-8 text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-90" />
                  <div className="text-5xl font-bold mb-2">50+</div>
                  <p className="text-lg opacity-90">Cities Covered</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-600 to-blue-400 text-white border-0">
                <CardContent className="p-8 text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-90" />
                  <div className="text-5xl font-bold mb-2">1000+</div>
                  <p className="text-lg opacity-90">Services Available</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                The Future of Moroccan Digital Marketplace
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We're building the future of local commerce in Morocco with innovation and community at our core.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-2 border-blue-100 hover:border-blue-300 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Trust & Safety
                  </h3>
                  <p className="text-sm text-gray-600">
                    Verified businesses and secure transactions
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-blue-100 hover:border-blue-300 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Fast & Easy
                  </h3>
                  <p className="text-sm text-gray-600">
                    Quick search and instant connections
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-blue-100 hover:border-blue-300 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Community First
                  </h3>
                  <p className="text-sm text-gray-600">
                    Supporting local businesses and communities
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-blue-100 hover:border-blue-300 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Nationwide Reach
                  </h3>
                  <p className="text-sm text-gray-600">
                    Connecting businesses across all of Morocco
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-400">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-white opacity-90 mb-8">
              Join thousands of businesses and customers already using SOUQORA
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                Browse Businesses
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                List Your Business
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
