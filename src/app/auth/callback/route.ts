import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(new URL('/auth/login?error=' + encodeURIComponent(error.message), requestUrl))
    }

    if (session?.user) {
      // Create profile if it doesn't exist
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle()

      if (!existingProfile) {
        await supabase
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
      }
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl))
}
