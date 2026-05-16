import { NextRequest, NextResponse } from 'next/server'
import { createPayPalOrder, capturePayPalOrder } from '@/lib/payments/paypal'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, description, action } = body

    if (action === 'create') {
      if (!amount || amount <= 0) {
        return NextResponse.json(
          { error: 'Invalid amount' },
          { status: 400 }
        )
      }

      const order = await createPayPalOrder(
        amount,
        currency || 'MAD',
        description
      )

      return NextResponse.json({
        success: true,
        approvalUrl: order.approvalUrl,
        orderId: order.orderId,
      })
    }

    if (action === 'capture') {
      const { orderId } = body
      if (!orderId) {
        return NextResponse.json(
          { error: 'Order ID required' },
          { status: 400 }
        )
      }

      const result = await capturePayPalOrder(orderId)

      return NextResponse.json({
        success: true,
        data: result,
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('PayPal payment error:', error)
    return NextResponse.json(
      { error: 'Failed to process PayPal payment' },
      { status: 500 }
    )
  }
}
