"use client"

import { useState } from "react"
import { Upload, X, Phone, MessageCircle, MapPin, Briefcase, Star, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

// Moroccan cities list
const MOROCCAN_CITIES = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Fes",
  "Tangier",
  "Agadir",
  "Meknes",
  "Oujda",
  "Kenitra",
  "Tetouan",
  "El Jadida",
  "Safi",
  "Mohammedia",
  "Beni Mellal",
  "Nador",
]

// Business categories
const BUSINESS_CATEGORIES = [
  "Restaurant",
  "Café",
  "Hotel",
  "Shopping",
  "Services",
  "Healthcare",
  "Education",
  "Technology",
  "Real Estate",
  "Automotive",
  "Beauty",
  "Fitness",
  "Entertainment",
  "Other",
]

export default function AddBusinessPage() {
  // Demo state - in production, this would be actual auth state
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  
  // Form state for demo purposes only
  const [formData, setFormData] = useState({
    businessName: "",
    category: "",
    city: "",
    phone: "",
    whatsapp: "",
    description: "",
    logoUrl: null as string | null,
    coverUrl: null as string | null,
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Not logged in state
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Login Required</h2>
              <p className="text-gray-600 mb-8">
                You must login to add your business to Souqora
              </p>
              <Button 
                onClick={() => setIsLoggedIn(true)}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                Login to Continue
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Logged in state - Show full form
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Add Your Business</h1>
            <p className="text-gray-600 text-lg">
              List your business on Souqora and reach thousands of customers across Morocco
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Logo Upload */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <Label className="text-base font-semibold mb-4 block">Business Logo</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  {formData.logoUrl ? (
                    <div className="relative inline-block">
                      <img
                        src={formData.logoUrl}
                        alt="Logo preview"
                        className="w-32 h-32 object-contain mx-auto rounded-lg"
                      />
                      <button
                        onClick={() => handleInputChange("logoUrl", "")}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 font-medium mb-2">Upload your logo</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Image Upload */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <Label className="text-base font-semibold mb-4 block">Cover Image</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  {formData.coverUrl ? (
                    <div className="relative">
                      <img
                        src={formData.coverUrl}
                        alt="Cover preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleInputChange("coverUrl", "")}
                        className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 font-medium mb-2">Upload cover image</p>
                      <p className="text-sm text-gray-500">Recommended: 1200x400px</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Business Information */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
                
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange("businessName", e.target.value)}
                    placeholder="Enter your business name"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="mt-2">
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
                  <Label htmlFor="city">City *</Label>
                  <Select value={formData.city} onValueChange={(value) => handleInputChange("city", value)}>
                    <SelectTrigger className="mt-2">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+212 6XX XXX XXX"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="whatsapp">WhatsApp (Optional)</Label>
                    <Input
                      id="whatsapp"
                      value={formData.whatsapp}
                      onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                      placeholder="+212 6XX XXX XXX"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe your business, services, and what makes you unique..."
                    rows={4}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Image Gallery */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <Label className="text-base font-semibold mb-4 block">Business Gallery</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 font-medium mb-2">Drag & drop images here</p>
                  <p className="text-sm text-gray-500">or click to browse (up to 10 images)</p>
                </div>
              </div>

              {/* Submit Button */}
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-lg rounded-2xl">
                Submit Business
              </Button>
            </div>

            {/* Live Preview Section */}
            <div className="lg:sticky lg:top-8 h-fit">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Live Preview
                </h3>

                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  {/* Cover Image */}
                  {formData.coverUrl ? (
                    <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-50">
                      <img
                        src={formData.coverUrl}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">Cover Image</span>
                    </div>
                  )}

                  {/* Logo */}
                  <div className="relative -mt-12 px-6">
                    {formData.logoUrl ? (
                      <div className="w-24 h-24 rounded-xl bg-white shadow-lg overflow-hidden border-4 border-white">
                        <img
                          src={formData.logoUrl}
                          alt="Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-xl bg-white shadow-lg border-4 border-white flex items-center justify-center">
                        <Briefcase className="h-8 w-8 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Business Info */}
                  <div className="p-6 pt-8">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      {formData.businessName || "Business Name"}
                    </h4>

                    <div className="space-y-3 text-sm">
                      {formData.category && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Briefcase className="h-4 w-4 text-blue-600" />
                          <span>{formData.category}</span>
                        </div>
                      )}

                      {formData.city && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4 text-blue-600" />
                          <span>{formData.city}</span>
                        </div>
                      )}

                      {formData.phone && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-4 w-4 text-blue-600" />
                          <span>{formData.phone}</span>
                        </div>
                      )}

                      {formData.whatsapp && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MessageCircle className="h-4 w-4 text-green-600" />
                          <span>{formData.whatsapp}</span>
                        </div>
                      )}
                    </div>

                    {formData.description && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {formData.description}
                        </p>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                        Pending Approval
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
