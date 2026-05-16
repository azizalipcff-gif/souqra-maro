import { NextRequest, NextResponse } from 'next/server'
import { ProductRepository } from '@/lib/db/models'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category_id = searchParams.get('category_id')
    const seller_id = searchParams.get('seller_id')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const products = await ProductRepository.findAll({
      category_id: category_id || undefined,
      seller_id: seller_id || undefined,
      featured: featured === 'true',
    })

    // Apply pagination
    const paginatedProducts = products.slice(offset, offset + limit)

    return NextResponse.json({
      products: paginatedProducts,
      total: products.length,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      seller_id,
      category_id,
      title,
      description,
      price,
      original_price,
      images,
      condition,
      stock,
      location,
    } = body

    // Validate required fields
    if (!seller_id || !title || !price || !images || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const product = await ProductRepository.create({
      seller_id,
      category_id,
      title,
      description,
      price,
      original_price,
      images,
      condition: condition || 'new',
      stock: stock || 0,
      location,
    })

    return NextResponse.json(
      { product, message: 'Product created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
