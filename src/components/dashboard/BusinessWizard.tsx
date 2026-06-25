"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/utils/supabase/client'
import { uploadBusinessImage } from '@/lib/supabase/storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, ArrowLeft, ArrowRight, CheckCircle, Upload, X, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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

export function BusinessWizard() {
  const { user } = useAuth()
  const supabase = createClient()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    // Step 1
    businessName: '',
    category: '',
    description: '',
    // Step 2
    logo: '',
    images: [] as string[],
    // Step 3
    address: '',
    city: '',
    phone: '',
    whatsapp: '',
    // Step 4
    website: '',
    workingHours: '',
    // Step 5
    locationMap: ''
  })

  const totalSteps = 5

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      // Upload logo
      let logoUrl = formData.logo
      if (formData.logo && formData.logo.startsWith('data:')) {
        const file = dataURLtoFile(formData.logo, 'business-logo.jpg')
        const { url, error } = await uploadBusinessImage(file, user?.id || '')
        if (error) throw error
        logoUrl = url
      }

      // Upload images
      const imageUrls = []
      for (const imageData of formData.images) {
        if (imageData.startsWith('data:')) {
          const file = dataURLtoFile(imageData, 'business-image.jpg')
          const { url, error } = await uploadBusinessImage(file, user?.id || '')
          if (error) throw error
          imageUrls.push(url)
        } else {
          imageUrls.push(imageData)
        }
      }

      const { error } = await supabase
        .from('businesses')
        .insert({
          owner_id: user?.id,
          title: formData.businessName,
          description: formData.description,
          category: formData.category,
          city: formData.city,
          whatsapp: formData.whatsapp,
          image_url: logoUrl || imageUrls[0] || null,
          status: 'pending'
        })

      if (error) throw error

      toast.success('Business submitted for review! It will appear in the marketplace after approval.')
      // Reset form or redirect
    } catch (error) {
      console.error('Error submitting business:', error)
      toast.error('Failed to submit business')
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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, logo: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result as string]
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo formData={formData} setFormData={setFormData} />
      case 2:
        return <Step2Media formData={formData} setFormData={setFormData} onLogoUpload={handleLogoUpload} onImageUpload={handleImageUpload} onRemoveImage={removeImage} />
      case 3:
        return <Step3Location formData={formData} setFormData={setFormData} />
      case 4:
        return <Step4Contact formData={formData} setFormData={setFormData} />
      case 5:
        return <Step5Review formData={formData} />
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Business</CardTitle>
          <div className="flex items-center gap-2 mt-4">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  i + 1 <= currentStep ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Step {currentStep} of {totalSteps}
          </p>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            {currentStep === totalSteps ? (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                {loading ? 'Submitting...' : 'Submit for Review'}
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Step Components
function Step1BasicInfo({ formData, setFormData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="e.g., Casa Electronics"
              required
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
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your business..."
              rows={6}
              required
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function Step2Media({ formData, setFormData, onLogoUpload, onImageUpload, onRemoveImage }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Media</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Business Logo</Label>
            <div className="flex items-center gap-4">
              {formData.logo ? (
                <div className="relative w-32 h-32">
                  <img
                    src={formData.logo}
                    alt="Logo preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Button
                    size="icon"
                    variant="danger"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData({ ...formData, logo: '' })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Upload Logo</p>
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Business Images</Label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={onImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload images</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PNG, JPG, WEBP (max 5MB each)</p>
              </label>
            </div>
          </div>

          {formData.images.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {formData.images.map((image: string, index: number) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    size="icon"
                    variant="danger"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onRemoveImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Step3Location({ formData, setFormData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Location</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Main Street"
            />
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
            <Label htmlFor="locationMap">Location Map (Optional)</Label>
            <Input
              id="locationMap"
              value={formData.locationMap}
              onChange={(e) => setFormData({ ...formData, locationMap: e.target.value })}
              placeholder="Google Maps link"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function Step4Contact({ formData, setFormData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+212 6XX XXX XXX"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              type="tel"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="+212 6XX XXX XXX"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website (Optional)</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://yourbusiness.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workingHours">Working Hours</Label>
            <Input
              id="workingHours"
              value={formData.workingHours}
              onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
              placeholder="e.g., 9:00 AM - 5:00 PM"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function Step5Review({ formData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Review & Publish</h3>
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Basic Information</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Business Name:</span> {formData.businessName}</p>
                <p><span className="text-gray-500">Category:</span> {formData.category}</p>
                <p><span className="text-gray-500">Description:</span> {formData.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Location</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Address:</span> {formData.address || 'Not provided'}</p>
                <p><span className="text-gray-500">City:</span> {formData.city}</p>
                {formData.locationMap && <p><span className="text-gray-500">Map:</span> {formData.locationMap}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Contact</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Phone:</span> {formData.phone || 'Not provided'}</p>
                <p><span className="text-gray-500">WhatsApp:</span> {formData.whatsapp || 'Not provided'}</p>
                <p><span className="text-gray-500">Website:</span> {formData.website || 'Not provided'}</p>
                <p><span className="text-gray-500">Working Hours:</span> {formData.workingHours || 'Not provided'}</p>
              </div>
            </CardContent>
          </Card>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Note:</strong> Your business will be submitted for review. It will appear in the marketplace after admin approval.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
