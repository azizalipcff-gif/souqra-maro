"use client"

import { createContext, useContext, useEffect, useState } from 'react'
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
  const supabase = createClient()

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
        .single()
      
      if (error) {
        console.error('[AuthContext] Error fetching user role:', error)
        setRole('client') // Default to client if error
      } else if (profile) {
        setRole(profile.role as 'client' | 'business_owner' | 'admin')
      } else {
        // Profile doesn't exist, create it
        const { data: userData } = await supabase.auth.getUser()
        if (userData?.user) {
          const fullName = userData.user.user_metadata?.full_name || userData.user.email || ''
          await createProfile(userId, fullName)
        }
        setRole('client') // Default to client if no profile
      }
    } catch (error) {
      console.error('[AuthContext] Error fetching user role:', error)
      setRole('client') // Default to client if error
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
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return
      
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
  }, [supabase.auth])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    
    // Wait for session to be set
    if (data.session) {
      setSession(data.session)
      setUser(data.session.user)
      await fetchUserRole(data.session.user.id)
      
      // Small delay to ensure state is updated before redirect
      setTimeout(() => {
        router.push('/')
      }, 100)
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    if (error) throw error
    
    // Create profile manually if trigger didn't fire
    if (data.user) {
      await createProfile(data.user.id, fullName)
      setSession(data.session)
      setUser(data.user)
      await fetchUserRole(data.user.id)
      
      // Small delay to ensure state is updated before redirect
      setTimeout(() => {
        router.push('/')
      }, 100)
    }
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
    await supabase.auth.signOut()
    setRole(null)
    router.push('/')
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
