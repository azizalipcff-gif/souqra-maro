"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  BarChart3,
  Heart,
  MessageSquare,
  FileText,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  userRole: "seller" | "admin"
}

const sellerNavItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/products", icon: Package, label: "Products" },
  { href: "/dashboard/orders", icon: ShoppingBag, label: "Orders" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/dashboard/messages", icon: MessageSquare, label: "Messages" },
  { href: "/dashboard/favorites", icon: Heart, label: "Favorites" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
]

const adminNavItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/services", icon: ShoppingBag, label: "Services" },
  { href: "/admin/reports", icon: FileText, label: "Reports" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
]

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()
  const navItems = userRole === "admin" ? adminNavItems : sellerNavItems

  return (
    <aside className="w-64 glass border-r border-white/20 min-h-screen p-4">
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="space-y-2"
      >
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-royal-blue text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          )
        })}

        <div className="pt-4 border-t border-gray-200 mt-4">
          <Link href="/logout">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </aside>
  )
}
