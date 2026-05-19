"use client"

import { useState } from "react"
import { Upload, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { uploadImage } from "@/lib/utils/upload"

interface BusinessImagesProps {
  logoUrl: string | null
  coverUrl: string | null
  onLogoUpload: (url: string) => void
  onCoverUpload: (url: string) => void
  disabled: boolean
}

export default function BusinessImages({
  logoUrl,
  coverUrl,
  onLogoUpload,
  onCoverUpload,
  disabled
}: BusinessImagesProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadType, setUploadType] = useState<"logo" | "cover" | null>(null)

  const handleFileUpload = async (type: "logo" | "cover", file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB")
      return
    }

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed")
      return
    }

    setIsUploading(true)
    setUploadType(type)

    try {
      const url = await uploadImage(file, type)
      if (type === "logo") {
        onLogoUpload(url)
      } else {
        onCoverUpload(url)
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload image")
    } finally {
      setIsUploading(false)
      setUploadType(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Logo Upload */}
      <div>
        <Label>Logo</Label>
        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          {logoUrl ? (
            <div className="relative inline-block">
              <img
                src={logoUrl}
                alt="Logo preview"
                className="w-32 h-32 object-contain mx-auto rounded-lg"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => onLogoUpload("")}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : (
            <div>
              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Upload your logo
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && handleFileUpload("logo", e.target.files[0])}
                disabled={disabled || isUploading}
                className="max-w-xs mx-auto"
              />
            </div>
          )}
        </div>
      </div>

      {/* Cover Image Upload */}
      <div>
        <Label>Cover Image</Label>
        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          {coverUrl ? (
            <div className="relative">
              <img
                src={coverUrl}
                alt="Cover preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => onCoverUpload("")}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : (
            <div>
              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Upload cover image
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && handleFileUpload("cover", e.target.files[0])}
                disabled={disabled || isUploading}
                className="max-w-xs mx-auto"
              />
            </div>
          )}
        </div>
      </div>

      {isUploading && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Uploading {uploadType}...</span>
        </div>
      )}
    </div>
  )
}
