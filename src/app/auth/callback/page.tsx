import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: { code?: string }
}) {
  const code = searchParams.code
  
  if (!code) {
    redirect('/login?error=no_code')
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('Error exchanging code for session:', error)
    redirect('/login?error=auth_failed')
  }

  // Create profile if it doesn't exist (for Google OAuth users)
  if (data.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', data.user.id)
      .maybeSingle()

    if (!profile) {
      // Profile doesn't exist, create it
      const fullName = data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email || ''
      await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          full_name: fullName,
          role: 'client'
        })
    }
  }

  redirect('/')
}
