"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { getSupabase } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const supabase = getSupabase()

    if (!supabase) {
      setLoading(false)
      return () => {
        isMounted = false
      }
    }

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession()
        if (!isMounted) return

        if (error) {
          console.error('[AuthContext] Error getting initial session:', error)
        } else {
          setSession(initialSession)
          setUser(initialSession?.user ?? null)
        }
      } catch (error) {
        console.error('[AuthContext] Error initializing auth:', error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: string, nextSession: Session | null) => {
        if (!isMounted) return
        setSession(nextSession)
        setUser(nextSession?.user ?? null)
        setLoading(false)
      }
    )

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    try {
      const supabase = getSupabase()
      if (!supabase) return

      console.log('[AuthContext] Signing out user')
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
    } catch (error) {
      console.error('[AuthContext] Error signing out:', error)
    }
  }

  const refreshSession = async () => {
    try {
      const supabase = getSupabase()
      if (!supabase) return

      console.log('[AuthContext] Refreshing session')
      const { data: { session: refreshedSession }, error } = await supabase.auth.refreshSession()
      
      if (error) {
        console.error('[AuthContext] Error refreshing session:', error)
      } else {
        console.log('[AuthContext] Session refreshed:', refreshedSession?.user?.id)
        setSession(refreshedSession)
        setUser(refreshedSession?.user ?? null)
      }
    } catch (error) {
      console.error('[AuthContext] Error refreshing session:', error)
    }
  }

  const value = {
    user,
    session,
    loading,
    signOut,
    refreshSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
