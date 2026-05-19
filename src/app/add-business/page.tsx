"use client"

import { useState } from "react"
import BusinessForm, { BusinessFormData } from "@/components/business/BusinessForm"
import BusinessPreview from "@/components/business/BusinessPreview"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function AddBusinessPage() {
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

  const handleFormChange = (data: BusinessFormData) => {
    setFormData(data)
  }

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
            <div className="lg:col-span-2">
              <BusinessForm onFormChange={handleFormChange} />
            </div>

            {/* Live Preview Section */}
            <div className="lg:sticky lg:top-8 h-fit">
              <BusinessPreview data={formData} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
