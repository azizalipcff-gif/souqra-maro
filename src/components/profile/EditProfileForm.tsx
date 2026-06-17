"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AvatarUpload } from './AvatarUpload'
import { ImageUpload } from './ImageUpload'
import { Loader2, Save } from 'lucide-react'

const MOROCCAN_CITIES = [
  'Casablanca', 'Rabat', 'Fes', 'Marrakech', 'Tangier', 'Agadir', 'Meknes', 'Oujda', 'Kenitra', 'Tetouan',
  'Essaouira', 'Safi', 'Mohammedia', 'Beni Mellal', 'Nador', 'El Jadida', 'Taza', 'Khouribga', 'Settat', 'Larache'
]

const profileSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  city: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  whatsapp: z.string().optional(),
  avatar_url: z.string().optional(),
  product_image: z.string().optional(),
  service_cover_image: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface EditProfileFormProps {
  initialData?: Partial<ProfileFormValues>
  onSubmit: (data: ProfileFormValues) => Promise<void>
  isLoading?: boolean
}

export function EditProfileForm({ initialData, onSubmit, isLoading = false }: EditProfileFormProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialData?.avatar_url || null)
  const [productImage, setProductImage] = useState<string | null>(initialData?.product_image || null)
  const [serviceCoverImage, setServiceCoverImage] = useState<string | null>(initialData?.service_cover_image || null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: initialData?.full_name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      city: initialData?.city || '',
      bio: initialData?.bio || '',
      whatsapp: initialData?.whatsapp || '',
      avatar_url: initialData?.avatar_url || '',
      product_image: initialData?.product_image || '',
      service_cover_image: initialData?.service_cover_image || '',
    },
  })

  const handleFormSubmit = async (data: ProfileFormValues) => {
    const formData = {
      ...data,
      avatar_url: avatarUrl || undefined,
      product_image: productImage || undefined,
      service_cover_image: serviceCoverImage || undefined,
    }
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Profile Info Section */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar Upload */}
          <AvatarUpload
            currentAvatar={avatarUrl || undefined}
            userName={initialData?.full_name || 'User'}
            onAvatarChange={(url) => {
              setAvatarUrl(url)
              setValue('avatar_url', url || undefined)
            }}
            maxSizeMB={2}
          />

          <Separator />

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              {...register('full_name')}
              placeholder="Enter your full name"
              className="h-11"
            />
            {errors.full_name && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.full_name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="your@email.com"
              className="h-11"
              disabled
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">Email cannot be changed</p>
            {errors.email && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              placeholder="+212 6XX XXX XXX"
              className="h-11"
            />
            {errors.phone && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.phone.message}</p>
            )}
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Select
              value={initialData?.city || ''}
              onValueChange={(value) => setValue('city', value)}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select your city" />
              </SelectTrigger>
              <SelectContent>
                {MOROCCAN_CITIES.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.city && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.city.message}</p>
            )}
          </div>

          {/* WhatsApp */}
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp Number</Label>
            <Input
              id="whatsapp"
              type="tel"
              {...register('whatsapp')}
              placeholder="+212 6XX XXX XXX"
              className="h-11"
            />
            {errors.whatsapp && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.whatsapp.message}</p>
            )}
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio / Description</Label>
            <Textarea
              id="bio"
              {...register('bio')}
              placeholder="Tell us about yourself..."
              rows={4}
              className="resize-none"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {initialData?.bio?.length || 0}/500 characters
            </p>
            {errors.bio && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.bio.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Product Image Section */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
          <CardDescription>Upload images for your product listings</CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUpload
            label="Product Image"
            currentImage={productImage || undefined}
            onImageChange={(url) => {
              setProductImage(url)
              setValue('product_image', url || undefined)
            }}
            maxSizeMB={5}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Service Cover Image Section */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Service Cover Image</CardTitle>
          <CardDescription>Upload a cover image for your service listing</CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUpload
            label="Service Cover Image"
            currentImage={serviceCoverImage || undefined}
            onImageChange={(url) => {
              setServiceCoverImage(url)
              setValue('service_cover_image', url || undefined)
            }}
            maxSizeMB={5}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button
          type="submit"
          disabled={isLoading || isSubmitting}
          className="h-11 bg-blue-600 hover:bg-blue-700"
        >
          {isLoading || isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
