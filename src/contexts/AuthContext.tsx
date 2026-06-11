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
    const supabase = getSupabase()
    if (!supabase) return

    console.log('[AuthContext] Initializing auth state')

    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log('[AuthContext] Getting initial session')
        const { data: { session: initialSession }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('[AuthContext] Error getting initial session:', error)
        } else {
          console.log('[AuthContext] Initial session:', initialSession?.user?.id)
          setSession(initialSession)
          setUser(initialSession?.user ?? null)
        }
      } catch (error) {
        console.error('[AuthContext] Error initializing auth:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: string, session: Session | null) => {
        console.log('[AuthContext] Auth state changed:', event, session?.user?.id)
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (event === 'SIGNED_IN') {
          console.log('[AuthContext] User signed in:', session?.user?.id)
          setLoading(false)
        } else if (event === 'SIGNED_OUT') {
          console.log('[AuthContext] User signed out')
          setLoading(false)
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('[AuthContext] Token refreshed')
        } else if (event === 'INITIAL_SESSION') {
          console.log('[AuthContext] Initial session loaded:', session?.user?.id)
          setLoading(false)
        }
      }
    )

    return () => {
      console.log('[AuthContext] Cleaning up auth subscription')
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
