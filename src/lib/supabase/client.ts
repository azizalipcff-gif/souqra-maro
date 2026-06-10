import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client-side singleton for browser
let supabaseInstance: SupabaseClient | null = null

export const getSupabase = (): SupabaseClient => {
  if (typeof window === 'undefined') {
    // Server-side: create new instance each time (for SSR safety)
    return createClient(supabaseUrl, supabaseAnonKey)
  }
  
  // Client-side: use singleton
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  }
  
  return supabaseInstance
}

export const createSupabaseClient = (): SupabaseClient => {
  return getSupabase()
}

