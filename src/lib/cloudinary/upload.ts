import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export interface UploadResult {
  public_id: string
  url: string
  width: number
  height: number
  format: string
  bytes: number
}

export async function uploadImage(
  file: File | Buffer | string,
  options?: {
    folder?: string
    transformation?: any
    resource_type?: 'image' | 'video' | 'auto'
  }
): Promise<UploadResult> {
  try {
    let fileToUpload: string

    // Convert File or Buffer to base64 data URI if needed
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const base64 = buffer.toString('base64')
      fileToUpload = `data:${file.type};base64,${base64}`
    } else if (Buffer.isBuffer(file)) {
      const base64 = file.toString('base64')
      fileToUpload = `data:image/jpeg;base64,${base64}`
    } else {
      fileToUpload = file
    }

    const result = await cloudinary.uploader.upload(fileToUpload, {
      folder: options?.folder || 'souqora',
      transformation: options?.transformation || [
        { quality: 'auto', fetch_format: 'auto' },
        { width: 1200, crop: 'limit' },
      ],
      resource_type: options?.resource_type || 'image',
    })

    return {
      public_id: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload image')
  }
}

export async function uploadMultipleImages(
  files: (File | Buffer | string)[],
  options?: {
    folder?: string
    transformation?: any
  }
): Promise<UploadResult[]> {
  const uploadPromises = files.map((file) => uploadImage(file, options))
  return Promise.all(uploadPromises)
}

export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw new Error('Failed to delete image')
  }
}

export async function deleteMultipleImages(publicIds: string[]): Promise<void> {
  const deletePromises = publicIds.map((id) => deleteImage(id))
  await Promise.all(deletePromises)
}

export function getPublicIdFromUrl(url: string): string {
  // Extract public_id from Cloudinary URL
  const matches = url.match(/\/v\d+\/(.+)\.\w+/)
  return matches ? matches[1] : ''
}

export function getOptimizedImageUrl(
  publicId: string,
  options?: {
    width?: number
    height?: number
    quality?: number
    format?: string
  }
): string {
  const transformation = cloudinary.url(publicId, {
    transformation: [
      { quality: options?.quality || 'auto', fetch_format: options?.format || 'auto' },
      ...(options?.width ? [{ width: options.width, crop: 'limit' }] : []),
      ...(options?.height ? [{ height: options.height, crop: 'limit' }] : []),
    ],
  })

  return transformation
}
