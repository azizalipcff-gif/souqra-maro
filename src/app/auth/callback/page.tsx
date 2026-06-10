"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { getSupabase } from "@/lib/supabase/client"

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = getSupabase()
        
        // Check for error in URL
        const errorParam = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')
        
        if (errorParam) {
          console.error('OAuth error:', errorParam, errorDescription)
          setError(errorDescription || errorParam)
          setStatus('error')
          setTimeout(() => {
            router.push('/auth/login?error=' + encodeURIComponent(errorDescription || errorParam))
          }, 2000)
          return
        }

        // Get session from URL (OAuth callback)
        const { data, error: sessionError } = await supabase.auth.getSessionFromUrl()
        
        if (sessionError) {
          console.error('Error getting session from URL:', sessionError)
          setError(sessionError.message)
          setStatus('error')
          setTimeout(() => {
            router.push('/auth/login?error=' + encodeURIComponent(sessionError.message))
          }, 2000)
          return
        }

        if (!data?.session?.user) {
          console.error('No session found')
          setError('no_session')
          setStatus('error')
          setTimeout(() => {
            router.push('/auth/login?error=no_session')
          }, 2000)
          return
        }

        console.log('Session created successfully for user:', data.session.user.id)

        // Check if profile exists, create if not
        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', data.session.user.id)
          .maybeSingle()

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error checking profile:', profileError)
        }

        if (!existingProfile) {
          console.log('Creating profile for user...')
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              user_id: data.session.user.id,
              full_name: data.session.user.user_metadata?.full_name || data.session.user.email,
              username: data.session.user.email?.split('@')[0] || '',
              role: 'client',
            })

          if (insertError) {
            console.error('Error creating profile:', insertError)
          } else {
            console.log('Profile created successfully')
          }
        }

        setStatus('success')
        
        // Get next parameter or default to profile
        const next = searchParams.get('next') || '/profile'
        
        setTimeout(() => {
          router.push(next)
          router.refresh()
        }, 500)
      } catch (error) {
        console.error('Unexpected error in callback:', error)
        setError('unexpected')
        setStatus('error')
        setTimeout(() => {
          router.push('/auth/login?error=unexpected')
        }, 2000)
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white flex items-center justify-center">
      <div className="text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <p className="text-xl font-semibold text-gray-700">Logging you in...</p>
            <p className="text-sm text-gray-500">Please wait while we set up your account</p>
          </div>
        )}
        
        {status === "success" && (
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-xl font-semibold text-gray-700">Success!</p>
            <p className="text-sm text-gray-500">Redirecting to your profile...</p>
          </div>
        )}
        
        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18M6 6l12 12" />
              </svg>
            </div>
            <p className="text-xl font-semibold text-gray-700">Authentication Error</p>
            <p className="text-sm text-gray-500">Error: {error}</p>
            <p className="text-sm text-gray-400">Redirecting to login page...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
