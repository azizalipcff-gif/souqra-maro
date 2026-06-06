import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    console.log("=== ADMIN CHECK API DEBUG ===")
    
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    console.log("AUTH HEADER:", authHeader)
    
    if (!authHeader) {
      console.log("❌ No authorization header")
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    console.log("TOKEN:", token.substring(0, 20) + "...")
    
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
    
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    console.log("USER DATA:", user)
    console.log("USER ERROR:", userError)
    
    if (userError || !user) {
      console.log("❌ User authentication failed")
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log("USER ID:", user.id)
    console.log("USER EMAIL:", user.email)

    // Check if user is admin
    console.log("=== PROFILE QUERY DEBUG ===")
    console.log("Querying profiles table for user ID:", user.id)
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    console.log("PROFILE DATA:", profile)
    console.log("PROFILE ERROR:", profileError)
    
    if (profileError) {
      console.error("❌ Profile query error:", profileError)
      console.error("Error code:", profileError.code)
      console.error("Error message:", profileError.message)
      console.error("Error details:", profileError.details)
    }

    console.log("PROFILE ROLE:", profile?.role)
    console.log("PROFILE ROLE TYPE:", typeof profile?.role)
    console.log("IS ADMIN:", profile?.role === "admin")
    console.log("SAFE ADMIN CHECK:", (profile?.role || "").toLowerCase() === "admin")

    if (profileError || profile?.role !== 'admin') {
      console.log("❌ Admin access denied")
      console.log("Reason:", profileError ? "Profile query failed" : `Role is '${profile?.role}', expected 'admin'`)
      return NextResponse.json({ isAdmin: false, role: profile?.role })
    }

    console.log("✅ Admin access granted")
    return NextResponse.json({ isAdmin: true, role: profile?.role })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
