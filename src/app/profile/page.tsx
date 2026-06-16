"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/utils/supabase/client'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Briefcase, Package, Settings, LogOut, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Profile {
  id: string
  full_name: string | null
  username: string | null
  role: 'client' | 'business_owner' | 'admin'
  city: string | null
  bio: string | null
  avatar_url: string | null
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
    if (loading) return

    if (!user) {
      router.push('/login')
      return
    }

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
          username: null
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
      const { data, error } = await supabase
        .from('businesses')
        .select('id, name, description')
        .eq('owner_id', userId)

      if (error) {
        console.error('Error loading businesses:', error)
      } else {
        setBusinesses(data || [])
      }
    } catch (error) {
      console.error('Exception in businesses loading:', error)
    }
  }

  const loadProductsData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price')
        .eq('seller_id', userId)

      if (error) {
        console.error('Error loading products:', error)
      } else {
        setProducts(data || [])
      }
    } catch (error) {
      console.error('Exception in products loading:', error)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const displayName = profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'User'
  const displayRole = profile?.role || 'client'
  const displayCity = profile?.city || 'Not specified'
  const displayBio = profile?.bio || 'No bio yet'

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Card */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{displayName}</CardTitle>
                    <CardDescription className="text-base">{user.email}</CardDescription>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {displayRole}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/profile/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{displayCity}</span>
              </div>
              <div className="text-gray-600">
                <p>{displayBio}</p>
              </div>
            </CardContent>
          </Card>

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
                ))}
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
              {profile?.role === 'business_owner' && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
              )}
              {profile?.role === 'business_owner' && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/add-business">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Add Business
                  </Link>
                </Button>
              )}
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/add-product">
                  <Package className="h-4 w-4 mr-2" />
                  Add Product
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