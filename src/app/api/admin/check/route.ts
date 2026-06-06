import { createRouteHandlerClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    console.log("=== ADMIN CHECK API DEBUG ===")
    console.log("FILE: src/app/api/admin/check/route.ts")
    
    const authHeader = request.headers.get('authorization')
    const cookieHeader = request.headers.get('cookie')
    console.log("AUTH HEADER:", authHeader ? "PRESENT" : "NOT PRESENT")
    console.log("COOKIE HEADER:", cookieHeader ? "PRESENT" : "NOT PRESENT")
    
    if (!authHeader && !cookieHeader) {
      console.log("❌ No authorization header or cookie")
      return NextResponse.json({ isAdmin: false, role: null }, { status: 200 })
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
      console.log("❌ User authentication failed")
      console.log("AUTH ERROR DETAILS:", userError)
      return NextResponse.json({ isAdmin: false, role: null }, { status: 200 })
    }

    // Use service role key to bypass RLS for profile query
    const adminSupabase = createAdminClient()

    // Check if user is admin
    console.log("PROFILE QUERY START")
    console.log("Querying profiles table for user ID:", user.id)
    
    const { data: profile, error: profileError } = await adminSupabase
      .from('profiles')
      .select('id, full_name, role, created_at')
      .eq('id', user.id)
      .maybeSingle()

    console.log("PROFILE DATA:", profile ? "FOUND" : "NOT FOUND")
    console.log("PROFILE ERROR:", profileError)
    
    if (profileError) {
      console.error("❌ Profile query error:", profileError)
      console.error("Error code:", profileError.code)
      console.error("Error message:", profileError.message)
      return NextResponse.json({ isAdmin: false, role: null }, { status: 200 })
    }

    console.log("PROFILE ROLE:", profile?.role)
    console.log("PROFILE ROLE TYPE:", typeof profile?.role)
    console.log("IS ADMIN:", profile?.role === "admin")

    if (!profile) {
      console.log("❌ Profile not found")
      return NextResponse.json({ isAdmin: false, role: null }, { status: 200 })
    }

    const isAdmin = profile?.role === 'admin'
    console.log("✅ Admin check complete:", isAdmin)
    return NextResponse.json({ isAdmin, role: profile?.role })
  } catch (error) {
    console.error('=== ADMIN CHECK API EXCEPTION ===')
    console.error('FILE: src/app/api/admin/check/route.ts')
    console.error('Error:', (error as any)?.message)
    return NextResponse.json({ isAdmin: false, role: null }, { status: 200 })
  }
}
