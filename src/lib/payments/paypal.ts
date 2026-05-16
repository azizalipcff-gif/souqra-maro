// PayPal integration for SOUQORA
// Note: This is a simplified implementation. In production, use the official PayPal SDK

export interface PayPalOrder {
  id: string
  status: string
  links: PayPalLink[]
}

export interface PayPalLink {
  href: string
  rel: string
  method: string
}

export interface PayPalPaymentResponse {
  approvalUrl: string
  orderId: string
}

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || ''
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || ''
const PAYPAL_API_BASE = process.env.NODE_ENV === 'production'
  ? 'https://api.paypal.com'
  : 'https://api.sandbox.paypal.com'

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${auth}`,
    },
    body: 'grant_type=client_credentials',
  })

  const data = await response.json()
  return data.access_token
}

export async function createPayPalOrder(
  amount: number,
  currency: string = 'MAD',
  description?: string
): Promise<PayPalPaymentResponse> {
  try {
    const accessToken = await getAccessToken()

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount.toFixed(2),
            },
            description,
          },
        ],
      }),
    })

    const order: PayPalOrder = await response.json()

    const approvalLink = order.links.find((link) => link.rel === 'approve')

    if (!approvalLink) {
      throw new Error('Approval link not found')
    }

    return {
      approvalUrl: approvalLink.href,
      orderId: order.id,
    }
  } catch (error) {
    console.error('PayPal order creation error:', error)
    throw new Error('Failed to create PayPal order')
  }
}

export async function capturePayPalOrder(orderId: string): Promise<any> {
  try {
    const accessToken = await getAccessToken()

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('PayPal capture error:', error)
    throw new Error('Failed to capture PayPal payment')
  }
}

export function getPayPalClientId(): string {
  return PAYPAL_CLIENT_ID
}
