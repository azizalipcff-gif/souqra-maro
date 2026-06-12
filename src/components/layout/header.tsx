"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, ShoppingCart, Heart, User, Menu, X, LogOut, ShoppingBag, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getSupabase } from "@/lib/supabase/client"

export function Header() {
  const router = useRouter()
  const { user, session, loading: authLoading, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  const loadProfile = async () => {
    if (!user) return

    try {
      const supabase = getSupabase()
      if (!supabase) return

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('id, user_id, full_name, username, phone, city, bio, avatar_url, role, created_at')
        .eq('user_id', user.id)
        .maybeSingle()

      if (profileData) {
        setProfile(profileData)
      }
    } catch (error) {
      console.error('[Header] Profile load error:', error)
    }
  }

  // Load profile when user is available
  useEffect(() => {
    if (user && !authLoading) {
      loadProfile()
    }
  }, [user, authLoading])

  const handleLogout = async () => {
    await signOut()
    setProfile(null)
    router.push('/')
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass sticky top-0 z-50 border-b border-white/20"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-royal-blue to-gold bg-clip-text text-transparent"
            >
              SOUQORA
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/marketplace"
              className="text-foreground hover:text-royal-blue transition-colors font-medium"
            >
              Marketplace
            </Link>
            <Link
              href="/services"
              className="text-foreground hover:text-royal-blue transition-colors font-medium"
            >
              Services
            </Link>
            <Link
              href="/categories"
              className="text-foreground hover:text-royal-blue transition-colors font-medium"
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="text-foreground hover:text-royal-blue transition-colors font-medium"
            >
              About
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search products, services..."
                className="pl-10 w-64"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            <Link href="/favorites">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>

            {/* User Account */}
            {!authLoading && (
              <>
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center space-x-2 hover:bg-white/10 rounded-lg p-2 transition-colors"
                    >
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt="Profile"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <Avatar className="w-8 h-8" />
                      )}
                      <span className="hidden md:block text-sm font-medium">
                        {profile?.username || profile?.full_name || user.email?.split('@')[0] || 'User'}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                        <hr className="my-2" />
                        <button
                          onClick={() => {
                            handleLogout()
                            setIsDropdownOpen(false)
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link href="/auth/login">
                      <Button variant="ghost" size="sm">
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button size="sm">
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-white/20"
          >
            <nav className="flex flex-col space-y-4">
              <Link
                href="/marketplace"
                className="text-foreground hover:text-royal-blue transition-colors font-medium"
              >
                Marketplace
              </Link>
              <Link
                href="/services"
                className="text-foreground hover:text-royal-blue transition-colors font-medium"
              >
                Services
              </Link>
              <Link
                href="/categories"
                className="text-foreground hover:text-royal-blue transition-colors font-medium"
              >
                Categories
              </Link>
              <Link
                href="/about"
                className="text-foreground hover:text-royal-blue transition-colors font-medium"
              >
                About
              </Link>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-10"
                />
              </div>
              {!authLoading && !user && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-white/20">
                  <Link href="/auth/login">
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="w-full">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}
