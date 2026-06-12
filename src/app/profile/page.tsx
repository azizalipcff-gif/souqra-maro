"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ArrowRight } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import ProfileCard from "@/components/profile/ProfileCard"
import EditProfileForm from "@/components/profile/EditProfileForm"
import AvatarUpload from "@/components/profile/AvatarUpload"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getSupabase } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/AuthContext"

interface Profile {
  id?: string
  full_name?: string | null
  username?: string | null
  phone?: string | null
  city?: string | null
  bio?: string | null
  avatar_url?: string | null
  email?: string | null
  created_at?: string | null
}

const DEFAULT_PROFILE: Profile = {
  full_name: '',
  username: '',
  phone: '',
  city: '',
  bio: '',
  avatar_url: null,
  email: '',
  created_at: null,
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, session, loading: authLoading, initialized } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Redirect if not authenticated
  useEffect(() => {
    if (initialized && !authLoading && !user) {
      router.push('/auth/login?next=/profile')
    }
  }, [user, authLoading, initialized, router])

  const loadProfile = useCallback(async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const supabase = getSupabase()
      if (!supabase) return
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) {
        if (error.code === 'PGRST116') {
          setProfile(DEFAULT_PROFILE)
        } else {
          setError('Failed to load profile')
        }
      } else if (data) {
        setProfile(data)
      }
    } catch (err) {
      setError('Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user && initialized) {
      loadProfile()
    }
  }, [user, initialized, loadProfile])

  const handleAvatarUpdate = async (avatarUrl: string) => {
    try {
      const supabase = getSupabase()
      if (!supabase) return

      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('user_id', user!.id)

      if (error) throw error

      setProfile({ ...profile, avatar_url })
      setSuccess('Avatar updated successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to update avatar')
    }
  }

  const handleProfileSave = async (updatedProfile: Profile) => {
    try {
      const supabase = getSupabase()
      if (!supabase) return

      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user!.id,
          ...updatedProfile,
        }, {
          onConflict: 'user_id',
        })

      if (error) throw error

      setProfile(updatedProfile)
      setIsEditing(false)
      setSuccess('Profile updated successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to update profile')
    }
  }

  // Show loading state while auth is initializing
  if (authLoading || !initialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
        <Footer />
      </div>
    )
  }

  // Show loading state while profile is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
        <Footer />
      </div>
    )
  }

  // Show error if no user
  if (!user) {
    return null // Will redirect by useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      <div className="container mx-auto px-4 py-16">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
            {success}
          </div>
        )}

        {isEditing ? (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => setIsEditing(false)}
                className="text-blue-600 hover:text-blue-700 mb-4"
              >
                ← Back to profile
              </button>
            </div>
            <AvatarUpload
              currentAvatar={profile.avatar_url || null}
              onAvatarChange={handleAvatarUpdate}
              userId={user.id}
            />
            <EditProfileForm
              profile={profile}
              onSave={handleProfileSave}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            </div>
            <ProfileCard 
              profile={profile}
              onEdit={() => setIsEditing(true)}
            />
            
            <Card className="mt-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Your Business</h3>
                    <p className="text-gray-600">List your business on our marketplace and reach more customers.</p>
                  </div>
                  <Button 
                    size="lg" 
                    variant="default" 
                    className="bg-white text-blue-600 hover:bg-gray-100"
                    onClick={() => router.push('/add-business')}
                  >
                    Add Your Business
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
