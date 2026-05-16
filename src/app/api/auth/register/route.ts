import { NextRequest, NextResponse } from 'next/server'
import { UserRepository } from '@/lib/db/models'
import { hash } from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, phone, role } = body

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await UserRepository.findByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const password_hash = await hash(password, 10)

    // Create user
    const user = await UserRepository.create({
      email,
      password_hash,
      name,
      phone,
      role: role || 'customer',
    })

    // Return user without password
    const { password_hash: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { user: userWithoutPassword, message: 'User created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
