"use client"

import { useState } from "react"
import { Loader2, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabase } from "@/lib/supabase/client"

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
  "Construction",
  "Professional Services",
  "Beauty & Fashion",
  "Home & Garden",
  "Sports & Fitness",
  "Travel & Tourism",
  "Other",
]

interface BusinessFormProps {
  userId: string
}

export default function BusinessForm({ userId }: BusinessFormProps) {
  const [formData, setFormData] = useState({
    business_name: "",
    category: "",
    city: "",
    phone: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const validateForm = () => {
    if (!formData.business_name.trim()) {
      setErrorMessage("Business name is required")
      return false
    }
    if (!formData.category) {
      setErrorMessage("Category is required")
      return false
    }
    if (!formData.city) {
      setErrorMessage("City is required")
      return false
    }
    if (!formData.phone.trim()) {
      setErrorMessage("Phone number is required")
      return false
    }
    // Validate Moroccan phone format
    const phoneRegex = /^(\+212|0)?[6-7]\d{8}$/
    if (!phoneRegex.test(formData.phone)) {
      setErrorMessage("Invalid Moroccan phone number format")
      return false
    }
    if (!formData.description.trim()) {
      setErrorMessage("Description is required")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setStatus("error")
      return
    }

    setIsSubmitting(true)
    setStatus("idle")
    setErrorMessage("")

    try {
      const supabase = getSupabase()
      
      const { data, error } = await supabase
        .from("businesses")
        .insert({
          user_id: userId,
          business_name: formData.business_name.trim(),
          category: formData.category,
          city: formData.city,
          phone: formData.phone.trim(),
          description: formData.description.trim(),
          approved: false,
        })
        .select()
        .single()

      if (error) {
        console.error("Business creation error:", error)
        setErrorMessage(error.message || "Failed to create business")
        setStatus("error")
      } else {
        console.log("Business created successfully:", data)
        setStatus("success")
        // Reset form
        setFormData({
          business_name: "",
          category: "",
          city: "",
          phone: "",
          description: "",
        })
      }
    } catch (error) {
      console.error("Unexpected error:", error)
      setErrorMessage("An unexpected error occurred")
      setStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Your Business</h2>
        
        {status === "success" && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-800">Business Submitted Successfully!</p>
              <p className="text-sm text-green-700 mt-1">
                Your business has been submitted and is waiting for admin approval. You will be notified once it's approved.
              </p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Name */}
          <div>
            <Label htmlFor="business_name">Business Name *</Label>
            <Input
              id="business_name"
              name="business_name"
              type="text"
              value={formData.business_name}
              onChange={handleChange}
              placeholder="Enter your business name"
              className="mt-1"
              disabled={isSubmitting}
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange("category", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger className="mt-1">
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

          {/* City */}
          <div>
            <Label htmlFor="city">City *</Label>
            <Select
              value={formData.city}
              onValueChange={(value) => handleSelectChange("city", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger className="mt-1">
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

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+212 6XX XXX XXX"
              className="mt-1"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">Format: +212 6XX XXX XXX or 06XX XXX XXX</p>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your business..."
              rows={4}
              className="mt-1"
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Business"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
