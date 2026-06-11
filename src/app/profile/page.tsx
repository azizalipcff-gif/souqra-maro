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
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const supabase = getSupabase()
    
    // Initial auth check
    checkAuthAndLoadProfile()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: any) => {
      console.log('Profile page auth state changed:', event, session?.user?.id)
      
      // Handle INITIAL_SESSION - just log it, don't make decisions yet
      if (event === 'INITIAL_SESSION') {
        if (session?.user) {
          setIsAuthenticated(true)
          loadProfile(session.user.id, session.user.email)
        }
        // If no session in INITIAL_SESSION, wait for SIGNED_IN event
        return
      }
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setIsAuthenticated(true)
        loadProfile(session?.user?.id || '', session?.user?.email)
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false)
        setProfile(DEFAULT_PROFILE)
        setError('You have been logged out')
        setIsLoading(false)
        // Do NOT redirect - let user stay on page with error message
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const checkAuthAndLoadProfile = async () => {
    try {
      const supabase = getSupabase()
      
      // Wait for session to be available
      let retries = 0
      let session = null
      
      while (retries < 3 && !session) {
        const { data } = await supabase.auth.getSession()
        session = data?.session
        if (!session) {
          await new Promise(resolve => setTimeout(resolve, 200))
          retries++
        }
      }
      
      if (!session?.user) {
        setIsAuthenticated(false)
        setError('You need to be logged in to view your profile')
        setIsLoading(false)
        // Do NOT redirect - let user stay on page with error message
        return
      }

      setIsAuthenticated(true)
      await loadProfile(session.user.id, session.user.email)
    } catch (error) {
      console.error('Auth check error:', error)
      setIsAuthenticated(false)
      setError('Authentication error')
      setIsLoading(false)
    }
  }

  const loadProfile = async (userId: string, userEmail?: string | null) => {
    try {
      const supabase = getSupabase()
      
      // Debug auth user first
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      console.log("USER =>", user)
      console.log("AUTH ERROR =>", authError)
      
      if (authError || !user) {
        console.error("No user logged in or auth error")
        setError('Authentication error')
        setIsLoading(false)
        return
      }
      
      console.log("LOADING PROFILE FOR USER ID:", userId)
      
      // Debug profile fetch with .select('*')
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      console.log("PROFILE DATA =>", data)
      console.log("PROFILE ERROR =>", error)

      if (error) {
        // If profile doesn't exist, create a default one
        if (error.code === 'PGRST116') {
          console.log("Profile does not exist, creating default profile")
          // Auto-create profile
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              user_id: user.id,
              full_name: user.email?.split('@')[0] || '',
              username: user.email?.split('@')[0] || '',
            })
            .select()
            .single()
          
          if (insertError) {
            console.error("Error creating profile:", insertError)
            setProfile({
              ...DEFAULT_PROFILE,
              id: userId,
            })
          } else {
            console.log("Created new profile:", newProfile)
            setProfile({
              ...DEFAULT_PROFILE,
              ...newProfile,
            })
          }
          return
        }
        throw error
      }

      if (data) {
        setProfile({
          ...DEFAULT_PROFILE,
          ...data,
        })
      } else {
        console.log("Profile data is null, auto-creating profile")
        // Auto-create profile if null
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            full_name: user.email?.split('@')[0] || '',
            username: user.email?.split('@')[0] || '',
          })
          .select()
          .single()
        
        if (insertError) {
          console.error("Error creating profile:", insertError)
          setProfile({
            ...DEFAULT_PROFILE,
            id: userId,
          })
        } else {
          console.log("Created new profile:", newProfile)
          setProfile({
            ...DEFAULT_PROFILE,
            ...newProfile,
          })
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      setError('Failed to load profile')
      // Don't crash, set default profile
      setProfile({
        ...DEFAULT_PROFILE,
        id: userId,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarChange = async (url: string) => {
    try {
      const supabase = getSupabase()
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      console.log("AVATAR UPDATE USER =>", user)
      console.log("AVATAR UPDATE USER ERROR =>", userError)
      
      if (userError || !user) {
        setError('Not authenticated')
        return
      }

      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: url })
        .eq('user_id', user.id)

      console.log("AVATAR UPDATE ERROR =>", error)

      if (error) throw error

      setProfile({ ...profile, avatar_url: url })
      setSuccess('Avatar updated successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error updating avatar:', error)
      setError('Failed to update avatar')
    }
  }

  const handleSaveProfile = async (formData: any) => {
    try {
      const supabase = getSupabase()
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      console.log("USER =>", user)
      console.log("AUTH ERROR =>", userError)
      
      if (userError || !user) {
        console.error("No user logged in")
        setError('Not authenticated')
        return
      }

      console.log("FORM DATA =>", formData)
      console.log("USER ID =>", user.id)

      const { data, error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('user_id', user.id)
        .select()

      console.log("UPDATE DATA =>", data)
      console.log("UPDATE ERROR =>", error)

      if (error) throw error

      setProfile({ ...profile, ...formData })
      setIsEditing(false)
      setSuccess('Profile updated successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
      setError('Failed to update profile')
      throw error
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-gray-600 mb-4">You need to be logged in to view your profile</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          {isEditing ? (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>
              <EditProfileForm
                profile={profile}
                onSave={handleSaveProfile}
                onCancel={() => setIsEditing(false)}
              />
            </div>
          ) : (
            <>
              <ProfileCard
                profile={profile}
                onEdit={() => setIsEditing(true)}
              />
              
              {/* Start Your Business Journey Card */}
              <Card className="mt-8 bg-gradient-to-br from-blue-600 to-blue-400 border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">
                          Start Your Business Journey
                        </h2>
                      </div>
                      <p className="text-white/90 text-lg mb-6">
                        List your business on SOUQORA and reach thousands of customers across Morocco. It's free, easy, and takes just a few minutes.
                      </p>
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
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
