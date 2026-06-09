"use client"

import { useState } from "react"
import { User, MapPin, Phone, Save, Loader2, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabase } from "@/lib/supabase/client"

const MOROCCAN_CITIES = [
  "Casablanca", "Rabat", "Tangier", "Marrakech", "Agadir", "Fes", "Oujda",
  "Kenitra", "Tetouan", "Safi", "Meknes", "El Jadida", "Beni Mellal", "Nador"
]

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

interface EditProfileFormProps {
  profile: Profile
  onSave: (data: any) => Promise<void>
  onCancel: () => void
}

export default function EditProfileForm({ profile, onSave, onCancel }: EditProfileFormProps) {
  const [formData, setFormData] = useState({
    full_name: profile.full_name || "",
    username: profile.username || "",
    phone: profile.phone || "",
    city: profile.city || "",
    bio: profile.bio || "",
    avatar_url: profile.avatar_url || null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError("")

    try {
      const supabase = getSupabase()
      const fileExt = file.name.split('.').pop()
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path)

      setFormData({ ...formData, avatar_url: publicUrl })
    } catch (error) {
      console.error('Error uploading avatar:', error)
      setError('Failed to upload avatar')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await onSave(formData)
    } catch (err) {
      setError("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Avatar Upload */}
      <div>
        <Label htmlFor="avatar">Profile Picture</Label>
        <div className="mt-2 flex items-center gap-4">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200">
            {formData.avatar_url ? (
              <img
                src={formData.avatar_url}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <User className="h-8 w-8" />
              </div>
            )}
            <label
              htmlFor="avatar"
              className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
            >
              {isUploading ? (
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              ) : (
                <Camera className="h-5 w-5 text-white" />
              )}
            </label>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={isUploading}
              className="hidden"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">
              Upload a profile picture. Recommended size: 200x200px.
            </p>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="full_name">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="pl-10"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="city">City</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
          <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
            <SelectTrigger className="pl-10">
              <SelectValue placeholder="Select your city" />
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
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={4}
          placeholder="Tell us about yourself..."
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading || isUploading} className="flex-1">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading || isUploading}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
