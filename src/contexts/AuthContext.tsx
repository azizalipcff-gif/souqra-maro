// src/contexts/AuthContext.tsx
"use client"

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react' // ✅ أضف useRef
import { User, Session } from '@supabase/supabase-js'
import { getSupabase } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  initialized: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  
  // ✅ مفتاح الحل: منع التنفيذ المتكرر
  const initializedRef = useRef(false)

  useEffect(() => {
    // ✅ منع التنفيذ مرتين
    if (initializedRef.current) return
    initializedRef.current = true

    const supabase = getSupabase()
    if (!supabase) {
      setLoading(false)
      setInitialized(true)
      return
    }

    let mounted = true

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession()
        
        if (mounted) {
          setSession(initialSession)
          setUser(initialSession?.user ?? null)
          setInitialized(true)
          setLoading(false)
        }
      } catch (error) {
        console.error('[AuthContext] Error:', error)
        if (mounted) {
          setInitialized(true)
          setLoading(false)
        }
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: string, session: Session | null) => {
        if (!mounted) return
        console.log('[Auth] Event:', event)
        setSession(session)
        setUser(session?.user ?? null)
        
        if (event === 'INITIAL_SESSION') {
          setInitialized(true)
          setLoading(false)
        } else if (event === 'SIGNED_IN') {
          setLoading(false)
        } else if (event === 'SIGNED_OUT') {
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    const supabase = getSupabase()
    if (!supabase) return
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, initialized, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
