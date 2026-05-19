import { BusinessFormData } from "@/types/business"

interface BusinessPreviewProps {
  formData: BusinessFormData
}

export default function BusinessPreview({ formData }: BusinessPreviewProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 sticky top-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Live Preview</h3>
      
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Cover Image */}
        {formData.cover_url ? (
          <div className="h-48 bg-gray-100">
            <img
              src={formData.cover_url}
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
          {formData.logo_url ? (
            <div className="w-24 h-24 rounded-lg bg-white shadow-lg overflow-hidden border-4 border-white">
              <img
                src={formData.logo_url}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-lg bg-white shadow-lg border-4 border-white flex items-center justify-center">
              <span className="text-gray-300 text-xs">Logo</span>
            </div>
          )}
        </div>

        {/* Business Info */}
        <div className="p-6 pt-8">
          <h4 className="text-xl font-bold text-gray-900 mb-2">
            {formData.business_name || "Business Name"}
          </h4>
          
          <div className="space-y-2 text-sm">
            {formData.category && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Category:</span>
                <span className="font-medium text-gray-900">{formData.category}</span>
              </div>
            )}
            
            {formData.city && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">City:</span>
                <span className="font-medium text-gray-900">{formData.city}</span>
              </div>
            )}
            
            {formData.phone && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Phone:</span>
                <span className="font-medium text-gray-900">{formData.phone}</span>
              </div>
            )}
            
            {formData.whatsapp && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">WhatsApp:</span>
                <span className="font-medium text-gray-900">{formData.whatsapp}</span>
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
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              Pending Approval
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
