import { NextRequest } from 'next/server'
import { verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface AuthUser {
  userId: string
  email: string
  role: 'customer' | 'seller'
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = verify(token, JWT_SECRET) as AuthUser
    return decoded
  } catch (error) {
    return null
  }
}

export function getAuthUser(request: NextRequest): AuthUser | null {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return null
  }

  return verifyToken(token)
}

export function requireAuth(request: NextRequest): AuthUser {
  const user = getAuthUser(request)
  
  if (!user) {
    throw new Error('Unauthorized')
  }

  return user
}

export function requireRole(roles: string[]) {
  return (request: NextRequest): AuthUser => {
    const user = requireAuth(request)
    
    if (!roles.includes(user.role)) {
      throw new Error('Forbidden')
    }

    return user
  }
}

export function requireSeller(request: NextRequest): AuthUser {
  return requireRole(['seller'])(request)
}
