import { getSupabase } from "@/lib/supabase/client"

export async function uploadImage(file: File, type: "logo" | "cover"): Promise<string> {
  const supabase = getSupabase()
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${type}-${Date.now()}.${fileExt}`
  const filePath = `business-${type}s}/${fileName}`

  const { data, error } = await supabase.storage
    .from('business-images')
    .upload(filePath, file)

  if (error) {
    console.error('Upload error:', error)
    throw new Error('Failed to upload image')
  }

  const { data: { publicUrl } } = supabase.storage
    .from('business-images')
    .getPublicUrl(data.path)

  return publicUrl
}
