"use client"

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Avatar } from '@/components/ui/avatar'
import { Upload, X, Camera } from 'lucide-react'

interface AvatarUploadProps {
  currentAvatar?: string
  userName?: string
  onAvatarChange: (avatar: string | null) => void
  maxSizeMB?: number
  accept?: string
  className?: string
}

export function AvatarUpload({
  currentAvatar,
  userName = 'User',
  onAvatarChange,
  maxSizeMB = 2,
  accept = 'image/jpeg,image/jpg,image/png,image/webp',
  className = ''
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = accept.split(',')
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only JPG, JPEG, PNG, and WebP are allowed.')
      return
    }

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds ${maxSizeMB}MB limit.`)
      return
    }

    setError('')

    // Create preview using FileReader
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setPreview(base64String)
      onAvatarChange(base64String)
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    setPreview(null)
    onAvatarChange(null)
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>Profile Picture</Label>
      
      <div className="flex items-center space-x-4">
        <div className="relative group">
          <Avatar className="h-24 w-24">
            {preview ? (
              <img
                src={preview}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {getInitials(userName)}
              </div>
            )}
          </Avatar>
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white rounded-full"
              onClick={handleClick}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          {preview && (
            <Button
              type="button"
              variant="danger"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6"
              onClick={handleRemove}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClick}
            className="w-full sm:w-auto"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload New Photo
          </Button>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            JPG, JPEG, PNG, WebP (max {maxSizeMB}MB)
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}
