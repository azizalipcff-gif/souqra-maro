import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  try {
    console.log("=== PROFILES API GET DEBUG ===")
    console.log("FILE: src/app/api/profiles/route.ts")
    console.log("LINE: 4")
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    console.log("TOKEN:", token ? token.substring(0, 20) + "..." : "null")
    
    if (!token) {
      console.log("❌ No token provided")
      return NextResponse.json({ error: 'Unauthorized - No authorization header provided' }, { status: 401 })
    }

    const supabase = getSupabase()
    console.log("USER ID QUERY START")
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    console.log("USER ID:", user?.id)
    console.log("USER EMAIL:", user?.email)
    console.log("AUTH ERROR:", authError)

    if (authError || !user) {
      console.log("❌ Invalid token or no user")
      console.log("AUTH ERROR DETAILS:", authError)
      return NextResponse.json({ error: 'Unauthorized - Invalid token or no user', details: authError?.message }, { status: 401 })
    }

    console.log("PROFILE QUERY START")
    console.log("Querying profiles table for user ID:", user.id)
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, full_name, role, created_at')
      .eq('id', user.id)
      .maybeSingle()

    console.log("PROFILE QUERY RESULT:", profile)
    console.log("PROFILE QUERY ERROR:", error)

    if (error) {
      console.log("ERROR CODE:", error.code)
      console.log("ERROR MESSAGE:", error.message)
      console.log("ERROR DETAILS:", error.details)
      console.log("ERROR HINT:", error.hint)
      if (error.code === 'PGRST116') {
        // Profile doesn't exist
        console.log("Profile does not exist (PGRST116)")
        return NextResponse.json({ profile: null }, { status: 200 })
      }
      console.log("Throwing error")
      return NextResponse.json({ 
        error: 'Failed to fetch profile', 
        details: error.message,
        code: error.code 
      }, { status: 500 })
    }

    console.log("✅ Profile fetched successfully")
    return NextResponse.json({ profile })
  } catch (error) {
    console.error('=== PROFILES API GET EXCEPTION ===')
    console.error('FILE: src/app/api/profiles/route.ts')
    console.error('Error:', error)
    console.error('Error message:', (error as any)?.message)
    console.error('Error stack:', (error as any)?.stack)
    console.error('Error code:', (error as any)?.code)
    console.error('Error details:', (error as any)?.details)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: (error as any)?.message,
      stack: (error as any)?.stack 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabase()
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { full_name, username, bio, phone, city, website, instagram, facebook } = body

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (existingProfile) {
      return NextResponse.json({ error: 'Profile already exists' }, { status: 400 })
    }

    // Check if username is taken
    if (username) {
      const { data: usernameCheck } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single()

      if (usernameCheck) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 400 })
      }
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        full_name,
        username,
        bio,
        phone,
        city,
        website,
        instagram,
        facebook,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Profile creation error:', error)
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabase()
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { full_name, username, bio, phone, city, website, instagram, facebook, avatar_url } = body

    // Check if username is taken (if changing username)
    if (username) {
      const { data: usernameCheck } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single()

      if (usernameCheck && usernameCheck.id !== user.id) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 400 })
      }
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .update({
        full_name,
        username,
        bio,
        phone,
        city,
        website,
        instagram,
        facebook,
        avatar_url,
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
