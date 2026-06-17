"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, Heart, Menu, X, LogOut, LayoutDashboard, Shield, UserCircle, Settings, Package, Store, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle"
import { SearchBar } from "@/components/marketplace/SearchBar"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Avatar } from "@/components/ui/avatar"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const { user, loading, signOut, isAdmin, isBusinessOwner } = useAuth()
  const dropdownRef = useRef<HTMLDivElement>(null)

  console.log('HEADER DEBUG - user:', user)
  console.log('HEADER DEBUG - loading:', loading)
  console.log('HEADER DEBUG - should show profile:', !loading && user)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setIsProfileDropdownOpen(false)
  }

  const getUserInitials = () => {
    if (!user?.email) return 'U'
    return user.email.charAt(0).toUpperCase()
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
            <Link href="/marketplace" className="text-foreground hover:text-royal-blue transition-colors font-medium">
              Marketplace
            </Link>
            <Link href="/services" className="text-foreground hover:text-royal-blue transition-colors font-medium">
              Services
            </Link>
            <Link href="/categories" className="text-foreground hover:text-royal-blue transition-colors font-medium">
              Categories
            </Link>
            <Link href="/about" className="text-foreground hover:text-royal-blue transition-colors font-medium">
              About
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center space-x-2">
            <SearchBar placeholder="Search products, services..." className="w-64" />
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
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

            {/* 🔥 إصلاح نظام الـ Auth: الـ Dropdown غايبان ديما إلا كان الـ User كاين بلا ما يتسنى الـ Loading يطول */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="relative"
                >
                  <Avatar className="h-8 w-8">
                    <div className="h-full w-full rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                      {getUserInitials()}
                    </div>
                  </Avatar>
                </Button>

                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-gray-200 dark:border-slate-800 py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-800">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user.user_metadata?.full_name || user.email}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>

                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <UserCircle className="mr-2 h-4 w-4" />
                        My Profile
                      </Link>

                      <Link
                        href="/profile/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Link>

                      <Link
                        href="/add-product"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <Package className="mr-2 h-4 w-4" />
                        Add Product
                      </Link>

                      <Link
                        href="/add-business"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <Store className="mr-2 h-4 w-4" />
                        Add Business
                      </Link>

                      <hr className="my-2 border-gray-100 dark:border-slate-800" />

                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* إلا ما كاين لا User ولا Loading، كنبينو أزرار الدخول */
              !loading && (
                <div className="flex items-center space-x-2">
                  <Link href="/login">
                    <Button variant="ghost" className="text-sm font-medium">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="text-sm font-medium bg-blue-600 hover:bg-blue-700">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )
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
              <Link href="/marketplace" className="text-foreground hover:text-royal-blue transition-colors font-medium">
                Marketplace
              </Link>
              <Link href="/services" className="text-foreground hover:text-royal-blue transition-colors font-medium">
                Services
              </Link>
              <Link href="/categories" className="text-foreground hover:text-royal-blue transition-colors font-medium">
                Categories
              </Link>
              <Link href="/about" className="text-foreground hover:text-royal-blue transition-colors font-medium">
                About
              </Link>
              <SearchBar placeholder="Search..." className="w-full" />
              
              {user && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-white/20">
                  <Link href="/profile" className="flex items-center text-foreground hover:text-royal-blue transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
                    <UserCircle className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                  <button onClick={handleSignOut} className="flex items-center text-red-600 hover:text-red-700 transition-colors font-medium">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}
