import { NextRequest, NextResponse } from 'next/server'
import { supabase, createServiceClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json({ profile: null }, { status: 200 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)

    if (userError || !user) {
      return NextResponse.json({ profile: null }, { status: 200 })
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, full_name, role, created_at')
      .eq('id', user.id)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ profile: null }, { status: 200 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    return NextResponse.json({ profile: null }, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { full_name } = body

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
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
