"use client"

import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
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

  const createProfile = async (userId: string, fullName: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: fullName,
          role: 'client'
        })
      
      if (error) {
        console.error('[AuthContext] Error creating profile:', error)
      }
    } catch (error) {
      console.error('[AuthContext] Error creating profile:', error)
    }
  }

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
    let mounted = true

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return
      
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchUserRole(session.user.id)
      }
      
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return
      
      console.log('[AuthContext] Auth state changed:', event, !!session)
      
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchUserRole(session.user.id)
      } else {
        setRole(null)
      }
      
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    // Auth listener will handle state updates
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
    // Auth listener will handle state updates
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
      // Auth listener will handle state updates
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
