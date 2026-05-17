import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = getSupabase()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data?.user) {
      // Check if profile exists, create if not
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', data.user.id)
        .single()

      if (!existingProfile) {
        // Create profile
        await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
            username: data.user.user_metadata?.username || data.user.email?.split('@')[0],
            avatar_url: data.user.user_metadata?.avatar_url,
          })
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/profile', requestUrl.origin))
}
