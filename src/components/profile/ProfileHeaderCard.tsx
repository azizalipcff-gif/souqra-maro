"use client"

import { useAuth } from '@/contexts/AuthContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Camera, MapPin, Phone, Mail, Calendar, Edit } from 'lucide-react'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ProfileEditForm } from './ProfileEditForm'
import Image from 'next/image'

export function ProfileHeaderCard() {
  const { profile, user } = useAuth()
  const [editOpen, setEditOpen] = useState(false)

  if (!profile || !user) return null

  const getAccountTypeBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-600">Admin</Badge>
      case 'business_owner':
        return <Badge className="bg-blue-600">Business Owner</Badge>
      default:
        return <Badge className="bg-gray-600">User</Badge>
    }
  }

  return (
    <Card className="overflow-hidden shadow-lg border-0">
      {/* Cover Image */}
      <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-4 right-4">
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="bg-white/90 hover:bg-white">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <ProfileEditForm profile={profile} onSuccess={() => setEditOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Profile Content */}
      <div className="px-6 pb-6">
        <div className="flex flex-col md:flex-row gap-6 -mt-16">
          {/* Avatar */}
          <div className="relative">
            <div className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name || 'Profile'}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500">
                  <span className="text-4xl font-bold text-white">
                    {profile.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <Button
              size="icon"
              className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-blue-600 hover:bg-blue-700"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          {/* User Info */}
          <div className="flex-1 pt-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile.full_name || 'No name set'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">@{profile.username || user.email?.split('@')[0]}</p>
              </div>
              {getAccountTypeBadge(profile.role)}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mt-4">
              {profile.city && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.city}</span>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>{profile.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {new Date(profile.created_at || '').toLocaleDateString()}</span>
              </div>
            </div>

            {profile.bio && (
              <p className="mt-4 text-gray-700 dark:text-gray-300 line-clamp-2">
                {profile.bio}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
