"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { DashboardStatsCard } from '@/components/dashboard/DashboardStatsCard'
import { Briefcase, Building2, Eye, Heart, MessageSquare, ShoppingBag, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function DashboardPage() {
  const supabase = createClient()
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalServices: 0,
    totalBusinesses: 0,
    profileViews: 0,
    favorites: 0,
    messages: 0,
    orders: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return

      try {
        // Fetch user's services
        const { count: servicesCount } = await supabase
          .from('services')
          .select('*', { count: 'exact', head: true })
          .eq('owner_id', user.id)

        // Fetch user's businesses
        const { count: businessesCount } = await supabase
          .from('businesses')
          .select('*', { count: 'exact', head: true })
          .eq('owner_id', user.id)

        setStats({
          totalServices: servicesCount || 0,
          totalBusinesses: businessesCount || 0,
          profileViews: 0, // Would need a separate table for this
          favorites: 0, // Would need a separate table for this
          messages: 0, // Would need a separate table for this
          orders: 0 // Would need a separate table for this
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [supabase, user])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back! Here's your overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardStatsCard
          title="Total Services"
          value={stats.totalServices}
          icon={Briefcase}
          description="Your published services"
        />
        <DashboardStatsCard
          title="Total Businesses"
          value={stats.totalBusinesses}
          icon={Building2}
          description="Your business listings"
        />
        <DashboardStatsCard
          title="Profile Views"
          value={stats.profileViews}
          icon={Eye}
          description="Views this month"
        />
        <DashboardStatsCard
          title="Favorites"
          value={stats.favorites}
          icon={Heart}
          description="Items saved"
        />
        <DashboardStatsCard
          title="Messages"
          value={stats.messages}
          icon={MessageSquare}
          description="Unread messages"
        />
        <DashboardStatsCard
          title="Orders"
          value={stats.orders}
          icon={ShoppingBag}
          description="Active orders"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/dashboard/services/new"
              className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-md cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <Briefcase className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-900 dark:text-white">Add New Service</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Create a new service listing
              </p>
            </a>
            <a
              href="/dashboard/businesses/new"
              className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-md cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <Building2 className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-900 dark:text-white">Add New Business</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Register a new business
              </p>
            </a>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">No recent activity</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Start by adding a service or business</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
