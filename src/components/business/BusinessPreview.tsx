import { Phone, MessageCircle, MapPin, Briefcase } from "lucide-react"
import { BusinessFormData } from "./BusinessForm"

interface BusinessPreviewProps {
  data: BusinessFormData
}

export default function BusinessPreview({ data }: BusinessPreviewProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <span className="text-yellow-500">★</span>
        Live Preview
      </h3>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        {/* Cover Image */}
        {data.coverUrl ? (
          <div className="h-48">
            <img
              src={data.coverUrl}
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
          {data.logoUrl ? (
            <div className="w-24 h-24 rounded-xl bg-white shadow-lg overflow-hidden border-4 border-white">
              <img
                src={data.logoUrl}
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
            {data.businessName || "Business Name"}
          </h4>

          <div className="space-y-3 text-sm">
            {data.category && (
              <div className="flex items-center gap-2 text-gray-600">
                <Briefcase className="h-4 w-4 text-blue-600" />
                <span>{data.category}</span>
              </div>
            )}

            {data.city && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span>{data.city}</span>
              </div>
            )}

            {data.phone && (
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4 text-blue-600" />
                <span>{data.phone}</span>
              </div>
            )}

            {data.whatsapp && (
              <div className="flex items-center gap-2 text-gray-600">
                <MessageCircle className="h-4 w-4 text-green-600" />
                <span>{data.whatsapp}</span>
              </div>
            )}
          </div>

          {data.description && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600 line-clamp-3">
                {data.description}
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
  )
}
