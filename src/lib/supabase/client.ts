import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

let supabaseInstance: ReturnType<typeof createBrowserClient> | undefined

export function getSupabase() {
  if (typeof window === 'undefined') return undefined

  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      }
    )
  }

  return supabaseInstance
}