import { NextRequest, NextResponse } from 'next/server'
import { UserRepository } from '@/lib/db/models'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing email or password' },
        { status: 400 }
      )
    }

    // Find user
    const user = await UserRepository.findByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if user is active
    if (!user.is_active) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 403 }
      )
    }

    // Verify password
    const isValidPassword = await compare(password, user.password_hash)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Return user without password
    const { password_hash: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      token,
      message: 'Login successful'
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
