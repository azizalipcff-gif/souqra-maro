"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Loader2, Building2, MapPin, Phone, FileText, ArrowLeft } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getSupabase } from "@/lib/supabase/client"
import Link from "next/link"

interface Business {
  id: string
  business_name: string
  category: string
  city: string
  phone: string
  description: string
  approved: boolean
  created_at?: string
}

export default function BusinessDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [isLoading, setIsLoading] = useState(true)
  const [business, setBusiness] = useState<Business | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    loadBusiness()
  }, [id])

  const loadBusiness = async () => {
    try {
      console.log("=== BUSINESS DETAILS DEBUG ===")
      console.log("Route ID:", id)
      console.log("ID type:", typeof id)
      console.log("ID length:", id.length)
      
      const supabase = getSupabase()
      
      console.log("Executing Supabase query...")
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      console.log("Business Query Result:", data)
      console.log("Business Query Error:", error)

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        })
        throw error
      }

      if (!data) {
        console.log('No business found with ID:', id)
        
        // Try to fetch all businesses to see if any exist
        const { data: allBusinesses, error: allError } = await supabase
          .from('businesses')
          .select('id, business_name, approved')
          .limit(5)
        
        console.log('Sample businesses in database:', allBusinesses)
        console.log('Sample businesses error:', allError)
        
        setError('Business not found')
        setIsLoading(false)
        return
      }

      console.log('Business found:', data)
      console.log('Business approved status:', data.approved)

      // Check if business is approved
      if (!data.approved) {
        console.log('Business not approved:', id)
        setError('Business not found')
        setIsLoading(false)
        return
      }

      setBusiness(data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading business:', error)
      setError('Failed to load business')
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Business Not Found</h1>
            <p className="text-gray-600 mb-8">{error || 'The business you are looking for does not exist.'}</p>
            <Link href="/businesses">
              <Button>Back to Businesses</Button>
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
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Link href="/businesses" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Businesses
          </Link>

          <Card className="shadow-lg">
            <CardContent className="p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-1">
                        {business.business_name}
                      </h1>
                      <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {business.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="border-2 border-gray-100">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Location</span>
                    </div>
                    <p className="text-gray-900 font-medium">{business.city}, Morocco</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-gray-100">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Phone</span>
                    </div>
                    <p className="text-gray-900 font-medium">{business.phone}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Description */}
              <Card className="border-2 border-gray-100 mb-8">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">About</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {business.description}
                  </p>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => window.location.href = `tel:${business.phone}`}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Call Now
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}
