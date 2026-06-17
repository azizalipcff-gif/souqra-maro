"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/utils/supabase/client'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Package, Plus, ArrowLeft, Upload, X, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const PRODUCT_CATEGORIES = [
  'Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Toys', 'Books',
  'Automotive', 'Health & Beauty', 'Food & Grocery', 'Pets', 'Music', 'Art'
]

const MOROCCAN_CITIES = [
  'Casablanca', 'Rabat', 'Fes', 'Marrakech', 'Tangier', 'Agadir', 'Meknes', 'Oujda', 'Kenitra', 'Tetouan',
  'Essaouira', 'Safi', 'Mohammedia', 'Beni Mellal', 'Nador', 'El Jadida', 'Taza', 'Khouribga', 'Settat', 'Larache'
]

export default function AddProductPage() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    city: '',
    phone: '',
    whatsapp: '',
    images: [] as string[]
  })

  const [imagePreview, setImagePreview] = useState<string[]>([])
  const [imageInput, setImageInput] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
  }, [user])

  const handleImageAdd = () => {
    if (imageInput && imagePreview.length < 5) {
      setImagePreview([...imagePreview, imageInput])
      setFormData({ ...formData, images: [...formData.images, imageInput] })
      setImageInput('')
    }
  }

  const handleImageRemove = (index: number) => {
    const newPreview = imagePreview.filter((_, i) => i !== index)
    const newImages = formData.images.filter((_, i) => i !== index)
    setImagePreview(newPreview)
    setFormData({ ...formData, images: newImages })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      // Validation
      if (!formData.title || !formData.description || !formData.category || !formData.price || !formData.city) {
        setError('Please fill in all required fields')
        setLoading(false)
        return
      }

      if (formData.images.length === 0) {
        setError('Please add at least one image')
        setLoading(false)
        return
      }

      const { error } = await supabase.from('products').insert({
        seller_id: user?.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        city: formData.city,
        images: formData.images,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        is_active: true,
        is_approved: false
      })

      if (error) {
        setError('Failed to create product')
        console.error('Error creating product:', error)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/profile')
        }, 2000)
      }
    } catch (error) {
      setError('Failed to create product')
      console.error('Error creating product:', error)
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
              <h1 className="text-3xl font-bold text-gray-900">Add Product</h1>
              <p className="text-gray-600">List a new product on the marketplace</p>
            </div>
          </div>

          {/* Product Form */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Product Details
              </CardTitle>
              <CardDescription>Fill in the product information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Product Title *</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter product title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="h-11"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your product in detail..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="resize-none"
                    required
                  />
                  <p className="text-sm text-gray-500">{formData.description.length}/500 characters</p>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })} required>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">Price (MAD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="h-11"
                    min="0"
                    step="0.01"
                    required
                  />
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
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+212 6XX XXX XXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-11"
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

                {/* Images */}
                <div className="space-y-4">
                  <Label>Product Images *</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="url"
                      placeholder="Enter image URL"
                      value={imageInput}
                      onChange={(e) => setImageInput(e.target.value)}
                      className="flex-1 h-11"
                    />
                    <Button
                      type="button"
                      onClick={handleImageAdd}
                      disabled={!imageInput || imagePreview.length >= 5}
                      className="h-11"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  
                  {imagePreview.length > 0 && (
                    <div className="grid grid-cols-5 gap-2">
                      {imagePreview.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => handleImageRemove(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-500">Add up to 5 images (URLs only)</p>
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
                    Product created successfully! Redirecting...
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
                        Creating Product...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-5 w-5" />
                        Create Product
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
