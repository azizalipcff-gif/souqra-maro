import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client-side singleton for browser
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

export const getSupabase = () => {
  if (typeof window === 'undefined') {
    // Server-side: create new instance each time (for SSR safety)
    return createClient(supabaseUrl, supabaseAnonKey)
  }
  
  // Client-side: use singleton with proper auth configuration
  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        storage: {
          getItem: (key: string) => {
            const item = localStorage.getItem(key)
            return item ? JSON.parse(item) : null
          },
          setItem: (key: string, value: any) => {
            localStorage.setItem(key, JSON.stringify(value))
          },
          removeItem: (key: string) => {
            localStorage.removeItem(key)
          },
        },
      },
    })
  }
  
  return supabaseInstance
}

export const createSupabaseClient = () => {
  return getSupabase()
}

