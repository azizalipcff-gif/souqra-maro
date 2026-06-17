"use client"

import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  role: 'client' | 'business_owner' | 'admin' | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  isAdmin: () => boolean
  isBusinessOwner: () => boolean
  isAuthenticated: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<'client' | 'business_owner' | 'admin' | null>(null)
  const router = useRouter()
  const supabaseRef = useRef(createClient())
  const supabase = supabaseRef.current

  const fetchUserRole = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle()
      
      if (error) {
        console.error('[AuthContext] Error fetching user role:', error)
        setRole('client')
      } else if (profile) {
        setRole(profile.role as 'client' | 'business_owner' | 'admin')
      } else {
        setRole('client')
      }
    } catch (error) {
      console.error('[AuthContext] Error fetching user role:', error)
      setRole('client')
    }
  }

  useEffect(() => {
    const mountedRef = { current: true }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mountedRef.current) return
      
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        fetchUserRole(session.user.id)
      }
      
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mountedRef.current) return
      
      console.log('[AuthContext] Auth state changed:', event, !!session)
      
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        fetchUserRole(session.user.id)
      } else {
        setRole(null)
      }
      
      setLoading(false)
    })

    return () => {
      mountedRef.current = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    router.push('/')
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    if (error) throw error
    router.push('/')
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) throw error
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('[AuthContext] Error signing out:', error)
    }
  }

  const isAdmin = () => role === 'admin'
  const isBusinessOwner = () => role === 'business_owner'
  const isAuthenticated = () => !!user

  return (
    <AuthContext.Provider value={{ user, session, loading, role, signIn, signUp, signInWithGoogle, signOut, isAdmin, isBusinessOwner, isAuthenticated }}>
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