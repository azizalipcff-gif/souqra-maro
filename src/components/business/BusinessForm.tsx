"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabase } from "@/lib/supabase/client"
import { validateBusinessData, MOROCCAN_CITIES_LIST, BUSINESS_CATEGORIES_LIST } from "@/lib/validations/business"
import { BusinessFormData } from "@/types/business"
import BusinessImages from "./BusinessImages"
import BusinessPreview from "./BusinessPreview"
import BusinessSuccess from "./BusinessSuccess"

interface BusinessFormProps {
  userId: string
}

export default function BusinessForm({ userId }: BusinessFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<BusinessFormData>({
    business_name: "",
    category: "",
    city: "",
    phone: "",
    whatsapp: "",
    description: "",
    logo_url: null,
    cover_url: null,
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

  const handleImageUpload = (type: "logo_url" | "cover_url", url: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: url,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validation = validateBusinessData(formData)
    if (!validation.valid) {
      const errorMessages = validation.errors.map(err => `${err.field}: ${err.message}`).join(', ')
      setErrorMessage(errorMessages)
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
          whatsapp: formData.whatsapp.trim() || null,
          description: formData.description.trim(),
          logo_url: formData.logo_url,
          cover_url: formData.cover_url,
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
      }
    } catch (error) {
      console.error("Unexpected error:", error)
      setErrorMessage("An unexpected error occurred")
      setStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === "success") {
    return <BusinessSuccess />
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div>
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Your Business</h2>
            
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
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUSINESS_CATEGORIES_LIST.map((category) => (
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
                  <SelectTrigger>
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOROCCAN_CITIES_LIST.map((city) => (
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
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">Format: +212 6XX XXX XXX or 06XX XXX XXX</p>
              </div>

              {/* WhatsApp */}
              <div>
                <Label htmlFor="whatsapp">WhatsApp (Optional)</Label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="+212 6XX XXX XXX"
                  disabled={isSubmitting}
                />
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
                  disabled={isSubmitting}
                />
              </div>

              {/* Images */}
              <BusinessImages
                logoUrl={formData.logo_url}
                coverUrl={formData.cover_url}
                onLogoUpload={(url) => handleImageUpload("logo_url", url)}
                onCoverUpload={(url) => handleImageUpload("cover_url", url)}
                disabled={isSubmitting}
              />

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

        {/* Preview Section */}
        <div className="lg:sticky lg:top-8 h-fit">
          <BusinessPreview formData={formData} />
        </div>
      </div>
    </div>
  )
}
