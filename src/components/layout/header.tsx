"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Search, ShoppingCart, Heart, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle"
import { useState } from "react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}
