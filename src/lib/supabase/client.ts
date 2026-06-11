import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client-side singleton for browser
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

export const getSupabase = () => {
  if (typeof window === 'undefined') {
    // Server-side: should not be called, but return null for safety
    return null
  }
  
  // Client-side: use singleton with cookie storage
  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  }
  
  return supabaseInstance
}

export const createSupabaseClient = () => {
  return getSupabase()
}

