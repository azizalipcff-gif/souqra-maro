import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export async function uploadBusinessImage(
  file: File,
  userId: string
): Promise<{ url: string; error: string | null }> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${userId}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('business-images')
      .upload(filePath, file)

    if (uploadError) {
      console.error('Error uploading business image:', uploadError)
      return { url: '', error: uploadError.message }
    }

    const { data: { publicUrl } } = supabase.storage
      .from('business-images')
      .getPublicUrl(filePath)

    return { url: publicUrl, error: null }
  } catch (error) {
    console.error('Error uploading business image:', error)
    return { url: '', error: 'Failed to upload image' }
  }
}

export async function uploadServiceImage(
  file: File,
  userId: string
): Promise<{ url: string; error: string | null }> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${userId}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('service-images')
      .upload(filePath, file)

    if (uploadError) {
      console.error('Error uploading service image:', uploadError)
      return { url: '', error: uploadError.message }
    }

    const { data: { publicUrl } } = supabase.storage
      .from('service-images')
      .getPublicUrl(filePath)

    return { url: publicUrl, error: null }
  } catch (error) {
    console.error('Error uploading service image:', error)
    return { url: '', error: 'Failed to upload image' }
  }
}

export async function uploadProfileImage(
  file: File,
  userId: string
): Promise<{ url: string; error: string | null }> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${userId}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload(filePath, file)

    if (uploadError) {
      console.error('Error uploading profile image:', uploadError)
      return { url: '', error: uploadError.message }
    }

    const { data: { publicUrl } } = supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath)

    return { url: publicUrl, error: null }
  } catch (error) {
    console.error('Error uploading profile image:', error)
    return { url: '', error: 'Failed to upload image' }
  }
}
