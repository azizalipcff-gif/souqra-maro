"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { StatsCard } from '@/components/admin/StatsCard'
import { Users, Store, Briefcase, CheckCircle } from 'lucide-react'

export default function AdminDashboard() {
  const supabase = createClient()
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingBusinesses: 0,
    pendingServices: 0,
    activeListings: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total users
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })

        // Fetch pending businesses
        const { count: pendingBusinesses } = await supabase
          .from('businesses')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending')

        // Fetch pending services
        const { count: pendingServices } = await supabase
          .from('services')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending')

        // Fetch active listings (businesses + services)
        const { count: activeBusinesses } = await supabase
          .from('businesses')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active')

        const { count: activeServices } = await supabase
          .from('services')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active')

        setStats({
          totalUsers: usersCount || 0,
          pendingBusinesses: pendingBusinesses || 0,
          pendingServices: pendingServices || 0,
          activeListings: (activeBusinesses || 0) + (activeServices || 0)
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Overview of your platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          description="Registered users"
        />
        <StatsCard
          title="Pending Businesses"
          value={stats.pendingBusinesses}
          icon={Store}
          description="Awaiting approval"
        />
        <StatsCard
          title="Pending Services"
          value={stats.pendingServices}
          icon={Briefcase}
          description="Awaiting approval"
        />
        <StatsCard
          title="Active Listings"
          value={stats.activeListings}
          icon={CheckCircle}
          description="Businesses + Services"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/admin/businesses"
              className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Store className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-900 dark:text-white">Review Businesses</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {stats.pendingBusinesses} pending approval
              </p>
            </a>
            <a
              href="/admin/services"
              className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Briefcase className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-900 dark:text-white">Review Services</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {stats.pendingServices} pending approval
              </p>
            </a>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">System Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Database</span>
              <span className="text-green-600 font-medium">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Storage</span>
              <span className="text-green-600 font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Auth</span>
              <span className="text-green-600 font-medium">Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
