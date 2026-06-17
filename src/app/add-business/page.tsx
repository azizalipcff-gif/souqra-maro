"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Loader2, Building2, MapPin, Phone, FileText, CheckCircle, Upload, X, Image as ImageIcon, ArrowLeft, Plus, Store } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from '@/utils/supabase/client'
import Link from "next/link"

const BUSINESS_CATEGORIES = [
  "Restaurants",
  "Cafés",
  "Hotels",
  "Beauty",
  "Mechanics",
  "Electronics",
  "Real Estate",
  "Fitness",
  "Education",
  "Healthcare",
  "Local Services",
  "Retail",
  "Other"
]

const MOROCCAN_CITIES = [
  "Casablanca", "Rabat", "Tangier", "Marrakech", "Agadir", "Fes", "Oujda",
  "Kenitra", "Tetouan", "Safi", "Meknes", "El Jadida", "Beni Mellal", "Nador",
  "Ouarzazate", "Taza", "Essaouira", "Al Hoceima", "Khouribga", "Settat", "Berkane"
]

export default function AddBusinessPage() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    business_name: "",
    category: "",
    city: "",
    phone: "",
    whatsapp: "",
    description: "",
    logo_url: "",
    cover_url: ""
  })

  const [imagePreview, setImagePreview] = useState<{ logo: string, cover: string }>({ logo: '', cover: '' })
  const [imageInput, setImageInput] = useState('')
  const [imageType, setImageType] = useState<'logo' | 'cover'>('logo')

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
  }, [user])

  const handleImageAdd = () => {
    if (imageInput) {
      if (imageType === 'logo') {
        setImagePreview({ ...imagePreview, logo: imageInput })
        setFormData({ ...formData, logo_url: imageInput })
      } else {
        setImagePreview({ ...imagePreview, cover: imageInput })
        setFormData({ ...formData, cover_url: imageInput })
      }
      setImageInput('')
    }
  }

  const handleImageRemove = (type: 'logo' | 'cover') => {
    if (type === 'logo') {
      setImagePreview({ ...imagePreview, logo: '' })
      setFormData({ ...formData, logo_url: '' })
    } else {
      setImagePreview({ ...imagePreview, cover: '' })
      setFormData({ ...formData, cover_url: '' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      if (!formData.business_name || !formData.category || !formData.city || !formData.phone || !formData.description) {
        setError('Please fill in all required fields')
        setLoading(false)
        return
      }

      const { error } = await supabase.from('businesses').insert({
        owner_id: user?.id,
        name: formData.business_name,
        category: formData.category,
        city: formData.city,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        description: formData.description,
        logo_url: formData.logo_url,
        cover_url: formData.cover_url,
        approved: false,
        status: 'pending'
      })

      if (error) {
        setError('Failed to create business')
        console.error('Error creating business:', error)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/profile')
        }, 2000)
      }
    } catch (error) {
      setError('Failed to create business')
      console.error('Error creating business:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Link href="/profile">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add Business</h1>
              <p className="text-gray-600">List your business on the marketplace</p>
            </div>
          </div>

          {/* Business Form */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Store className="h-5 w-5 mr-2" />
                Business Details
              </CardTitle>
              <CardDescription>Fill in your business information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Business Name */}
                <div className="space-y-2">
                  <Label htmlFor="business_name">Business Name *</Label>
                  <Input
                    id="business_name"
                    type="text"
                    placeholder="Enter your business name"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    className="h-11"
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })} required>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })} required>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select your city" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOROCCAN_CITIES.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+212 6XX XXX XXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-11"
                    required
                  />
                </div>

                {/* WhatsApp */}
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder="+212 6XX XXX XXX"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="h-11"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your business in detail..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="resize-none"
                    required
                  />
                  <p className="text-sm text-gray-500">{formData.description.length}/500 characters</p>
                </div>

                {/* Logo */}
                <div className="space-y-4">
                  <Label>Business Logo</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="url"
                      placeholder="Enter logo URL"
                      value={imageType === 'logo' ? imageInput : ''}
                      onChange={(e) => {
                        setImageInput(e.target.value)
                        setImageType('logo')
                      }}
                      className="flex-1 h-11"
                    />
                    <Button
                      type="button"
                      onClick={() => setImageType('logo')}
                      className="h-11"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Logo
                    </Button>
                  </div>
                  
                  {imagePreview.logo && (
                    <div className="relative inline-block">
                      <img
                        src={imagePreview.logo}
                        alt="Logo preview"
                        className="w-32 h-32 object-contain rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageRemove('logo')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Cover */}
                <div className="space-y-4">
                  <Label>Cover Image</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="url"
                      placeholder="Enter cover image URL"
                      value={imageType === 'cover' ? imageInput : ''}
                      onChange={(e) => {
                        setImageInput(e.target.value)
                        setImageType('cover')
                      }}
                      className="flex-1 h-11"
                    />
                    <Button
                      type="button"
                      onClick={() => setImageType('cover')}
                      className="h-11"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Cover
                    </Button>
                  </div>
                  
                  {imagePreview.cover && (
                    <div className="relative">
                      <img
                        src={imagePreview.cover}
                        alt="Cover preview"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageRemove('cover')}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Error and Success Messages */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Business created successfully! Redirecting...
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <Link href="/profile">
                    <Button variant="outline" className="h-11">
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-11 bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating Business...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-5 w-5" />
                        Create Business
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}
