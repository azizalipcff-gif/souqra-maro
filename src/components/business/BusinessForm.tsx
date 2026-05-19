"use client"

import { useState } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

export interface BusinessFormData {
  businessName: string
  category: string
  city: string
  phone: string
  whatsapp: string
  description: string
  logoUrl: string | null
  coverUrl: string | null
}

interface BusinessFormProps {
  onFormChange: (data: BusinessFormData) => void
}

export default function BusinessForm({ onFormChange }: BusinessFormProps) {
  const [formData, setFormData] = useState<BusinessFormData>({
    businessName: "",
    category: "",
    city: "",
    phone: "",
    whatsapp: "",
    description: "",
    logoUrl: null,
    coverUrl: null,
  })

  const handleInputChange = (field: keyof BusinessFormData, value: string | null) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    onFormChange(newData)
  }

  return (
    <div className="space-y-6">
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
                onClick={(e) => {
                  e.stopPropagation()
                  handleInputChange("logoUrl", null)
                }}
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
                onClick={(e) => {
                  e.stopPropagation()
                  handleInputChange("coverUrl", null)
                }}
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
  )
}
