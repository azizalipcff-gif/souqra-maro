"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/utils/supabase/client'
import { uploadBusinessImage } from '@/lib/supabase/storage'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { ImageUpload } from '@/components/profile/ImageUpload'

const CATEGORIES = [
  'Electronics',
  'Photography',
  'Web Dev',
  'Cleaning',
  'Cars',
  'Design',
  'Food',
  'Other'
]

const CITIES = [
  'Casablanca',
  'Rabat',
  'Tanger',
  'Marrakech',
  'Agadir',
  'Fes',
  'Berkane',
  'Oujda',
  'Autre'
]

export function AddBusinessForm() {
  const { user, profile } = useAuth()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    city: '',
    price: '',
    whatsapp: profile?.whatsapp || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.id) {
      toast.error('You must be logged in to add a business')
      return
    }

    setLoading(true)

    try {
      let finalImageUrl = imageUrl

      // Upload image if provided
      if (imageUrl && imageUrl.startsWith('data:')) {
        const file = dataURLtoFile(imageUrl, 'business-image.jpg')
        const { url, error } = await uploadBusinessImage(file, user.id)
        
        if (error) {
          toast.error('Failed to upload image')
          setLoading(false)
          return
        }
        
        finalImageUrl = url
      }

      const { error } = await supabase
        .from('businesses')
        .insert({
          owner_id: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          city: formData.city,
          price: formData.price ? parseFloat(formData.price) : null,
          whatsapp: formData.whatsapp,
          image_url: finalImageUrl,
          status: 'active'
        })

      if (error) {
        console.error('Error adding business:', error)
        toast.error('Failed to add business')
      } else {
        toast.success('Business added successfully!')
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: '',
          city: '',
          price: '',
          whatsapp: profile?.whatsapp || ''
        })
        setImageUrl(null)
      }
    } catch (error) {
      console.error('Error adding business:', error)
      toast.error('Failed to add business')
    } finally {
      setLoading(false)
    }
  }

  const dataURLtoFile = (dataUrl: string, filename: string): File => {
    const arr = dataUrl.split(',')
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg'
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle>Add Business</CardTitle>
        <CardDescription>Create a new business listing for the marketplace</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Business name"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your business..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {CITIES.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (MAD)</Label>
            <Input
              id="price"
              type="number"
              placeholder="Optional price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp Number</Label>
            <Input
              id="whatsapp"
              type="tel"
              placeholder="+212 6XX XXX XXX"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <ImageUpload
              label="Business Image"
              currentImage={imageUrl || undefined}
              onImageChange={setImageUrl}
              maxSizeMB={5}
              accept="image/jpeg,image/png,image/webp"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Adding Business...' : 'Add Business'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
