import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

function assertSupabaseEnv() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
}

export const createServiceClient = () => {
  assertSupabaseEnv()
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }
  return createClient(supabaseUrl, supabaseServiceKey)
}

export const createServerSupabaseClient = async () => {
  assertSupabaseEnv()
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // ignore in server components
        }
      },
    },
  })
}

export const createRouteHandlerClient = (request: Request) => {
  assertSupabaseEnv()
  const cookieHeader = request.headers.get('cookie') || ''
  const cookieMap = new Map(
    cookieHeader.split(';').map((cookie) => cookie.trim()).filter(Boolean).map((cookie) => {
      const separatorIndex = cookie.indexOf('=')
      return [cookie.slice(0, separatorIndex), cookie.slice(separatorIndex + 1)]
    })
  )

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieMap.get(name)
      },
      set() {},
      remove() {},
    },
  })
}
