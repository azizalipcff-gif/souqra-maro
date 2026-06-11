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
  
  // Client-side: use singleton with cookie-compatible storage for PKCE
  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: {
          getItem: (key: string) => {
            if (typeof document === 'undefined') return null
            const item = document.cookie
              .split('; ')
              .find((row) => row.startsWith(`${key}=`))
            return item ? decodeURIComponent(item.split('=')[1]) : null
          },
          setItem: (key: string, value: string) => {
            if (typeof document === 'undefined') return
            document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`
          },
          removeItem: (key: string) => {
            if (typeof document === 'undefined') return
            document.cookie = `${key}=; path=/; max-age=-1`
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

