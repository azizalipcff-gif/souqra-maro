"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  User, MapPin, Phone, Mail, ShoppingBag, Heart, Settings, 
  Shield, LogOut, Camera, Edit2, CheckCircle, Loader2, X, Globe
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { getSupabase } from "@/lib/supabase/client"
import { processImageForUpload } from "@/lib/performance/image-optimization"

const MOROCCAN_CITIES = [
  "Casablanca", "Rabat", "Tangier", "Marrakech", "Agadir", "Fes", "Oujda",
  "Kenitra", "Tetouan", "Safi", "Meknes", "El Jadida", "Beni Mellal", "Nador"
]

export default function ProfilePage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const [profile, setProfile] = useState<any>(null)
  const [userBusinesses, setUserBusinesses] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    bio: "",
    phone: "",
    city: "",
    website: "",
    instagram: "",
    facebook: "",
  })

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>("")

  useEffect(() => {
    checkAuthAndLoadProfile()
  }, [])

  const checkAuthAndLoadProfile = async () => {
    try {
      const { data: { session } } = await getSupabase().auth.getSession()
      if (!session) {
        router.push("/auth/login?redirect=/profile")
        return
      }

      setIsAuthenticated(true)
      await loadProfile()
      await loadUserBusinesses()
    } catch (error) {
      console.error('Auth check error:', error)
      router.push("/auth/login?redirect=/profile")
    } finally {
      setIsLoading(false)
    }
  }

  const loadProfile = async () => {
    try {
      const { data: { session } } = await getSupabase().auth.getSession()
      if (!session) return

      const response = await fetch('/api/profiles', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      const data = await response.json()
      
      if (data.profile) {
        setProfile(data.profile)
        setFormData({
          full_name: data.profile.full_name || "",
          username: data.profile.username || "",
          bio: data.profile.bio || "",
          phone: data.profile.phone || "",
          city: data.profile.city || "",
          website: data.profile.website || "",
          instagram: data.profile.instagram || "",
          facebook: data.profile.facebook || "",
        })
        if (data.profile.avatar_url) {
          setAvatarPreview(data.profile.avatar_url)
        }
      }
    } catch (error) {
      console.error('Profile load error:', error)
    }
  }

  const loadUserBusinesses = async () => {
    try {
      const { data: { session } } = await getSupabase().auth.getSession()
      if (!session) return

      const { data: businesses } = await getSupabase()
        .from('businesses')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (businesses) {
        setUserBusinesses(businesses)
      }
    } catch (error) {
      console.error('Businesses load error:', error)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleRemoveAvatar = () => {
    setAvatarFile(null)
    setAvatarPreview("")
  }

  const handleAvatarUpload = async () => {
    if (!avatarFile) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const { data: { session } } = await getSupabase().auth.getSession()
      if (!session) throw new Error('Not authenticated')

      // Process and compress image
      const processedImage = await processImageForUpload(avatarFile)
      setUploadProgress(50)

      // Upload image
      const uploadFormData = new FormData()
      uploadFormData.append('avatar', processedImage)
      uploadFormData.append('type', 'avatar')

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      if (!uploadResponse.ok) throw new Error('Upload failed')

      const uploadData = await uploadResponse.json()
      setUploadProgress(100)

      // Update profile with new avatar URL
      const profileResponse = await fetch('/api/profiles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          ...formData,
          avatar_url: uploadData.images?.avatar,
        }),
      })

      if (!profileResponse.ok) throw new Error('Profile update failed')

      const profileData = await profileResponse.json()
      setProfile(profileData.profile)
      setAvatarPreview(profileData.profile.avatar_url)
      setAvatarFile(null)
      setSuccess('Avatar updated successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Avatar upload error:', error)
      setError('Failed to upload avatar')
      setTimeout(() => setError(''), 3000)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError("")

    try {
      const { data: { session } } = await getSupabase().auth.getSession()
      if (!session) throw new Error('Not authenticated')

      const response = await fetch('/api/profiles', {
        method: profile ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save profile')
      }

      const data = await response.json()
      setProfile(data.profile)
      setIsEditing(false)
      setSuccess('Profile saved successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Profile save error:', error)
      setError(error instanceof Error ? error.message : 'Failed to save profile')
      setTimeout(() => setError(''), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await getSupabase().auth.signOut()
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-royal-blue" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-8">My Profile</h1>

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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Profile"
                          className="w-32 h-32 rounded-full object-cover border-4 border-gold"
                        />
                      ) : (
                        <Avatar className="w-32 h-32 border-4 border-gold" />
                      )}
                      <label className="absolute bottom-0 right-0 p-2 bg-royal-blue text-white rounded-full hover:bg-royal-blue-light transition-colors cursor-pointer">
                        <Camera className="h-4 w-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {avatarFile && (
                      <div className="w-full mb-4">
                        <div className="flex gap-2 mb-2">
                          <Button
                            size="sm"
                            onClick={handleAvatarUpload}
                            disabled={isUploading}
                            className="flex-1"
                          >
                            {isUploading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                {uploadProgress > 0 ? `${uploadProgress}%` : 'Uploading...'}
                              </>
                            ) : (
                              'Upload'
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleRemoveAvatar}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    <h2 className="text-2xl font-bold mb-1">
                      {profile?.full_name || 'Complete your profile'}
                    </h2>
                    <p className="text-gray-600 mb-4">{profile?.username || '@username'}</p>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                      <MapPin className="h-4 w-4" />
                      {profile?.city || 'Location not set'}
                    </div>

                    <div className="grid grid-cols-3 gap-4 w-full mb-6">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-royal-blue">{userBusinesses.length}</p>
                        <p className="text-xs text-gray-600">Businesses</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-royal-blue">
                          {userBusinesses.filter(b => b.approved).length}
                        </p>
                        <p className="text-xs text-gray-600">Approved</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-royal-blue">
                          {userBusinesses.filter(b => !b.approved).length}
                        </p>
                        <p className="text-xs text-gray-600">Pending</p>
                      </div>
                    </div>

                    <div className="space-y-2 w-full">
                      <Link href="/add-business">
                        <Button variant="outline" className="w-full justify-start">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Add Business
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-red-600 hover:text-red-700"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <form className="space-y-4">
                      <div>
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Select
                          value={formData.city}
                          onValueChange={(value) => setFormData({ ...formData, city: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                          <SelectContent>
                            {MOROCCAN_CITIES.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          rows={4}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            type="url"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            placeholder="https://"
                          />
                        </div>
                        <div>
                          <Label htmlFor="instagram">Instagram</Label>
                          <Input
                            id="instagram"
                            value={formData.instagram}
                            onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                            placeholder="@username"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input
                          id="facebook"
                          value={formData.facebook}
                          onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                          placeholder="Facebook URL"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSave} disabled={isLoading}>
                          {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="font-medium">{profile?.full_name || 'Not set'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Username</p>
                          <p className="font-medium">{profile?.username || 'Not set'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{profile?.phone || 'Not set'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">City</p>
                          <p className="font-medium">{profile?.city || 'Not set'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Bio</p>
                        <p className="font-medium">{profile?.bio || 'Not set'}</p>
                      </div>
                      {profile?.website && (
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Website</p>
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                              {profile.website}
                            </a>
                          </div>
                        </div>
                      )}
                      {profile?.instagram && (
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Instagram</p>
                            <p className="font-medium">{profile.instagram}</p>
                          </div>
                        </div>
                      )}
                      {profile?.facebook && (
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Facebook</p>
                            <p className="font-medium">{profile.facebook}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* My Businesses */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>My Businesses</CardTitle>
                  <Link href="/add-business">
                    <Button size="sm">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Add Business
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {userBusinesses.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">You haven't added any businesses yet</p>
                      <Link href="/add-business">
                        <Button>Add Your First Business</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userBusinesses.map((business) => (
                        <div key={business.id} className="flex items-center justify-between p-4 border rounded-lg hover:border-gold transition-colors">
                          <div>
                            <p className="font-semibold">{business.name}</p>
                            <p className="text-sm text-gray-500">{business.city} • {business.category}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={business.approved ? "success" : "warning"}
                            >
                              {business.approved ? 'Approved' : 'Pending'}
                            </Badge>
                            <Link href={`/business/${business.slug}`}>
                              <Button variant="outline" size="sm">View</Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
