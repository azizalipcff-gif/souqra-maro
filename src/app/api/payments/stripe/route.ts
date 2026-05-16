import { NextRequest, NextResponse } from 'next/server'
import { createPaymentIntent, confirmPaymentIntent } from '@/lib/payments/stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, orderId } = body

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    const paymentIntent = await createPaymentIntent(
      amount,
      currency || 'mad',
      orderId ? { orderId } : undefined
    )

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.clientSecret,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    })
  } catch (error) {
    console.error('Stripe payment error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
