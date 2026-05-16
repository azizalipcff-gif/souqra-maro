import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
})

export interface StripePaymentIntent {
  clientSecret: string
  amount: number
  currency: string
}

export async function createPaymentIntent(
  amount: number,
  currency: string = 'mad',
  metadata?: Record<string, string>
): Promise<StripePaymentIntent> {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return {
      clientSecret: paymentIntent.client_secret!,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
    }
  } catch (error) {
    console.error('Stripe payment intent error:', error)
    throw new Error('Failed to create payment intent')
  }
}

export async function confirmPaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return paymentIntent
  } catch (error) {
    console.error('Stripe confirm payment error:', error)
    throw new Error('Failed to confirm payment')
  }
}

export async function refundPayment(
  paymentIntentId: string,
  amount?: number
): Promise<Stripe.Refund> {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
    })
    return refund
  } catch (error) {
    console.error('Stripe refund error:', error)
    throw new Error('Failed to process refund')
  }
}

export async function createCustomer(
  email: string,
  name?: string
): Promise<Stripe.Customer> {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
    })
    return customer
  } catch (error) {
    console.error('Stripe customer creation error:', error)
    throw new Error('Failed to create customer')
  }
}
