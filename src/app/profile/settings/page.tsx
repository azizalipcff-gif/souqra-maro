"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/utils/supabase/client'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { EditProfileForm } from '@/components/profile/EditProfileForm'
import { AddBusinessForm } from '@/components/dashboard/AddBusinessForm'
import { AddServiceForm } from '@/components/dashboard/AddServiceForm'
import { Loader2, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ProfileData {
  full_name: string | undefined
  email: string
  phone: string | undefined
  city: string | undefined
  bio: string | undefined
  whatsapp: string | undefined
  avatar_url: string | undefined
  product_image?: string | undefined
  service_cover_image?: string | undefined
}

export default function EditProfilePage() {
  const { user, refreshProfile } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    loadProfile()
  }, [user])

  const loadProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (error) {
        console.error('Error loading profile:', error)
        toast.error('Failed to load profile data')
      } else if (data) {
        setProfileData({
          full_name: data.full_name || undefined,
          email: user.email || '',
          phone: data.phone || undefined,
          city: data.city || undefined,
          bio: data.bio || undefined,
          whatsapp: data.whatsapp || undefined,
          avatar_url: data.avatar_url || undefined,
        })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      toast.error('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: any) => {
    setSaving(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          phone: data.phone,
          city: data.city,
          bio: data.bio,
          whatsapp: data.whatsapp,
          avatar_url: data.avatar_url,
        })
        .eq('id', user?.id)

      if (error) {
        console.error('Error updating profile:', error)
        toast.error('Failed to update profile')
      } else {
        // Refresh profile data in context
        await refreshProfile()
        
        toast.success('Profile updated successfully!', {
          description: 'Your changes have been saved.',
          icon: <CheckCircle className="h-5 w-5 text-green-600" />,
        })
        
        // Redirect to profile page after successful save
        setTimeout(() => {
          router.push('/profile')
        }, 1500)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Link href="/profile">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600">Update your profile, add businesses, and services</p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="business">Add Business</TabsTrigger>
              <TabsTrigger value="service">Add Service</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              {profileData ? (
                <EditProfileForm
                  initialData={profileData}
                  onSubmit={handleSubmit}
                  isLoading={saving}
                />
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Failed to load profile data</p>
                  <Button onClick={loadProfile} className="mt-4">
                    Retry
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="business">
              <AddBusinessForm />
            </TabsContent>
            
            <TabsContent value="service">
              <AddServiceForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  )
}
