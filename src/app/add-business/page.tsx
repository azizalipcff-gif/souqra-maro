"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Upload, Plus, X, Check, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

const MOROCCAN_CITIES = [
  "Casablanca",
  "Rabat",
  "Tangier",
  "Marrakech",
  "Agadir",
  "Fes",
  "Oujda",
  "Meknes",
  "Kenitra",
  "Tetouan",
  "Safi",
  "El Jadida",
  "Beni Mellal",
  "Nador",
  "Berkane",
  "Al Hoceima",
  "Taza",
  "Essaouira",
  "Khouribga",
  "Settat",
]

const BUSINESS_CATEGORIES = [
  "Technology",
  "Restaurants & Food",
  "Retail",
  "Services",
  "Health & Wellness",
  "Education",
  "Entertainment",
  "Automotive",
  "Real Estate",
  "Professional Services",
  "Beauty & Fashion",
  "Home Services",
  "Other",
]

interface Service {
  id: string
  name: string
  description: string
  price: string
}

interface BusinessHours {
  day: string
  open: string
  close: string
  closed: boolean
}

export default function AddBusinessPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    fullDescription: "",
    category: "",
    tags: [] as string[],
    city: "",
    neighborhood: "",
    address: "",
    phone: "",
    whatsapp: "",
    email: "",
    website: "",
    instagram: "",
    facebook: "",
  })

  const [services, setServices] = useState<Service[]>([])
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([
    { day: "Monday", open: "09:00", close: "18:00", closed: false },
    { day: "Tuesday", open: "09:00", close: "18:00", closed: false },
    { day: "Wednesday", open: "09:00", close: "18:00", closed: false },
    { day: "Thursday", open: "09:00", close: "18:00", closed: false },
    { day: "Friday", open: "09:00", close: "18:00", closed: false },
    { day: "Saturday", open: "09:00", close: "18:00", closed: false },
    { day: "Sunday", open: "09:00", close: "18:00", closed: true },
  ])

  const [images, setImages] = useState<{
    logo: File | null
    cover: File | null
    gallery: File[]
  }>({
    logo: null,
    cover: null,
    gallery: [],
  })

  const [imagePreviews, setImagePreviews] = useState<{
    logo: string
    cover: string
    gallery: string[]
  }>({
    logo: "",
    cover: "",
    gallery: [],
  })

  const [tagInput, setTagInput] = useState("")
  const [currentStep, setCurrentStep] = useState(1)

  // Auth check
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login?redirect=/add-business")
      } else {
        setIsAuthenticated(true)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const handleImageUpload = (type: "logo" | "cover" | "gallery", file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB")
      return
    }

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      if (type === "gallery") {
        setImages((prev) => ({ ...prev, gallery: [...prev.gallery, file] }))
        setImagePreviews((prev) => ({
          ...prev,
          gallery: [...prev.gallery, reader.result as string],
        }))
      } else {
        setImages((prev) => ({ ...prev, [type]: file }))
        setImagePreviews((prev) => ({ ...prev, [type]: reader.result as string }))
      }
    }
    reader.readAsDataURL(file)
  }

  const removeImage = (type: "logo" | "cover" | "gallery", index?: number) => {
    if (type === "gallery" && index !== undefined) {
      setImages((prev) => ({
        ...prev,
        gallery: prev.gallery.filter((_, i) => i !== index),
      }))
      setImagePreviews((prev) => ({
        ...prev,
        gallery: prev.gallery.filter((_, i) => i !== index),
      }))
    } else {
      setImages((prev) => ({ ...prev, [type]: null }))
      setImagePreviews((prev) => ({ ...prev, [type]: "" }))
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const addService = () => {
    setServices((prev) => [
      ...prev,
      { id: Date.now().toString(), name: "", description: "", price: "" },
    ])
  }

  const updateService = (id: string, field: keyof Service, value: string) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, [field]: value } : service
      )
    )
  }

  const removeService = (id: string) => {
    setServices((prev) => prev.filter((service) => service.id !== id))
  }

  const updateBusinessHours = (index: number, field: keyof BusinessHours, value: string | boolean) => {
    setBusinessHours((prev) =>
      prev.map((hours, i) =>
        i === index ? { ...hours, [field]: value } : hours
      )
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // Validation
      if (!formData.name || !formData.shortDescription || !formData.category || !formData.city) {
        setError("Please fill in all required fields")
        setIsSubmitting(false)
        return
      }

      if (!images.logo) {
        setError("Please upload a business logo")
        setIsSubmitting(false)
        return
      }

      // Create FormData for file upload
      const uploadFormData = new FormData()
      
      if (images.logo) uploadFormData.append("logo", images.logo)
      if (images.cover) uploadFormData.append("cover", images.cover)
      images.gallery.forEach((file) => uploadFormData.append("gallery", file))

      // Upload images
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      })

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload images")
      }

      const uploadData = await uploadResponse.json()

      // Submit business data
      const businessData = {
        ...formData,
        services,
        businessHours,
        images: uploadData.images,
      }

      const response = await fetch("/api/businesses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(businessData),
      })

      if (!response.ok) {
        throw new Error("Failed to submit business")
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-royal-blue" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Business Submitted Successfully!</h1>
            <p className="text-gray-600 mb-8">
              Your business has been submitted and is waiting for admin approval. You will be notified once it's approved.
            </p>
            <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Add Your Business</h1>
            <p className="text-gray-600 text-lg">
              Grow your business and reach thousands of customers across Morocco.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Business Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your business name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="shortDescription">Short Description *</Label>
                  <Input
                    id="shortDescription"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
                    placeholder="Brief description (max 150 characters)"
                    maxLength={150}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="fullDescription">Full Description</Label>
                  <Textarea
                    id="fullDescription"
                    value={formData.fullDescription}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fullDescription: e.target.value }))}
                    placeholder="Detailed description of your business"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
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
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      placeholder="Add tags (press Enter)"
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag} <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Select
                    value={formData.city}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, city: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a city" />
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

                <div>
                  <Label htmlFor="neighborhood">Neighborhood</Label>
                  <Input
                    id="neighborhood"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData((prev) => ({ ...prev, neighborhood: e.target.value }))}
                    placeholder="Enter neighborhood"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter full address"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+212 6XX XXX XXX"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData((prev) => ({ ...prev, whatsapp: e.target.value }))}
                    placeholder="+212 6XX XXX XXX"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="business@example.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div>
                  <Label htmlFor="instagram">Instagram (Optional)</Label>
                  <Input
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) => setFormData((prev) => ({ ...prev, instagram: e.target.value }))}
                    placeholder="@yourbusiness"
                  />
                </div>

                <div>
                  <Label htmlFor="facebook">Facebook (Optional)</Label>
                  <Input
                    id="facebook"
                    value={formData.facebook}
                    onChange={(e) => setFormData((prev) => ({ ...prev, facebook: e.target.value }))}
                    placeholder="Your Facebook page"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Logo *</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-royal-blue transition-colors">
                    {imagePreviews.logo ? (
                      <div className="relative inline-block">
                        <img
                          src={imagePreviews.logo}
                          alt="Logo preview"
                          className="w-32 h-32 object-contain rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2"
                          onClick={() => removeImage("logo")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          Drag & drop or click to upload
                        </p>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleImageUpload("logo", e.target.files[0])}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label htmlFor="logo-upload">
                          <Button type="button" variant="outline" asChild>
                            <span>Choose File</span>
                          </Button>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Cover Image</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-royal-blue transition-colors">
                    {imagePreviews.cover ? (
                      <div className="relative">
                        <img
                          src={imagePreviews.cover}
                          alt="Cover preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => removeImage("cover")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          Drag & drop or click to upload
                        </p>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleImageUpload("cover", e.target.files[0])}
                          className="hidden"
                          id="cover-upload"
                        />
                        <label htmlFor="cover-upload">
                          <Button type="button" variant="outline" asChild>
                            <span>Choose File</span>
                          </Button>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Gallery Images</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-royal-blue transition-colors">
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Drag & drop or click to upload multiple images
                    </p>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        if (e.target.files) {
                          Array.from(e.target.files).forEach((file) => handleImageUpload("gallery", file))
                        }
                      }}
                      className="hidden"
                      id="gallery-upload"
                    />
                    <label htmlFor="gallery-upload">
                      <Button type="button" variant="outline" asChild>
                        <span>Choose Files</span>
                      </Button>
                    </label>
                  </div>
                  {imagePreviews.gallery.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-4">
                      {imagePreviews.gallery.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1"
                            onClick={() => removeImage("gallery", index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {services.map((service) => (
                  <div key={service.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <Input
                        placeholder="Service name"
                        value={service.name}
                        onChange={(e) => updateService(service.id, "name", e.target.value)}
                        className="flex-1 mr-2"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeService(service.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Service description"
                      value={service.description}
                      onChange={(e) => updateService(service.id, "description", e.target.value)}
                      rows={2}
                    />
                    <Input
                      placeholder="Price (e.g., 500 MAD)"
                      value={service.price}
                      onChange={(e) => updateService(service.id, "price", e.target.value)}
                    />
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addService} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card>
              <CardHeader>
                <CardTitle>Business Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {businessHours.map((hours, index) => (
                  <div key={hours.day} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-32 font-medium">{hours.day}</div>
                    {!hours.closed ? (
                      <>
                        <Input
                          type="time"
                          value={hours.open}
                          onChange={(e) => updateBusinessHours(index, "open", e.target.value)}
                          className="w-32"
                        />
                        <span>to</span>
                        <Input
                          type="time"
                          value={hours.close}
                          onChange={(e) => updateBusinessHours(index, "close", e.target.value)}
                          className="w-32"
                        />
                      </>
                    ) : (
                      <span className="text-gray-500">Closed</span>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateBusinessHours(index, "closed", !hours.closed)}
                    >
                      {hours.closed ? "Open" : "Closed"}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Business"
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
              </form>
            </div>

            {/* Live Preview */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {imagePreviews.cover && (
                      <div className="relative h-48 rounded-lg overflow-hidden">
                        <img
                          src={imagePreviews.cover}
                          alt="Cover"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-start gap-4">
                      {imagePreviews.logo && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          <img
                            src={imagePreviews.logo}
                            alt="Logo"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg truncate">
                          {formData.name || "Business Name"}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {formData.shortDescription || "Short description will appear here"}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">{formData.category || "Category"}</Badge>
                          {formData.city && <Badge variant="outline">{formData.city}</Badge>}
                        </div>
                      </div>
                    </div>

                    {formData.fullDescription && (
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {formData.fullDescription}
                      </p>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">📍</span>
                        <span>{formData.city || "City"}</span>
                        {formData.neighborhood && <span>, {formData.neighborhood}</span>}
                      </div>
                      {formData.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500">📞</span>
                          <span>{formData.phone}</span>
                        </div>
                      )}
                    </div>

                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {formData.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {services.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Services</h4>
                        <div className="space-y-2">
                          {services.slice(0, 3).map((service) => (
                            <div key={service.id} className="text-sm">
                              <div className="font-medium">{service.name || "Service name"}</div>
                              {service.price && <div className="text-gray-600">{service.price}</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
