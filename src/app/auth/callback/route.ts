import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/profile'

  if (!code) {
    return NextResponse.redirect(
      new URL('/auth/login?error=missing_code', requestUrl)
    )
  }

  const cookieStore = await cookies()
  const response = NextResponse.redirect(new URL(next, requestUrl))

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set({
              name,
              value,
              ...options,
            })
          })
        },
      },
    }
  )

  const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(
      new URL(
        '/auth/login?error=' + encodeURIComponent(error.message),
        requestUrl
      )
    )
  }

  // Create profile if it doesn't exist
  if (session?.user) {
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', session.user.id)
      .maybeSingle()

    if (!existingProfile) {
      const { error: insertError } = await supabase
        .from('profiles')
        .upsert({
          user_id: session.user.id,
          full_name: session.user.user_metadata?.full_name || session.user.email,
          username: session.user.email?.split('@')[0] || '',
          role: 'client',
        }, {
          onConflict: 'user_id',
          ignoreDuplicates: false,
        })

      if (insertError) {
        console.error('Error creating profile:', insertError)
      }
    }
  }

  return response
}