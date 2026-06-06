import { supabase, createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json({ isAdmin: false, role: null }, { status: 200 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)

    if (userError || !user) {
      return NextResponse.json({ isAdmin: false, role: null }, { status: 200 })
    }

    // Use service client to bypass RLS for profile query
    const serviceSupabase = createServiceClient()

    const { data: profile, error: profileError } = await serviceSupabase
      .from('profiles')
      .select('id, full_name, role, created_at')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError || !profile) {
      return NextResponse.json({ isAdmin: false, role: null }, { status: 200 })
    }

    const isAdmin = profile.role === 'admin'
    return NextResponse.json({ isAdmin, role: profile.role })
  } catch (error) {
    return NextResponse.json({ isAdmin: false, role: null }, { status: 200 })
  }
}
