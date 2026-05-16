import { NextRequest, NextResponse } from 'next/server'
import { rateLimitByIp } from './rate-limit'

export async function rateLimitMiddleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown'

  const result = rateLimitByIp(ip, 100, 60000) // 100 requests per minute

  if (!result.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': result.resetTime.toString(),
        }
      }
    )
  }

  return NextResponse.next({
    headers: {
      'X-RateLimit-Limit': '100',
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': result.resetTime.toString(),
    }
  })
}

export async function authMiddleware(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Token validation would happen here
  // For now, just pass through
  return NextResponse.next()
}

export async function corsMiddleware(request: NextRequest) {
  const response = NextResponse.next()

  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200 })
  }

  return response
}
