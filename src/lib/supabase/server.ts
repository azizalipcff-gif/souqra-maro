import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const createServiceClient = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }
  return createClient(supabaseUrl, supabaseServiceKey)
}

// Helper for API routes to create client from request headers
export const createRouteHandlerClient = (request: Request) => {
  const cookieHeader = request.headers.get('cookie')
  
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          if (!cookieHeader) return undefined
          const cookies = cookieHeader.split(';').map(c => c.trim())
          const found = cookies.find(c => c.startsWith(`${name}=`))
          return found?.substring(name.length + 1)
        },
        set() {},
        remove() {},
      },
    }
  )
}
