import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase/client'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication using Supabase
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabaseServer = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    )

    const { data: { user }, error: authError } = await supabaseServer.auth.getUser()
    if (authError || !user) {
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

    // Create business in Supabase
    const { data: business, error: businessError } = await supabaseServer
      .from('businesses')
      .insert({
        owner_id: user.id,
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
        status: 'pending',
        approved: false,
        verified: false,
        featured: false,
        rating: 0,
        views: 0,
      })
      .select()
      .single()

    if (businessError) {
      console.error('Business creation error:', businessError)
      return NextResponse.json(
        { error: 'Failed to create business' },
        { status: 500 }
      )
    }

    // Insert business images
    if (body.images && body.images.logo) {
      await supabaseServer.from('business_images').insert({
        business_id: business.id,
        image_type: 'logo',
        image_url: body.images.logo,
        order_index: 0,
      })
    }

    if (body.images && body.images.cover) {
      await supabaseServer.from('business_images').insert({
        business_id: business.id,
        image_type: 'cover',
        image_url: body.images.cover,
        order_index: 0,
      })
    }

    if (body.images && body.images.gallery && body.images.gallery.length > 0) {
      const galleryImages = body.images.gallery.map((url: string, index: number) => ({
        business_id: business.id,
        image_type: 'gallery',
        image_url: url,
        order_index: index,
      }))
      await supabaseServer.from('business_images').insert(galleryImages)
    }

    // Insert business services
    if (body.services && body.services.length > 0) {
      const services = body.services.map((service: any, index: number) => ({
        business_id: business.id,
        name: service.name,
        description: service.description,
        price: service.price,
        order_index: index,
      }))
      await supabaseServer.from('business_services').insert(services)
    }

    // Insert business tags
    if (body.tags && body.tags.length > 0) {
      const tags = body.tags.map((tag: string) => ({
        business_id: business.id,
        tag,
      }))
      await supabaseServer.from('business_tags').insert(tags)
    }

    // Insert business hours
    if (body.businessHours && body.businessHours.length > 0) {
      const hours = body.businessHours.map((hour: any) => ({
        business_id: business.id,
        day: hour.day,
        open_time: hour.open,
        close_time: hour.close,
        is_closed: hour.closed,
      }))
      await supabaseServer.from('business_hours').insert(hours)
    }

    return NextResponse.json({
      success: true,
      business,
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

    // Build query
    let query = getSupabase()
      .from('businesses')
      .select(`
        *,
        business_images (
          image_type,
          image_url,
          order_index
        ),
        business_services (
          name,
          description,
          price,
          order_index
        ),
        business_tags (
          tag
        ),
        business_hours (
          day,
          open_time,
          close_time,
          is_closed
        )
      `)

    // Apply filters
    if (city) {
      query = query.eq('city', city)
    }
    if (category) {
      query = query.eq('category', category)
    }
    if (status) {
      query = query.eq('status', status)
    }
    if (approved === 'true') {
      query = query.eq('approved', true)
    }

    // Only show approved and active businesses by default
    if (!status && !approved) {
      query = query.eq('approved', true).eq('status', 'active')
    }

    const { data: businesses, error } = await query

    if (error) {
      console.error('Business fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch businesses' },
        { status: 500 }
      )
    }

    return NextResponse.json({ businesses })
  } catch (error) {
    console.error('Business fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
