import { createRouteHandlerClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    console.log("=== ADMIN APPROVE BUSINESS API DEBUG ===")
    
    const authHeader = request.headers.get('authorization')
    const cookieHeader = request.headers.get('cookie')
    console.log("AUTH HEADER:", authHeader ? "PRESENT" : "NOT PRESENT")
    console.log("COOKIE HEADER:", cookieHeader ? "PRESENT" : "NOT PRESENT")
    
    if (!authHeader && !cookieHeader) {
      console.log("❌ No authorization header or cookie")
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createRouteHandlerClient(request)
    
    console.log("USER AUTHENTICATION START")
    
    let user = null
    let userError = null
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    console.log("SESSION:", session ? "PRESENT" : "NOT PRESENT")
    console.log("SESSION ERROR:", sessionError)
    
    if (session?.user) {
      user = session.user
    } else if (authHeader) {
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
      return NextResponse.json({ error: 'Failed to query profile' }, { status: 500 })
    }

    console.log("PROFILE ROLE:", profile?.role)
    console.log("IS ADMIN:", profile?.role === "admin")

    if (!profile || profile?.role !== 'admin') {
      console.log("❌ Admin access denied")
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    console.log("✅ Admin access granted")

    // Get business ID from request
    const { businessId } = await request.json()

    if (!businessId) {
      return NextResponse.json({ error: 'Business ID is required' }, { status: 400 })
    }

    // Approve business
    const { error: updateError } = await adminSupabase
      .from('businesses')
      .update({ approved: true })
      .eq('id', businessId)

    if (updateError) {
      console.error('Error approving business:', updateError)
      return NextResponse.json({ error: 'Failed to approve business' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Business approved successfully' })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: (error as any)?.message 
    }, { status: 500 })
  }
}
