"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Building2, MapPin, Phone, FileText, CheckCircle, Upload, X, Image as ImageIcon } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { getSupabase } from "@/lib/supabase/client"
import { uploadBusinessImage } from "@/lib/utils/image-upload"

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
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [userId, setUserId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    business_name: "",
    category: "",
    city: "",
    phone: "",
    description: ""
  })

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<{ logo: number, cover: number }>({ logo: 0, cover: 0 })
  const [uploadError, setUploadError] = useState("")

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const supabase = getSupabase()
      const { data } = await supabase.auth.getSession()
      const session = data?.session
      
      if (!session?.user) {
        setIsAuthenticated(false)
        router.push("/login?next=/add-business")
        return
      }

      setIsAuthenticated(true)
      setUserId(session.user.id)
    } catch (error) {
      console.error('Auth check error:', error)
      setIsAuthenticated(false)
      router.push("/login?next=/add-business")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Invalid file type. Only JPG, JPEG, PNG, and WebP are allowed.")
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size exceeds 5MB limit.")
      return
    }

    setUploadError("")
    setLogoFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Invalid file type. Only JPG, JPEG, PNG, and WebP are allowed.")
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size exceeds 5MB limit.")
      return
    }

    setUploadError("")
    setCoverFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setCoverPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removeLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
  }

  const removeCover = () => {
    setCoverFile(null)
    setCoverPreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setUploadError("")

    // Validate required fields
    if (!formData.business_name || !formData.category || !formData.city || !formData.phone || !formData.description) {
      setError("Please fill in all required fields")
      return
    }

    if (!userId) {
      setError("Authentication error. Please log in again.")
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = getSupabase()

      // First, create the business record to get the ID
      const { data: businessData, error: insertError } = await supabase
        .from('businesses')
        .insert({
          user_id: userId,
          business_name: formData.business_name,
          category: formData.category,
          city: formData.city,
          phone: formData.phone,
          description: formData.description,
          approved: true
        })
        .select()
        .single()

      if (insertError) throw insertError

      const businessId = businessData.id

      // Upload logo if provided
      let logoUrl = null
      if (logoFile) {
        try {
          const logoResult = await uploadBusinessImage(logoFile, "logo", businessId)
          logoUrl = logoResult.url
        } catch (error) {
          console.error('Logo upload error:', error)
          setUploadError("Failed to upload logo. Business created without logo.")
        }
      }

      // Upload cover if provided
      let coverUrl = null
      if (coverFile) {
        try {
          const coverResult = await uploadBusinessImage(coverFile, "cover", businessId)
          coverUrl = coverResult.url
        } catch (error) {
          console.error('Cover upload error:', error)
          setUploadError("Failed to upload cover image. Business created without cover.")
        }
      }

      // Update business with image URLs
      if (logoUrl || coverUrl) {
        const updateData: any = {}
        if (logoUrl) updateData.logo_url = logoUrl
        if (coverUrl) updateData.cover_url = coverUrl

        const { error: updateError } = await supabase
          .from('businesses')
          .update(updateData)
          .eq('id', businessId)

        if (updateError) throw updateError
      }

      setIsSuccess(true)
      setTimeout(() => {
        router.push('/businesses')
      }, 2000)
    } catch (error) {
      console.error('Error creating business:', error)
      setError("Failed to submit business. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-gray-600">Redirecting to login...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-green-200">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Business Submitted Successfully
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Your business has been submitted for review. We will review your submission and approve it shortly.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => router.push('/profile')}>
                    Back to Profile
                  </Button>
                  <Button variant="outline" onClick={() => router.push('/marketplace')}>
                    Browse Marketplace
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Your Business</h1>
            <p className="text-gray-600">Fill in the details below to list your business on SOUQORA</p>
          </div>

          <Card className="shadow-lg">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                {uploadError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{uploadError}</p>
                  </div>
                )}

                <div>
                  <Label htmlFor="business_name">Business Name *</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="business_name"
                      value={formData.business_name}
                      onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                      className="pl-10"
                      placeholder="Enter your business name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your business category" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
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
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-10"
                      placeholder="+212 XXX XXX XXX"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="pl-10 min-h-[120px]"
                      placeholder="Describe your business in a few sentences..."
                      required
                    />
                  </div>
                </div>

                {/* Logo Upload */}
                <div>
                  <Label>Business Logo (Optional)</Label>
                  <p className="text-sm text-gray-500 mb-2">Upload your business logo. JPG, JPEG, PNG, or WebP. Max 5MB.</p>
                  
                  {logoPreview ? (
                    <div className="relative mt-2">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-32 h-32 object-contain border-2 border-gray-200 rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="danger"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={removeLogo}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                          <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Click to upload logo</p>
                          <p className="text-xs text-gray-400 mt-1">JPG, JPEG, PNG, WebP (max 5MB)</p>
                        </div>
                      </label>
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                {/* Cover Upload */}
                <div>
                  <Label>Cover Image (Optional)</Label>
                  <p className="text-sm text-gray-500 mb-2">Upload a cover image for your business. JPG, JPEG, PNG, or WebP. Max 5MB.</p>
                  
                  {coverPreview ? (
                    <div className="relative mt-2">
                      <img
                        src={coverPreview}
                        alt="Cover preview"
                        className="w-full h-48 object-cover border-2 border-gray-200 rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="danger"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={removeCover}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <label htmlFor="cover-upload" className="cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                          <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Click to upload cover image</p>
                          <p className="text-xs text-gray-400 mt-1">JPG, JPEG, PNG, WebP (max 5MB)</p>
                        </div>
                      </label>
                      <input
                        id="cover-upload"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleCoverChange}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Business"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}
