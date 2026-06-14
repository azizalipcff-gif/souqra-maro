import { NextRequest, NextResponse } from 'next/server'
import { uploadImage, uploadMultipleImages } from '@/lib/cloudinary/upload'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    // Validate file types and sizes
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    const maxSize = 5 * 1024 * 1024 // 5MB

    const validFiles: File[] = []
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.type}. Allowed types: ${allowedTypes.join(', ')}` },
          { status: 400 }
        )
      }

      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `File too large: ${file.name}. Maximum size: 5MB` },
          { status: 400 }
        )
      }

      validFiles.push(file)
    }

    // Upload images
    const results = await uploadMultipleImages(validFiles, {
      folder: 'souqora/uploads',
    })

    return NextResponse.json({
      success: true,
      images: results,
      message: `${results.length} image(s) uploaded successfully`,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload images' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { publicIds } = body

    if (!publicIds || !Array.isArray(publicIds)) {
      return NextResponse.json(
        { error: 'Invalid request. publicIds array required' },
        { status: 400 }
      )
    }

    const { deleteImage, deleteMultipleImages } = await import('@/lib/cloudinary/upload')
    await deleteMultipleImages(publicIds)

    return NextResponse.json({
      success: true,
      message: `${publicIds.length} image(s) deleted successfully`,
    })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete images' },
      { status: 500 }
    )
  }
}
