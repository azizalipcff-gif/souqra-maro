"use client"

import { User, MapPin, Phone, Mail, Calendar } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2 } from "lucide-react"

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

interface ProfileCardProps {
  profile: Profile
  onEdit: () => void
}

export default function ProfileCard({ profile, onEdit }: ProfileCardProps) {
  const displayName = profile.full_name || 'Complete your profile'
  const displayUsername = profile.username || '@username'
  const displayEmail = profile.email || 'No email'
  const displayCity = profile.city || 'Location not set'
  const displayPhone = profile.phone || null
  const displayBio = profile.bio || null
  const displayAvatar = profile.avatar_url || null
  const displayCreatedAt = profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Recently'

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400" />
        
        {/* Avatar */}
        <div className="px-6 pb-6">
          <div className="relative -mt-16 mb-4">
            <Avatar 
              src={displayAvatar || undefined}
              alt={displayName}
              className="h-32 w-32 border-4 border-white shadow-lg"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{displayName}</h2>
              <p className="text-gray-600">{displayUsername}</p>
            </div>

            {displayBio && (
              <p className="text-gray-700">{displayBio}</p>
            )}

            <div className="space-y-2 pt-4 border-t">
              {displayPhone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{displayPhone}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{displayCity}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{displayEmail}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Joined {displayCreatedAt}</span>
              </div>
            </div>

            <Button onClick={onEdit} className="w-full">
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
