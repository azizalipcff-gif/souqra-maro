"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, Store, User, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { getSupabase } from "@/lib/supabase/client"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  try {
    setError(null)

    const { data, error } = await getSupabase().auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    if (error) {
      setError(error.message)
      return
    }

    if (data.user) {
      router.push("/")
      router.refresh()
    }
  } catch (err) {
    console.error("Login error:", err)
    setError("Login failed")
  }
}

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    try {
      const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://souqora.vercel.app'
      const { data, error } = await getSupabase().auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        console.error('Google login error:', error)
        alert(`Login failed: ${error.message}`)
        setIsGoogleLoading(false)
      }
      // If successful, the redirect will happen automatically
    } catch (error) {
      console.error('Google login error:', error)
      alert('An unexpected error occurred during login')
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <Card className="shadow-2xl border-2 border-gold/20">
            <CardHeader className="text-center pb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 bg-gradient-to-br from-royal-blue to-gold rounded-2xl mx-auto mb-4 flex items-center justify-center"
              >
                <Store className="h-8 w-8 text-white" />
              </motion.div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-royal-blue to-gold bg-clip-text text-transparent">
                Welcome Back
              </CardTitle>
              <p className="text-gray-600 mt-2">Sign in to your SOUQORA account</p>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-red-800 font-medium">Authentication Error</p>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-400 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <Link href="/auth/forgot-password" className="text-sm text-royal-blue hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button
  type="submit"
  className="w-full"
  size="lg"
>
  Sign In
</Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading}
                  >
                    {isGoogleLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      'Google'
                    )}
                  </Button>
                  <Button variant="outline" className="w-full" disabled>
                    Facebook
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/auth/register" className="text-royal-blue font-semibold hover:underline">
                  Sign up
                </Link>
              </p>
              <p className="text-center text-sm text-gray-600">
                Want to sell on SOUQORA?{" "}
                <Link href="/auth/register?role=seller" className="text-gold font-semibold hover:underline">
                  Become a seller
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-royal-blue" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
