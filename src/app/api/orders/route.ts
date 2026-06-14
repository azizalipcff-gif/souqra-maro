import { NextRequest, NextResponse } from 'next/server'
import { OrderRepository } from '@/lib/db/models'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const user_id = searchParams.get('user_id')
    const status = searchParams.get('status')

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    let orders = await OrderRepository.findByUserId(user_id)

    if (status) {
      orders = orders.filter(order => order.status === status)
    }

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Orders fetch error:', error)
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
      user_id,
      total,
      payment_method,
      shipping_address,
      notes,
      items,
    } = body

    // Validate required fields
    if (!user_id || !total || !payment_method || !shipping_address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate order number
    const order_number = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    const order = await OrderRepository.create({
      user_id,
      order_number,
      total,
      status: 'pending',
      payment_method,
      payment_status: 'pending',
      shipping_address,
      notes,
    })

    // TODO: Create order items

    return NextResponse.json(
      { order, message: 'Order created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
