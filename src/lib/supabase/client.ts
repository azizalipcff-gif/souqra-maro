import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

let supabaseInstance: ReturnType<typeof createBrowserClient> | undefined

export function getSupabase() {
  if (typeof window === 'undefined') {
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
      }
    )
  }

  return supabaseInstance
}