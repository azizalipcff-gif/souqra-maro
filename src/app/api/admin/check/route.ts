import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    console.log("=== ADMIN CHECK API DEBUG ===")
    console.log("FILE: src/app/api/admin/check/route.ts")
    console.log("LINE: 4")
    
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    console.log("AUTH HEADER:", authHeader)
    
    if (!authHeader) {
      console.log("❌ No authorization header")
      return NextResponse.json({ error: 'Unauthorized - No authorization header provided' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    console.log("TOKEN:", token.substring(0, 20) + "...")
    
    // Check if service role key is available
    console.log("SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "SET" : "NOT SET")
    console.log("SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "SET" : "NOT SET")
    
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("❌ SUPABASE_SERVICE_ROLE_KEY is not set in environment variables")
      return NextResponse.json({ error: 'Server configuration error - Service role key not configured' }, { status: 500 })
    }
    
    // Use service role key to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
    
    console.log("USER AUTHENTICATION START")
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    console.log("USER DATA:", user)
    console.log("USER ERROR:", userError)
    
    if (userError || !user) {
      console.log("❌ User authentication failed")
      console.log("USER ERROR DETAILS:", userError)
      return NextResponse.json({ error: 'Unauthorized - Invalid token or no user', details: userError?.message }, { status: 401 })
    }

    console.log("USER ID:", user.id)
    console.log("USER EMAIL:", user.email)

    // Check if user is admin
    console.log("PROFILE QUERY START")
    console.log("Querying profiles table for user ID:", user.id)
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, role, created_at')
      .eq('id', user.id)
      .maybeSingle()

    console.log("PROFILE DATA:", profile)
    console.log("PROFILE ERROR:", profileError)
    
    if (profileError) {
      console.error("❌ Profile query error:", profileError)
      console.error("Error code:", profileError.code)
      console.error("Error message:", profileError.message)
      console.error("Error details:", profileError.details)
      console.error("Error hint:", profileError.hint)
      return NextResponse.json({ 
        error: 'Failed to query profile', 
        details: profileError.message,
        code: profileError.code 
      }, { status: 500 })
    }

    console.log("PROFILE ROLE:", profile?.role)
    console.log("PROFILE ROLE TYPE:", typeof profile?.role)
    console.log("IS ADMIN:", profile?.role === "admin")
    console.log("SAFE ADMIN CHECK:", (profile?.role || "").toLowerCase() === "admin")

    if (!profile) {
      console.log("❌ Profile not found")
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    if (profile?.role !== 'admin') {
      console.log("❌ Admin access denied")
      console.log("Reason:", `Role is '${profile?.role}', expected 'admin'`)
      return NextResponse.json({ isAdmin: false, role: profile?.role })
    }

    console.log("✅ Admin access granted")
    return NextResponse.json({ isAdmin: true, role: profile?.role })
  } catch (error) {
    console.error('=== ADMIN CHECK API EXCEPTION ===')
    console.error('FILE: src/app/api/admin/check/route.ts')
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
