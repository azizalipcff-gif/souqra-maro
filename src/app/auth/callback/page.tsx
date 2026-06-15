import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: { code?: string }
}) {
  const code = searchParams.code

  if (!code) redirect('/login?error=no_code')

  const supabase = await createClient()

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.session) {
    redirect('/login?error=auth_failed')
  }

  const user = data.session.user

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile) {
    await supabase.from('profiles').insert({
      id: user.id,
      full_name:
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email ||
        '',
      role: 'client',
    })
  }

  redirect('/')
}