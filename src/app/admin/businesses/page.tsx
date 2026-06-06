"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Building2, MapPin, Phone, ArrowLeft, CheckCircle, XCircle } from "lucide-react"
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
  created_at: string
  user_id: string
}

export default function AdminBusinessesPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [businesses, setBusinesses] = useState<Business[]>([])

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      console.log("=== ADMIN BUSINESSES AUTH CHECK ===")
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()
      
      console.log("SESSION USER:", session?.user?.id)
      console.log("SESSION EMAIL:", session?.user?.email)
      console.log("SESSION EXISTS:", !!session)
      
      if (!session?.user) {
        console.log("❌ No session found, redirecting to login")
        router.push("/login")
        return
      }

      setIsAuthenticated(true)

      // Check if user is admin
      console.log("Fetching profile for user ID:", session.user.id)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      console.log("PROFILE DATA:", profile)
      console.log("PROFILE ERROR:", profileError)
      console.log("PROFILE ROLE:", profile?.role)
      console.log("IS ADMIN:", profile?.role === "admin")

      if (profileError) {
        console.error("Profile query error:", profileError)
      }

      if (profile?.role !== 'admin') {
        console.log("❌ User is not admin, role is:", profile?.role)
        router.push("/")
        return
      }

      console.log("✅ User is admin, granting access")
      setIsAdmin(true)
      await fetchBusinesses()
    } catch (error) {
      console.error('Admin access check error:', error)
      router.push("/")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchBusinesses = async () => {
    try {
      const supabase = getSupabase()

      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data) {
        setBusinesses(data)
      }
    } catch (error) {
      console.error('Error fetching businesses:', error)
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

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-gray-600">Redirecting...</p>
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/admin" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Business Management</h1>
            <p className="text-gray-600">View and manage all business listings</p>
          </div>

          {/* Navigation */}
          <div className="flex gap-4 mb-8">
            <Link href="/admin">
              <Button variant="outline">
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/businesses">
              <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                Businesses
              </Button>
            </Link>
            <Link href="/admin/pending">
              <Button variant="outline">
                Pending Approvals
              </Button>
            </Link>
          </div>

          {/* Businesses Table */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              {businesses.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">No Businesses Yet</h2>
                  <p className="text-gray-600">
                    Businesses will appear here once users submit them.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Business Name</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Category</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900">City</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Phone</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Owner ID</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Created</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {businesses.map((business) => (
                        <tr key={business.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-900">{business.business_name}</div>
                          </td>
                          <td className="py-4 px-4 text-gray-600">{business.category}</td>
                          <td className="py-4 px-4 text-gray-600">{business.city}</td>
                          <td className="py-4 px-4 text-gray-600">{business.phone}</td>
                          <td className="py-4 px-4 text-gray-600 text-sm">{business.user_id}</td>
                          <td className="py-4 px-4 text-gray-600 text-sm">
                            {new Date(business.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4">
                            {business.approved ? (
                              <div className="flex items-center text-green-600">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approved
                              </div>
                            ) : (
                              <div className="flex items-center text-yellow-600">
                                <XCircle className="h-4 w-4 mr-1" />
                                Pending
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}
