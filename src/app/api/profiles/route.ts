import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    console.log("=== PROFILES API GET DEBUG ===")
    console.log("FILE: src/app/api/profiles/route.ts")
    
    const authHeader = request.headers.get('authorization')
    const cookieHeader = request.headers.get('cookie')
    console.log("AUTH HEADER:", authHeader ? "PRESENT" : "NOT PRESENT")
    console.log("COOKIE HEADER:", cookieHeader ? "PRESENT" : "NOT PRESENT")
    
    if (!authHeader && !cookieHeader) {
      console.log("❌ No authorization header or cookie")
      return NextResponse.json({ profile: null }, { status: 200 })
    }

    const supabase = createRouteHandlerClient(request)
    
    console.log("USER AUTHENTICATION START")
    
    // Try to get user from session (cookies)
    let user = null
    let userError = null
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    console.log("SESSION:", session ? "PRESENT" : "NOT PRESENT")
    console.log("SESSION ERROR:", sessionError)
    
    if (session?.user) {
      user = session.user
    } else if (authHeader) {
      // Fallback to Bearer token
      const token = authHeader.replace('Bearer ', '')
      console.log("TOKEN:", token.substring(0, 20) + "...")
      const { data: { user: tokenUser }, error: tokenError } = await supabase.auth.getUser(token)
      console.log("TOKEN USER:", tokenUser ? "PRESENT" : "NOT PRESENT")
      console.log("TOKEN ERROR:", tokenError)
      user = tokenUser
      userError = tokenError
    }
    
    console.log("USER ID:", user?.id)
    console.log("USER EMAIL:", user?.email)
    console.log("AUTH ERROR:", userError)

    if (userError || !user) {
      console.log("❌ Invalid token or no user")
      console.log("AUTH ERROR DETAILS:", userError)
      return NextResponse.json({ profile: null }, { status: 200 })
    }

    console.log("PROFILE QUERY START")
    console.log("Querying profiles table for user ID:", user.id)
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, full_name, role, created_at')
      .eq('id', user.id)
      .maybeSingle()

    console.log("PROFILE QUERY RESULT:", profile ? "FOUND" : "NOT FOUND")
    console.log("PROFILE QUERY ERROR:", error)

    if (error) {
      console.log("ERROR CODE:", error.code)
      console.log("ERROR MESSAGE:", error.message)
      console.log("ERROR DETAILS:", error.details)
      console.log("ERROR HINT:", error.hint)
      // Always return null on error, never 500
      return NextResponse.json({ profile: null }, { status: 200 })
    }

    console.log("✅ Profile fetched successfully")
    return NextResponse.json({ profile })
  } catch (error) {
    console.error('=== PROFILES API GET EXCEPTION ===')
    console.error('FILE: src/app/api/profiles/route.ts')
    console.error('Error:', (error as any)?.message)
    // Always return null on exception, never 500
    return NextResponse.json({ profile: null }, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const cookieHeader = request.headers.get('cookie')
    
    if (!authHeader && !cookieHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createRouteHandlerClient(request)

    let user = null
    let userError = null
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (session?.user) {
      user = session.user
    } else if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user: tokenUser }, error: tokenError } = await supabase.auth.getUser(token)
      user = tokenUser
      userError = tokenError
    }

    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { full_name } = body

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle()

    if (existingProfile) {
      return NextResponse.json({ error: 'Profile already exists' }, { status: 400 })
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        full_name,
        role: 'client',
      })
      .select('id, full_name, role, created_at')
      .maybeSingle()

    if (error) throw error

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Profile creation error:', error)
    return NextResponse.json({ error: 'Failed to create profile', details: (error as any)?.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const cookieHeader = request.headers.get('cookie')
    
    if (!authHeader && !cookieHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createRouteHandlerClient(request)

    let user = null
    let userError = null
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (session?.user) {
      user = session.user
    } else if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user: tokenUser }, error: tokenError } = await supabase.auth.getUser(token)
      user = tokenUser
      userError = tokenError
    }

    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { full_name } = body

    const { data: profile, error } = await supabase
      .from('profiles')
      .update({
        full_name,
      })
      .eq('id', user.id)
      .select('id, full_name, role, created_at')
      .maybeSingle()

    if (error) throw error

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Failed to update profile', details: (error as any)?.message }, { status: 500 })
  }
}
