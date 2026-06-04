import { getSupabase } from "@/lib/supabase/client"

const BUCKET_NAME = "business-images"
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

export interface UploadResult {
  url: string
  path: string
}

export interface UploadError {
  message: string
}

export async function uploadBusinessImage(
  file: File,
  type: "logo" | "cover",
  businessId: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Only JPG, JPEG, PNG, and WebP are allowed.")
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size exceeds 5MB limit.")
  }

  const supabase = getSupabase()
  const folder = type === "logo" ? "logos" : "covers"
  const fileExt = file.name.split(".").pop()
  const fileName = `${businessId}/${Date.now()}.${fileExt}`
  const filePath = `${folder}/${fileName}`

  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath)

    return {
      url: publicUrl,
      path: filePath
    }
  } catch (error) {
    console.error("Upload error:", error)
    throw new Error("Failed to upload image. Please try again.")
  }
}

export async function deleteBusinessImage(path: string): Promise<void> {
  const supabase = getSupabase()

  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path])

    if (error) throw error
  } catch (error) {
    console.error("Delete error:", error)
    throw new Error("Failed to delete image.")
  }
}
