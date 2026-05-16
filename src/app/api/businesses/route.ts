import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/security/auth'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate required fields
    const requiredFields = ['name', 'shortDescription', 'category', 'city', 'phone', 'email']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate Moroccan phone format
    const phoneRegex = /^(\+212|0)?[6-7]\d{8}$/
    if (!phoneRegex.test(body.phone)) {
      return NextResponse.json(
        { error: 'Invalid Moroccan phone number format' },
        { status: 400 }
      )
    }

    // Generate slug from business name
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Create business data
    const businessData = {
      id: crypto.randomUUID(),
      owner_id: user.userId,
      name: body.name,
      slug,
      short_description: body.shortDescription,
      full_description: body.fullDescription || '',
      category: body.category,
      city: body.city,
      neighborhood: body.neighborhood || '',
      address: body.address || '',
      phone: body.phone,
      whatsapp: body.whatsapp || '',
      email: body.email,
      website: body.website || '',
      instagram: body.instagram || '',
      facebook: body.facebook || '',
      tags: body.tags || [],
      images: body.images || {},
      services: body.services || [],
      business_hours: body.businessHours || [],
      status: 'pending',
      approved: false,
      verified: false,
      featured: false,
      rating: 0,
      views: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // TODO: Save to database
    // For now, return success response
    // In production, this would insert into PostgreSQL

    return NextResponse.json({
      success: true,
      business: businessData,
      message: 'Business submitted successfully and is waiting for admin approval',
    })
  } catch (error) {
    console.error('Business submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const city = searchParams.get('city')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const approved = searchParams.get('approved')

    // TODO: Fetch from database
    // For now, return mock data
    const businesses: any[] = []

    return NextResponse.json({ businesses })
  } catch (error) {
    console.error('Business fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
