"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Building2, MapPin, Phone, FileText, ArrowLeft, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
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

export default function AdminPendingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showRejectDialog, setShowRejectDialog] = useState<string | null>(null)

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        router.push("/login")
        return
      }

      setIsAuthenticated(true)

      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (profile?.role !== 'admin') {
        router.push("/")
        return
      }

      setIsAdmin(true)
      await fetchPendingBusinesses()
    } catch (error) {
      console.error('Admin access check error:', error)
      router.push("/")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPendingBusinesses = async () => {
    try {
      const supabase = getSupabase()

      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('approved', false)
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data) {
        setBusinesses(data)
      }
    } catch (error) {
      console.error('Error fetching pending businesses:', error)
    }
  }

  const handleApprove = async (businessId: string) => {
    setActionLoading(businessId)
    try {
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        alert('You must be logged in to perform this action')
        return
      }

      const response = await fetch('/api/admin/approve-business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ businessId })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to approve business')
      }

      // Refresh list
      await fetchPendingBusinesses()
    } catch (error) {
      console.error('Error approving business:', error)
      alert('Failed to approve business. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (businessId: string) => {
    if (!confirm('Are you sure you want to reject this business? This will delete it from the database.')) {
      return
    }

    setActionLoading(businessId)
    try {
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        alert('You must be logged in to perform this action')
        return
      }

      const response = await fetch('/api/admin/reject-business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ businessId })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to reject business')
      }

      // Refresh list
      await fetchPendingBusinesses()
    } catch (error) {
      console.error('Error rejecting business:', error)
      alert('Failed to reject business. Please try again.')
    } finally {
      setActionLoading(null)
      setShowRejectDialog(null)
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/admin" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Pending Approvals</h1>
            <p className="text-gray-600">Review and approve business submissions</p>
          </div>

          {/* Navigation */}
          <div className="flex gap-4 mb-8">
            <Link href="/admin">
              <Button variant="outline">
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/businesses">
              <Button variant="outline">
                Businesses
              </Button>
            </Link>
            <Link href="/admin/pending">
              <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                Pending Approvals
              </Button>
            </Link>
          </div>

          {/* Pending Businesses */}
          {businesses.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h2>
                <p className="text-gray-600">
                  There are no pending business approvals at the moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {businesses.map((business) => (
                <Card key={business.id} className="shadow-lg border-2 border-yellow-100 hover:border-yellow-300 transition-colors">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Business Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Building2 className="h-8 w-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                              {business.business_name}
                            </h3>
                            <span className="text-sm font-medium text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                              {business.category}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-6 leading-relaxed">
                          {business.description}
                        </p>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <MapPin className="h-5 w-5 text-gray-600" />
                            <div>
                              <p className="text-xs text-gray-500">Location</p>
                              <p className="font-medium text-gray-900">{business.city}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Phone className="h-5 w-5 text-gray-600" />
                            <div>
                              <p className="text-xs text-gray-500">Phone</p>
                              <p className="font-medium text-gray-900">{business.phone}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 text-sm text-gray-500">
                          <p>Submitted: {new Date(business.created_at).toLocaleDateString()}</p>
                          <p>Owner ID: {business.user_id}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex md:flex-col gap-3 md:w-48">
                        <Button
                          onClick={() => handleApprove(business.id)}
                          disabled={actionLoading === business.id}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          size="lg"
                        >
                          {actionLoading === business.id ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle className="h-5 w-5 mr-2" />
                              Approve
                            </>
                          )}
                        </Button>

                        <Button
                          onClick={() => handleReject(business.id)}
                          disabled={actionLoading === business.id}
                          variant="outline"
                          className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                          size="lg"
                        >
                          {actionLoading === business.id ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <>
                              <XCircle className="h-5 w-5 mr-2" />
                              Reject
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
