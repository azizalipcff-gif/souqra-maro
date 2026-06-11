"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, TrendingUp, ArrowRight } from "lucide-react"
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
  const { user, session, loading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    console.log('[ProfilePage] Auth state:', { user: user?.id, session: session?.user?.id, authLoading })
    
    // Only load profile if user is authenticated
    if (user && !authLoading) {
      loadProfile()
    } else if (!authLoading && !user) {
      // User is not authenticated and auth is done loading
      setIsLoading(false)
      setError('You need to be logged in to view your profile')
    }
  }, [user, authLoading])

  const loadProfile = async () => {
    if (!user) {
      console.log('[ProfilePage] No user to load profile for')
      return
    }

    try {
      setIsLoading(true)
      const supabase = getSupabase()
      
      console.log('[ProfilePage] Loading profile for user:', user.id)
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      console.log('[ProfilePage] Profile data:', data)
      console.log('[ProfilePage] Profile error:', error)

      if (error) {
        // If profile doesn't exist, create a default one
        if (error.code === 'PGRST116') {
          console.log('[ProfilePage] Profile does not exist, creating default profile')
          const defaultProfile = {
            user_id: user.id,
            full_name: user.user_metadata?.full_name || user.email,
            username: user.email?.split('@')[0] || '',
            avatar_url: user.user_metadata?.avatar_url || null,
            email: user.email,
          }
          
          const { error: insertError } = await supabase
            .from('profiles')
            .upsert(defaultProfile, {
              onConflict: 'user_id',
              ignoreDuplicates: false,
            })

          if (insertError) {
            console.error('[ProfilePage] Error creating profile:', insertError)
            setError('Failed to create profile')
          } else {
            console.log('[ProfilePage] Default profile created')
            setProfile(defaultProfile as Profile)
          }
        } else {
          console.error('[ProfilePage] Error loading profile:', error)
          setError('Failed to load profile')
        }
      } else if (data) {
        console.log('[ProfilePage] Profile loaded successfully')
        setProfile(data)
      } else {
        console.log('[ProfilePage] No profile found, creating default')
        const defaultProfile = {
          user_id: user.id,
          full_name: user.user_metadata?.full_name || user.email,
          username: user.email?.split('@')[0] || '',
          avatar_url: user.user_metadata?.avatar_url || null,
          email: user.email,
        }
        
        const { error: insertError } = await supabase
          .from('profiles')
          .upsert(defaultProfile, {
            onConflict: 'user_id',
            ignoreDuplicates: false,
          })

        if (insertError) {
          console.error('[ProfilePage] Error creating profile:', insertError)
          setError('Failed to create profile')
        } else {
          console.log('[ProfilePage] Default profile created')
          setProfile(defaultProfile as Profile)
        }
      }
    } catch (error) {
      console.error('[ProfilePage] Error in loadProfile:', error)
      setError('An error occurred while loading your profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarUpdate = (avatarUrl: string) => {
    setProfile(prev => ({ ...prev, avatar_url: avatarUrl }))
    setSuccess('Avatar updated successfully')
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleSaveProfile = async (updatedProfile: Profile) => {
    try {
      const supabase = getSupabase()
      
      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('user_id', user?.id)

      if (error) {
        console.error('[ProfilePage] Error saving profile:', error)
        setError('Failed to save profile')
      } else {
        console.log('[ProfilePage] Profile saved successfully')
        setProfile(updatedProfile)
        setSuccess('Profile updated successfully')
        setIsEditing(false)
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (error) {
      console.error('[ProfilePage] Error in handleSaveProfile:', error)
      setError('An error occurred while saving your profile')
    }
  }

  // Show loading screen while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show error if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-gray-600 mb-4">{error || 'You need to be logged in to view your profile'}</p>
            <button
              onClick={() => router.push('/auth/login?next=/profile')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Login
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Show loading screen while profile is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your profile...</p>
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
              onSave={handleSaveProfile}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            </div>
            <ProfileCard profile={profile} />
            
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
