import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient(request)

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    console.log("USER =>", user)
    console.log("AUTH ERROR =>", userError)

    if (userError || !user) {
      return NextResponse.json({ profile: null }, { status: 200 })
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, full_name, role, created_at')
      .eq('user_id', user.id)
      .maybeSingle()

    console.log("PROFILE =>", profile)
    console.log("PROFILE ERROR =>", error)

    if (error) {
      return NextResponse.json({ profile: null }, { status: 200 })
    }

    return NextResponse.json({ profile })

  } catch (error) {
    console.log("GET PROFILE ERROR =>", error)
    return NextResponse.json({ profile: null }, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient(request)

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { full_name } = body

    const { data: profile, error } = await supabase
      .from('profiles')
      .insert({
        user_id: user.id,
        full_name,
        role: 'client',
      })
      .select('id, full_name, role, created_at')
      .maybeSingle()

    if (error) {
      console.log("CREATE ERROR =>", error)
      throw error
    }

    return NextResponse.json({ profile })

  } catch (error) {
    console.log("POST PROFILE ERROR =>", error)
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient(request)

    const { data: { user }, error: userError } = await supabase.auth.getUser()

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
      .eq('user_id', user.id)
      .select('id, full_name, role, created_at')
      .maybeSingle()

    if (error) {
      console.log("UPDATE ERROR =>", error)
      throw error
    }

    return NextResponse.json({ profile })

  } catch (error) {
    console.log("PUT PROFILE ERROR =>", error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}