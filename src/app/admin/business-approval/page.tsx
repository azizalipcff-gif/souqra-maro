"use client"

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Clock,
  MapPin,
  Phone,
  Mail,
  Eye,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

interface Business {
  id: string
  business_name: string
  description: string
  logo: string
  cover: string
  category: string
  city: string
  phone: string
  email: string
  website: string
  created_at: string
  user_id: string
  profiles?: {
    full_name: string
    email: string
  }
}

export default function BusinessApprovalPage() {
  const { user } = useAuth()
  const [pendingBusinesses, setPendingBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchPendingBusinesses()
  }, [])

  const fetchPendingBusinesses = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from('businesses')
        .select(`
          *,
          profiles!businesses_user_id_fkey (
            full_name,
            email
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      
      setPendingBusinesses(data || [])
    } catch (err) {
      console.error('Error fetching pending businesses:', err)
      setError('Failed to load pending businesses')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      setProcessing(id)
      setError(null)
      
      const { error: updateError } = await supabase
        .from('businesses')
        .update({ 
          status: 'active',
          approved: true 
        })
        .eq('id', id)

      if (updateError) throw updateError
      
      // Refresh the list
      await fetchPendingBusinesses()
      
      // Show success message (you could add a toast here)
      alert('Business approved successfully!')
    } catch (err) {
      console.error('Error approving business:', err)
      setError('Failed to approve business')
      alert('Failed to approve business. Please try again.')
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (id: string) => {
    try {
      setProcessing(id)
      setError(null)
      
      const { error: updateError } = await supabase
        .from('businesses')
        .update({ 
          status: 'suspended',
          approved: false 
        })
        .eq('id', id)

      if (updateError) throw updateError
      
      // Refresh the list
      await fetchPendingBusinesses()
      
      // Show success message
      alert('Business rejected successfully!')
    } catch (err) {
      console.error('Error rejecting business:', err)
      setError('Failed to reject business')
      alert('Failed to reject business. Please try again.')
    } finally {
      setProcessing(null)
    }
  }

  const handleView = (id: string) => {
    // Navigate to business detail page
    window.open(`/business/${id}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/admin">
              <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Business Approval</h1>
          <p className="text-blue-100 text-lg">Review and approve pending business registrations</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card className="hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
                <Clock className="h-5 w-5 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">{pendingBusinesses.length}</div>
                <p className="text-xs text-gray-500 font-medium">Awaiting review</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Approved Today</CardTitle>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">-</div>
                <p className="text-xs text-gray-500 font-medium">Businesses approved</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Rejected Today</CardTitle>
                <XCircle className="h-5 w-5 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">-</div>
                <p className="text-xs text-gray-500 font-medium">Businesses rejected</p>
              </CardContent>
            </Card>
          </div>

          {/* Pending Businesses */}
          <Card className="border border-gray-100">
            <CardHeader>
              <CardTitle className="text-xl">Pending Businesses ({pendingBusinesses.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Loading pending businesses...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {pendingBusinesses.map((business) => (
                    <div key={business.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Logo */}
                        <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                          {business.logo ? (
                            <img src={business.logo} alt={business.business_name} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <Building2 className="h-12 w-12 text-white" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{business.business_name}</h3>
                              <Badge variant="outline" className="mt-2">{business.category}</Badge>
                            </div>
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 font-medium">
                              Pending
                            </Badge>
                          </div>

                          <p className="text-gray-600 mb-4 leading-relaxed">{business.description}</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">{business.city}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">{business.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span className="truncate font-medium">{business.email}</span>
                            </div>
                            {business.website && (
                              <div className="flex items-center gap-2">
                                <span className="truncate font-medium">{business.website}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <span className="font-medium">
                              Submitted by {business.profiles?.full_name || business.profiles?.email || 'Unknown'} • {new Date(business.created_at).toLocaleDateString()}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleView(business.id)}
                              className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(business.id)}
                              disabled={processing === business.id}
                              className="bg-green-600 hover:bg-green-700 transition-colors"
                            >
                              {processing === business.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="mr-2 h-4 w-4" />
                              )}
                              Approve
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleReject(business.id)}
                              disabled={processing === business.id}
                              className="transition-colors"
                            >
                              {processing === business.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <XCircle className="mr-2 h-4 w-4" />
                              )}
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && pendingBusinesses.length === 0 && (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg font-medium">No pending businesses</p>
                  <p className="text-gray-500 mt-2">All caught up!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}
