import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const city = searchParams.get('city')
    const category = searchParams.get('category')

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    // Build search query with filters
    let dbQuery = getSupabase()
      .from('businesses')
      .select(`
        *,
        business_images (
          image_type,
          image_url,
          order_index
        ),
        business_tags (
          tag
        )
      `)
      .eq('approved', true)
      .eq('status', 'active')

    // Add text search
    dbQuery = dbQuery.or(`name.ilike.%${query}%,short_description.ilike.%${query}%,full_description.ilike.%${query}%`)

    // Add filters
    if (city) {
      dbQuery = dbQuery.eq('city', city)
    }
    if (category) {
      dbQuery = dbQuery.eq('category', category)
    }

    const { data: businesses, error } = await dbQuery

    if (error) {
      console.error('Search error:', error)
      return NextResponse.json(
        { error: 'Search failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({ businesses })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
