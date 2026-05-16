import { NextRequest, NextResponse } from 'next/server'
import { ProductRepository } from '@/lib/db/models'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await ProductRepository.findById(params.id)

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await ProductRepository.update(params.id, {
      views_count: product.views_count + 1,
    } as any)

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const product = await ProductRepository.update(params.id, body)

    return NextResponse.json({
      product,
      message: 'Product updated successfully'
    })
  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ProductRepository.delete(params.id)

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Product deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
