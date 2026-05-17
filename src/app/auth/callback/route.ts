import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase/client'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription)
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(errorDescription || error)}`, requestUrl.origin)
    )
  }

  if (!code) {
    console.error('No code provided in callback')
    return NextResponse.redirect(
      new URL('/auth/login?error=no_code', requestUrl.origin)
    )
  }

  try {
    const supabase = getSupabase()
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError)
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin)
      )
    }

    if (!data?.user) {
      console.error('No user data after code exchange')
      return NextResponse.redirect(
        new URL('/auth/login?error=no_user', requestUrl.origin)
      )
    }

    // Check if profile exists, create if not
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', data.user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error checking profile:', profileError)
    }

    if (!existingProfile) {
      // Create profile
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          user_id: data.user.id,
          full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
          username: data.user.user_metadata?.username || data.user.email?.split('@')[0],
          avatar_url: data.user.user_metadata?.avatar_url,
        })

      if (insertError) {
        console.error('Error creating profile:', insertError)
      }
    }

    // Set session cookie
    const cookieStore = cookies()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
      // Redirect to profile on success
      return NextResponse.redirect(new URL('/profile', requestUrl.origin))
    } else {
      return NextResponse.redirect(
        new URL('/auth/login?error=no_session', requestUrl.origin)
      )
    }
  } catch (error) {
    console.error('Unexpected error in callback:', error)
    return NextResponse.redirect(
      new URL('/auth/login?error=unexpected', requestUrl.origin)
    )
  }
}
