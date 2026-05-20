"use client"

import { User, MapPin, Phone, Mail, Calendar } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2 } from "lucide-react"

interface ProfileCardProps {
  profile: any
  onEdit: () => void
}

export default function ProfileCard({ profile, onEdit }: ProfileCardProps) {
  const initials = profile.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2) || 'U'

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400" />
        
        {/* Avatar */}
        <div className="px-6 pb-6">
          <div className="relative -mt-16 mb-4">
            <Avatar 
              src={profile.avatar_url} 
              alt={profile.full_name}
              className="h-32 w-32 border-4 border-white shadow-lg"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{profile.full_name}</h2>
              <p className="text-gray-600">@{profile.username}</p>
            </div>

            {profile.bio && (
              <p className="text-gray-700">{profile.bio}</p>
            )}

            <div className="space-y-2 pt-4 border-t">
              {profile.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{profile.phone}</span>
                </div>
              )}

              {profile.city && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.city}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{profile.email}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
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
