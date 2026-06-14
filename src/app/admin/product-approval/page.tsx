"use client"

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingBag, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Clock,
  MapPin,
  Building2,
  Eye,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  condition: string
  location: string
  is_approved: boolean
  created_at: string
  business_id: string
  businesses?: {
    business_name: string
    city: string
  }
}

export default function ProductApprovalPage() {
  const { user } = useAuth()
  const [pendingProducts, setPendingProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchPendingProducts()
  }, [])

  const fetchPendingProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from('products')
        .select(`
          *,
          businesses!products_business_id_fkey (
            business_name,
            city
          )
        `)
        .eq('is_approved', false)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      
      setPendingProducts(data || [])
    } catch (err) {
      console.error('Error fetching pending products:', err)
      setError('Failed to load pending products')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      setProcessing(id)
      setError(null)
      
      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          is_approved: true 
        })
        .eq('id', id)

      if (updateError) throw updateError
      
      // Refresh the list
      await fetchPendingProducts()
      
      // Show success message
      alert('Product approved successfully!')
    } catch (err) {
      console.error('Error approving product:', err)
      setError('Failed to approve product')
      alert('Failed to approve product. Please try again.')
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (id: string) => {
    try {
      setProcessing(id)
      setError(null)
      
      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          is_active: false,
          is_approved: false 
        })
        .eq('id', id)

      if (updateError) throw updateError
      
      // Refresh the list
      await fetchPendingProducts()
      
      // Show success message
      alert('Product rejected successfully!')
    } catch (err) {
      console.error('Error rejecting product:', err)
      setError('Failed to reject product')
      alert('Failed to reject product. Please try again.')
    } finally {
      setProcessing(null)
    }
  }

  const handleView = (id: string) => {
    // Navigate to product detail page
    window.open(`/products/${id}`, '_blank')
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
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Product Approval</h1>
          <p className="text-blue-100 text-lg">Review and approve pending product listings</p>
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
                <div className="text-3xl font-bold text-gray-900 mb-2">{pendingProducts.length}</div>
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
                <p className="text-xs text-gray-500 font-medium">Products approved</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Rejected Today</CardTitle>
                <XCircle className="h-5 w-5 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">-</div>
                <p className="text-xs text-gray-500 font-medium">Products rejected</p>
              </CardContent>
            </Card>
          </div>

          {/* Pending Products */}
          <Card className="border border-gray-100">
            <CardHeader>
              <CardTitle className="text-xl">Pending Products ({pendingProducts.length})</CardTitle>
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
                  <span className="ml-2 text-gray-600">Loading pending products...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {pendingProducts.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Image */}
                        <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-md">
                          {product.images && product.images[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <ShoppingBag className="h-12 w-12 text-white" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline">{product.businesses?.business_name || 'Unknown Business'}</Badge>
                                <Badge variant={product.condition === 'new' ? 'default' : 'secondary'}>
                                  {product.condition}
                                </Badge>
                              </div>
                            </div>
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 font-medium">
                              Pending
                            </Badge>
                          </div>

                          <p className="text-gray-600 mb-4 leading-relaxed">{product.description}</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">{product.businesses?.business_name || 'Unknown Business'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">{product.location}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl font-bold text-blue-600">{product.price.toLocaleString()} MAD</span>
                            <div className="text-sm text-gray-500 font-medium">
                              Submitted on {new Date(product.created_at).toLocaleDateString()}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleView(product.id)}
                              className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(product.id)}
                              disabled={processing === product.id}
                              className="bg-green-600 hover:bg-green-700 transition-colors"
                            >
                              {processing === product.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="mr-2 h-4 w-4" />
                              )}
                              Approve
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleReject(product.id)}
                              disabled={processing === product.id}
                              className="transition-colors"
                            >
                              {processing === product.id ? (
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

              {!loading && pendingProducts.length === 0 && (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg font-medium">No pending products</p>
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
