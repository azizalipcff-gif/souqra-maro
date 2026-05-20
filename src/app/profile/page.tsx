"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import ProfileCard from "@/components/profile/ProfileCard"
import EditProfileForm from "@/components/profile/EditProfileForm"
import AvatarUpload from "@/components/profile/AvatarUpload"
import { getSupabase } from "@/lib/supabase/client"

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    checkAuthAndLoadProfile()
  }, [])

  const checkAuthAndLoadProfile = async () => {
    try {
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push("/login?next=/profile")
        return
      }

      await loadProfile()
    } catch (error) {
      console.error('Auth check error:', error)
      router.push("/login?next=/profile")
    } finally {
      setIsLoading(false)
    }
  }

  const loadProfile = async () => {
    try {
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (error) throw error

      if (data) {
        setProfile({
          ...data,
          email: session.user.email,
        })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      setError('Failed to load profile')
    }
  }

  const handleAvatarChange = async (url: string) => {
    try {
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: url })
        .eq('id', session.user.id)

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
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', session.user.id)

      if (error) throw error

      setProfile({ ...profile, ...formData })
      setIsEditing(false)
      setSuccess('Profile updated successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
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
            <ProfileCard
              profile={profile}
              onEdit={() => setIsEditing(true)}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
