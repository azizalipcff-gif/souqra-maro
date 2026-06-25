"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/utils/supabase/client'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Briefcase, Package, Settings, LogOut, Edit, Plus, Store, Heart, Eye, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ProfileHeaderCard } from '@/components/profile/ProfileHeaderCard'

interface Profile {
  id: string
  full_name: string | null
  username: string | null
  role: 'client' | 'business_owner' | 'admin'
  city: string | null
  bio: string | null
  avatar_url: string | null
  phone: string | null
  created_at: string | null
}

interface Business {
  id: string
  name: string
  description: string | null
}

interface Product {
  id: string
  name: string
  price: number
}

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProfile, setLoadingProfile] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      const loadAllData = async () => {
        try {
          setLoadingProfile(true)
          await Promise.all([
            loadProfileData(user.id),
            loadBusinessesData(user.id),
            loadProductsData(user.id)
          ])
        } catch (err) {
          console.error('Error loading page data:', err)
        } finally {
          setLoadingProfile(false)
        }
      }
      loadAllData()
    }
  }, [user, loading, router])

  const loadProfileData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('Error loading profile:', error)
        return
      }

      if (data) {
        setProfile(data)
      } else {
        const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || ''
        const newProfile = {
          id: userId,
          full_name: fullName,
          role: 'client' as const,
          city: null,
          bio: null,
          avatar_url: null,
          username: null,
          phone: null,
          created_at: new Date().toISOString()
        }

        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: newProfile.id,
            full_name: newProfile.full_name,
            role: newProfile.role,
          })

        if (insertError) {
          console.error('Error creating profile:', insertError)
        } else {
          setProfile(newProfile)
        }
      }
    } catch (error) {
      console.error('Exception in profile loading:', error)
    }
  }

  const loadBusinessesData = async (userId: string) => {
    try {
      // Skip loading businesses - table doesn't exist yet or has different schema
      setBusinesses([])
      return
      
      // const { data, error } = await supabase
      //   .from('businesses')
      //   .select('id, name, description')
      //   .eq('owner_id', userId)

      // if (error) {
      //   console.error('Error loading businesses:', error)
      // } else {
      //   setBusinesses(data || [])
      // }
    } catch (error) {
      console.error('Exception in businesses loading:', error)
      setBusinesses([])
    }
  }

  const loadProductsData = async (userId: string) => {
    try {
      // Skip loading products - table doesn't exist yet or has different schema
      setProducts([])
      return
      
      // const { data, error } = await supabase
      //   .from('products')
      //   .select('id, name, price')
      //   .eq('seller_id', userId)

      // if (error) {
      //   console.error('Error loading products:', error)
      // } else {
      //   setProducts(data || [])
      // }
    } catch (error) {
      console.error('Exception in products loading:', error)
      setProducts([])
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (!user && loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Premium Profile Header Card */}
          <ProfileHeaderCard />

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <Package className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-gray-900">{products.length}</div>
                <div className="text-sm text-gray-600">Products</div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <Store className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-gray-900">{businesses.length}</div>
                <div className="text-sm text-gray-600">Businesses</div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <Eye className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-600">Views</div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <Heart className="h-8 w-8 mx-auto mb-2 text-red-600" />
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-600">Favorites</div>
              </CardContent>
            </Card>
          </div>

          {/* Businesses Section */}
          {profile?.role === 'business_owner' && (
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  My Businesses
                </CardTitle>
              </CardHeader>
              <CardContent>
                {businesses.length > 0 ? (
                  <div className="space-y-3">
                    {businesses.map((business) => (
                      <Link
                        key={business.id}
                        href={`/business/${business.id}`}
                        className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                      >
                        <h3 className="font-medium text-gray-900">{business.name}</h3>
                        {business.description && (
                          <p className="text-sm text-gray-600 mt-1">{business.description}</p>
                        )}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">You haven't created any businesses yet</p>
                    <Button asChild>
                      <Link href="/add-business">Add Business</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Products Section */}
          {products.length > 0 && (
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  My Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <span className="text-sm font-medium text-blue-600">${product.price}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard">
                  <Settings className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/services/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/businesses/new">
                  <Store className="h-4 w-4 mr-2" />
                  Add Business
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
      <Footer />
    </div>
  )
}