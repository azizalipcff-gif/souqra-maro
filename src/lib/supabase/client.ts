import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabaseInstance: ReturnType<typeof createBrowserClient> | undefined

export function getSupabase() {
  if (typeof window === 'undefined') return undefined

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[Supabase] Missing public env vars for browser client')
    return undefined
  }

  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storage: {
            getItem: (key) => {
              const cookies = document.cookie.split(';').reduce((acc, cookie) => {
                const [k, v] = cookie.trim().split('=')
                acc[k] = v
                return acc
              }, {} as Record<string, string>)
              return cookies[key] || null
            },
            setItem: (key, value) => {
              document.cookie = `${key}=${value}; path=/; max-age=3600; SameSite=Lax; Secure`
            },
            removeItem: (key) => {
              document.cookie = `${key}=; path=/; max-age=0; SameSite=Lax; Secure`
            },
          },
        },
      }
    )
  }

  return supabaseInstance
}